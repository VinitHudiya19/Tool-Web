"use client";

import { useCallback, useMemo, useState } from "react";

import TransformTool, { type TransformOutcome } from "@/components/dev/TransformTool";
import { OptionGroup, Toggle } from "@/components/dev/ui";
import { removeDuplicateLines, type DuplicateMode } from "@/lib/dev/data";

const MODES: { id: DuplicateMode; label: string; hint: string }[] = [
  { id: "exact", label: "Exact", hint: "Lines must match character for character." },
  {
    id: "trimmed",
    label: "Ignore spacing",
    hint: "Ignores leading and trailing whitespace, which is usually a copy-and-paste artefact.",
  },
  {
    id: "caseInsensitive",
    label: "Ignore case",
    hint: "Treats Alice and alice as the same — right for email addresses, wrong for anything case-sensitive.",
  },
];

export default function DuplicateRemoverTool() {
  const [mode, setMode] = useState<DuplicateMode>("trimmed");
  const [sort, setSort] = useState(false);
  const [keepEmpty, setKeepEmpty] = useState(false);
  const [input, setInput] = useState("");

  const transform = useCallback(
    (source: string): TransformOutcome => {
      const result = removeDuplicateLines(source, { mode, sort, keepEmpty });

      return {
        output: result.lines.join("\n"),
        stats: [
          { label: "Kept", value: result.lines.length },
          { label: "Removed", value: result.removed },
          {
            label: "Repeated values",
            value: result.duplicates.length,
            hint: result.duplicates.length > 0 ? "Listed below" : undefined,
          },
        ],
      };
    },
    [mode, sort, keepEmpty],
  );

  // Recomputed from the settled input rather than smuggled out of the
  // transform, so the panel below stays a pure function of state.
  const duplicates = useMemo(
    () =>
      input.trim()
        ? removeDuplicateLines(input, { mode, sort, keepEmpty }).duplicates
        : [],
    [input, mode, sort, keepEmpty],
  );

  return (
    <>
      <TransformTool
        transform={transform}
        onInput={setInput}
        inputLabel="Your list"
        outputLabel="Deduplicated"
        placeholder={"one value per line\nanother value\none value per line"}
        downloadName="deduplicated.txt"
        showByteCounts={false}
        rows={14}
        controls={
          <div className="space-y-4">
            <OptionGroup<DuplicateMode>
              legend="How to match"
              value={mode}
              onChange={setMode}
              options={MODES}
            />
            <div className="grid gap-2 sm:grid-cols-2">
              <Toggle
                checked={sort}
                onChange={setSort}
                label="Sort alphabetically"
                hint="Destroys the original ordering, so leave off for a ranked list."
              />
              <Toggle
                checked={keepEmpty}
                onChange={setKeepEmpty}
                label="Keep blank lines"
                hint="Useful when blank lines separate records."
              />
            </div>
          </div>
        }
      />

      {duplicates.length > 0 && (
        <section className="mt-5 rounded-custom-lg border border-border-custom bg-bg p-5 shadow-custom-sm">
          <h2 className="mb-1 text-xs font-semibold uppercase tracking-wider text-text-2">
            What repeated
          </h2>
          <p className="mb-3 text-xs text-text-2">
            The counts often explain the cause — a value appearing exactly twice
            throughout usually means an export ran twice.
          </p>
          <ul className="space-y-1.5">
            {duplicates.map((entry) => (
              <li
                key={entry.value}
                className="flex items-center justify-between gap-3 rounded-custom-sm bg-surface px-3 py-2"
              >
                <span className="min-w-0 truncate font-mono text-xs text-text-custom">
                  {entry.value}
                </span>
                <span
                  className="shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold tabular-nums text-white"
                  style={{ background: "var(--cat-accent)" }}
                >
                  {entry.count}×
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
