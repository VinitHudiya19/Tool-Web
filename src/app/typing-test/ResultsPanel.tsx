"use client";

import { lazy, Suspense, useState } from "react";
import { Check, Copy, RotateCcw, Trophy } from "lucide-react";

import type { TestResult } from "@/lib/typing/stats";
import type { PersonalBest } from "@/lib/typing/storage";

// Recharts is ~100KB and only ever needed once a test finishes, so it is not
// part of the bundle that loads with the page.
const SpeedChart = lazy(() => import("./SpeedChart"));

export default function ResultsPanel({
  result,
  personalBest,
  isNewRecord,
  modeLabel,
  onRestart,
  onRepeat,
}: {
  result: TestResult;
  personalBest: PersonalBest | null;
  isNewRecord: boolean;
  modeLabel: string;
  onRestart: () => void;
  onRepeat: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const shareText = `${result.wpm} WPM · ${result.accuracy}% accuracy · ${modeLabel} — typing test at quicktoolz.tech/typing-test`;

  const copyResult = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard permission can be denied; the figures are on screen anyway.
    }
  };

  return (
    <div className="space-y-6">
      {isNewRecord && (
        <p
          role="status"
          className="flex items-center justify-center gap-2 rounded-custom-sm border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800"
        >
          <Trophy size={16} aria-hidden="true" />
          New personal best for {modeLabel}
        </p>
      )}

      {/* Headline figures, announced together so a screen reader hears the
          result as one sentence rather than four disconnected numbers. */}
      <div
        aria-live="polite"
        aria-label={`Result: ${result.wpm} words per minute, ${result.accuracy} percent accuracy, ${result.consistency} percent consistency.`}
        className="grid grid-cols-2 gap-3 sm:grid-cols-4"
      >
        <Stat label="WPM" value={result.wpm} isPrimary />
        <Stat label="Accuracy" value={`${result.accuracy}%`} />
        <Stat label="Raw WPM" value={result.rawWpm} />
        <Stat label="Consistency" value={`${result.consistency}%`} />
      </div>

      <dl className="grid grid-cols-2 gap-x-6 gap-y-3 rounded-custom-md border border-border-custom bg-surface p-4 text-sm sm:grid-cols-4">
        <Detail label="Correct words" value={result.correctWords} />
        <Detail label="Wrong words" value={result.incorrectWords} />
        <Detail
          label="Characters"
          value={`${result.correctChars} / ${result.correctChars + result.incorrectChars}`}
        />
        <Detail label="Time" value={`${(result.durationMs / 1000).toFixed(1)}s`} />
      </dl>

      {result.samples.length > 1 && (
        <div className="rounded-custom-md border border-border-custom bg-bg p-4">
          <h3 className="mb-3 text-sm font-semibold text-text-custom">
            Speed over time
          </h3>
          <Suspense
            fallback={
              <div className="h-[200px] animate-pulse rounded-custom-sm bg-surface" />
            }
          >
            <SpeedChart samples={result.samples} />
          </Suspense>
        </div>
      )}

      {personalBest && (
        <p className="text-center text-sm text-text-2">
          Your best for {modeLabel}:{" "}
          <strong className="font-semibold text-text-custom">
            {personalBest.wpm} WPM
          </strong>{" "}
          at {personalBest.accuracy}% accuracy
          {personalBest.date ? ` · ${personalBest.date}` : ""}
        </p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <button
          type="button"
          onClick={onRestart}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-custom-sm bg-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-primary-h focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 active:scale-[0.99]"
        >
          <RotateCcw size={15} aria-hidden="true" />
          New test
        </button>
        <button
          type="button"
          onClick={onRepeat}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-custom-sm border border-border-custom bg-bg px-6 text-sm font-medium text-text-2 transition-colors hover:border-primary hover:text-text-custom focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
        >
          Repeat same text
        </button>
        <button
          type="button"
          onClick={copyResult}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-custom-sm border border-border-custom bg-bg px-6 text-sm font-medium text-text-2 transition-colors hover:border-primary hover:text-text-custom focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
        >
          {copied ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}
          {copied ? "Copied" : "Copy result"}
        </button>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  isPrimary = false,
}: {
  label: string;
  value: string | number;
  isPrimary?: boolean;
}) {
  return (
    <div
      className={`rounded-custom-md border p-4 text-center ${
        isPrimary
          ? "border-primary/30 bg-primary/5"
          : "border-border-custom bg-bg"
      }`}
    >
      <div
        className={`font-bold tabular-nums ${
          isPrimary ? "text-4xl text-primary" : "text-3xl text-text-custom"
        }`}
      >
        {value}
      </div>
      <div className="mt-0.5 text-[11px] font-semibold uppercase tracking-wider text-text-2">
        {label}
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <dt className="text-[11px] font-semibold uppercase tracking-wider text-text-2 opacity-70">
        {label}
      </dt>
      <dd className="mt-0.5 font-semibold tabular-nums text-text-custom">{value}</dd>
    </div>
  );
}
