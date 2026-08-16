"use client";

import { useId, useRef, useState, type ReactNode } from "react";
import { Check, Clipboard, Copy, Download, Trash2, Upload } from "lucide-react";

/** Card wrapper matching the other tool categories. */
export function ToolShell({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-5 rounded-custom-lg border border-border-custom bg-bg p-5 shadow-custom-sm sm:p-6">
      {children}
    </div>
  );
}

export function ErrorBanner({
  message,
  onDismiss,
}: {
  message: string;
  onDismiss?: () => void;
}) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className="flex items-start justify-between gap-3 rounded-custom-sm border border-red-200 bg-red-50 p-3 text-sm text-red-700"
    >
      <span className="whitespace-pre-wrap">{message}</span>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className="shrink-0 font-semibold hover:underline"
        >
          Dismiss
        </button>
      )}
    </div>
  );
}

export function InfoNote({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-custom-sm border border-amber-200 bg-amber-50 p-3 text-xs leading-relaxed text-amber-800">
      {children}
    </p>
  );
}

/** Small secondary button used in toolbars. */
export function SmallButton({
  onClick,
  icon,
  children,
  tone = "default",
  disabled,
}: {
  onClick: () => void;
  icon?: ReactNode;
  children: ReactNode;
  tone?: "default" | "danger";
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex h-8 items-center gap-1.5 rounded-custom-sm px-2.5 text-xs font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-40 ${
        tone === "danger"
          ? "bg-red-50 text-red-600"
          : "text-text-2 hover:bg-surface hover:text-text-custom"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}

/** Primary action button in the category accent. */
export function ActionButton({
  onClick,
  children,
  icon,
  disabled,
}: {
  onClick: () => void;
  children: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex h-11 items-center justify-center gap-2 rounded-custom-sm px-5 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
      style={{ background: "var(--cat-accent)" }}
    >
      {icon}
      {children}
    </button>
  );
}

export function CopyButton({
  text,
  label = "Copy",
  disabled,
}: {
  text: string;
  label?: string;
  disabled?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  return (
    <ActionButton
      disabled={disabled || !text}
      icon={copied ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1800);
        } catch {
          // Clipboard can be blocked; the text stays selectable on screen.
        }
      }}
    >
      {copied ? "Copied" : label}
    </ActionButton>
  );
}

