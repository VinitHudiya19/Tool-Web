"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { ArrowLeftRight, Download } from "lucide-react";

import { CopyButton, ErrorBanner, TextInput, ToolShell } from "@/components/text/ui";
import { CASES, convertCase, type CaseId } from "@/lib/text/case";

export default function CaseConverterTool() {
  const [text, setText] = useState("");
  const [caseId, setCaseId] = useState<CaseId>("title");
  const [error, setError] = useState("");

  const deferredText = useDeferredValue(text);
  const output = useMemo(
    () => convertCase(deferredText, caseId),
    [deferredText, caseId],
  );

  const active = CASES.find((entry) => entry.id === caseId) ?? CASES[0];

  const download = () => {
    const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${caseId}-case.txt`;
    document.body.append(link);
    link.click();
    link.remove();

    // Revoked on the next tick so the download has started.
    setTimeout(() => URL.revokeObjectURL(url), 0);
  };

  return (
    <ToolShell>
      <ErrorBanner message={error} onDismiss={() => setError("")} />

      <fieldset>
        <legend className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-2">
          Style
        </legend>
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 lg:grid-cols-5">
          {CASES.map((entry) => (
            <button
              key={entry.id}
              type="button"
              onClick={() => setCaseId(entry.id)}
              aria-pressed={caseId === entry.id}
              title={entry.hint}
              className={`flex h-14 flex-col items-center justify-center gap-0.5 rounded-custom-sm px-2 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${
                caseId === entry.id
                  ? "text-white"
                  : "border border-border-custom bg-bg text-text-2 hover:text-text-custom"
              }`}
              style={caseId === entry.id ? { background: "var(--cat-accent)" } : undefined}
            >
              <span className="text-[13px] font-semibold">{entry.label}</span>
              {/* A live preview of the transform beats a bare label */}
              <span
                className={`truncate font-mono text-[10px] ${
                  caseId === entry.id ? "text-white/75" : "text-text-2 opacity-70"
                }`}
              >
                {entry.sample}
              </span>
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-text-2">{active.hint}</p>
      </fieldset>

      <div className="grid gap-4 lg:grid-cols-2">
        <TextInput
          value={text}
          onChange={setText}
          onError={setError}
          label="Input"
          placeholder="Type or paste text. A list is converted line by line."
          rows={10}
        />

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-sm font-medium text-text-2">Output</span>
            {output && (
              <button
                type="button"
                onClick={() => setText(output)}
                className="inline-flex h-8 items-center gap-1.5 rounded-custom-sm px-2.5 text-xs font-medium text-text-2 transition-colors hover:bg-surface hover:text-text-custom focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                title="Move the result into the input to convert it again"
              >
                <ArrowLeftRight size={13} aria-hidden="true" />
                Use as input
              </button>
            )}
          </div>

          <textarea
            readOnly
            value={output}
            rows={10}
            placeholder="The converted text appears here."
            spellCheck={false}
            className="w-full resize-y rounded-custom-sm border border-border-custom bg-surface px-3.5 py-3 text-sm leading-relaxed text-text-custom focus:outline-none focus:ring-[3px] focus:ring-primary/20"
          />
        </div>
      </div>

      {output && (
        <div className="flex flex-col gap-3 border-t border-border-custom pt-4 sm:flex-row">
          <CopyButton text={output} label="Copy result" />

          <button
            type="button"
            onClick={download}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-custom-sm border border-border-custom bg-bg px-5 text-sm font-medium text-text-2 transition-colors hover:text-text-custom focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
          >
            <Download size={15} aria-hidden="true" />
            Download .txt
          </button>
        </div>
      )}
    </ToolShell>
  );
}
