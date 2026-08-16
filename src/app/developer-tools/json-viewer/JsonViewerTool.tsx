"use client";

import { useCallback, useState } from "react";
import { AlertTriangle } from "lucide-react";

import TransformTool, { type TransformOutcome } from "@/components/dev/TransformTool";
import { OptionGroup, Toggle } from "@/components/dev/ui";
import { formatJson, measureJson, parseJson, sortKeys } from "@/lib/dev/json";

export default function JsonViewerTool() {
  const [indent, setIndent] = useState("2");
  const [shouldSortKeys, setShouldSortKeys] = useState(false);

  const transform = useCallback(
    (input: string): TransformOutcome => {
      const parsed = parseJson(input);

      if (!parsed.ok) {
        // A location beats a bare "unexpected token" every time.
        const pointer = parsed.excerpt
          ? `\n\n${parsed.excerpt}\n${" ".repeat(Math.max(parsed.column - 1, 0))}^`
          : "";
        throw new Error(
          `${parsed.message}\nLine ${parsed.line}, column ${parsed.column}.${pointer}`,
        );
      }

      const value = shouldSortKeys ? sortKeys(parsed.value) : parsed.value;
      const output = formatJson(value, indent === "0" ? 0 : Number.parseInt(indent, 10));
      const { nodes, depth } = measureJson(parsed.value);

      return {
        output,
        note:
          parsed.unsafeNumbers.length > 0 ? (
            <span className="flex items-start gap-2 rounded-custom-sm border border-amber-200 bg-amber-50 p-3 text-xs leading-relaxed text-amber-800">
              <AlertTriangle size={14} className="mt-px shrink-0" aria-hidden="true" />
              <span>
                <strong className="font-semibold">
                  {parsed.unsafeNumbers.length === 1
                    ? "One number is"
                    : `${parsed.unsafeNumbers.length} numbers are`}{" "}
                  too large for JavaScript to hold exactly
                </strong>{" "}
                — {parsed.unsafeNumbers.slice(0, 3).join(", ")}
                {parsed.unsafeNumbers.length > 3 && " and others"}. The formatted output
                above already shows the rounded value. To keep these intact, the system
                producing this JSON needs to send them as strings.
              </span>
            </span>
          ) : undefined,
        stats: [
          { label: "Nodes", value: nodes },
          { label: "Max depth", value: depth },
        ],
      };
    },
    [indent, shouldSortKeys],
  );

  return (
    <TransformTool
      transform={transform}
      canSwap
      inputLabel="JSON"
      outputLabel="Formatted"
      placeholder='{"paste": "your JSON here"}'
      downloadName="formatted.json"
      downloadMime="application/json"
      accept=".json,application/json,text/*"
      rows={14}
      controls={
        <div className="space-y-4">
          <OptionGroup
            legend="Indent"
            value={indent}
            onChange={setIndent}
            options={[
              { id: "2", label: "2 spaces" },
              { id: "4", label: "4 spaces" },
              { id: "0", label: "Minify", hint: "Smallest valid form, for transport." },
            ]}
          />
          <Toggle
            checked={shouldSortKeys}
            onChange={setShouldSortKeys}
            label="Sort keys alphabetically"
            hint="Puts two documents into the same shape so a diff shows only real differences."
          />
        </div>
      }
    />
  );
}
