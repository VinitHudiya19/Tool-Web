"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { Check, Minus, Pencil, Plus } from "lucide-react";

import { CodeArea, ErrorBanner, StatCard, Toggle, ToolShell } from "@/components/dev/ui";
import { diffJson, parseJson, summariseDiff, type DiffEntry } from "@/lib/dev/json";

/** Discriminated so the branches below narrow cleanly. */
type ComparisonResult =
  | { status: "idle" }
  | { status: "error"; message: string }
  | {
      status: "compared";
      entries: DiffEntry[];
      summary: ReturnType<typeof summariseDiff>;
    };

const KIND_STYLES = {
  added: { icon: Plus, label: "Added", className: "border-emerald-200 bg-emerald-50 text-emerald-800" },
  removed: { icon: Minus, label: "Removed", className: "border-red-200 bg-red-50 text-red-700" },
  changed: { icon: Pencil, label: "Changed", className: "border-amber-200 bg-amber-50 text-amber-800" },
} as const;

/** Renders a value compactly, truncating anything unwieldy. */
function preview(value: unknown): string {
  if (value === undefined) return "—";
  const text = JSON.stringify(value);
  if (text === undefined) return String(value);
  return text.length > 120 ? `${text.slice(0, 120)}…` : text;
}

export default function JsonCompareTool() {
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");
  const [showUnchanged, setShowUnchanged] = useState(false);
  const [fileError, setFileError] = useState("");

  const deferredLeft = useDeferredValue(left);
  const deferredRight = useDeferredValue(right);

  const result = useMemo((): ComparisonResult => {
    if (!deferredLeft.trim() || !deferredRight.trim()) return { status: "idle" };

    const a = parseJson(deferredLeft);
    if (!a.ok) {
      return {
        status: "error",
        message: `Left side: ${a.message} (line ${a.line}, column ${a.column})`,
      };
    }

    const b = parseJson(deferredRight);
    if (!b.ok) {
      return {
        status: "error",
        message: `Right side: ${b.message} (line ${b.line}, column ${b.column})`,
      };
    }

    const entries = diffJson(a.value, b.value);
    return { status: "compared", entries, summary: summariseDiff(entries) };
  }, [deferredLeft, deferredRight]);

  const visible: DiffEntry[] =
    result.status === "compared"
      ? result.entries.filter((entry) => showUnchanged || entry.kind !== "unchanged")
      : [];

  return (
    <ToolShell>
      <ErrorBanner message={fileError} onDismiss={() => setFileError("")} />

      <div className="grid gap-4 lg:grid-cols-2">
        <CodeArea
          value={left}
          onChange={setLeft}
          onError={setFileError}
          label="Original"
          placeholder='{"a": 1}'
          rows={12}
          accept=".json,application/json,text/*"
        />
        <CodeArea
          value={right}
          onChange={setRight}
          onError={setFileError}
          label="Changed"
          placeholder='{"a": 2}'
          rows={12}
          accept=".json,application/json,text/*"
        />
      </div>

      {result.status === "error" && <ErrorBanner message={result.message} />}

      {result.status === "compared" && (
        <div aria-live="polite" className="space-y-4 border-t border-border-custom pt-4">
          {result.summary.identical ? (
            <p className="flex items-center gap-2.5 rounded-custom-sm border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800">
              <Check size={16} aria-hidden="true" />
              These documents are equivalent. Any difference in key order or formatting
              carries no meaning in JSON.
            </p>
          ) : (
            <>
              <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <StatCard label="Added" value={result.summary.added} />
                <StatCard label="Removed" value={result.summary.removed} />
                <StatCard label="Changed" value={result.summary.changed} emphasis />
                <StatCard label="Unchanged" value={result.summary.unchanged} />
              </dl>

              <Toggle
                checked={showUnchanged}
                onChange={setShowUnchanged}
                label="Show unchanged values too"
              />

              <ul className="max-h-[28rem] space-y-1.5 overflow-y-auto">
                {visible.map((entry, index) => {
                  if (entry.kind === "unchanged") {
                    return (
                      <li
                        key={`${entry.path}-${index}`}
                        className="rounded-custom-sm border border-border-custom bg-surface px-3 py-2"
                      >
                        <code className="font-mono text-xs text-text-2">{entry.path}</code>
                        <span className="ml-2 font-mono text-xs text-text-2 opacity-60">
                          {preview(entry.left)}
                        </span>
                      </li>
                    );
                  }

                  const style = KIND_STYLES[entry.kind];
                  const Icon = style.icon;

                  return (
                    <li
                      key={`${entry.path}-${index}`}
                      className={`rounded-custom-sm border px-3 py-2 ${style.className}`}
                    >
                      <div className="flex items-start gap-2">
                        <Icon size={13} className="mt-0.5 shrink-0" aria-hidden="true" />
                        <div className="min-w-0 flex-grow">
                          <code className="break-all font-mono text-xs font-semibold">
                            {entry.path}
                          </code>
                          <div className="mt-0.5 font-mono text-xs">
                            {entry.kind === "changed" ? (
                              <>
                                <span className="line-through opacity-70">
                                  {preview(entry.left)}
                                </span>
                                <span className="mx-1.5">→</span>
                                <span className="font-semibold">{preview(entry.right)}</span>
                              </>
                            ) : entry.kind === "added" ? (
                              preview(entry.right)
                            ) : (
                              preview(entry.left)
                            )}
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </div>
      )}
    </ToolShell>
  );
}
