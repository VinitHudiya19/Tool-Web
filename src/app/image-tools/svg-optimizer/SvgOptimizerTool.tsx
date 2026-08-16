"use client";

import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";

import { ActionButton, ErrorBanner, ToolShell } from "@/components/image/ui";
import SvgInput from "@/components/image/SvgInput";
import { CodeOutput } from "@/components/seo-tools/ui";
import { downloadBlob, formatBytes } from "@/lib/image/files";

interface Optimised {
  markup: string;
  originalBytes: number;
  optimisedBytes: number;
}

/** Toggles, mapped to what each one actually removes. */
const OPTIONS = [
  {
    id: "removeComments",
    label: "Remove comments",
    hint: "Editor comments the browser ignores",
  },
  {
    id: "removeMetadata",
    label: "Remove metadata",
    hint: "Titles, layer names and file paths",
  },
  {
    id: "cleanupNumericValues",
    label: "Round numbers",
    hint: "Trims coordinates to sensible precision",
  },
  {
    id: "removeDimensions",
    label: "Drop width and height",
    hint: "Keeps viewBox so it scales with CSS",
  },
] as const;

type OptionId = (typeof OPTIONS)[number]["id"];

export default function SvgOptimizerTool() {
  const [source, setSource] = useState("");
  const [fileName, setFileName] = useState("optimised.svg");
  const [error, setError] = useState("");
  const [isWorking, setIsWorking] = useState(false);
  const [result, setResult] = useState<Optimised | null>(null);

  const [enabled, setEnabled] = useState<Record<OptionId, boolean>>({
    removeComments: true,
    removeMetadata: true,
    cleanupNumericValues: true,
    // Off by default: dropping dimensions changes how the SVG sizes itself
    // when used without CSS, which surprises people.
    removeDimensions: false,
  });

  const optimise = async () => {
    if (!source.trim()) {
      setError("Add an SVG file or paste some markup first.");
      return;
    }

    setIsWorking(true);
    setError("");

    try {
      // The browser build, so nothing has to be uploaded.
      const { optimize } = await import("svgo/browser");

      const overrides = Object.entries(enabled)
        .filter(([, isOn]) => !isOn)
        .map(([id]) => [id, false] as const);

      const output = optimize(source, {
        multipass: true,
        plugins: [
          {
            name: "preset-default",
            params: {
              // Start from the safe defaults, then switch off what the user
              // unticked — rather than building a plugin list from scratch,
              // which silently loses every other safe optimisation.
              overrides: Object.fromEntries(overrides),
            },
          },
          ...(enabled.removeDimensions ? ["removeDimensions" as const] : []),
        ],
      });

      setResult({
        markup: output.data,
        originalBytes: new Blob([source]).size,
        optimisedBytes: new Blob([output.data]).size,
      });
    } catch (cause) {
      setError(
        cause instanceof Error
          ? `That SVG could not be parsed: ${cause.message}`
          : "That SVG could not be parsed.",
      );
      setResult(null);
    } finally {
      setIsWorking(false);
    }
  };

  const saved = result ? result.originalBytes - result.optimisedBytes : 0;
  const percent =
    result && result.originalBytes > 0
      ? Math.round((saved / result.originalBytes) * 100)
      : 0;

  return (
    <ToolShell>
      <ErrorBanner message={error} onDismiss={() => setError("")} />

      <SvgInput
        value={source}
        onChange={(markup, name) => {
          setSource(markup);
          setResult(null);
          if (name) setFileName(name.replace(/\.svg$/i, "-optimised.svg"));
        }}
        onError={setError}
      />

      <fieldset className="border-t border-border-custom pt-4">
        <legend className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-2">
          What to remove
        </legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {OPTIONS.map((option) => (
            <label
              key={option.id}
              className="flex cursor-pointer items-start gap-2.5 rounded-custom-sm border border-border-custom bg-bg p-3 transition-colors hover:bg-surface has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-primary"
            >
              <input
                type="checkbox"
                checked={enabled[option.id]}
                onChange={(event) =>
                  setEnabled((current) => ({
                    ...current,
                    [option.id]: event.target.checked,
                  }))
                }
                className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--cat-accent)]"
              />
              <span>
                <span className="block text-sm font-medium text-text-custom">
                  {option.label}
                </span>
                <span className="block text-xs text-text-2">{option.hint}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="border-t border-border-custom pt-4">
        <ActionButton
          onClick={optimise}
          disabled={isWorking || !source.trim()}
          icon={
            isWorking ? (
              <Loader2 size={16} className="animate-spin" aria-hidden="true" />
            ) : (
              <Sparkles size={16} aria-hidden="true" />
            )
          }
        >
          {isWorking ? "Optimising…" : "Optimise SVG"}
        </ActionButton>
      </div>

      {result && (
        <div className="space-y-4 border-t border-border-custom pt-6">
          <p aria-live="polite" className="text-sm text-text-2">
            {formatBytes(result.originalBytes)} → {formatBytes(result.optimisedBytes)}{" "}
            <strong
              className={`font-semibold ${saved > 0 ? "text-emerald-600" : "text-amber-600"}`}
            >
              {saved > 0 ? `${percent}% smaller` : "already optimised"}
            </strong>
          </p>

          {/* Side by side, so you can confirm nothing changed visually */}
          <div className="grid gap-4 sm:grid-cols-2">
            <SvgPreview label="Original" markup={source} />
            <SvgPreview label="Optimised" markup={result.markup} />
          </div>

          <CodeOutput
            code={result.markup}
            fileName={fileName}
            label="Optimised SVG"
            language="xml"
          />

          <button
            type="button"
            onClick={() =>
              downloadBlob(
                new Blob([result.markup], { type: "image/svg+xml" }),
                fileName,
              )
            }
            className="inline-flex h-11 items-center justify-center gap-2 rounded-custom-sm border border-border-custom bg-bg px-5 text-sm font-medium text-text-2 transition-colors hover:text-text-custom focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
          >
            Download .svg file
          </button>
        </div>
      )}
    </ToolShell>
  );
}

/**
 * Renders SVG markup in a sandboxed frame.
 *
 * An SVG can carry scripts, so it is never injected into this page's DOM —
 * a sandboxed iframe with no allow-scripts keeps it inert.
 */
function SvgPreview({ label, markup }: { label: string; markup: string }) {
  const document = `<!doctype html><html><body style="margin:0;display:flex;align-items:center;justify-content:center;height:100vh;background:transparent">${markup}</body></html>`;

  return (
    <figure className="rounded-custom-sm border border-border-custom bg-surface p-3">
      <figcaption className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-2">
        {label}
      </figcaption>
      <iframe
        title={`${label} SVG preview`}
        sandbox=""
        srcDoc={document}
        className="h-40 w-full rounded bg-white"
      />
    </figure>
  );
}