/** Downloads text as a file without leaving a leaked object URL behind. */
export function downloadText(text: string, fileName: string, mime = "text/plain") {
  const url = URL.createObjectURL(new Blob([text], { type: `${mime};charset=utf-8` }));

  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.append(link);
  link.click();
  link.remove();

  // Revoked on the next tick, once the download has started.
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

export function DownloadButton({
  text,
  fileName,
  mime,
  label = "Download",
}: {
  text: string;
  fileName: string;
  mime?: string;
  label?: string;
}) {
  return (
    <button
      type="button"
      disabled={!text}
      onClick={() => downloadText(text, fileName, mime)}
      className="inline-flex h-11 items-center justify-center gap-2 rounded-custom-sm border border-border-custom bg-bg px-5 text-sm font-medium text-text-2 transition-colors hover:text-text-custom focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-40"
    >
      <Download size={15} aria-hidden="true" />
      {label}
    </button>
  );
}

/** A labelled code area with paste, load and clear actions. */
export function CodeArea({
  value,
  onChange,
  label,
  placeholder,
  rows = 12,
  readOnly = false,
  accept = ".txt,.json,.csv,.xml,.html,.css,.js,.sql,.md,text/*",
  onError,
  actions,
}: {
  value: string;
  onChange?: (text: string) => void;
  label: string;
  placeholder?: string;
  rows?: number;
  readOnly?: boolean;
  accept?: string;
  onError?: (message: string) => void;
  actions?: ReactNode;
}) {
  const inputId = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  const readFile = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      onError?.("Files are limited to 5 MB.");
      return;
    }
    try {
      onChange?.(await file.text());
      onError?.("");
    } catch {
      onError?.("That file could not be read.");
    }
  };

  return (
    <div className="min-w-0">
      <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
        <label htmlFor={inputId} className="text-sm font-medium text-text-2">
          {label}
        </label>

        <div className="flex items-center gap-1">
          {actions}

          {!readOnly && onChange && (
            <>
              <SmallButton
                icon={<Clipboard size={13} />}
                onClick={async () => {
                  try {
                    onChange(await navigator.clipboard.readText());
                    onError?.("");
                  } catch {
                    onError?.(
                      "Your browser blocked clipboard access. Paste with Ctrl+V instead.",
                    );
                  }
                }}
              >
                Paste
              </SmallButton>

              <SmallButton
                icon={<Upload size={13} />}
                onClick={() => fileRef.current?.click()}
              >
                Load
              </SmallButton>

              <input
                ref={fileRef}
                type="file"
                accept={accept}
                className="sr-only"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) void readFile(file);
                  event.target.value = "";
                }}
              />

              {value.length > 0 && (
                <SmallButton
                  icon={<Trash2 size={13} />}
                  tone={confirmClear ? "danger" : "default"}
                  onClick={() => {
                    // Losing a long paste to a stray click is worth one confirmation.
                    if (value.length > 280 && !confirmClear) {
                      setConfirmClear(true);
                      return;
                    }
                    onChange("");
                    setConfirmClear(false);
                  }}
                >
                  {confirmClear ? "Sure?" : "Clear"}
                </SmallButton>
              )}
            </>
          )}
        </div>
      </div>

      <textarea
        id={inputId}
        value={value}
        readOnly={readOnly}
        onChange={(event) => {
          onChange?.(event.target.value);
          setConfirmClear(false);
        }}
        onDragOver={(event) => {
          if (readOnly) return;
          event.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(event) => {
          if (readOnly) return;
          event.preventDefault();
          setIsDragOver(false);
          const file = event.dataTransfer.files?.[0];
          if (file) void readFile(file);
        }}
        placeholder={placeholder}
        rows={rows}
        spellCheck={false}
        className={`w-full resize-y rounded-custom-sm border px-3.5 py-3 font-mono text-xs leading-relaxed text-text-custom transition-colors focus:outline-none focus:ring-[3px] focus:ring-primary/20 ${
          readOnly ? "bg-surface" : "bg-bg"
        } ${isDragOver ? "border-dashed" : "border-border-custom focus:border-primary"}`}
        style={isDragOver ? { borderColor: "var(--cat-accent)" } : undefined}
      />
    </div>
  );
}

/** Segmented control for a small set of mutually exclusive options. */
export function OptionGroup<T extends string>({
  legend,
  options,
  value,
  onChange,
  hint,
}: {
  legend: string;
  options: { id: T; label: string; hint?: string }[];
  value: T;
  onChange: (id: T) => void;
  hint?: string;
}) {
  const active = options.find((option) => option.id === value);

  return (
    <fieldset>
      <legend className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-2">
        {legend}
      </legend>
      <div className="flex flex-wrap gap-1.5">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            aria-pressed={value === option.id}
            title={option.hint}
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
      {(hint ?? active?.hint) && (
        <p className="mt-2 text-xs text-text-2">{hint ?? active?.hint}</p>
      )}
    </fieldset>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
  hint,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  hint?: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-2.5 rounded-custom-sm border border-border-custom bg-bg p-3 transition-colors hover:bg-surface">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--cat-accent)]"
      />
      <span>
        <span className="block text-sm font-medium text-text-custom">{label}</span>
        {hint && <span className="block text-xs text-text-2">{hint}</span>}
      </span>
    </label>
  );
}

/** A single figure, used for byte counts and savings. */
export function StatCard({
  label,
  value,
  hint,
  emphasis,
}: {
  label: string;
  value: string | number;
  hint?: string;
  emphasis?: boolean;
}) {
  return (
    <div
      className="rounded-custom-md border border-border-custom p-4"
      style={emphasis ? { background: "var(--cat-surface)" } : undefined}
    >
      <dt className="text-[11px] font-semibold uppercase tracking-wider text-text-2">
        {label}
      </dt>
      <dd
        className="mt-1 text-xl font-bold tabular-nums"
        style={{ color: emphasis ? "var(--cat-accent)" : undefined }}
      >
        {typeof value === "number" ? value.toLocaleString() : value}
      </dd>
      {hint && <p className="mt-0.5 text-[11px] leading-snug text-text-2">{hint}</p>}
    </div>
  );
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
