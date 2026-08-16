/**
 * Tabular data conversion and cleaning.
 *
 * Parsing and serialising go through PapaParse, which already handles the
 * cases hand-written CSV code gets wrong: a field containing the delimiter, a
 * quote inside a quoted field, and a newline inside a field. What is added
 * here is the surrounding judgement — type inference that refuses to mangle
 * identifiers, and flattening that produces predictable column names.
 */

import Papa from "papaparse";

export type JsonRecord = Record<string, unknown>;

export interface CsvParseResult {
  rows: JsonRecord[];
  headers: string[];
  /** Rows PapaParse could not read cleanly, with the reason. */
  problems: { row: number; message: string }[];
  delimiter: string;
}

/**
 * Converts a cell to a number or boolean where that is unambiguous.
 *
 * The trap is over-eagerness: a leading zero means the value is an
 * identifier — a zip code, a phone number, a part number — and turning
 * "007" into 7 loses data that cannot be recovered. Values that would not
 * survive a round trip are left as text.
 */
export function inferValue(
  raw: string,
  options: { numbers?: boolean; booleans?: boolean; nulls?: boolean } = {},
): unknown {
  const { numbers = true, booleans = true, nulls = true } = options;
  const text = raw.trim();

  if (text === "") return nulls ? null : "";

  if (booleans) {
    const lower = text.toLowerCase();
    if (lower === "true") return true;
    if (lower === "false") return false;
  }

  if (nulls && text.toLowerCase() === "null") return null;

  if (numbers) {
    // Only convert when the text is exactly what the number prints back as.
    // That rejects "007", "1_000", "+1", "1.0" and " 1 " while accepting the
    // values a spreadsheet would genuinely treat as numeric.
    const asNumber = Number(text);
    if (
      text !== "" &&
      Number.isFinite(asNumber) &&
      String(asNumber) === text
    ) {
      return asNumber;
    }
  }

  return raw;
}

export function parseCsv(
  input: string,
  options: {
    delimiter?: string;
    hasHeader?: boolean;
    inferTypes?: boolean;
    skipEmptyRows?: boolean;
  } = {},
): CsvParseResult {
  const {
    delimiter = "",
    hasHeader = true,
    inferTypes = true,
    skipEmptyRows = true,
  } = options;

  const parsed = Papa.parse<string[]>(input, {
    delimiter,
    header: false,
    skipEmptyLines: skipEmptyRows ? "greedy" : false,
    // Type inference is done here rather than by PapaParse, whose dynamic
    // typing converts "007" to 7.
    dynamicTyping: false,
  });

  const problems = parsed.errors.map((error) => ({
    row: (error.row ?? 0) + 1,
    message: error.message,
  }));

  const table = parsed.data.filter((row) => Array.isArray(row));
  if (table.length === 0) {
    return { rows: [], headers: [], problems, delimiter: parsed.meta.delimiter };
  }

  const headers = hasHeader
    ? table[0].map((name, index) => {
        const clean = String(name ?? "").trim();
        // An unnamed column still needs a usable key.
        return clean === "" ? `column_${index + 1}` : clean;
      })
    : table[0].map((_, index) => `column_${index + 1}`);

  // A duplicate header would silently overwrite the earlier column.
  const seen = new Map<string, number>();
  const uniqueHeaders = headers.map((name) => {
    const count = seen.get(name) ?? 0;
    seen.set(name, count + 1);
    return count === 0 ? name : `${name}_${count + 1}`;
  });

  const body = hasHeader ? table.slice(1) : table;

  const rows = body.map((cells) => {
    const record: JsonRecord = {};
    uniqueHeaders.forEach((key, index) => {
      const cell = cells[index];
      record[key] =
        cell === undefined
          ? null
          : inferTypes
            ? inferValue(String(cell))
            : cell;
    });
    return record;
  });

  return { rows, headers: uniqueHeaders, problems, delimiter: parsed.meta.delimiter };
}

/**
 * Flattens nested objects into dotted column names.
 *
 * A CSV has no way to express nesting, so `{user:{name:"x"}}` has to become a
 * `user.name` column. Arrays of scalars are joined rather than exploded, since
 * exploding changes the row count and silently duplicates data.
 */
