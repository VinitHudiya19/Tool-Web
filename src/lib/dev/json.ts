/**
 * JSON parsing, comparison and formatting.
 *
 * `JSON.parse` silently rounds any integer beyond 2^53, so an id like
 * 9007199254740993 comes back as ...992 and a viewer built on it shows the
 * wrong number with no indication anything happened. Large integers are
 * detected here and reported rather than quietly corrupted.
 */

export interface ParseFailure {
  message: string;
  line: number;
  column: number;
  /** The offending line, for pointing at the problem. */
  excerpt: string;
}

export interface ParseSuccess<T = unknown> {
  value: T;
  /** Integers that exceed what a double can represent exactly. */
  unsafeNumbers: string[];
}

export type ParseOutcome<T = unknown> =
  | ({ ok: true } & ParseSuccess<T>)
  | ({ ok: false } & ParseFailure);

/** Converts a character offset into a line and column for the error message. */
function locate(text: string, offset: number) {
  const before = text.slice(0, offset);
  const line = before.split("\n").length;
  const lastBreak = before.lastIndexOf("\n");
  return {
    line,
    column: offset - lastBreak,
    excerpt: text.split("\n")[line - 1] ?? "",
  };
}

/**
 * Finds integer literals too large to survive a round trip.
 *
 * Matching on the raw text is the only way to see them: by the time
 * JSON.parse has run, the information is already gone.
 */
function findUnsafeNumbers(text: string): string[] {
  const found: string[] = [];
  // Integers only — a float was never exact to begin with.
  const pattern = /(?<![\w."])-?\d{16,}(?![\w.])/g;

  for (const match of text.matchAll(pattern)) {
    const literal = match[0];
    if (!Number.isSafeInteger(Number(literal)) && !found.includes(literal)) {
      found.push(literal);
    }
  }

  return found.slice(0, 10);
}

export function parseJson<T = unknown>(text: string): ParseOutcome<T> {
  if (!text.trim()) {
    return {
      ok: false,
      message: "Nothing to parse yet.",
      line: 1,
      column: 1,
      excerpt: "",
    };
  }

  try {
    const value = JSON.parse(text) as T;
    return { ok: true, value, unsafeNumbers: findUnsafeNumbers(text) };
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : "Invalid JSON.";

    // Browsers report a character offset; turning it into a line and column
    // is the difference between a usable error and a shrug.
    const offsetMatch = /position (\d+)/.exec(message);
    if (offsetMatch) {
      const { line, column, excerpt } = locate(text, Number(offsetMatch[1]));
      return {
        ok: false,
        message: message.replace(/\s*at position \d+.*$/, ""),
        line,
        column,
        excerpt,
      };
    }

    const lineMatch = /line (\d+) column (\d+)/.exec(message);
    if (lineMatch) {
      const line = Number(lineMatch[1]);
      return {
        ok: false,
        message,
        line,
        column: Number(lineMatch[2]),
        excerpt: text.split("\n")[line - 1] ?? "",
      };
    }

    return { ok: false, message, line: 1, column: 1, excerpt: "" };
  }
}

/** Re-serialises with an indent, or minified when indent is 0. */
export function formatJson(value: unknown, indent: number | "\t"): string {
  return JSON.stringify(value, null, indent === 0 ? undefined : indent);
}

/** Sorts object keys recursively, for a stable diff or a canonical form. */
export function sortKeys<T>(value: T): T {
  if (Array.isArray(value)) return value.map(sortKeys) as unknown as T;

  if (value && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, nested]) => [key, sortKeys(nested)]);
    return Object.fromEntries(entries) as T;
  }

  return value;
}

export type DiffKind = "added" | "removed" | "changed" | "unchanged";

export interface DiffEntry {
  path: string;
  kind: DiffKind;
  left?: unknown;
  right?: unknown;
}

/**
 * Compares two parsed values structurally.
 *
 * Comparing formatted text instead reports every reindentation and key
 * reordering as a difference, which buries the one change that matters.
 */
export function diffJson(
  left: unknown,
  right: unknown,
  path = "$",
  output: DiffEntry[] = [],
): DiffEntry[] {
  if (Object.is(left, right)) {
    output.push({ path, kind: "unchanged", left, right });
    return output;
  }

  const leftIsObject = left !== null && typeof left === "object";
  const rightIsObject = right !== null && typeof right === "object";

  if (!leftIsObject || !rightIsObject) {
    output.push({ path, kind: "changed", left, right });
    return output;
  }

  if (Array.isArray(left) !== Array.isArray(right)) {
    output.push({ path, kind: "changed", left, right });
    return output;
  }

  if (Array.isArray(left) && Array.isArray(right)) {
    const length = Math.max(left.length, right.length);
    for (let index = 0; index < length; index += 1) {
      const childPath = `${path}[${index}]`;
      if (index >= left.length) {
        output.push({ path: childPath, kind: "added", right: right[index] });
      } else if (index >= right.length) {
        output.push({ path: childPath, kind: "removed", left: left[index] });
      } else {
        diffJson(left[index], right[index], childPath, output);
      }
    }
    return output;
  }

  const leftRecord = left as Record<string, unknown>;
  const rightRecord = right as Record<string, unknown>;
  const keys = [
    ...new Set([...Object.keys(leftRecord), ...Object.keys(rightRecord)]),
  ].sort();

  for (const key of keys) {
    // A key path with a dot or bracket in it needs quoting to stay readable.
    const childPath = /^[A-Za-z_$][\w$]*$/.test(key)
      ? `${path}.${key}`
      : `${path}["${key}"]`;

    if (!(key in leftRecord)) {
      output.push({ path: childPath, kind: "added", right: rightRecord[key] });
    } else if (!(key in rightRecord)) {
      output.push({ path: childPath, kind: "removed", left: leftRecord[key] });
    } else {
      diffJson(leftRecord[key], rightRecord[key], childPath, output);
    }
  }

  return output;
}

export interface DiffSummary {
  added: number;
  removed: number;
  changed: number;
  unchanged: number;
  identical: boolean;
}

export function summariseDiff(entries: DiffEntry[]): DiffSummary {
  const summary = { added: 0, removed: 0, changed: 0, unchanged: 0 };
  for (const entry of entries) summary[entry.kind] += 1;
  return {
    ...summary,
    identical: summary.added + summary.removed + summary.changed === 0,
  };
}

/** Describes the shape of a parsed value, for the viewer's summary line. */
export function describeValue(value: unknown): string {
  if (value === null) return "null";
  if (Array.isArray(value)) return `array of ${value.length}`;
  if (typeof value === "object") {
    return `object with ${Object.keys(value as object).length} keys`;
  }
  return typeof value;
}

/** Counts nodes and depth, which is what makes a payload slow to render. */
export function measureJson(value: unknown): { nodes: number; depth: number } {
  let nodes = 0;
  let depth = 0;

  const walk = (node: unknown, level: number) => {
    nodes += 1;
    depth = Math.max(depth, level);

    if (Array.isArray(node)) {
      for (const child of node) walk(child, level + 1);
      return;
    }

    if (node && typeof node === "object") {
      for (const child of Object.values(node)) walk(child, level + 1);
    }
  };

  walk(value, 0);
  return { nodes, depth };
}
