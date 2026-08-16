"use client";

import { useId, useRef, useState, type ReactNode } from "react";
import { AlertCircle, ImagePlus, Loader2, Plus, X } from "lucide-react";

import { formatBytes } from "@/lib/image/files";

/** The bordered card every image tool's interface sits inside. */
export function ToolShell({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-6 rounded-custom-md border border-border-custom bg-bg p-4 shadow-custom-sm sm:p-6">
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
      className="flex items-start gap-3 rounded-custom-sm border border-red-200 bg-red-50 p-4"
    >
      <AlertCircle size={18} className="mt-px shrink-0 text-red-600" aria-hidden="true" />
      <p className="flex-grow text-sm font-medium leading-relaxed text-red-700">
        {message}
      </p>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss error"
          className="shrink-0 rounded p-0.5 text-red-500 transition-colors hover:text-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}

/**
 * The upload control shared by every image tool.
 *
 * A real label wrapping a file input, so it works by keyboard and is announced
 * properly; drag-and-drop is layered on top for mouse users.
 */
export function ImageDropzone({
  onFiles,
  multiple = true,
  accept = "image/jpeg,image/png,image/webp,image/gif,image/bmp,image/avif",
  title,
  hint,
  compact = false,
  disabled = false,
}: {
  onFiles: (files: FileList) => void;
  multiple?: boolean;
  accept?: string;
  title: string;
  hint: string;
  compact?: boolean;
  disabled?: boolean;
}) {
  const inputId = useId();
  const [isDragOver, setIsDragOver] = useState(false);

  const handlers = {
    onDragOver: (event: React.DragEvent) => {
      event.preventDefault();
      if (!disabled) setIsDragOver(true);
    },
    onDragLeave: () => setIsDragOver(false),
    onDrop: (event: React.DragEvent) => {
      event.preventDefault();
      setIsDragOver(false);
      if (!disabled && event.dataTransfer.files?.length) onFiles(event.dataTransfer.files);
    },
  };

  const input = (
    <input
      id={inputId}
      type="file"
      accept={accept}
      multiple={multiple}
      disabled={disabled}
      onChange={(event) => {
        if (event.target.files?.length) onFiles(event.target.files);
        // Reset so choosing the same file twice still fires a change.
        event.target.value = "";
      }}
      className="sr-only"
    />
  );

  if (compact) {
    return (
      <div {...handlers}>
        {input}
        <label
          htmlFor={inputId}
          className={`flex cursor-pointer items-center justify-center gap-2 rounded-custom-sm border border-dashed px-4 py-3 text-sm font-medium transition-colors ${
            isDragOver
              ? "bg-[var(--cat-surface)] text-[var(--cat-accent)]"
              : "border-border-custom bg-surface text-text-2 hover:text-text-custom"
          } ${disabled ? "pointer-events-none opacity-50" : ""}`}
          style={isDragOver ? { borderColor: "var(--cat-accent)" } : undefined}
        >
          <Plus size={15} aria-hidden="true" />
          {title}
        </label>
      </div>
    );
  }

  return (
    <div {...handlers}>
      {input}
      <label
        htmlFor={inputId}
        className={`flex cursor-pointer flex-col items-center gap-3 rounded-custom-md border-2 border-dashed px-6 py-12 text-center transition-colors ${
          isDragOver ? "bg-[var(--cat-surface)]" : "border-border-custom bg-surface"
        } ${disabled ? "pointer-events-none opacity-50" : ""}`}
        style={isDragOver ? { borderColor: "var(--cat-accent)" } : undefined}
      >
        <ImagePlus size={40} style={{ color: "var(--cat-accent)" }} aria-hidden="true" />
        <span className="text-base font-semibold text-text-custom">{title}</span>
        <span className="text-sm text-text-2">or click to browse your device</span>
        <span className="text-[11px] font-medium uppercase tracking-wider text-text-2 opacity-70">
          {hint}
        </span>
      </label>
    </div>
  );
}

/** The primary action button for every image tool. */
export function ActionButton({
  children,
  onClick,
  disabled = false,
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

/** A labelled slider, used for quality and opacity across the tools. */
export function Slider({
  id,
  label,
  value,
  min,
  max,
  step = 1,
  suffix = "",
  hint,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
  hint?: string;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <label htmlFor={id} className="text-sm font-medium text-text-2">
          {label}
        </label>
        <span className="text-sm font-semibold tabular-nums text-text-custom">
          {value}
          {suffix}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-border-custom accent-[var(--cat-accent)]"
      />
      {hint && <p className="mt-1.5 text-xs text-text-2">{hint}</p>}
    </div>
  );
}

/** A busy state for long-running batch work. */
export function ProgressPanel({
  title,
  status,
  progress,
}: {
  title: string;
  status: string;
  progress?: number;
}) {
  const value =
    typeof progress === "number" ? Math.max(0, Math.min(100, Math.round(progress))) : undefined;

  return (
    <div className="flex flex-col items-center gap-4 rounded-custom-md border border-border-custom bg-surface px-6 py-10 text-center">
      <Loader2 size={32} className="animate-spin" style={{ color: "var(--cat-accent)" }} aria-hidden="true" />
      <div>
        <h3 className="text-base font-semibold text-text-custom">{title}</h3>
        <p aria-live="polite" className="mt-1 text-sm text-text-2">
          {status}
        </p>
      </div>
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
        aria-label={title}
        className="h-2 w-full max-w-md overflow-hidden rounded-full bg-border-custom"
      >
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            value === undefined ? "w-1/3 animate-pulse" : ""
          }`}
          style={{
            background: "var(--cat-accent)",
            ...(value === undefined ? {} : { width: `${value}%` }),
          }}
        />
      </div>
    </div>
  );
}

/** Shows an original and processed size with the saving between them. */
export function SizeComparison({
  originalBytes,
  newBytes,
}: {
  originalBytes: number;
  newBytes: number;
}) {
  const saved = originalBytes - newBytes;
  const percent = originalBytes > 0 ? Math.round((saved / originalBytes) * 100) : 0;
  const grew = saved < 0;

  return (
    <span className="text-xs tabular-nums text-text-2">
      {formatBytes(originalBytes)} → {formatBytes(newBytes)}{" "}
      <strong
        className={`font-semibold ${grew ? "text-amber-600" : "text-emerald-600"}`}
      >
        {grew ? `+${Math.abs(percent)}%` : `−${percent}%`}
      </strong>
    </span>
  );
}

/** A thumbnail with its filename and metadata, used in every file list. */
export function ImageCard({
  previewUrl,
  name,
  meta,
  onRemove,
  actions,
}: {
  previewUrl: string;
  name: string;
  meta: ReactNode;
  onRemove?: () => void;
  actions?: ReactNode;
}) {
  return (
    <li className="flex items-center gap-3 rounded-custom-sm border border-border-custom bg-bg p-3">
      <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-custom-sm bg-surface">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={previewUrl} alt="" className="h-full w-full object-contain" />
      </span>

      <div className="min-w-0 flex-grow">
        <p className="truncate text-sm font-medium text-text-custom" title={name}>
          {name}
        </p>
        <div className="mt-0.5">{meta}</div>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        {actions}
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remove ${name}`}
            className="rounded p-2 text-text-2 transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
          >
            <X size={15} />
          </button>
        )}
      </div>
    </li>
  );
}

/** Tracks object URLs so none leak when the component unmounts. */
export function useObjectUrls() {
  const urls = useRef<Set<string>>(new Set());

  const create = (blob: Blob): string => {
    const url = URL.createObjectURL(blob);
    urls.current.add(url);
    return url;
  };

  const release = (url: string) => {
    URL.revokeObjectURL(url);
    urls.current.delete(url);
  };

  const releaseAll = () => {
    urls.current.forEach((url) => URL.revokeObjectURL(url));
    urls.current.clear();
  };

  return { create, release, releaseAll };
}
