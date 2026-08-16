"use client";

import { useMemo, useState } from "react";

import { CopyButton, OptionGroup, ToolShell } from "@/components/dev/ui";

type Direction = "row" | "row-reverse" | "column" | "column-reverse";
type Justify =
  | "flex-start"
  | "flex-end"
  | "center"
  | "space-between"
  | "space-around"
  | "space-evenly";
type Align = "stretch" | "flex-start" | "flex-end" | "center" | "baseline";
type Wrap = "nowrap" | "wrap" | "wrap-reverse";

export default function FlexboxTool() {
  const [direction, setDirection] = useState<Direction>("row");
  const [justify, setJustify] = useState<Justify>("flex-start");
  const [align, setAlign] = useState<Align>("stretch");
  const [wrap, setWrap] = useState<Wrap>("nowrap");
  const [gap, setGap] = useState(12);
  const [itemCount, setItemCount] = useState(4);

  const isRow = direction.startsWith("row");

  const css = useMemo(
    () =>
      [
        ".container {",
        "  display: flex;",
        `  flex-direction: ${direction};`,
        `  justify-content: ${justify};`,
        `  align-items: ${align};`,
        `  flex-wrap: ${wrap};`,
        `  gap: ${gap}px;`,
        "}",
      ].join("\n"),
    [direction, justify, align, wrap, gap],
  );

  return (
    <ToolShell>
      {/* Which axis is which changes with direction, which is the whole difficulty. */}
      <p className="rounded-custom-sm border border-border-custom bg-surface p-3 text-xs leading-relaxed text-text-2">
        <strong className="font-semibold text-text-custom">
          Main axis is {isRow ? "horizontal" : "vertical"}
        </strong>{" "}
        because the direction is {direction}. So{" "}
        <code className="rounded bg-bg px-1 py-0.5 font-mono">justify-content</code>{" "}
        controls {isRow ? "left-to-right" : "top-to-bottom"} placement, and{" "}
        <code className="rounded bg-bg px-1 py-0.5 font-mono">align-items</code> controls{" "}
        {isRow ? "top-to-bottom" : "left-to-right"}. Switch to a{" "}
        {isRow ? "column" : "row"} and they swap.
      </p>

      <div className="space-y-4">
        <OptionGroup<Direction>
          legend="flex-direction"
          value={direction}
          onChange={setDirection}
          options={[
            { id: "row", label: "row" },
            { id: "row-reverse", label: "row-reverse" },
            { id: "column", label: "column" },
            { id: "column-reverse", label: "column-reverse" },
          ]}
        />

        <OptionGroup<Justify>
          legend={`justify-content — along the ${isRow ? "horizontal" : "vertical"} axis`}
          value={justify}
          onChange={setJustify}
          options={[
            { id: "flex-start", label: "flex-start" },
            { id: "center", label: "center" },
            { id: "flex-end", label: "flex-end" },
            { id: "space-between", label: "space-between" },
            { id: "space-around", label: "space-around" },
            { id: "space-evenly", label: "space-evenly" },
          ]}
        />

        <OptionGroup<Align>
          legend={`align-items — across the ${isRow ? "vertical" : "horizontal"} axis`}
          value={align}
          onChange={setAlign}
          options={[
            { id: "stretch", label: "stretch", hint: "The default — items fill the cross axis." },
            { id: "flex-start", label: "flex-start" },
            { id: "center", label: "center" },
            { id: "flex-end", label: "flex-end" },
            { id: "baseline", label: "baseline" },
          ]}
        />

        <OptionGroup<Wrap>
          legend="flex-wrap"
          value={wrap}
          onChange={setWrap}
          options={[
            { id: "nowrap", label: "nowrap", hint: "The default — items shrink rather than wrapping." },
            { id: "wrap", label: "wrap" },
            { id: "wrap-reverse", label: "wrap-reverse" },
          ]}
        />

        <div className="flex flex-wrap gap-6">
          <div>
            <label htmlFor="flex-gap" className="mb-1.5 block text-sm font-medium text-text-2">
              gap
            </label>
            <input
              id="flex-gap"
              type="range"
              min={0}
              max={48}
              value={gap}
              onChange={(event) => setGap(Number(event.target.value))}
              className="w-40 accent-[var(--cat-accent)]"
            />
            <span className="ml-2 text-xs tabular-nums text-text-2">{gap}px</span>
          </div>

          <div>
            <label htmlFor="flex-items" className="mb-1.5 block text-sm font-medium text-text-2">
              Items
            </label>
            <input
              id="flex-items"
              type="range"
              min={2}
              max={8}
              value={itemCount}
              onChange={(event) => setItemCount(Number(event.target.value))}
              className="w-40 accent-[var(--cat-accent)]"
            />
            <span className="ml-2 text-xs tabular-nums text-text-2">{itemCount}</span>
          </div>
        </div>
      </div>

      {/* Real flexbox rendered by the browser, not a simulation */}
      <div>
        <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-text-2">
          Preview
        </p>
        <div
          className="min-h-[200px] rounded-custom-md border border-dashed border-border-custom bg-surface p-3"
          style={{
            display: "flex",
            flexDirection: direction,
            justifyContent: justify,
            alignItems: align,
            flexWrap: wrap,
            gap: `${gap}px`,
          }}
        >
          {Array.from({ length: itemCount }, (_, index) => (
            <div
              key={index}
              className="flex items-center justify-center rounded-custom-sm px-4 py-3 text-sm font-semibold text-white"
              style={{
                background: "var(--cat-accent)",
                // Varied heights make the align-items effect visible.
                minHeight: index % 3 === 1 ? 64 : 40,
                minWidth: 56,
              }}
            >
              {index + 1}
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-border-custom pt-4">
        <pre className="overflow-x-auto rounded-custom-sm border border-border-custom bg-surface p-4 font-mono text-xs leading-relaxed text-text-custom">
          {css}
        </pre>
        <div className="mt-3">
          <CopyButton text={css} label="Copy CSS" />
        </div>
      </div>
    </ToolShell>
  );
}
