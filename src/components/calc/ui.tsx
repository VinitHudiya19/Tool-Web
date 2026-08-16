"use client";

import { useId, type ReactNode } from "react";

/** Card wrapper matching the other tool categories. */
export function CalcShell({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-5 rounded-custom-lg border border-border-custom bg-bg p-5 shadow-custom-sm sm:p-6">
      {children}
    </div>
  );
}

/**
 * A numeric field with an optional prefix and a slider.
 *
 * Numbers are held as strings so a half-typed value like "1." or an empty box
 * does not get coerced to 0 and snap the input back under the user's cursor.
 */
export function NumberField({
  label,
  value,
  onChange,
  prefix,
  suffix,
  min,
  max,
  step = 1,
  showSlider = false,
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  prefix?: string;
  suffix?: string;
  min?: number;
  max?: number;
  step?: number;
  showSlider?: boolean;
  hint?: string;
}) {
  const id = useId();
  const numeric = Number.parseFloat(value);
  const isValid = Number.isFinite(numeric);

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-text-2">
        {label}
      </label>

      <div className="relative">
        {prefix && (
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-text-2">
            {prefix}
          </span>
        )}
        <input
          id={id}
          type="number"
          inputMode="decimal"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(event) => onChange(event.target.value)}
          className={`h-12 w-full rounded-custom-sm border border-border-custom bg-bg text-sm font-medium text-text-custom transition-colors focus:border-primary focus:outline-none focus:ring-[3px] focus:ring-primary/20 ${
            prefix ? "pl-9" : "pl-3.5"
          } ${suffix ? "pr-10" : "pr-3.5"}`}
        />
        {suffix && (
          <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-text-2">
            {suffix}
          </span>
        )}
      </div>

      {showSlider && min !== undefined && max !== undefined && (
        <input
          type="range"
          aria-label={`${label} slider`}
          min={min}
          max={max}
          step={step}
          value={isValid ? Math.min(Math.max(numeric, min), max) : min}
          onChange={(event) => onChange(event.target.value)}
          className="mt-2 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-surface accent-[var(--cat-accent)]"
        />
      )}

      {hint && <p className="mt-1 text-xs text-text-2">{hint}</p>}
    </div>
  );
}

/** Segmented control for a small set of options. */
export function OptionGroup<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { id: T; label: string; hint?: string }[];
  onChange: (value: T) => void;
}) {
  const active = options.find((option) => option.id === value);

  return (
    <fieldset>
      <legend className="mb-1.5 text-sm font-medium text-text-2">{label}</legend>
      <div className="flex flex-wrap gap-1.5">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            aria-pressed={value === option.id}
            className={`h-9 rounded-custom-sm px-3.5 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${
              value === option.id
                ? "text-white"
                : "border border-border-custom bg-bg text-text-2 hover:text-text-custom"
            }`}
            style={value === option.id ? { background: "var(--cat-accent)" } : undefined}
          >
            {option.label}
          </button>
        ))}
      </div>
      {active?.hint && <p className="mt-1.5 text-xs text-text-2">{active.hint}</p>}
    </fieldset>
  );
}

/** The headline figure. */
export function PrimaryResult({
  label,
  value,
  sublabel,
}: {
  label: string;
  value: string;
  sublabel?: string;
}) {
  return (
    <div
      className="rounded-custom-md border p-5 text-center"
      style={{ background: "var(--cat-surface)", borderColor: "var(--cat-accent)" }}
    >
      <p className="text-[11px] font-semibold uppercase tracking-wider text-text-2">
        {label}
      </p>
      <p
        aria-live="polite"
        className="mt-1 text-3xl font-bold tabular-nums sm:text-4xl"
        style={{ color: "var(--cat-accent)" }}
      >
        {value}
      </p>
      {sublabel && <p className="mt-1 text-xs text-text-2">{sublabel}</p>}
    </div>
  );
}

/** A secondary figure in the results grid. */
export function ResultStat({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "positive" | "negative" | "warning";
}) {
  const colour =
    tone === "positive"
      ? "text-emerald-600"
      : tone === "negative"
        ? "text-red-600"
        : tone === "warning"
          ? "text-amber-600"
          : "text-text-custom";

  return (
    <div className="rounded-custom-md border border-border-custom p-4">
      <dt className="text-[11px] font-semibold uppercase tracking-wider text-text-2">
        {label}
      </dt>
      <dd className={`mt-1 text-xl font-bold tabular-nums ${colour}`}>{value}</dd>
      {hint && <p className="mt-0.5 text-[11px] leading-snug text-text-2">{hint}</p>}
    </div>
  );
}

/**
 * A proportion bar, used to show a split such as principal against interest.
 */
export function SplitBar({
  segments,
}: {
  segments: { label: string; value: number; colour: string }[];
}) {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);
  if (total <= 0) return null;

  return (
    <div>
      <div className="flex h-3 overflow-hidden rounded-full border border-border-custom">
        {segments.map((segment) => (
          <span
            key={segment.label}
            title={`${segment.label}: ${Math.round((segment.value / total) * 100)}%`}
            style={{
              width: `${(segment.value / total) * 100}%`,
              background: segment.colour,
            }}
          />
        ))}
      </div>
      <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
        {segments.map((segment) => (
          <li key={segment.label} className="flex items-center gap-1.5 text-xs text-text-2">
            <span
              className="h-2.5 w-2.5 rounded-sm"
              style={{ background: segment.colour }}
              aria-hidden="true"
            />
            {segment.label} — {Math.round((segment.value / total) * 100)}%
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Currency options, since the audience spans several. */
export const CURRENCIES = [
  { id: "INR", symbol: "₹", locale: "en-IN" },
  { id: "USD", symbol: "$", locale: "en-US" },
  { id: "GBP", symbol: "£", locale: "en-GB" },
  { id: "EUR", symbol: "€", locale: "de-DE" },
] as const;

export type CurrencyId = (typeof CURRENCIES)[number]["id"];

/** Formats a number as currency, using the Indian grouping where relevant. */
export function formatCurrency(value: number, currency: CurrencyId): string {
  const spec = CURRENCIES.find((entry) => entry.id === currency) ?? CURRENCIES[0];

  if (!Number.isFinite(value)) return "—";

  return new Intl.NumberFormat(spec.locale, {
    style: "currency",
    currency: spec.id,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number, decimals = 0): string {
  if (!Number.isFinite(value)) return "—";
  return value.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}
