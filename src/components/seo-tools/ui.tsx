"use client";

import { useState, type ReactNode } from "react";
import { AlertCircle, Check, Copy, Download } from "lucide-react";

/** The bordered card every SEO tool's interface sits inside. */
export function ToolShell({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-6 rounded-custom-md border border-border-custom bg-bg p-4 shadow-custom-sm sm:p-6">
      {children}
    </div>
  );
}

export function Field({
  id,
  label,
  hint,
  error,
  required,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-text-2">
        {label}
        {required && (
          <span className="ml-1 text-red-600" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {children}
      {error ? (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-600"
        >
          <AlertCircle size={13} aria-hidden="true" />
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-text-2">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

/** Shared input styling, including the invalid state. */
export function textInputClass(hasError = false): string {
  return `h-12 w-full rounded-custom-sm border bg-bg px-3.5 text-sm text-text-custom transition-colors focus:outline-none focus:ring-[3px] ${
    hasError
      ? "border-red-500 focus:ring-red-500/20"
      : "border-border-custom focus:border-primary focus:ring-primary/20"
  }`;
}

export function TextInput({
  id,
  value,
  onChange,
  placeholder,
  hasError,
  type = "text",
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hasError?: boolean;
  type?: string;
}) {
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      aria-invalid={hasError || undefined}
      aria-describedby={hasError ? `${id}-error` : `${id}-hint`}
      className={textInputClass(hasError)}
    />
  );
}

export function TextArea({
  id,
  value,
  onChange,
  placeholder,
  rows = 3,
  hasError,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  hasError?: boolean;
}) {
  return (
    <textarea
      id={id}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      rows={rows}
      aria-invalid={hasError || undefined}
      aria-describedby={hasError ? `${id}-error` : `${id}-hint`}
      className={`w-full resize-y rounded-custom-sm border bg-bg px-3.5 py-3 text-sm leading-relaxed text-text-custom transition-colors focus:outline-none focus:ring-[3px] ${
        hasError
          ? "border-red-500 focus:ring-red-500/20"
          : "border-border-custom focus:border-primary focus:ring-primary/20"
      }`}
    />
  );
}

export function Select({
  id,
  value,
  onChange,
  options,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      id={id}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="h-12 w-full rounded-custom-sm border border-border-custom bg-bg px-3 text-sm text-text-custom transition-colors focus:border-primary focus:outline-none focus:ring-[3px] focus:ring-primary/20"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export function PrimaryButton({
  children,
  onClick,
  disabled,
  icon,
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  icon?: ReactNode;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-custom-sm px-6 text-sm font-semibold text-white shadow-custom-sm transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-border-custom disabled:text-text-2 disabled:shadow-none sm:w-auto sm:min-w-[200px]"
      style={{ background: disabled ? undefined : "var(--cat-accent)" }}
    >
      {icon}
      {children}
    </button>
  );
}

/**
 * Generated code with copy and download.
 *
 * Output is shown in a <pre> so whitespace is preserved exactly as it will be
 * pasted, and marked aria-live so the result is announced when it changes.
 */
export function CodeOutput({
  code,
  fileName,
  label = "Generated code",
  language = "json",
}: {
  code: string;
  fileName: string;
  label?: string;
  language?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can be blocked; the code is selectable on screen.
    }
  };

  const download = () => {
    const blob = new Blob([code], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    setTimeout(() => URL.revokeObjectURL(url), 0);
  };

  return (
    <div className="rounded-custom-md border border-border-custom bg-surface">
      <div className="flex items-center justify-between gap-3 border-b border-border-custom px-4 py-2.5">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-text-2">
          {label}
        </h3>
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={copy}
            className="inline-flex h-8 items-center gap-1.5 rounded-custom-sm border border-border-custom bg-bg px-2.5 text-xs font-medium text-text-2 transition-colors hover:text-text-custom focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
          >
            {copied ? <Check size={13} aria-hidden="true" /> : <Copy size={13} aria-hidden="true" />}
            {copied ? "Copied" : "Copy"}
          </button>
          <button
            type="button"
            onClick={download}
            aria-label={`Download ${fileName}`}
            className="inline-flex h-8 items-center gap-1.5 rounded-custom-sm border border-border-custom bg-bg px-2.5 text-xs font-medium text-text-2 transition-colors hover:text-text-custom focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
          >
            <Download size={13} aria-hidden="true" />
            <span className="hidden sm:inline">Download</span>
          </button>
        </div>
      </div>

      <pre
        aria-live="polite"
        aria-label={label}
        className="max-h-[420px] overflow-auto p-4 text-xs leading-relaxed text-text-custom"
      >
        <code data-language={language}>{code}</code>
      </pre>
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-custom-md border border-dashed border-border-custom bg-surface px-6 py-12 text-center">
      <p className="text-sm text-text-2">{message}</p>
    </div>
  );
}
