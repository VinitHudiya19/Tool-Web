"use client";

import { useId, useState } from "react";
import { FileCode2, Upload } from "lucide-react";

/**
 * SVG source input, by file or by pasting markup.
 *
 * Design tools export files, but people usually have the markup on the
 * clipboard, so both paths are offered rather than forcing a save first.
 */
export default function SvgInput({
  value,
  onChange,
  onError,
}: {
  value: string;
  onChange: (markup: string, fileName?: string) => void;
  onError: (message: string) => void;
}) {
  const inputId = useId();
  const areaId = useId();
  const [isDragOver, setIsDragOver] = useState(false);

  const readFile = async (file: File) => {
    if (!file.type.includes("svg") && !file.name.toLowerCase().endsWith(".svg")) {
      onError(`"${file.name}" is not an SVG file.`);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      onError("SVG files are limited to 5 MB.");
      return;
    }

    try {
      const markup = await file.text();
      if (!markup.includes("<svg")) {
        onError(`"${file.name}" does not contain an <svg> element.`);
        return;
      }
      onError("");
      onChange(markup, file.name);
    } catch {
      onError("That file could not be read.");
    }
  };

  return (
    <div className="space-y-3">
      <div
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
      >
        <input
          id={inputId}
          type="file"
          accept=".svg,image/svg+xml"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void readFile(file);
            event.target.value = "";
          }}
          className="sr-only"
        />
        <label
          htmlFor={inputId}
          className={`flex cursor-pointer items-center justify-center gap-2 rounded-custom-sm border border-dashed px-4 py-4 text-sm font-medium transition-colors ${
            isDragOver
              ? "bg-[var(--cat-surface)] text-[var(--cat-accent)]"
              : "border-border-custom bg-surface text-text-2 hover:text-text-custom"
          }`}
          style={isDragOver ? { borderColor: "var(--cat-accent)" } : undefined}
        >
          <Upload size={16} aria-hidden="true" />
          Drop an SVG file here, or click to browse
        </label>
      </div>

      <div>
        <label
          htmlFor={areaId}
          className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-text-2"
        >
          <FileCode2 size={14} aria-hidden="true" />
          Or paste your SVG markup
        </label>
        <textarea
          id={areaId}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">…</svg>'}
          rows={6}
          spellCheck={false}
          className="w-full resize-y rounded-custom-sm border border-border-custom bg-bg px-3.5 py-3 font-mono text-xs leading-relaxed text-text-custom transition-colors focus:border-primary focus:outline-none focus:ring-[3px] focus:ring-primary/20"
        />
      </div>
    </div>
  );
}
