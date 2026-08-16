/**
 * Minifiers that understand what they are editing.
 *
 * The usual approach — collapse all whitespace, strip anything between `/*`
 * and `*​/` — corrupts content that merely looks like syntax. `"https://x.com"`
 * loses everything after the `//`, a `url("a/*b*​/c.png")` loses its middle,
 * and `<pre>` blocks lose the indentation that gives them meaning.
 *
 * Each function splits the source into spans that may be rewritten and spans
 * that must be copied verbatim, then only ever edits the former. Tidying the
 * joined output instead — which is the tempting shortcut — reaches straight
 * back into the literals the split was there to protect.
 */

export interface MinifyResult {
  code: string;
  originalBytes: number;
  minifiedBytes: number;
}

function measure(original: string, minified: string): MinifyResult {
  return {
    code: minified,
    originalBytes: new Blob([original]).size,
    minifiedBytes: new Blob([minified]).size,
  };
}

/** A run of source, marked with whether it may be rewritten. */
interface Span {
  text: string;
  verbatim: boolean;
}

/** Scans a quoted string, returning the index just past its closing quote. */
function skipString(source: string, start: number, quote: string): number {
  let index = start + 1;

  while (index < source.length) {
    const character = source[index];
    // A backslash escapes the next character, including the closing quote.
    if (character === "\\") {
      index += 2;
      continue;
    }
    if (character === quote) return index + 1;
    index += 1;
  }

  // Unterminated: keep the remainder as literal rather than reinterpreting it.
  return source.length;
}

/**
 * True when a `/` at `index` opens a regular expression rather than division.
 *
 * Decided by the previous meaningful character: after a value or closing
 * bracket it is division, after an operator or keyword it starts a regex.
 */
function isRegexPosition(source: string, index: number): boolean {
  let cursor = index - 1;
  while (cursor >= 0 && /\s/.test(source[cursor])) cursor -= 1;
  if (cursor < 0) return true;

  const previous = source[cursor];
  if (/[)\]}]/.test(previous)) return false;

  if (/[\w$]/.test(previous)) {
    // A keyword can still precede a regex: `return /x/`, `typeof /x/`.
    const word = source.slice(0, cursor + 1).match(/[\w$]+$/)?.[0] ?? "";
    return [
      "return", "typeof", "instanceof", "in", "of", "new", "delete", "void",
      "throw", "case", "do", "else", "yield", "await",
    ].includes(word);
  }

  return true;
}

/** Scans a regex literal including its character class and flags. */
function skipRegex(source: string, start: number): number {
  let index = start + 1;
  let inClass = false;

  while (index < source.length) {
    const character = source[index];
    if (character === "\\") {
      index += 2;
      continue;
    }
    if (character === "[") inClass = true;
    else if (character === "]") inClass = false;
    else if (character === "\n") return start + 1; // Not a regex after all.
    else if (character === "/" && !inClass) {
      index += 1;
      while (index < source.length && /[a-z]/i.test(source[index])) index += 1;
      return index;
    }
    index += 1;
  }

  return source.length;
}

/** Scans a template literal, following `${…}` back into expression context. */
function skipTemplate(source: string, start: number): number {
  let index = start + 1;

  while (index < source.length) {
    const character = source[index];
    if (character === "\\") {
      index += 2;
      continue;
    }
    if (character === "`") return index + 1;

    if (character === "$" && source[index + 1] === "{") {
      let depth = 1;
      index += 2;
      while (index < source.length && depth > 0) {
        const inner = source[index];
        if (inner === "`") {
          index = skipTemplate(source, index);
          continue;
        }
        if (inner === '"' || inner === "'") {
          index = skipString(source, index, inner);
          continue;
        }
        if (inner === "{") depth += 1;
        else if (inner === "}") depth -= 1;
        index += 1;
      }
      continue;
    }

    index += 1;
  }

  return source.length;
}

/**
 * Characters that can be safely closed up against a neighbour.
 *
 * Deliberately excludes `+` and `-`: removing the space in `a + +b` would
 * produce `a++b`, which parses as something else entirely.
 */
const TIGHTENABLE = /[{};,:()[\]=<>!&|?*/%^~]/;

/** Removes a space between two tokens only when it cannot merge them. */
function canTighten(left: string, right: string): boolean {
  if (!left || !right) return true;

  const a = left[left.length - 1];
  const b = right[0];

  // Two of the same sign would form ++ or --.
  if (/[+-]/.test(a) && a === b) return false;
  // A comment marker must not be created out of two divisions.
  if (a === "/" && (b === "/" || b === "*")) return false;

  return TIGHTENABLE.test(a) || TIGHTENABLE.test(b);
}

