"use client";

import { useCallback, useState } from "react";

import TransformTool, { type TransformOutcome } from "@/components/dev/TransformTool";
import { OptionGroup, Toggle } from "@/components/dev/ui";
import { parseCsv } from "@/lib/dev/data";

const DELIMITERS = [
  { id: "", label: "Detect", hint: "Guessed from the file's content." },
  { id: ",", label: "Comma" },
  { id: ";", label: "Semicolon", hint: "Common where a comma is the decimal separator." },
  { id: "\t", label: "Tab", hint: "What you get pasting from a spreadsheet." },
];

export default function CsvToJsonTool() {
  const [delimiter, setDelimiter] = useState("");
  const [hasHeader, setHasHeader] = useState(true);
  const [inferTypes, setInferTypes] = useState(true);
  const [indent, setIndent] = useState("2");

  const transform = useCallback(
    (input: string): TransformOutcome => {
      const { rows, headers, problems, delimiter: used } = parseCsv(input, {
        delimiter,
        hasHeader,
        inferTypes,
      });

      if (rows.length === 0) {
        throw new Error("No rows were found. Check the delimiter and header settings.");
      }

      const output = JSON.stringify(
        rows,
        null,
        indent === "0" ? undefined : Number.parseInt(indent, 10),
      );

      const delimiterName =
        used === "\t" ? "tab" : used === ";" ? "semicolon" : used === "," ? "comma" : used;

      return {
        output,
        note:
          problems.length > 0 ? (
            <span className="block rounded-custom-sm border border-amber-200 bg-amber-50 p-3 text-xs leading-relaxed text-amber-800">
              <strong className="font-semibold">
                {problems.length} row{problems.length === 1 ? "" : "s"} could not be read
                cleanly
              </strong>{" "}
              — {problems.slice(0, 3).map((problem) => `line ${problem.row}`).join(", ")}
              {problems.length > 3 && " and others"}. A row with the wrong number of
              fields usually means a quote was left unclosed earlier in the file.
            </span>
          ) : undefined,
        stats: [
          { label: "Rows", value: rows.length },
          { label: "Columns", value: headers.length },
          { label: "Delimiter", value: delimiterName || "comma" },
        ],
      };
    },
    [delimiter, hasHeader, inferTypes, indent],
  );

  return (
    <TransformTool
      transform={transform}
      inputLabel="CSV"
      outputLabel="JSON"
      placeholder={"name,zip\nAda,007"}
      downloadName="data.json"
      downloadMime="application/json"
      accept=".csv,.tsv,.txt,text/*"
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
          <OptionGroup
            legend="JSON indent"
            value={indent}
            onChange={setIndent}
            options={[
              { id: "2", label: "2 spaces" },
              { id: "0", label: "Minified" },
            ]}
          />
          <div className="grid gap-2 sm:grid-cols-2">
            <Toggle
              checked={hasHeader}
              onChange={setHasHeader}
              label="First row is a header"
              hint="Turn off and columns are named column_1 upwards."
            />
            <Toggle
              checked={inferTypes}
              onChange={setInferTypes}
              label="Convert numbers and booleans"
              hint="Values with leading zeros stay text either way, so 007 is never turned into 7."
            />
          </div>
        </div>
      }
    />
  );
}
