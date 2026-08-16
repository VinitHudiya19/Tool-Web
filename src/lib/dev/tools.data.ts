import type { SeoToolConfig } from "@/lib/seo-tools/types";

/** JSON, tabular data and time tools. */
export const DATA_TOOLS: Record<string, SeoToolConfig> = {
  "json-viewer": {
    slug: "json-viewer",
    name: "JSON Viewer",
    title: "JSON Viewer & Formatter — Errors With Lines",
    description:
      "Format, validate and explore JSON in your browser. Reports the line and column of an error and flags numbers too large to survive.",
    h1: "JSON Viewer and Formatter",
    intro:
      "This tool indents JSON so it can be read, validates it so you can find the mistake, and warns about a failure mode almost every other viewer hides: JavaScript cannot represent integers beyond about nine quadrillion, so a large database id is silently rounded on the way in and displayed as a different number entirely.",
    iconName: "FileJson",
    applicationCategory: "DeveloperApplication",
    features: [
      "Format with configurable indent, or minify",
      "Errors reported with line, column and the offending line",
      "Warns about integers too large for JavaScript to hold",
      "Optional recursive key sorting",
      "Node count and nesting depth",
    ],
    steps: [
      {
        name: "Paste your JSON",
        text: "Type, paste, or load a .json file. Validation runs as you type, so an error appears the moment it exists.",
      },
      {
        name: "Read any error precisely",
        text: "A failure reports the line and column and shows the line itself, rather than a bare message about an unexpected token.",
      },
      {
        name: "Format or minify",
        text: "Choose an indent for reading, or minify to the smallest valid form for transport. Keys can be sorted recursively to make two documents comparable.",
      },
      {
        name: "Check the warnings",
        text: "If the document contains integers beyond JavaScript's exact range, they are listed — a real problem when those values are database identifiers.",
      },
    ],
    examples: [
      {
        title: "An oversized identifier",
        input: '{"id": 9007199254740993}',
        output: "Warning: 9007199254740993 cannot be represented exactly",
        explanation:
          "Parsed as a JavaScript number, this becomes ...992. Every viewer built on JSON.parse displays the wrong value silently; here it is flagged before you copy it somewhere that matters.",
      },
      {
        title: "A trailing comma",
        input: '{"a": 1,}',
        output: "Error at line 1, column 8",
        explanation:
          "JSON forbids trailing commas even though JavaScript allows them. The location makes it findable in a document of a few thousand lines.",
      },
      {
        title: "Sorting keys to compare two files",
        input: '{"b":1,"a":2}',
        output: '{"a":2,"b":1}',
        explanation:
          "Sorting recursively puts two documents into the same shape, so a diff shows genuine differences rather than every reordered key.",
      },
    ],
    benefits: [
      {
        title: "Errors you can act on",
        description:
          "A line, a column and the text of the offending line, instead of a message that tells you only that something is wrong somewhere.",
      },
      {
        title: "Catches silent number corruption",
        description:
          "Large integers are detected in the raw text before parsing, which is the only point at which the information still exists.",
      },
      {
        title: "Makes documents comparable",
        description:
          "Recursive key sorting turns two structurally identical payloads into two identical files, which is what makes a diff useful.",
      },
      {
        title: "Nothing is uploaded",
        description:
          "API responses pasted into a viewer routinely contain tokens and personal data. None of it leaves your browser.",
      },
    ],
    limitations: [
      "Large integers are reported but not repaired, since fixing them requires changing the type — usually to a string — which only the producing system can decide.",
      "JSON with comments or trailing commas is invalid by the standard and is reported as an error rather than silently accepted.",
      "Very large documents are held in memory twice, as text and as a parsed value, so a file beyond tens of megabytes may struggle.",
      "Duplicate keys are resolved by the parser keeping the last one, which is standard behaviour but means the loss is invisible.",
    ],
    keyTakeaways: [
      "Errors are reported with a line and column, not just a message.",
      "Integers beyond 2^53 are silently corrupted by every JSON parser in JavaScript; this one warns you.",
      "Sorting keys recursively makes two documents genuinely comparable.",
      "Comments and trailing commas are not valid JSON, however common they are.",
      "Everything runs in your browser.",
    ],
    faqs: [
      {
        id: "big-numbers",
        question: "Why would a number change when I format my JSON?",
        answer:
          "JavaScript stores all numbers as doubles, which represent integers exactly only up to 2^53 — about nine quadrillion. A larger id is rounded to the nearest representable value on parsing, so it comes out as a different number with no error raised.",
      },
      {
        id: "big-numbers-fix",
        question: "How do I fix an oversized number?",
        answer:
          "The producing system needs to send it as a string. There is no way to recover the original value once it has been parsed, which is why this tool inspects the raw text before parsing rather than after.",
      },
      {
        id: "comments",
        question: "Why is my JSON with comments rejected?",
        answer:
          "The JSON specification has no comments. Several tools accept them as an extension — JSON5 and JSONC exist for exactly this — but a document containing them is not JSON and will be rejected by any strict parser, including this one.",
      },
      {
        id: "trailing-comma",
        question: "Why can I not leave a trailing comma?",
        answer:
          "JavaScript object literals allow one; JSON does not. It is the single most common validation error, because the two syntaxes look identical until a parser disagrees.",
      },
      {
        id: "duplicate-keys",
        question: "What happens if the same key appears twice?",
        answer:
          "The parser keeps the last one and discards the first, silently. The specification does not define the behaviour, so different languages resolve it differently — which makes duplicate keys a genuine portability problem.",
      },
      {
        id: "sorting",
        question: "When is sorting keys useful?",
        answer:
          "When comparing two documents. Key order carries no meaning in JSON, so two equivalent payloads can differ textually in every line. Sorting both puts them in the same shape and leaves only real differences.",
      },
      {
        id: "minify",
        question: "How much smaller is minified JSON?",
        answer:
          "Formatted JSON is often 20 to 40 percent whitespace, so minifying saves roughly that. Over the wire the difference is much smaller, since gzip compresses repeated indentation very efficiently.",
      },
      {
        id: "size",
        question: "How large a file can it handle?",
        answer:
          "A few megabytes is comfortable. The document is held both as text and as a parsed structure, so memory use is roughly double the file size and a very large export may be slow.",
      },
      {
        id: "privacy",
        question: "Is the JSON I paste sent anywhere?",
        answer:
          "No. Parsing and formatting happen in this page. This matters more than for most tools, since the JSON people paste into a viewer is usually a live API response complete with auth tokens and customer records.",
      },
    ],
    relatedSlugs: ["json-compare", "json-to-csv", "csv-to-json", "xml-formatter"],
  },

  "json-compare": {
    slug: "json-compare",
    name: "JSON Compare",
    title: "JSON Compare — Structural Diff, Not Text",
    description:
      "Compare two JSON documents structurally. Ignores key order and formatting so only real differences are reported.",
    h1: "JSON Compare",
    intro:
      "This tool compares two JSON documents by structure rather than by text. That distinction is the whole point: key order and indentation carry no meaning in JSON, so a text diff of two equivalent payloads can light up every line while a structural comparison correctly reports that nothing changed.",
    iconName: "GitCompare",
    applicationCategory: "DeveloperApplication",
    features: [
      "Structural comparison that ignores key order",
      "Every difference given a path like $.user.email",
      "Added, removed and changed reported separately",
      "Works with nested objects and arrays",
      "Counts of each kind of difference",
    ],
    steps: [
      {
        name: "Paste both documents",
        text: "Put the original on the left and the new version on the right. Each is validated separately, so an error in one is reported against that side.",
      },
      {
        name: "Read the summary",
        text: "Counts of added, removed and changed values tell you the scale of the difference before you read any of it.",
      },
      {
        name: "Work through the paths",
        text: "Each difference is listed with a path such as $.items[2].price, so you can find it in the original document immediately.",
      },
      {
        name: "Confirm a match",
        text: "When the documents are equivalent the tool says so plainly, regardless of how differently the two were formatted.",
      },
    ],
    examples: [
      {
        title: "Reordered keys",
        input: '{"a":1,"b":2} vs {"b":2,"a":1}',
        output: "Identical",
        explanation:
          "A text diff reports both lines as changed. Key order has no meaning in JSON, so a structural comparison correctly finds nothing.",
      },
      {
        title: "A changed nested value",
        input: '{"user":{"age":30}} vs {"user":{"age":31}}',
        output: "$.user.age changed: 30 → 31",
        explanation:
          "The path points straight at the value that moved, which is what you need in a document with several hundred keys.",
      },
      {
        title: "An added array element",
        input: "[1] vs [1,2]",
        output: "$[1] added: 2",
        explanation:
          "Arrays are compared by position, since order is meaningful in a JSON array in a way it is not for object keys.",
      },
    ],
    benefits: [
      {
        title: "No false differences",
        description:
          "Reformatting, reindenting and reordering keys are all invisible, so the differences reported are differences that matter.",
      },
      {
        title: "Paths you can use",
        description:
          "Every entry is addressed with a path expression, which can be pasted into a query or used to navigate the original document.",
      },
      {
        title: "Handles deep nesting",
        description:
          "Objects within arrays within objects are walked recursively, so a difference buried six levels down is found and named.",
      },
      {
        title: "Runs in your browser",
        description:
          "Comparing two API responses often means comparing two sets of real customer records. Neither is uploaded.",
      },
    ],
    limitations: [
      "Arrays are compared by position, so a reordered list reports every element as changed even when the same values are present.",
      "Very large documents produce a long list of differences, which is accurate but hard to read.",
      "Numbers are compared after parsing, so two values that differ only beyond JavaScript's precision appear equal.",
      "The comparison shows what differs, not why — it has no knowledge of your schema or which fields are expected to change.",
    ],
    keyTakeaways: [
      "Key order and formatting are ignored, so only real differences appear.",
      "Arrays are compared by position, because order is meaningful in an array.",
      "Every difference is reported with a path expression.",
      "Two documents that differ only in layout are correctly reported as identical.",
      "Everything runs in your browser.",
    ],
    faqs: [
      {
        id: "why-structural",
        question: "How is this different from a normal text diff?",
        answer:
          "A text diff compares characters, so reindenting a file or reordering its keys shows as changes on every affected line. This compares the parsed structures, where key order does not exist as a concept, and reports only genuine differences in value.",
      },
      {
        id: "key-order",
        question: "Does key order ever matter in JSON?",
        answer:
          "Not to the specification — an object is an unordered set of pairs. Some systems preserve insertion order in practice, but relying on it is a bug waiting to happen, which is why it is treated as insignificant here.",
      },
      {
        id: "array-order",
        question: "Why are arrays compared by position?",
        answer:
          "Because order is meaningful in a JSON array. Treating arrays as unordered would report a reversed list as identical, which is usually wrong. The trade-off is that inserting one element at the start shows every later element as changed.",
      },
      {
        id: "paths",
        question: "What do the paths mean?",
        answer:
          "They follow the usual JSONPath convention: $ is the root, a dot introduces an object key, and square brackets index into an array. So $.items[0].name is the name field of the first element of the items array.",
      },
      {
        id: "types",
        question: "How is a type change reported?",
        answer:
          "As a changed value, showing both sides. A field that was the number 1 and is now the string \"1\" is a difference that frequently breaks clients, so it is never treated as equal.",
      },
      {
        id: "null-vs-missing",
        question: "Is a null value the same as a missing key?",
        answer:
          "No, and the distinction is deliberate. A key present with a null value is reported as changed, while a key that has gone entirely is reported as removed — a difference that matters to most APIs.",
      },
      {
        id: "large-diffs",
        question: "What if there are hundreds of differences?",
        answer:
          "They are all listed, ordered by path. If the list is overwhelming it usually means the two documents are not really versions of each other, or an array has shifted by one position near the start.",
      },
      {
        id: "precision",
        question: "Are very large numbers compared reliably?",
        answer:
          "Only within JavaScript's exact integer range. Two ids differing beyond 2^53 both round to the same value on parsing and will be reported as equal — the JSON viewer will warn you when a document contains such numbers.",
      },
      {
        id: "privacy",
        question: "Are the documents I compare uploaded?",
        answer:
          "No. Both are parsed and compared in this page. Comparing a production response against a staging one usually means handling real customer data, and none of it is transmitted.",
      },
    ],
    relatedSlugs: ["json-viewer", "json-to-csv", "csv-to-json", "duplicate-row-remover"],
  },

  "json-to-csv": {
    slug: "json-to-csv",
    name: "JSON to CSV",
    title: "JSON to CSV Converter — Nested Data Flattened",
    description:
      "Convert JSON to CSV in your browser. Flattens nested objects into dotted columns and quotes values correctly.",
    h1: "JSON to CSV Converter",
    intro:
      "This tool turns JSON into a spreadsheet-ready CSV. Two things decide whether the result is usable: nested objects have to become columns somehow, since CSV is flat, and any value containing a comma, a quote or a line break has to be quoted correctly or the file falls apart when opened. Both are handled here rather than left to chance.",
    iconName: "TableProperties",
    applicationCategory: "DeveloperApplication",
    features: [
      "Flattens nested objects into dotted column names",
      "Correct quoting for commas, quotes and newlines",
      "Handles records with different keys",
      "Unwraps common API envelopes automatically",
      "Configurable delimiter for Excel compatibility",
    ],
    steps: [
      {
        name: "Paste your JSON",
        text: "An array of objects is the usual input. A wrapper such as {\"data\": [...]} is unwrapped automatically, since that is how most APIs respond.",
      },
      {
        name: "Choose how to flatten",
        text: "Nested objects become dotted columns like user.address.city. Set the maximum depth if you want deep structures left as JSON in a single cell.",
      },
      {
        name: "Pick a delimiter",
        text: "Comma is standard. Semicolon is what Excel expects in many European locales, where a comma is the decimal separator.",
      },
      {
        name: "Copy or download",
        text: "Download the .csv to open in a spreadsheet, or copy it to the clipboard as tab-separated text for pasting directly into a sheet.",
      },
    ],
    examples: [
      {
        title: "A value containing a comma",
        input: '[{"name":"Ada, Lovelace"}]',
        output: 'name\n"Ada, Lovelace"',
        explanation:
          "Without quoting, that single value would be read as two columns and every row after it would be misaligned. Quoting is applied wherever the value needs it.",
      },
      {
        title: "Nested objects",
        input: '[{"user":{"name":"x"}}]',
        output: "user.name\nx",
        explanation:
          "CSV has no way to express nesting, so the path becomes the column name. The dotted convention is what most spreadsheet users expect.",
      },
      {
        title: "Records with different keys",
        input: '[{"a":1},{"b":2}]',
        output: "a,b\n1,\n,2",
        explanation:
          "The columns are the union of every key found, with blanks where a record lacked one. Using only the first record's keys would silently discard data.",
      },
    ],
    benefits: [
      {
        title: "Quoting handled properly",
        description:
          "Commas, quotes and embedded newlines are escaped according to the CSV convention, so the file opens correctly in Excel, Sheets and Numbers.",
      },
      {
        title: "No data quietly lost",
        description:
          "Columns are the union of all keys across all records, so a field that only some records have still appears.",
      },
      {
        title: "Predictable column names",
        description:
          "Nested paths become dotted names rather than being dropped or exploded into extra rows.",
      },
      {
        title: "Runs in your browser",
        description:
          "Exports are usually real data. Nothing is uploaded and no copy is retained.",
      },
    ],
    limitations: [
      "Arrays of objects inside a record are serialised as JSON in a single cell, since exploding them would change the row count.",
      "CSV has no types, so everything becomes text — a spreadsheet will reinterpret it on opening, sometimes wrongly.",
      "Very deep nesting produces long column names, which is why the depth limit exists.",
      "Excel may still mangle values that look like dates or long numbers, which is a spreadsheet behaviour no exporter can prevent.",
    ],
    keyTakeaways: [
      "Values containing commas, quotes or newlines are quoted correctly.",
      "Nested objects flatten to dotted column names.",
      "Columns are the union of all keys, so nothing is silently dropped.",
      "Choose a semicolon delimiter if Excel in your locale expects one.",
      "Everything runs in your browser.",
    ],
    faqs: [
      {
        id: "quoting",
        question: "How are commas inside values handled?",
        answer:
          "The value is wrapped in quotes, and any quote inside it is doubled. That is the convention every spreadsheet follows, and getting it wrong is what causes a file to open with its columns shifted from one row onwards.",
      },
      {
        id: "nesting",
        question: "What happens to nested objects?",
        answer:
          "They become dotted column names, so {\"user\":{\"city\":\"x\"}} produces a user.city column. CSV is a flat format with no way to express nesting, so a path-based name is the closest faithful representation.",
      },
      {
        id: "arrays",
        question: "How are arrays inside a record handled?",
        answer:
          "An array of simple values is joined into one cell. An array of objects is written as JSON in the cell, because expanding it would multiply the rows and silently duplicate the rest of the record.",
      },
      {
        id: "missing-keys",
        question: "What if my records do not all have the same fields?",
        answer:
          "Every key found anywhere becomes a column, and records lacking it get an empty cell. Taking the columns from the first record alone — which several converters do — would quietly discard fields that appear later.",
      },
      {
        id: "excel-delimiter",
        question: "Why does Excel put everything in one column?",
        answer:
          "Because your Excel is configured for a locale where the list separator is a semicolon rather than a comma. Switch the delimiter to semicolon and the file will open correctly.",
      },
      {
        id: "envelope",
        question: "Does it handle an API response wrapper?",
        answer:
          "Yes. A response shaped like {\"data\": [...]} or {\"results\": [...]} is unwrapped automatically, since pasting a raw API response is the most common way this tool gets used.",
      },
      {
        id: "types",
        question: "Are numbers and booleans preserved?",
        answer:
          "They are written in their plain form, but CSV has no type system, so it is the spreadsheet that decides how to read them. This is why an id with leading zeros can lose them on opening — a spreadsheet behaviour, not an export bug.",
      },
      {
        id: "large-files",
        question: "How much data can it convert?",
        answer:
          "Tens of thousands of rows convert without difficulty. Beyond that both the input and the output are held in memory, so a very large export may become slow.",
      },
      {
        id: "privacy",
        question: "Is my JSON uploaded to convert it?",
        answer:
          "No. Conversion runs in this page. That matters because the JSON people convert to CSV is nearly always a real export — customers, orders, transactions.",
      },
    ],
    relatedSlugs: ["csv-to-json", "json-viewer", "duplicate-row-remover", "json-compare"],
  },

  "csv-to-json": {
    slug: "csv-to-json",
    name: "CSV to JSON",
    title: "CSV to JSON Converter — Keeps Leading Zeros",
    description:
      "Convert CSV to JSON in your browser. Handles quoted fields and refuses to turn identifiers like 007 into numbers.",
    h1: "CSV to JSON Converter",
    intro:
      "This tool turns a CSV file into JSON. The parsing handles the cases that break naive splitting — a comma inside a quoted field, a doubled quote, a newline within a value. The type conversion is where most converters do damage: turning 007 into the number 7 destroys a zip code, a phone number or a part code, so values that would not survive the round trip are kept as text.",
    iconName: "Braces",
    applicationCategory: "DeveloperApplication",
    features: [
      "Correct handling of quoted fields, escaped quotes and embedded newlines",
      "Type inference that preserves leading zeros",
      "Automatic delimiter detection",
      "Duplicate and blank column headers made unique",
      "Optional array-of-arrays output",
    ],
    steps: [
      {
        name: "Paste or load your CSV",
        text: "Drop in a .csv file or paste the text. The delimiter is detected automatically, and can be overridden if the guess is wrong.",
      },
      {
        name: "Say whether there is a header row",
        text: "With a header, each row becomes an object keyed by column name. Without one, columns are named column_1 upwards.",
      },
      {
        name: "Choose type conversion",
        text: "Numbers and booleans can be converted from text. Values with leading zeros are always left as strings, since converting them loses information.",
      },
      {
        name: "Copy the JSON",
        text: "Copy the result or download it. Any rows the parser could not read cleanly are reported with their line numbers.",
      },
    ],
    examples: [
      {
        title: "A zip code",
        input: "zip\n007",
        output: '[{"zip":"007"}]',
        explanation:
          "Converting this to the number 7 would lose the leading zeros permanently. Any value that would not print back identically is kept as text.",
      },
      {
        title: "A comma inside a quoted field",
        input: 'name,note\nAda,"Hello, world"',
        output: '[{"name":"Ada","note":"Hello, world"}]',
        explanation:
          "Splitting on commas would produce three fields and misalign the row. Proper CSV parsing treats the quoted section as one value.",
      },
      {
        title: "Duplicate column names",
        input: "a,a,b\n1,2,3",
        output: '[{"a":1,"a_2":2,"b":3}]',
        explanation:
          "Two columns with the same name would overwrite each other in an object. The second is renamed so no data is lost.",
      },
    ],
    benefits: [
      {
        title: "Identifiers survive",
        description:
          "Zip codes, phone numbers and part codes with leading zeros stay as text rather than being silently converted to numbers.",
      },
      {
        title: "Real CSV parsing",
        description:
          "Quoted fields, doubled quotes and newlines inside values are all handled, which is where hand-rolled splitting always fails.",
      },
      {
        title: "No columns lost",
        description:
          "Blank and duplicate headers are given usable unique names instead of collapsing into one another.",
      },
      {
        title: "Runs in your browser",
        description:
          "Spreadsheet exports are usually real records. Nothing is uploaded.",
      },
    ],
    limitations: [
      "Type inference is a guess. A column of numeric-looking codes without leading zeros will still be converted to numbers.",
      "Very large files are held in memory as text and as parsed objects, so a huge export may be slow.",
      "Character encoding is whatever the browser decoded the file as; a Latin-1 export may show damaged accents.",
      "Excel's own quirks on export — such as a leading byte order mark — are handled, but its date reformatting cannot be undone here.",
    ],
    keyTakeaways: [
      "Leading zeros are preserved, so 007 stays a string.",
      "Quoted fields containing commas, quotes and newlines parse correctly.",
      "Duplicate and blank headers are made unique rather than collapsing.",
      "The delimiter is detected automatically and can be overridden.",
      "Everything runs in your browser.",
    ],
    faqs: [
      {
        id: "leading-zeros",
        question: "Why is 007 kept as a string?",
        answer:
          "Because converting it to a number loses the zeros permanently, and a value with leading zeros is almost always an identifier — a zip code, a phone number, a part code — rather than a quantity. Only values that print back identically are converted.",
      },
      {
        id: "quoted-fields",
        question: "How are commas inside a field handled?",
        answer:
          "A field wrapped in quotes may contain the delimiter, quotes doubled to escape them, and even line breaks. Proper parsing tracks the quoting state, which is why splitting on commas produces garbage for any real-world file.",
      },
      {
        id: "delimiter",
        question: "What if my file uses semicolons or tabs?",
        answer:
          "The delimiter is detected from the content and can be set manually if the guess is wrong. Semicolons are common in European locales where a comma is the decimal separator; tabs appear when data is pasted from a spreadsheet.",
      },
      {
        id: "duplicate-headers",
        question: "What happens if two columns have the same name?",
        answer:
          "The second is renamed with a numeric suffix. Left alone, the later column would overwrite the earlier one when each row became an object, and the loss would be completely invisible.",
      },
      {
        id: "no-header",
        question: "Can I convert a file with no header row?",
        answer:
          "Yes. Turn the header option off and columns are named column_1, column_2 and so on. Getting this wrong is easy to spot — your first data row becomes the key names.",
      },
      {
        id: "empty-values",
        question: "How are empty cells represented?",
        answer:
          "As null by default, which distinguishes an empty cell from an empty string. That can be turned off if your consumer treats null and empty string differently.",
      },
      {
        id: "accents",
        question: "Why are accented characters damaged?",
        answer:
          "The file was probably saved as Latin-1 or Windows-1252 rather than UTF-8, and the browser has decoded it as UTF-8. Re-export the file as UTF-8 from the source application — the damage cannot be reliably undone afterwards.",
      },
      {
        id: "errors",
        question: "What if some rows are malformed?",
        answer:
          "They are reported with their line numbers rather than silently dropped. A row with the wrong number of fields usually means a quote was left unclosed somewhere earlier in the file.",
      },
      {
        id: "privacy",
        question: "Is my spreadsheet data uploaded?",
        answer:
          "No. Parsing runs in this page. A CSV pasted into a converter is nearly always a genuine export of customers, staff or transactions, and none of it is transmitted.",
      },
    ],
    relatedSlugs: ["json-to-csv", "json-viewer", "duplicate-row-remover", "sql-formatter"],
  },

  "duplicate-row-remover": {
    slug: "duplicate-row-remover",
    name: "Duplicate Row Remover",
    title: "Remove Duplicate Lines — Order Preserved",
    description:
      "Remove duplicate lines from a list in your browser. Keeps the first occurrence so a ranked list stays in order.",
    h1: "Duplicate Row Remover",
    intro:
      "This tool removes repeated lines from a list — email addresses, URLs, identifiers, log lines. It keeps the first occurrence of each rather than the last, which matters whenever the list is ordered by something: a ranked set of results, a prioritised backlog, a chronological log. It also reports what was duplicated, which is often more interesting than the cleaned list.",
    iconName: "ListFilter",
    applicationCategory: "DeveloperApplication",
    features: [
      "Keeps the first occurrence, preserving order",
      "Exact, trimmed or case-insensitive matching",
      "Reports which values were duplicated and how often",
      "Optional alphabetical sorting",
      "Counts removed at a glance",
    ],
    steps: [
      {
        name: "Paste your list",
        text: "One value per line. Paste from a spreadsheet column, a log file or a query result.",
      },
      {
        name: "Choose how to match",
        text: "Exact matching compares lines literally. Trimmed ignores surrounding spaces, and case-insensitive treats Alice and alice as the same — which is usually right for email addresses.",
      },
      {
        name: "Read what was duplicated",
        text: "The most frequently repeated values are listed with their counts, which often reveals the reason the duplicates exist.",
      },
      {
        name: "Copy the cleaned list",
        text: "Copy or download the result. The original order is preserved unless you ask for it to be sorted.",
      },
    ],
    examples: [
      {
        title: "Order preserved",
        input: "b\na\nb\nc",
        output: "b\na\nc",
        explanation:
          "The first occurrence of each line is kept, so a list ordered by relevance or date keeps its ordering. Keeping the last occurrence instead would silently reshuffle it.",
      },
      {
        title: "Case-insensitive email addresses",
        input: "Ada@x.com\nada@x.com",
        output: "Ada@x.com",
        explanation:
          "The domain part of an email address is case-insensitive and in practice the local part is too, so these are the same address. The first spelling is kept.",
      },
      {
        title: "Trailing whitespace",
        input: "value\nvalue ",
        output: "value",
        explanation:
          "A trailing space from a copy-and-paste makes two lines differ. Trimmed matching treats them as one, which is almost always what was meant.",
      },
    ],
    benefits: [
      {
        title: "Ordering survives",
        description:
          "The first occurrence is kept, so a list sorted by rank, date or priority is still in that order afterwards.",
      },
      {
        title: "Shows what repeated",
        description:
          "The duplicate report with counts frequently explains the underlying problem — a join fanning out, an export run twice.",
      },
      {
        title: "Matching you can choose",
        description:
          "Whitespace and case differences are usually noise, but not always, so how strictly lines are compared is up to you.",
      },
      {
        title: "Runs in your browser",
        description:
          "Lists of email addresses and customer identifiers are exactly the data you should not paste into a random website. This one does not transmit it.",
      },
    ],
    limitations: [
      "It works line by line, so a CSV row with the same values in a different column order is not detected as a duplicate.",
      "There is no fuzzy matching — near-duplicates such as a misspelt name are treated as distinct values.",
      "Case-insensitive matching uses simple lowercasing, which is correct for most scripts but not for every locale rule.",
      "Very large lists are held in memory, so a file of several million lines may be slow.",
    ],
    keyTakeaways: [
      "The first occurrence is kept, so ordering is preserved.",
      "Matching can ignore surrounding whitespace, letter case, or neither.",
      "The duplicate report often explains why the duplicates exist.",
      "Comparison is line by line, not field by field.",
      "Everything runs in your browser.",
    ],
    faqs: [
      {
        id: "which-kept",
        question: "Which copy of a duplicate is kept?",
        answer:
          "The first. That preserves the order of a list sorted by relevance, date or priority. Keeping the last instead would reshuffle the list in a way that is easy to miss and hard to undo.",
      },
      {
        id: "case",
        question: "Should I use case-insensitive matching?",
        answer:
          "For email addresses and domain names, yes — they are not case-sensitive in practice. For anything case-sensitive, such as passwords, base64 or API keys, no: two values differing only in case are genuinely different.",
      },
      {
        id: "whitespace",
        question: "Why do two identical-looking lines not match?",
        answer:
          "Almost always trailing whitespace from a copy and paste, or a mix of Windows and Unix line endings. Trimmed matching handles both, which is why it is worth trying when exact matching finds fewer duplicates than you expected.",
      },
      {
        id: "counts",
        question: "What use is the duplicate report?",
        answer:
          "The counts usually explain the cause. A value appearing exactly twice throughout suggests an export was run twice or a join produced a fan-out; one value appearing hundreds of times suggests a default or placeholder leaking into real data.",
      },
      {
        id: "csv",
        question: "Can it deduplicate CSV rows?",
        answer:
          "Only as whole lines. Two rows with identical values written in a different order, or differing only in quoting, will not match. For field-aware comparison, convert to JSON first and compare there.",
      },
      {
        id: "sorting",
        question: "Should I sort the output?",
        answer:
          "Only if the input order carried no meaning. Sorting makes a list easier to scan and compare, but it destroys any ordering the list already had — which is the thing keeping the first occurrence was protecting.",
      },
      {
        id: "empty-lines",
        question: "What happens to blank lines?",
        answer:
          "They are dropped by default, since a blank line is rarely meaningful data. They can be kept if the blank lines are structural — separating records, for instance.",
      },
      {
        id: "size",
        question: "How long a list can it handle?",
        answer:
          "Hundreds of thousands of lines are fine. The whole list and its index are held in memory at once, so several million lines will make the browser struggle.",
      },
      {
        id: "privacy",
        question: "Is my list uploaded anywhere?",
        answer:
          "No. Deduplication runs in this page. This is one of the tools where it matters most, because the lists people deduplicate are usually email addresses, customer ids or account numbers.",
      },
    ],
    relatedSlugs: ["csv-to-json", "json-to-csv", "json-compare", "sql-formatter"],
  },

  "unix-timestamp-converter": {
    slug: "unix-timestamp-converter",
    name: "Unix Timestamp Converter",
    title: "Unix Timestamp Converter — Seconds or Millis",
    description:
      "Convert Unix timestamps to dates and back. Detects seconds versus milliseconds and shows both UTC and your local time.",
    h1: "Unix Timestamp Converter",
    intro:
      "A Unix timestamp counts the seconds since the start of 1970 in UTC, which makes it unambiguous to store and unreadable to humans. Two things go wrong in practice: a timestamp in seconds and one in milliseconds look alike but are a thousand-fold apart, and a value read in one timezone means a different local moment than the same value read in another. Both are handled explicitly here.",
    iconName: "Clock",
    applicationCategory: "DeveloperApplication",
    features: [
      "Automatic detection of seconds versus milliseconds",
      "UTC, ISO 8601 and local time shown together",
      "Relative description such as three days ago",
      "Converts a date back to a timestamp",
      "Live current timestamp",
    ],
    steps: [
      {
        name: "Paste a timestamp",
        text: "Enter the number from your log or database. Whether it is in seconds or milliseconds is detected from its magnitude, and can be overridden.",
      },
      {
        name: "Read every form at once",
        text: "ISO 8601, the UTC string, your local time with its zone, and a plain description like two hours ago are all shown together.",
      },
      {
        name: "Or convert the other way",
        text: "Enter a date and get its timestamp. A date without a time is treated explicitly as local or UTC rather than being guessed.",
      },
      {
        name: "Copy the form you need",
        text: "Copy any representation directly. The current timestamp is always shown, updating each second.",
      },
    ],
    examples: [
      {
        title: "The epoch itself",
        input: "0",
        output: "1970-01-01T00:00:00.000Z",
        explanation:
          "Zero is the start of the Unix epoch. Seeing it in a database usually means a date field was never set rather than that something happened in 1970.",
      },
      {
        title: "The 32-bit limit",
        input: "2147483647",
        output: "2038-01-19T03:14:07.000Z",
        explanation:
          "The largest value a signed 32-bit integer can hold. Systems still storing timestamps that way will overflow at this moment, which is the Year 2038 problem.",
      },
      {
        title: "Milliseconds mistaken for seconds",
        input: "1700000000000",
        output: "Detected as milliseconds",
        explanation:
          "Read as seconds this would be a date over fifty thousand years away. Thirteen digits means milliseconds, which JavaScript uses natively while most other languages use seconds.",
      },
    ],
    benefits: [
      {
        title: "No unit confusion",
        description:
          "Seconds and milliseconds are distinguished by magnitude, so pasting a JavaScript timestamp into a tool expecting seconds no longer produces a date in the far future.",
      },
      {
        title: "Both timezones at once",
        description:
          "UTC and your local time are shown together with the zone named, which is what you need to reconcile a log entry with a user's report.",
      },
      {
        title: "Human context",
        description:
          "A relative description makes it immediately obvious whether a timestamp is recent, ancient, or wrongly in the future.",
      },
      {
        title: "Runs in your browser",
        description:
          "Timestamps come from logs and databases. Nothing is uploaded.",
      },
    ],
    limitations: [
      "Local time uses your device's zone and its current daylight saving rules, which may differ from the server that produced the timestamp.",
      "Leap seconds are not represented, because Unix time ignores them by definition.",
      "Dates before 1970 are negative timestamps, which some systems reject even though they are valid.",
      "Historical timezone rules change, so a very old timestamp may display slightly differently from how it appeared at the time.",
    ],
    keyTakeaways: [
      "Ten digits means seconds; thirteen means milliseconds.",
      "A Unix timestamp is always UTC — a timezone is applied only when displaying it.",
      "2147483647 is the 32-bit limit and overflows in January 2038.",
      "A timestamp of 0 usually means a field was never set.",
      "Everything runs in your browser.",
    ],
    faqs: [
      {
        id: "seconds-or-millis",
        question: "How do I tell seconds from milliseconds?",
        answer:
          "Count the digits. A current timestamp in seconds is ten digits; in milliseconds it is thirteen. JavaScript uses milliseconds while most other languages and databases use seconds, which is why the confusion arises constantly.",
      },
      {
        id: "timezone",
        question: "Does a Unix timestamp have a timezone?",
        answer:
          "No. It is always the number of seconds since 1970 in UTC. A timezone only enters when you display it, which is why the same timestamp shows as different wall-clock times in London and New York.",
      },
      {
        id: "2038",
        question: "What is the Year 2038 problem?",
        answer:
          "A signed 32-bit integer holds at most 2147483647, which as a timestamp is 19 January 2038. Systems still storing time that way will overflow to a negative number and read as 1901. Modern systems use 64-bit values and are unaffected.",
      },
      {
        id: "zero",
        question: "Why do I keep seeing 1 January 1970?",
        answer:
          "That is timestamp zero. It nearly always means a date field was never set and defaulted to zero, rather than that anything actually happened at the start of the epoch.",
      },
      {
        id: "negative",
        question: "Can a timestamp be negative?",
        answer:
          "Yes — a negative value is a date before 1970 and is perfectly valid. Some systems reject them anyway, which is why dates of birth are often stored as a formatted date rather than a timestamp.",
      },
      {
        id: "date-only",
        question: "Why does a date without a time shift by a day?",
        answer:
          "A bare date like 2024-03-05 is interpreted as UTC midnight by the JavaScript standard, while the same string with a time is interpreted as local. Near either side of the date line that is a whole day out, so this tool asks which you meant.",
      },
      {
        id: "leap-seconds",
        question: "Are leap seconds accounted for?",
        answer:
          "No, and that is by design. Unix time pretends every day has exactly 86,400 seconds, so a leap second is absorbed rather than counted. This keeps the arithmetic simple at the cost of being very slightly out of step with astronomical time.",
      },
      {
        id: "iso",
        question: "What is ISO 8601 and why prefer it?",
        answer:
          "The international standard format, like 2024-03-05T14:30:00Z, where the trailing Z means UTC. It sorts correctly as text, is unambiguous about the timezone, and is understood by essentially every system — unlike a format such as 03/05/2024.",
      },
      {
        id: "privacy",
        question: "Is anything I paste here recorded?",
        answer:
          "No. The conversion is arithmetic done in your browser. Log lines pasted alongside a timestamp often contain user ids and request paths, and none of it is transmitted.",
      },
    ],
    relatedSlugs: ["uuid-generator", "json-viewer", "hash-generator", "duplicate-row-remover"],
  },
};