/** Collapses whitespace in a code span, respecting token adjacency. */
function tightenCode(code: string, keepNewlines: boolean): string {
  const parts = code.split(/(\s+)/);
  let result = "";

  for (let index = 0; index < parts.length; index += 1) {
    const part = parts[index];
    if (part === "") continue;

    if (!/^\s+$/.test(part)) {
      result += part;
      continue;
    }

    const next = parts[index + 1] ?? "";
    // A line break can be load-bearing through automatic semicolon insertion,
    // so it is kept even where a plain space would be dropped.
    const hasNewline = /\n/.test(part);

    if (canTighten(result, next)) {
      if (hasNewline && keepNewlines && result && next) result += "\n";
      continue;
    }

    result += hasNewline && keepNewlines ? "\n" : " ";
  }

  return result;
}

/** Joins spans, tightening only those marked rewritable. */
function renderSpans(spans: Span[], keepNewlines: boolean): string {
  let result = "";

  for (const span of spans) {
    if (span.verbatim) {
      result += span.text;
      continue;
    }
    result += tightenCode(span.text, keepNewlines);
  }

  return result.trim();
}

/**
 * Minifies JavaScript without touching string, template, regex or comment
 * contents, and without joining tokens whose meaning depends on the gap.
 */
export function minifyJavaScript(
  source: string,
  options: { removeComments?: boolean } = {},
): MinifyResult {
  const { removeComments = true } = options;
  const spans: Span[] = [];
  let buffer = "";
  let index = 0;

  const flush = () => {
    if (buffer) {
      spans.push({ text: buffer, verbatim: false });
      buffer = "";
    }
  };

  while (index < source.length) {
    const character = source[index];

    if (character === '"' || character === "'") {
      flush();
      const end = skipString(source, index, character);
      spans.push({ text: source.slice(index, end), verbatim: true });
      index = end;
      continue;
    }

    if (character === "`") {
      flush();
      const end = skipTemplate(source, index);
      spans.push({ text: source.slice(index, end), verbatim: true });
      index = end;
      continue;
    }

    if (character === "/" && source[index + 1] === "/") {
      const end = source.indexOf("\n", index);
      const stop = end === -1 ? source.length : end;
      if (removeComments) {
        // The line break after the comment still separates statements.
        buffer += "\n";
      } else {
        flush();
        spans.push({ text: source.slice(index, stop), verbatim: true });
      }
      index = stop;
      continue;
    }

    if (character === "/" && source[index + 1] === "*") {
      const end = source.indexOf("*/", index + 2);
      const stop = end === -1 ? source.length : end + 2;
      if (removeComments) {
        // A removed comment still separated two tokens.
        buffer += " ";
      } else {
        flush();
        spans.push({ text: source.slice(index, stop), verbatim: true });
      }
      index = stop;
      continue;
    }

    if (character === "/" && isRegexPosition(source, index)) {
      flush();
      const end = skipRegex(source, index);
      spans.push({ text: source.slice(index, end), verbatim: true });
      index = end;
      continue;
    }

    buffer += character;
    index += 1;
  }

  flush();

  const code = renderSpans(spans, true)
    // Collapse the blank lines left behind by removed comments.
    .replace(/\n{2,}/g, "\n");

  return measure(source, code);
}

/**
 * Minifies CSS without editing string literals or url() values.
 *
 * A comment marker can appear inside a URL and a `content` string can hold
 * meaningful runs of spaces; both are destroyed by a naive pass.
 */
export function minifyCss(
  source: string,
  options: { removeComments?: boolean } = {},
): MinifyResult {
  const { removeComments = true } = options;
  const spans: Span[] = [];
  let buffer = "";
  let index = 0;

  const flush = () => {
    if (buffer) {
      spans.push({ text: buffer, verbatim: false });
      buffer = "";
    }
  };

  while (index < source.length) {
    const character = source[index];

    if (character === '"' || character === "'") {
      flush();
      const end = skipString(source, index, character);
      spans.push({ text: source.slice(index, end), verbatim: true });
      index = end;
      continue;
    }

    // url(…) may hold an unquoted value containing slashes and asterisks.
    if (source.startsWith("url(", index)) {
      flush();
      const end = source.indexOf(")", index);
      const stop = end === -1 ? source.length : end + 1;
      spans.push({ text: source.slice(index, stop), verbatim: true });
      index = stop;
      continue;
    }

    if (character === "/" && source[index + 1] === "*") {
      const end = source.indexOf("*/", index + 2);
      const stop = end === -1 ? source.length : end + 2;
      // `/*!` conventionally marks a licence comment that must survive.
      if (removeComments && !source.startsWith("/*!", index)) {
        buffer += " ";
      } else {
        flush();
        spans.push({ text: source.slice(index, stop), verbatim: true });
      }
      index = stop;
      continue;
    }

    buffer += character;
    index += 1;
  }

  flush();

  const code = renderSpans(spans, false)
    // A trailing semicolon before a closing brace is redundant.
    .replace(/;\}/g, "}");

  return measure(source, code);
}

