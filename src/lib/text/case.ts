/**
 * Case conversion.
 *
 * Two things separate this from the usual implementation. Words are split on
 * case boundaries as well as separators, so `getUserName` becomes
 * `get_user_name` rather than `getusername` — which is the main reason anyone
 * opens a case converter. And splitting uses Unicode properties instead of
 * `[a-zA-Z0-9]`, so accented and non-Latin text survives instead of being
 * silently deleted.
 */

import { toSentencePieces } from "./segment";

export type CaseId =
  | "upper"
  | "lower"
  | "title"
  | "sentence"
  | "camel"
  | "pascal"
  | "snake"
  | "kebab"
  | "constant"
  | "dot";

/**
 * Splits an identifier or phrase into its component words.
 *
 * Handles separators, lowerUpper boundaries (`userName`) and acronym-to-word
 * boundaries (`XMLHttp` → `XML` + `Http`). Digits stay attached to the word
 * before them, so `utf8`, `md5` and `base64` survive as single words rather
 * than becoming `utf_8`.
 */
export function splitWords(input: string): string[] {
  if (!input) return [];

  return (
    input
      // Separators become spaces.
      .replace(/[_\-.\s]+/gu, " ")
      // A lowercase or digit followed by an uppercase starts a new word.
      .replace(/(\p{Ll}|\p{N})(\p{Lu})/gu, "$1 $2")
      // An acronym followed by a capitalised word: XMLHttp → XML Http.
      .replace(/(\p{Lu}+)(\p{Lu}\p{Ll})/gu, "$1 $2")
      .split(" ")
      .map((word) => word.trim())
      .filter(Boolean)
  );
}

/** Uppercases the first character and lowercases the remainder. */
function capitalise(word: string): string {
  if (!word) return word;
  // Spread rather than charAt, so a surrogate pair is not split in half.
  const [first, ...rest] = [...word];
  return first.toLocaleUpperCase() + rest.join("").toLocaleLowerCase();
}

/**
 * Words kept lowercase inside a title, unless first or last.
 *
 * Chicago and AP both keep articles, short conjunctions and short
 * prepositions down, which is why "The Lord of the Rings" is not
 * "The Lord Of The Rings".
 */
const TITLE_MINOR_WORDS = new Set([
  "a", "an", "and", "as", "at", "but", "by", "for", "from", "if", "in",
  "into", "nor", "of", "off", "on", "onto", "or", "over", "per", "so",
  "the", "to", "up", "via", "vs", "with", "yet",
]);

/**
 * True when a word looks deliberately cased and should be left alone.
 *
 * Catches acronyms (NASA, API) and interior capitals (iPhone, macOS,
 * McDonald), which naive title casing flattens to "Nasa" and "Iphone".
 */
function hasDeliberateCase(word: string): boolean {
  const letters = [...word].filter((character) => /\p{L}/u.test(character));
  if (letters.length < 2) return false;

  const uppercaseCount = letters.filter((character) =>
    /\p{Lu}/u.test(character),
  ).length;

  // All caps, or a capital somewhere after the first character.
  if (uppercaseCount === letters.length) return true;
  return letters.slice(1).some((character) => /\p{Lu}/u.test(character));
}

/**
 * Title case with minor-word handling.
 *
 * Whitespace is preserved exactly, so line breaks and indentation survive.
 */
export function toTitleCase(input: string): string {
  if (!input) return "";

  const parts = input.split(/(\s+)/u);
  // Index of the first and last word-bearing part, which are always capitalised.
  const wordIndexes = parts
    .map((part, index) => (part.trim() ? index : -1))
    .filter((index) => index !== -1);
  const firstWord = wordIndexes[0];
  const lastWord = wordIndexes[wordIndexes.length - 1];

  return parts
    .map((part, index) => {
      if (!part.trim()) return part;
      if (hasDeliberateCase(part)) return part;

      const bare = part.replace(/[^\p{L}\p{N}]/gu, "").toLocaleLowerCase();
      const isMinor = TITLE_MINOR_WORDS.has(bare);

      if (isMinor && index !== firstWord && index !== lastWord) {
        return part.toLocaleLowerCase();
      }

      // Capitalise after any leading punctuation, so ("hello) becomes ("Hello).
      return part.replace(/\p{L}/u, (character) => character.toLocaleUpperCase());
    })
    .join("");
}

/**
 * True when the text reads as shouting rather than prose.
 *
 * Matters because acronym preservation and all-caps repair pull in opposite
 * directions: NASA should survive, but SHOUTED TEXT is exactly what someone
 * reaches for sentence case to fix. If most letters are capitals, the text is
 * treated as shouting and nothing is preserved.
 */