export function flattenRecord(
  value: JsonRecord,
  prefix = "",
  depth = 0,
  maxDepth = 5,
): JsonRecord {
  const output: JsonRecord = {};

  for (const [key, nested] of Object.entries(value)) {
    const path = prefix ? `${prefix}.${key}` : key;

    if (
      nested !== null &&
      typeof nested === "object" &&
      !Array.isArray(nested) &&
      depth < maxDepth
    ) {
      Object.assign(
        output,
        flattenRecord(nested as JsonRecord, path, depth + 1, maxDepth),
      );
      continue;
    }

    if (Array.isArray(nested)) {
      const isScalarList = nested.every(
        (item) => item === null || typeof item !== "object",
      );
      output[path] = isScalarList ? nested.join("; ") : JSON.stringify(nested);
      continue;
    }

    output[path] = nested;
  }

  return output;
}

/** Serialises records to CSV, letting PapaParse handle quoting. */
export function toCsv(
  rows: JsonRecord[],
  options: {
    delimiter?: string;
    includeHeaders?: boolean;
    columns?: string[];
    flatten?: boolean;
    maxDepth?: number;
  } = {},
): string {
  const {
    delimiter = ",",
    includeHeaders = true,
    columns,
    flatten = true,
    maxDepth = 5,
  } = options;

  const prepared = flatten
    ? rows.map((row) => flattenRecord(row, "", 0, maxDepth))
    : rows;

  // Union of keys across all rows, since records need not be uniform.
  const discovered: string[] = [];
  for (const row of prepared) {
    for (const key of Object.keys(row)) {
      if (!discovered.includes(key)) discovered.push(key);
    }
  }

  const fields = columns?.length ? columns : discovered;

  return Papa.unparse(
    {
      fields,
      data: prepared.map((row) =>
        fields.map((field) => {
          const value = row[field];
          if (value === null || value === undefined) return "";
          if (typeof value === "object") return JSON.stringify(value);
          return value;
        }),
      ),
    },
    { delimiter, header: includeHeaders, newline: "\n" },
  );
}

/** Coerces parsed JSON into a list of records, whatever shape it arrived in. */
export function toRecords(value: unknown): JsonRecord[] | null {
  if (Array.isArray(value)) {
    // An array of scalars becomes a single-column table.
    if (value.every((item) => item === null || typeof item !== "object")) {
      return value.map((item) => ({ value: item }));
    }
    return value.filter(
      (item): item is JsonRecord => item !== null && typeof item === "object",
    );
  }

  if (value && typeof value === "object") {
    const record = value as JsonRecord;
    // A wrapper like {data: [...]} is the most common API envelope.
    for (const key of ["data", "items", "results", "rows", "records"]) {
      if (Array.isArray(record[key])) return toRecords(record[key]);
    }
    return [record];
  }

  return null;
}

export type DuplicateMode = "exact" | "trimmed" | "caseInsensitive";

export interface DedupeResult {
  lines: string[];
  removed: number;
  /** Values that appeared more than once, with their counts. */
  duplicates: { value: string; count: number }[];
}

/**
 * Removes duplicate lines.
 *
 * The first occurrence is kept rather than the last, so the original ordering
 * of a list survives — which matters when the input is ranked.
 */
export function removeDuplicateLines(
  input: string,
  options: {
    mode?: DuplicateMode;
    keepEmpty?: boolean;
    sort?: boolean;
  } = {},
): DedupeResult {
  const { mode = "exact", keepEmpty = false, sort = false } = options;

  const normalise = (line: string) => {
    if (mode === "exact") return line;
    const trimmed = line.trim();
    return mode === "caseInsensitive" ? trimmed.toLowerCase() : trimmed;
  };

  const counts = new Map<string, number>();
  const firstSeen = new Map<string, string>();
  const order: string[] = [];

  for (const line of input.split(/\r?\n/)) {
    if (!keepEmpty && line.trim() === "") continue;

    const key = normalise(line);
    const count = counts.get(key) ?? 0;
    counts.set(key, count + 1);

    if (count === 0) {
      firstSeen.set(key, line);
      order.push(key);
    }
  }

  const keys = sort ? [...order].sort((a, b) => a.localeCompare(b)) : order;
  const lines = keys.map((key) => firstSeen.get(key) ?? key);

  const duplicates = order
    .filter((key) => (counts.get(key) ?? 0) > 1)
    .map((key) => ({ value: firstSeen.get(key) ?? key, count: counts.get(key) ?? 0 }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);

  const total = [...counts.values()].reduce((sum, count) => sum + count, 0);

  return { lines, removed: total - lines.length, duplicates };
}