/** Elements whose contents must survive minification byte for byte. */
const HTML_VERBATIM = new Set(["pre", "textarea", "script", "style"]);

/** Collapses whitespace between attributes without touching their values. */
function minifyTag(tag: string): string {
  let result = "";
  let index = 0;

  while (index < tag.length) {
    const character = tag[index];

    if (character === '"' || character === "'") {
      const end = skipString(tag, index, character);
      result += tag.slice(index, end);
      index = end;
      continue;
    }

    if (/\s/.test(character)) {
      let end = index;
      while (end < tag.length && /\s/.test(tag[end])) end += 1;
      // A space before `>` or `/>` is never needed.
      result += /^\/?>/.test(tag.slice(end)) ? "" : " ";
      index = end;
      continue;
    }

    result += character;
    index += 1;
  }

  return result;
}

/**
 * Minifies HTML while preserving whitespace-significant elements.
 *
 * Collapsing every run of whitespace destroys `<pre>` and `<textarea>`, and
 * dropping the space between two inline elements runs their words together —
 * "bold italic" becoming "bolditalic". Runs are collapsed to a single space
 * rather than removed.
 */
export function minifyHtml(
  source: string,
  options: { removeComments?: boolean } = {},
): MinifyResult {
  const { removeComments = true } = options;
  let result = "";
  let index = 0;

  while (index < source.length) {
    if (source.startsWith("<!--", index)) {
      const end = source.indexOf("-->", index);
      const stop = end === -1 ? source.length : end + 3;
      const comment = source.slice(index, stop);
      // Conditional comments and `<!--!` directives are load-bearing.
      const isDirective = /^<!--(\[if|!)/.test(comment);
      if (!removeComments || isDirective) result += comment;
      index = stop;
      continue;
    }

    if (source[index] === "<") {
      const tagEnd = source.indexOf(">", index);
      const stop = tagEnd === -1 ? source.length : tagEnd + 1;
      const tag = source.slice(index, stop);
      result += minifyTag(tag);
      index = stop;

      // An opening tag for a protected element: copy through to its close.
      const opening = /^<\s*([a-zA-Z][\w-]*)/.exec(tag);
      const name = opening?.[1].toLowerCase();
      if (name && HTML_VERBATIM.has(name) && !/\/\s*>$/.test(tag)) {
        const closing = new RegExp(`</\\s*${name}\\s*>`, "i");
        const rest = source.slice(index);
        const match = closing.exec(rest);
        if (match) {
          result += rest.slice(0, match.index + match[0].length);
          index += match.index + match[0].length;
        }
      }
      continue;
    }

    // Text node. Runs of whitespace collapse to one space, which keeps words
    // either side of a tag boundary apart.
    const nextTag = source.indexOf("<", index);
    const stop = nextTag === -1 ? source.length : nextTag;
    result += source.slice(index, stop).replace(/\s+/g, " ");
    index = stop;
  }

  return measure(source, result.trim());
}

/**
 * Minifies XML, collapsing only whitespace that sits between elements.
 *
 * Text content is left alone: any character data may be significant and XML
 * has no inline-element convention to lean on.
 */
export function minifyXml(
  source: string,
  options: { removeComments?: boolean } = {},
): MinifyResult {
  const { removeComments = true } = options;
  let result = "";
  let index = 0;

  while (index < source.length) {
    if (source.startsWith("<!--", index)) {
      const end = source.indexOf("-->", index);
      const stop = end === -1 ? source.length : end + 3;
      if (!removeComments) result += source.slice(index, stop);
      index = stop;
      continue;
    }

    // CDATA is verbatim by definition.
    if (source.startsWith("<![CDATA[", index)) {
      const end = source.indexOf("]]>", index);
      const stop = end === -1 ? source.length : end + 3;
      result += source.slice(index, stop);
      index = stop;
      continue;
    }

    if (source[index] === "<") {
      const end = source.indexOf(">", index);
      const stop = end === -1 ? source.length : end + 1;
      result += minifyTag(source.slice(index, stop));
      index = stop;
      continue;
    }

    const nextTag = source.indexOf("<", index);
    const stop = nextTag === -1 ? source.length : nextTag;
    const text = source.slice(index, stop);
    // Whitespace-only runs between elements are formatting, not content.
    result += text.trim() === "" ? "" : text;
    index = stop;
  }

  return measure(source, result.trim());
}
