"use client";

import { useEffect, useRef, useState } from "react";
import { Download } from "lucide-react";

import {
  ActionButton,
  ErrorBanner,
  InfoNote,
  OptionGroup,
  ToolShell,
  Toggle,
  downloadText,
} from "@/components/dev/ui";

interface Symbology {
  id: string;
  label: string;
  hint: string;
  /** Describes what the format will accept. */
  requirement: string;
  validate: (value: string) => string;
}

/** Computes the EAN/UPC check digit from the preceding digits. */
function checkDigit(digits: string): number {
  // Weights alternate 3 and 1 from the right.
  let sum = 0;
  const reversed = [...digits].reverse();
  reversed.forEach((digit, index) => {
    sum += Number(digit) * (index % 2 === 0 ? 3 : 1);
  });
  return (10 - (sum % 10)) % 10;
}

const SYMBOLOGIES: Symbology[] = [
  {
    id: "EAN13",
    label: "EAN-13",
    hint: "Retail products outside North America.",
    requirement: "12 digits (the 13th is calculated) or 13 to verify",
    validate: (value) => {
      if (!/^\d{12,13}$/.test(value)) return "EAN-13 needs 12 or 13 digits.";
      if (value.length === 13) {
        const expected = checkDigit(value.slice(0, 12));
        if (Number(value[12]) !== expected) {
          return `The check digit should be ${expected}, not ${value[12]}.`;
        }
      }
      return "";
    },
  },
  {
    id: "EAN8",
    label: "EAN-8",
    hint: "Small retail packaging.",
    requirement: "7 digits (the 8th is calculated) or 8 to verify",
    validate: (value) =>
      /^\d{7,8}$/.test(value) ? "" : "EAN-8 needs 7 or 8 digits.",
  },
  {
    id: "UPC",
    label: "UPC-A",
    hint: "Retail products in North America.",
    requirement: "11 digits (the 12th is calculated) or 12 to verify",
    validate: (value) =>
      /^\d{11,12}$/.test(value) ? "" : "UPC-A needs 11 or 12 digits.",
  },
  {
    id: "CODE128",
    label: "Code 128",
    hint: "Logistics and internal codes. Any length, letters allowed.",
    requirement: "Any printable ASCII, any length",
    validate: (value) =>
      value.length > 0 ? "" : "Enter something to encode.",
  },
  {
    id: "CODE39",
    label: "Code 39",
    hint: "Older industrial systems.",
    requirement: "Digits, uppercase letters and - . $ / + % space",
    validate: (value) =>
      /^[0-9A-Z\-. $/+%]*$/.test(value)
        ? ""
        : "Code 39 allows only digits, uppercase letters and - . $ / + % and space.",
  },
  {
    id: "ITF14",
    label: "ITF-14",
    hint: "Shipping cartons and outer cases.",
    requirement: "13 digits (the 14th is calculated) or 14 to verify",
    validate: (value) =>
      /^\d{13,14}$/.test(value) ? "" : "ITF-14 needs 13 or 14 digits.",
  },
];

