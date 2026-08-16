"use client";

import { useCallback, useId, useRef, useState, type ReactNode } from "react";
import { Check, Clipboard, Copy, Trash2, Upload } from "lucide-react";

/** Card wrapper matching the other tool categories. */
export function ToolShell({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-5 rounded-custom-lg border border-border-custom bg-bg p-5 shadow-custom-sm sm:p-6">
      {children}
    </div>
  );
}

/**
 * The text input, with the actions people reach for.
 *
 * Paste and file loading are offered because the common case is text that
 * exists somewhere else already.
 */
export function TextInput({
  value,
  onChange,
  label,
  placeholder,
  rows = 10,
  onError,
}: {
  value: string;
  onChange: (text: string) => void;
  label: string;
  placeholder?: string;
  rows?: number;
  onError?: (message: string) => void;
}) {
  const inputId = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  const readFile = useCallback(
    async (file: File) => {
      const isText =
        file.type.startsWith("text/") ||
        /\.(txt|md|csv|json|log)$/i.test(file.name);

      if (!isText) {
        onError?.(`"${file.name}" is not a plain text file.`);
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        onError?.("Text files are limited to 5 MB.");
        return;
      }

      try {
        onChange(await file.text());
        onError?.("");
      } catch {
        onError?.("That file could not be read.");
      }
    },
    [onChange, onError],
  );

  const paste = async () => {
    try {
      onChange(await navigator.clipboard.readText());
      onError?.("");
    } catch {
      onError?.("Your browser blocked clipboard access. Paste with Ctrl+V instead.");
    }
  };

  return (
    <div>
      <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
        <label htmlFor={inputId} className="text-sm font-medium text-text-2">
          {label}
        </label>

        <div className="flex items-center gap-1">
          <SmallButton onClick={paste} icon={<Clipboard size={13} />}>
            Paste
          </SmallButton>

          <SmallButton
            onClick={() => fileRef.current?.click()}
            icon={<Upload size={13} />}
          >
            Load file
          </SmallButton>

          <input
            ref={fileRef}
            type="file"
            accept=".txt,.md,.csv,.json,.log,text/*"
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void readFile(file);
              event.target.value = "";
            }}
          />

          {value.length > 0 && (
            <SmallButton
              onClick={() => {
                // Losing a long paste to a stray click is worth one confirmation.
                if (value.length > 280 && !confirmClear) {
                  setConfirmClear(true);
                  return;
                }
                onChange("");
                setConfirmClear(false);
              }}
              icon={<Trash2 size={13} />}
              tone={confirmClear ? "danger" : "default"}
            >
              {confirmClear ? "Sure?" : "Clear"}
            </SmallButton>
          )}
        </div>
      </div>

      <textarea
        id={inputId}
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
          setConfirmClear(false);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragOver(false);
          const file = event.dataTransfer.files?.[0];
          if (file) void readFile(file);
        }}
        placeholder={placeholder}
        rows={rows}
        spellCheck={false}
        className={`w-full resize-y rounded-custom-sm border bg-bg px-3.5 py-3 text-sm leading-relaxed text-text-custom transition-colors focus:outline-none focus:ring-[3px] focus:ring-primary/20 ${
          isDragOver ? "border-dashed" : "border-border-custom focus:border-primary"
        }`}
        style={isDragOver ? { borderColor: "var(--cat-accent)" } : undefined}
      />
    </div>
  );
}

function SmallButton({
  onClick,
  icon,
  children,
  tone = "default",
}: {
  onClick: () => void;
  icon: ReactNode;
  children: ReactNode;
  tone?: "default" | "danger";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-8 items-center gap-1.5 rounded-custom-sm px-2.5 text-xs font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${
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

/** Copy-to-clipboard button with its own confirmation state. */
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
    <button
      type="button"
      disabled={disabled || !text}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1800);
        } catch {
          // Clipboard can be blocked; the text remains selectable on screen.
        }
      }}
      className="inline-flex h-11 items-center justify-center gap-2 rounded-custom-sm px-5 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
      style={{ background: "var(--cat-accent)" }}
    >
      {copied ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}
      {copied ? "Copied" : label}
    </button>
  );
}

/** A single figure in the statistics grid. */
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
        className="mt-1 text-2xl font-bold tabular-nums"
        style={{ color: emphasis ? "var(--cat-accent)" : undefined }}
      >
        {typeof value === "number" ? value.toLocaleString() : value}
      </dd>
      {hint && <p className="mt-0.5 text-[11px] leading-snug text-text-2">{hint}</p>}
    </div>
  );
}

export function ErrorBanner({
  message,
  onDismiss,
}: {
  message: string;
  onDismiss: () => void;
}) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className="flex items-start justify-between gap-3 rounded-custom-sm border border-red-200 bg-red-50 p-3 text-sm text-red-700"
    >
      <span>{message}</span>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss"
        className="shrink-0 font-semibold hover:underline"
      >
        Dismiss
      </button>
    </div>
  );
}
