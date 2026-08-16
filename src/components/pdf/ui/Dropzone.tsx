"use client";

import { useId, useRef, useState } from "react";
import { FilePlus2, Plus } from "lucide-react";

interface DropzoneProps {
  onFiles: (files: FileList) => void;
  /** File input accept attribute, e.g. ".pdf" or "image/jpeg,image/png". */
  accept: string;
  multiple?: boolean;
  title: string;
  hint: string;
  /** Renders the slim "add more" bar instead of the full panel. */
  compact?: boolean;
  disabled?: boolean;
}

/**
 * The one upload control used by every PDF tool.
 *
 * It is a real <label> wrapping a file input rather than a click-handled div,
 * so it is reachable by keyboard and announced properly, and drag-and-drop is
 * layered on top for mouse users.
 */
export default function Dropzone({
  onFiles,
  accept,
  multiple = false,
  title,
  hint,
  compact = false,
  disabled = false,
}: DropzoneProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
    if (disabled) return;
    if (event.dataTransfer.files?.length) onFiles(event.dataTransfer.files);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) onFiles(event.target.files);
    // Reset so picking the same file twice still fires a change event.
    event.target.value = "";
  };

  const dropHandlers = {
    onDragOver: (event: React.DragEvent) => {
      event.preventDefault();
      if (!disabled) setIsDragOver(true);
    },
    onDragLeave: () => setIsDragOver(false),
    onDrop: handleDrop,
  };

  const input = (
    <input
      id={inputId}
      ref={inputRef}
      type="file"
      accept={accept}
      multiple={multiple}
      onChange={handleChange}
      disabled={disabled}
      className="sr-only"
    />
  );

  if (compact) {
    return (
      <div {...dropHandlers}>
        {input}
        <label
          htmlFor={inputId}
          className={`flex cursor-pointer items-center justify-center gap-2 rounded-custom-sm border border-dashed px-4 py-3 text-sm font-medium transition-colors ${
            isDragOver
              ? "border-pdf-accent bg-pdf-surface text-pdf-accent"
              : "border-border-custom bg-surface text-text-2 hover:border-pdf-accent-soft hover:text-text-custom"
          } ${disabled ? "pointer-events-none opacity-50" : ""}`}
        >
          <Plus size={15} aria-hidden="true" />
          {title}
        </label>
      </div>
    );
  }

  return (
    <div {...dropHandlers}>
      {input}
      <label
        htmlFor={inputId}
        className={`flex cursor-pointer flex-col items-center gap-3 rounded-custom-md border-2 border-dashed px-6 py-12 text-center transition-colors ${
          isDragOver
            ? "border-pdf-accent bg-pdf-surface"
            : "border-border-custom bg-surface hover:border-pdf-accent-soft"
        } ${disabled ? "pointer-events-none opacity-50" : ""}`}
      >
        <FilePlus2 size={40} className="text-pdf-accent" aria-hidden="true" />
        <span className="text-base font-semibold text-text-custom">{title}</span>
        <span className="text-sm text-text-2">or click to browse your device</span>
        <span className="text-[11px] font-medium uppercase tracking-wider text-text-2 opacity-70">
          {hint}
        </span>
      </label>
    </div>
  );
}
