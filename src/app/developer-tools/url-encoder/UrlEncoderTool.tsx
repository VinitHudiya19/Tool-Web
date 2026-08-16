"use client";

import { useCallback, useMemo, useState } from "react";

import TransformTool, { type TransformOutcome } from "@/components/dev/TransformTool";
import { OptionGroup } from "@/components/dev/ui";
import { decodeUrl, encodeUrl, parseUrl, type UrlEncodeMode } from "@/lib/dev/encoding";

type Direction = "encode" | "decode";

const MODES: { id: UrlEncodeMode; label: string; hint: string }[] = [
  {
    id: "component",
    label: "Single value",
    hint: "Escapes / ? & = so a value can sit safely inside a query string. This is what you want most of the time.",
  },
  {
    id: "full",
    label: "Whole URL",
    hint: "Escapes spaces and accents but leaves the structure — scheme, slashes, query separators — intact.",
  },
  {
    id: "form",
    label: "Form data",
    hint: "application/x-www-form-urlencoded: a space becomes +, and a few extra punctuation marks are escaped.",
  },
];

export default function UrlEncoderTool() {
  const [direction, setDirection] = useState<Direction>("encode");
  const [mode, setMode] = useState<UrlEncodeMode>("component");
  const [lastInput, setLastInput] = useState("");

  const transform = useCallback(
    (input: string): TransformOutcome => ({
      output: direction === "encode" ? encodeUrl(input, mode) : decodeUrl(input, mode),
    }),
    [direction, mode],
  );

  // Showing the parts makes it obvious which one needs escaping.
  const parts = useMemo(() => parseUrl(lastInput), [lastInput]);

  return (
    <>
      <TransformTool
        transform={transform}
        onInput={setLastInput}
        canSwap
        inputLabel={direction === "encode" ? "Text to encode" : "Encoded text"}
        outputLabel={direction === "encode" ? "Encoded" : "Decoded"}
        placeholder={
          direction === "encode"
            ? "Paste a URL or a single parameter value."
            : "Paste percent-encoded text."
        }
        downloadName="url.txt"
        showByteCounts={false}
        rows={8}
        controls={
          <div className="space-y-4">
            <OptionGroup<Direction>
              legend="Direction"
              value={direction}
              onChange={setDirection}
              options={[
                { id: "encode", label: "Encode" },
                { id: "decode", label: "Decode" },
              ]}
            />
            <OptionGroup<UrlEncodeMode>
              legend="What are you encoding?"
              value={mode}
              onChange={setMode}
              options={MODES}
            />
          </div>
        }
      />

      {parts && (
        <section className="mt-5 rounded-custom-lg border border-border-custom bg-bg p-5 shadow-custom-sm">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-2">
            This URL&rsquo;s parts
          </h2>
          <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
            <Part label="Scheme" value={parts.scheme} />
            <Part label="Host" value={parts.host} />
            <Part label="Path" value={parts.path} />
            {parts.fragment && <Part label="Fragment" value={parts.fragment} />}
          </dl>

          {parts.query.length > 0 && (
            <>
              <h3 className="mb-2 mt-4 text-xs font-semibold uppercase tracking-wider text-text-2">
                Query parameters ({parts.query.length})
              </h3>
              <ul className="space-y-1">
                {parts.query.map((entry, index) => (
                  <li
                    key={`${entry.key}-${index}`}
                    className="flex flex-wrap gap-2 rounded-custom-sm bg-surface px-3 py-2 font-mono text-xs"
                  >
                    <span className="font-semibold text-text-custom">{entry.key}</span>
                    <span className="text-text-2">=</span>
                    <span className="min-w-0 break-all text-text-2">{entry.value}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-xs text-text-2">
                Values are shown already decoded. Any value containing an ampersand,
                equals sign or question mark needs single-value encoding.
              </p>
            </>
          )}
        </section>
      )}
    </>
  );
}

function Part({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="min-w-0">
      <dt className="text-[11px] uppercase tracking-wider text-text-2 opacity-70">
        {label}
      </dt>
      <dd className="break-all font-mono text-xs text-text-custom">{value}</dd>
    </div>
  );
}