function isShouting(text: string): boolean {
  const letters = [...text].filter((character) => /\p{L}/u.test(character));
  if (letters.length < 8) return false;

  const uppercase = letters.filter((character) => /\p{Lu}/u.test(character)).length;
  return uppercase / letters.length > 0.6;
}

/**
 * Sentence case.
 *
 * Boundaries come from the Unicode sentence rules, so the stop in "Dr. Smith"
 * or "9.99" does not start a new sentence. Deliberate capitals such as NASA
 * are kept, unless the whole text is shouting.
 */
export function toSentenceCase(input: string): string {
  if (!input) return "";

  const shouting = isShouting(input);

  const lower = (piece: string) =>
    piece
      .split(/(\s+)/u)
      .map((part) =>
        !shouting && hasDeliberateCase(part) ? part : part.toLocaleLowerCase(),
      )
      .join("");

  // Boundaries are found on the original text, since the segmenter relies on
  // the existing capitalisation to tell a sentence end from an abbreviation.
  return toSentencePieces(input)
    .map((piece) => {
      // Each line inside a piece starts a sentence too, which the segmenter
      // does not assume for a bare line break.
      return lower(piece)
        .split(/(\n)/u)
        .map((part) =>
          part === "\n"
            ? part
            : part.replace(/\p{L}/u, (letter) => letter.toLocaleUpperCase()),
        )
        .join("");
    })
    .join("");
}

function joinWords(input: string, separator: string, transform: (word: string) => string) {
  return splitWords(input).map(transform).join(separator);
}

export function toCamelCase(input: string): string {
  const words = splitWords(input);
  if (words.length === 0) return "";

  return words
    .map((word, index) =>
      index === 0 ? word.toLocaleLowerCase() : capitalise(word),
    )
    .join("");
}

export function toPascalCase(input: string): string {
  return joinWords(input, "", capitalise);
}

export function toSnakeCase(input: string): string {
  return joinWords(input, "_", (word) => word.toLocaleLowerCase());
}

export function toKebabCase(input: string): string {
  return joinWords(input, "-", (word) => word.toLocaleLowerCase());
}

export function toConstantCase(input: string): string {
  return joinWords(input, "_", (word) => word.toLocaleUpperCase());
}

export function toDotCase(input: string): string {
  return joinWords(input, ".", (word) => word.toLocaleLowerCase());
}

/**
 * Applies a case transform.
 *
 * Identifier styles run per line so a pasted list of names converts to a list
 * rather than collapsing into one long identifier. The prose styles see the
 * whole text, since sentence detection needs the surrounding context.
 */
export function convertCase(input: string, caseId: CaseId): string {
  if (!input) return "";

  switch (caseId) {
    case "upper":
      return input.toLocaleUpperCase();
    case "lower":
      return input.toLocaleLowerCase();
    case "title":
      return toTitleCase(input);
    case "sentence":
      return toSentenceCase(input);
    default:
      break;
  }

  const perLine: Record<string, (line: string) => string> = {
    camel: toCamelCase,
    pascal: toPascalCase,
    snake: toSnakeCase,
    kebab: toKebabCase,
    constant: toConstantCase,
    dot: toDotCase,
  };

  const transform = perLine[caseId];
  if (!transform) return input;

  return input
    .split("\n")
    .map((line) => (line.trim() ? transform(line) : line))
    .join("\n");
}

export interface CaseSpec {
  id: CaseId;
  label: string;
  hint: string;
  /** Shown as a live preview on the button. */
  sample: string;
}

export const CASES: CaseSpec[] = [
  { id: "upper", label: "UPPERCASE", hint: "Every letter capitalised", sample: "HELLO WORLD" },
  { id: "lower", label: "lowercase", hint: "Every letter lowered", sample: "hello world" },
  { id: "title", label: "Title Case", hint: "Headline style, minor words kept down", sample: "Hello World" },
  { id: "sentence", label: "Sentence case", hint: "Capital after each sentence", sample: "Hello world" },
  { id: "camel", label: "camelCase", hint: "JavaScript variables", sample: "helloWorld" },
  { id: "pascal", label: "PascalCase", hint: "Class and component names", sample: "HelloWorld" },
  { id: "snake", label: "snake_case", hint: "Python and SQL", sample: "hello_world" },
  { id: "kebab", label: "kebab-case", hint: "URLs, CSS and file names", sample: "hello-world" },
  { id: "constant", label: "CONSTANT_CASE", hint: "Environment variables", sample: "HELLO_WORLD" },
  { id: "dot", label: "dot.case", hint: "Config keys and namespaces", sample: "hello.world" },
];
