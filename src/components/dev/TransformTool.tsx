"use client";

import {
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { ArrowLeftRight } from "lucide-react";

import {
  CodeArea,
  CopyButton,
  DownloadButton,
  ErrorBanner,
  SmallButton,
  StatCard,
  ToolShell,
  formatBytes,
} from "./ui";

export interface TransformOutcome {
  output: string;
  /** Shown above the output when the transform wants to explain something. */
  note?: ReactNode;
  /** Extra figures shown beneath the panes. */
  stats?: { label: string; value: string | number; hint?: string }[];
}

/**
 * The shared engine for tools that take text in and give text out.
 *
 * Encoders, formatters and viewers differ only in the transform function and
 * the controls above it, so they share one component: the input handling,
 * error reporting, copy, download and swap behave identically everywhere
 * rather than being reimplemented per tool with slightly different bugs.
 */
export default function TransformTool({
  transform,
  controls,
  inputLabel = "Input",
  outputLabel = "Output",
  placeholder,
  downloadName,
  downloadMime,
  rows = 12,
  canSwap = false,
  onSwap,
  accept,
  initialInput = "",
  showByteCounts = true,
  onInput,
}: {
  /** Throws to report a problem; the message is shown to the user. */
  transform: (input: string) => TransformOutcome;
  controls?: ReactNode;
  inputLabel?: string;
  outputLabel?: string;
  placeholder?: string;
  downloadName: string;
  downloadMime?: string;
  rows?: number;
  /** Offers a button that moves the output back into the input. */
  canSwap?: boolean;
  onSwap?: () => void;
  accept?: string;
  initialInput?: string;
  showByteCounts?: boolean;
  /** Notified after the input settles, for panels rendered outside this tool. */
  onInput?: (input: string) => void;
}) {
  const [input, setInput] = useState(initialInput);
  const [fileError, setFileError] = useState("");

  // Keeps typing responsive on a large paste: the textarea updates
  // immediately while the transform catches up a frame later.
  const deferredInput = useDeferredValue(input);

  const result = useMemo(() => {
    if (!deferredInput.trim()) {
      return { outcome: { output: "" } as TransformOutcome, error: "" };
    }

    try {
      return { outcome: transform(deferredInput), error: "" };
    } catch (cause) {
      return {
        outcome: { output: "" } as TransformOutcome,
        error: cause instanceof Error ? cause.message : "That input could not be processed.",
      };
    }
  }, [deferredInput, transform]);

  // Reported from an effect rather than during the transform, since the
  // transform runs while rendering and must not set state.
  useEffect(() => {
    onInput?.(deferredInput);
  }, [deferredInput, onInput]);

  const { outcome, error } = result;

  const inputBytes = new Blob([deferredInput]).size;
  const outputBytes = new Blob([outcome.output]).size;
  const difference = inputBytes - outputBytes;

  return (
    <ToolShell>
      <ErrorBanner message={fileError} onDismiss={() => setFileError("")} />

      {controls}

      <div className="grid gap-4 lg:grid-cols-2">
        <CodeArea
          value={input}
          onChange={(next) => {
            setInput(next);
            // Clearing the box should clear any stale file error with it.
            if (next === "") setFileError("");
          }}
          onError={setFileError}
          label={inputLabel}
          placeholder={placeholder}
          rows={rows}
          accept={accept}
        />

        <CodeArea
          value={outcome.output}
          readOnly
          label={outputLabel}
          rows={rows}
          actions={
            canSwap && outcome.output ? (
              <SmallButton
                icon={<ArrowLeftRight size={13} />}
                onClick={() => {
                  setInput(outcome.output);
                  onSwap?.();
                }}
              >
                Use as input
              </SmallButton>
            ) : null
          }
        />
      </div>

      {/* A failed transform explains itself where the output would be. */}
      <ErrorBanner message={error} />

      {outcome.note && !error && (
        <div className="text-sm text-text-2">{outcome.note}</div>
      )}

      {(showByteCounts || outcome.stats) && outcome.output && !error && (
        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {showByteCounts && (
            <>
              <StatCard label="Input" value={formatBytes(inputBytes)} />
              <StatCard label="Output" value={formatBytes(outputBytes)} />
              <StatCard
                label={difference >= 0 ? "Saved" : "Added"}
                value={formatBytes(Math.abs(difference))}
                hint={
                  inputBytes > 0
                    ? `${Math.abs(Math.round((difference / inputBytes) * 100))}%`
                    : undefined
                }
                emphasis={difference > 0}
              />
            </>
          )}
          {outcome.stats?.map((stat) => (
            <StatCard
              key={stat.label}
              label={stat.label}
              value={stat.value}
              hint={stat.hint}
            />
          ))}
        </dl>
      )}

      {outcome.output && !error && (
        <div className="flex flex-col gap-3 border-t border-border-custom pt-4 sm:flex-row">
          <CopyButton text={outcome.output} label="Copy result" />
          <DownloadButton
            text={outcome.output}
            fileName={downloadName}
            mime={downloadMime}
          />
        </div>
      )}
    </ToolShell>
  );
}
