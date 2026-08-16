"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Copy } from "lucide-react";

import { ErrorBanner, OptionGroup, ToolShell } from "@/components/dev/ui";
import {
  detectUnit,
  parseDateInput,
  REFERENCE_TIMESTAMPS,
  viewTimestamp,
  type TimestampUnit,
} from "@/lib/dev/time";

type Direction = "toDate" | "toTimestamp";

export default function TimestampTool() {
  const [direction, setDirection] = useState<Direction>("toDate");
  const [timestampInput, setTimestampInput] = useState("");
  const [dateInput, setDateInput] = useState("");
  const [unitOverride, setUnitOverride] = useState<TimestampUnit | "auto">("auto");
  const [assumeZone, setAssumeZone] = useState<"local" | "utc">("local");
  const [now, setNow] = useState(() => Date.now());
  const [copied, setCopied] = useState("");

  // The live clock, which is often the reason people open this tool.
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const view = useMemo(() => {
    if (direction === "toDate") {
      const value = Number(timestampInput.trim());
      if (!timestampInput.trim() || !Number.isFinite(value)) return null;
      const unit = unitOverride === "auto" ? detectUnit(value) : unitOverride;
      return viewTimestamp(value, unit);
    }

    const parsed = parseDateInput(dateInput, assumeZone);
    return parsed ? viewTimestamp(parsed.getTime(), "milliseconds") : null;
  }, [direction, timestampInput, dateInput, unitOverride, assumeZone]);

  const invalid =
    direction === "toDate"
      ? timestampInput.trim() !== "" && !view
      : dateInput.trim() !== "" && !view;

  const copy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(value);
      setTimeout(() => setCopied(""), 1800);
    } catch {
      // Clipboard can be blocked; the value stays selectable.
    }
  };

  const detected =
    direction === "toDate" && timestampInput.trim() && Number.isFinite(Number(timestampInput))
      ? detectUnit(Number(timestampInput))
      : null;

  return (
    <ToolShell>
      {/* Current time, always visible */}
      <div className="flex flex-wrap items-baseline justify-between gap-2 rounded-custom-md border border-border-custom bg-surface p-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-text-2">
            Right now
          </p>
          <p className="font-mono text-xl font-bold tabular-nums text-text-custom">
            {Math.floor(now / 1000)}
          </p>
          <p className="text-xs text-text-2">
            {Math.floor(now / 1000)} seconds · {now} milliseconds
          </p>
        </div>
        <button
          type="button"
          onClick={() => copy(String(Math.floor(now / 1000)))}
          className="inline-flex h-9 items-center gap-1.5 rounded-custom-sm border border-border-custom bg-bg px-3 text-xs font-medium text-text-2 transition-colors hover:text-text-custom focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
        >
          {copied === String(Math.floor(now / 1000)) ? (
            <Check size={13} aria-hidden="true" />
          ) : (
            <Copy size={13} aria-hidden="true" />
          )}
          Copy
        </button>
      </div>

      <OptionGroup<Direction>
        legend="Direction"
        value={direction}
        onChange={setDirection}
        options={[
          { id: "toDate", label: "Timestamp to date" },
          { id: "toTimestamp", label: "Date to timestamp" },
        ]}
      />

      {direction === "toDate" ? (
        <div className="space-y-3">
          <div>
            <label
              htmlFor="timestamp-input"
              className="mb-1.5 block text-sm font-medium text-text-2"
            >
              Unix timestamp
            </label>
            <input
              id="timestamp-input"
              type="text"
              inputMode="numeric"
              value={timestampInput}
              onChange={(event) => setTimestampInput(event.target.value)}
              placeholder="1700000000"
              spellCheck={false}
              className="h-12 w-full max-w-xs rounded-custom-sm border border-border-custom bg-bg px-3.5 font-mono text-sm text-text-custom focus:border-primary focus:outline-none focus:ring-[3px] focus:ring-primary/20"
            />
            {detected && unitOverride === "auto" && (
              <p className="mt-1.5 text-xs text-text-2">
                Detected as <strong className="font-semibold">{detected}</strong> from its{" "}
                {timestampInput.trim().replace("-", "").length} digits.
              </p>
            )}
          </div>

          <OptionGroup<TimestampUnit | "auto">
            legend="Unit"
            value={unitOverride}
            onChange={setUnitOverride}
            options={[
              { id: "auto", label: "Detect" },
              { id: "seconds", label: "Seconds", hint: "Ten digits for a current date." },
              {
                id: "milliseconds",
                label: "Milliseconds",
                hint: "Thirteen digits. What JavaScript uses natively.",
              },
            ]}
          />

          <div className="flex flex-wrap gap-1.5">
            {REFERENCE_TIMESTAMPS.map((reference) => (
              <button
                key={reference.label}
                type="button"
                onClick={() => {
                  setTimestampInput(String(reference.seconds));
                  setUnitOverride("seconds");
                }}
                className="h-8 rounded-custom-sm border border-border-custom bg-bg px-3 text-xs font-medium text-text-2 transition-colors hover:text-text-custom focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
              >
                {reference.label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div>
            <label
              htmlFor="date-input"
              className="mb-1.5 block text-sm font-medium text-text-2"
            >
              Date
            </label>
            <input
              id="date-input"
              type="text"
              value={dateInput}
              onChange={(event) => setDateInput(event.target.value)}
              placeholder="2024-03-05 or 2024-03-05T14:30:00Z"
              spellCheck={false}
              className="h-12 w-full max-w-sm rounded-custom-sm border border-border-custom bg-bg px-3.5 font-mono text-sm text-text-custom focus:border-primary focus:outline-none focus:ring-[3px] focus:ring-primary/20"
            />
          </div>

          <OptionGroup<"local" | "utc">
            legend="A date with no time means"
            value={assumeZone}
            onChange={setAssumeZone}
            options={[
              { id: "local", label: "Local midnight" },
              {
                id: "utc",
                label: "UTC midnight",
                hint: "What the JavaScript standard assumes for a bare date, which can shift the day either side of the date line.",
              },
            ]}
          />
        </div>
      )}

      {invalid && (
        <ErrorBanner
          message={
            direction === "toDate"
              ? "That is not a number this tool can read as a timestamp."
              : "That date could not be understood. Try a format like 2024-03-05 or 2024-03-05T14:30:00Z."
          }
        />
      )}

      {view && (
        <dl
          aria-live="polite"
          className="space-y-2 border-t border-border-custom pt-4"
        >
          <Row label="ISO 8601" value={view.iso} onCopy={copy} copied={copied} />
          <Row label="UTC" value={view.utc} onCopy={copy} copied={copied} />
          <Row
            label={`Local (${view.localZone})`}
            value={view.local}
            onCopy={copy}
            copied={copied}
          />
          <Row label="Seconds" value={String(view.seconds)} onCopy={copy} copied={copied} />
          <Row
            label="Milliseconds"
            value={String(view.milliseconds)}
            onCopy={copy}
            copied={copied}
          />
          <Row label="Relative" value={view.relative} onCopy={copy} copied={copied} />
          <Row label="Day" value={view.dayOfWeek} onCopy={copy} copied={copied} />

          {view.seconds === 0 && (
            <p className="rounded-custom-sm border border-amber-200 bg-amber-50 p-3 text-xs leading-relaxed text-amber-800">
              A timestamp of zero is the start of the Unix epoch. Seeing it in a database
              nearly always means the field was never set rather than that something
              happened in 1970.
            </p>
          )}
        </dl>
      )}
    </ToolShell>
  );
}

function Row({
  label,
  value,
  onCopy,
  copied,
}: {
  label: string;
  value: string;
  onCopy: (value: string) => void;
  copied: string;
}) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 rounded-custom-sm bg-surface px-3 py-2">
      <dt className="w-40 shrink-0 text-[11px] font-semibold uppercase tracking-wider text-text-2">
        {label}
      </dt>
      <dd className="min-w-0 flex-grow break-all font-mono text-sm text-text-custom">
        {value}
      </dd>
      <button
        type="button"
        onClick={() => onCopy(value)}
        aria-label={`Copy ${label}`}
        className="shrink-0 rounded p-1.5 text-text-2 transition-colors hover:bg-bg hover:text-text-custom focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        {copied === value ? (
          <Check size={13} className="text-emerald-600" aria-hidden="true" />
        ) : (
          <Copy size={13} aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
