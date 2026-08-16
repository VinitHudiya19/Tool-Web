"use client";

import { useCallback, useState } from "react";

import TransformTool, { type TransformOutcome } from "@/components/dev/TransformTool";
import { OptionGroup, Toggle } from "@/components/dev/ui";
import { toCsv, toRecords } from "@/lib/dev/data";
import { parseJson } from "@/lib/dev/json";

const DELIMITERS = [
  { id: ",", label: "Comma", hint: "The standard, and what most tools expect." },
  {
    id: ";",
    label: "Semicolon",
    hint: "What Excel expects in locales where a comma is the decimal separator.",
  },
  { id: "\t", label: "Tab", hint: "Best for pasting straight into a spreadsheet." },
];

export default function JsonToCsvTool() {
  const [delimiter, setDelimiter] = useState(",");
  const [includeHeaders, setIncludeHeaders] = useState(true);
  const [flatten, setFlatten] = useState(true);

  const transform = useCallback(
    (input: string): TransformOutcome => {
      const parsed = parseJson(input);
      if (!parsed.ok) {
        throw new Error(`${parsed.message}\nLine ${parsed.line}, column ${parsed.column}.`);
      }

      const records = toRecords(parsed.value);
      if (!records || records.length === 0) {
        throw new Error(
          "CSV needs a list of records. Provide an array of objects, or an object wrapping one such as {\"data\": [...]}.",
        );
      }

      const output = toCsv(records, { delimiter, includeHeaders, flatten });
      const columns = output.split("\n")[0]?.split(delimiter).length ?? 0;

      return {
        output,
        stats: [
          { label: "Rows", value: records.length },
          { label: "Columns", value: columns },
        ],
      };
    },
    [delimiter, includeHeaders, flatten],
  );

  return (
    <TransformTool
      transform={transform}
      inputLabel="JSON"
      outputLabel="CSV"
      placeholder='[{"name": "Ada", "city": "London"}]'
      downloadName="data.csv"
      downloadMime="text/csv"
      accept=".json,application/json,text/*"
      showByteCounts={false}
      rows={14}
      controls={
        <div className="space-y-4">
          <OptionGroup
            legend="Delimiter"
            value={delimiter}
            onChange={setDelimiter}
            options={DELIMITERS}
          />
          <div className="grid gap-2 sm:grid-cols-2">
            <Toggle
              checked={includeHeaders}
              onChange={setIncludeHeaders}
              label="Include a header row"
            />
            <Toggle
              checked={flatten}
              onChange={setFlatten}
              label="Flatten nested objects"
              hint="Produces dotted columns like user.city. Turn off to keep nested values as JSON in one cell."
            />
          </div>
        </div>
      }
    />
  );
}