export default function BarcodeTool() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [symbology, setSymbology] = useState("EAN13");
  const [value, setValue] = useState("590123412345");
  const [showText, setShowText] = useState(true);
  const [height, setHeight] = useState(80);
  const [error, setError] = useState("");
  const [rendered, setRendered] = useState(false);

  const spec = SYMBOLOGIES.find((entry) => entry.id === symbology) ?? SYMBOLOGIES[0];
  const validationError = value ? spec.validate(value) : "";

  // The computed check digit, shown before rendering so it is not a surprise.
  const computed =
    !validationError && /^\d+$/.test(value)
      ? symbology === "EAN13" && value.length === 12
        ? checkDigit(value)
        : symbology === "UPC" && value.length === 11
          ? checkDigit(value)
          : null
      : null;

  useEffect(() => {
    let cancelled = false;

    const render = async () => {
      if (!value || validationError || !svgRef.current) {
        setRendered(false);
        return;
      }

      try {
        const JsBarcode = (await import("jsbarcode")).default;
        if (cancelled || !svgRef.current) return;

        JsBarcode(svgRef.current, value, {
          format: symbology,
          displayValue: showText,
          height,
          margin: 10,
          fontSize: 16,
        });

        setRendered(true);
        setError("");
      } catch (cause) {
        setRendered(false);
        setError(
          cause instanceof Error
            ? `That could not be encoded: ${cause.message}`
            : "That value could not be encoded in this format.",
        );
      }
    };

    void render();
    return () => {
      cancelled = true;
    };
  }, [value, symbology, showText, height, validationError]);

  const downloadSvg = () => {
    if (!svgRef.current) return;
    downloadText(
      new XMLSerializer().serializeToString(svgRef.current),
      "barcode.svg",
      "image/svg+xml",
    );
  };

  const downloadPng = () => {
    const svg = svgRef.current;
    if (!svg) return;

    const serialised = new XMLSerializer().serializeToString(svg);
    const svgUrl = URL.createObjectURL(
      new Blob([serialised], { type: "image/svg+xml;charset=utf-8" }),
    );

    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      // Rendered at twice the size, since a soft barcode does not scan.
      canvas.width = image.width * 2;
      canvas.height = image.height * 2;

      const context = canvas.getContext("2d");
      if (context) {
        context.fillStyle = "#FFFFFF";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
          if (!blob) return;
          const pngUrl = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = pngUrl;
          link.download = "barcode.png";
          document.body.append(link);
          link.click();
          link.remove();
          URL.revokeObjectURL(pngUrl);
        }, "image/png");
      }

      URL.revokeObjectURL(svgUrl);
    };
    image.onerror = () => URL.revokeObjectURL(svgUrl);
    image.src = svgUrl;
  };

  return (
    <ToolShell>
      <ErrorBanner message={error} onDismiss={() => setError("")} />

      <OptionGroup
        legend="Format"
        value={symbology}
        onChange={setSymbology}
        options={SYMBOLOGIES.map((entry) => ({
          id: entry.id,
          label: entry.label,
          hint: entry.hint,
        }))}
      />

      <div>
        <label htmlFor="barcode-value" className="mb-1.5 block text-sm font-medium text-text-2">
          Data to encode
        </label>
        <input
          id="barcode-value"
          type="text"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          spellCheck={false}
          className="h-12 w-full max-w-md rounded-custom-sm border border-border-custom bg-bg px-3.5 font-mono text-sm text-text-custom focus:border-primary focus:outline-none focus:ring-[3px] focus:ring-primary/20"
        />
        <p className="mt-1.5 text-xs text-text-2">Accepts: {spec.requirement}</p>

        {validationError && (
          <p className="mt-2 rounded-custom-sm border border-red-200 bg-red-50 p-2.5 text-xs text-red-700">
            {validationError}
          </p>
        )}

        {computed !== null && (
          <p className="mt-2 rounded-custom-sm border border-emerald-200 bg-emerald-50 p-2.5 text-xs text-emerald-800">
            Check digit <strong className="font-semibold">{computed}</strong> will be
            appended, making <span className="font-mono">{value}{computed}</span>.
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-end gap-4">
        <div>
          <label htmlFor="barcode-height" className="mb-1.5 block text-sm font-medium text-text-2">
            Height
          </label>
          <input
            id="barcode-height"
            type="range"
            min={40}
            max={160}
            value={height}
            onChange={(event) => setHeight(Number(event.target.value))}
            className="w-48 accent-[var(--cat-accent)]"
          />
          <span className="ml-2 text-xs tabular-nums text-text-2">{height}px</span>
        </div>

        <Toggle
          checked={showText}
          onChange={setShowText}
          label="Show the digits"
          hint="Required by GS1 for retail codes, and lets someone key it in if the scan fails."
        />
      </div>

      <div className="flex justify-center overflow-x-auto rounded-custom-md border border-border-custom bg-white p-6">
        <svg ref={svgRef} aria-label={`${spec.label} barcode for ${value}`} />
      </div>

      {rendered && (
        <>
          <div className="flex flex-col gap-3 border-t border-border-custom pt-4 sm:flex-row">
            <ActionButton onClick={downloadSvg} icon={<Download size={15} aria-hidden="true" />}>
              Download SVG
            </ActionButton>
            <button
              type="button"
              onClick={downloadPng}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-custom-sm border border-border-custom bg-bg px-5 text-sm font-medium text-text-2 transition-colors hover:text-text-custom focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
            >
              <Download size={15} aria-hidden="true" />
              Download PNG
            </button>
          </div>

          <InfoNote>
            Keep the clear margin either side — the quiet zone — when placing this in a
            layout, and print SVG rather than PNG where you can. Losing the quiet zone is
            the most common reason a printed barcode will not scan.
          </InfoNote>
        </>
      )}
    </ToolShell>
  );
}
