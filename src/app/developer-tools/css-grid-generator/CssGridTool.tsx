"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";

import { CopyButton, SmallButton, ToolShell, Toggle } from "@/components/dev/ui";

interface Track {
  id: string;
  size: string;
}

interface Item {
  id: string;
  columnStart: number;
  columnSpan: number;
  rowStart: number;
  rowSpan: number;
}

const SIZE_PRESETS = ["1fr", "2fr", "auto", "min-content", "max-content", "200px", "minmax(200px, 1fr)"];

let nextId = 0;
const makeId = () => `t${(nextId += 1)}`;

export default function CssGridTool() {
  const [columns, setColumns] = useState<Track[]>([
    { id: makeId(), size: "1fr" },
    { id: makeId(), size: "1fr" },
    { id: makeId(), size: "1fr" },
  ]);
  const [rows, setRows] = useState<Track[]>([
    { id: makeId(), size: "auto" },
    { id: makeId(), size: "auto" },
  ]);
  const [columnGap, setColumnGap] = useState(16);
  const [rowGap, setRowGap] = useState(16);
  const [useAutoFit, setUseAutoFit] = useState(false);
  const [items, setItems] = useState<Item[]>([
    { id: makeId(), columnStart: 1, columnSpan: 2, rowStart: 1, rowSpan: 1 },
    { id: makeId(), columnStart: 3, columnSpan: 1, rowStart: 1, rowSpan: 2 },
  ]);

  const templateColumns = useAutoFit
    ? "repeat(auto-fit, minmax(200px, 1fr))"
    : columns.map((track) => track.size).join(" ");
  const templateRows = rows.map((track) => track.size).join(" ");

  const css = useMemo(() => {
    const lines = [
      ".grid {",
      "  display: grid;",
      `  grid-template-columns: ${templateColumns};`,
      `  grid-template-rows: ${templateRows};`,
      rowGap === columnGap
        ? `  gap: ${rowGap}px;`
        : `  row-gap: ${rowGap}px;\n  column-gap: ${columnGap}px;`,
      "}",
    ];

    items.forEach((item, index) => {
      lines.push(
        "",
        `.item-${index + 1} {`,
        `  grid-column: ${item.columnStart} / span ${item.columnSpan};`,
        `  grid-row: ${item.rowStart} / span ${item.rowSpan};`,
        "}",
      );
    });

    return lines.join("\n");
  }, [templateColumns, templateRows, rowGap, columnGap, items]);

  const html = useMemo(
    () =>
      [
        '<div class="grid">',
        ...items.map((_, index) => `  <div class="item-${index + 1}">${index + 1}</div>`),
        "</div>",
      ].join("\n"),
    [items],
  );

  const updateTrack = (
    which: "columns" | "rows",
    id: string,
    size: string,
  ) => {
    const setter = which === "columns" ? setColumns : setRows;
    setter((current) =>
      current.map((track) => (track.id === id ? { ...track, size } : track)),
    );
  };

  return (
    <ToolShell>
      <div className="grid gap-5 lg:grid-cols-2">
        <TrackEditor
          legend="Columns"
          tracks={columns}
          disabled={useAutoFit}
          onChange={(id, size) => updateTrack("columns", id, size)}
          onAdd={() => setColumns((current) => [...current, { id: makeId(), size: "1fr" }])}
          onRemove={(id) =>
            setColumns((current) =>
              current.length > 1 ? current.filter((track) => track.id !== id) : current,
            )
          }
        />
        <TrackEditor
          legend="Rows"
          tracks={rows}
          onChange={(id, size) => updateTrack("rows", id, size)}
          onAdd={() => setRows((current) => [...current, { id: makeId(), size: "auto" }])}
          onRemove={(id) =>
            setRows((current) =>
              current.length > 1 ? current.filter((track) => track.id !== id) : current,
            )
          }
        />
      </div>

      <Toggle
        checked={useAutoFit}
        onChange={setUseAutoFit}
        label="Responsive columns with auto-fit"
        hint="repeat(auto-fit, minmax(200px, 1fr)) fits as many columns as will fit and wraps the rest — no media queries needed."
      />

      <div className="flex flex-wrap gap-6">
        <GapSlider id="col-gap" label="Column gap" value={columnGap} onChange={setColumnGap} />
        <GapSlider id="row-gap" label="Row gap" value={rowGap} onChange={setRowGap} />
      </div>

      {/* Items */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-text-2">
            Items
          </span>
          <SmallButton
            icon={<Plus size={13} />}
            onClick={() =>
              setItems((current) => [
                ...current,
                { id: makeId(), columnStart: 1, columnSpan: 1, rowStart: 1, rowSpan: 1 },
              ])
            }
          >
            Add item
          </SmallButton>
        </div>

        <ul className="space-y-2">
          {items.map((item, index) => (
            <li
              key={item.id}
              className="flex flex-wrap items-end gap-3 rounded-custom-sm border border-border-custom bg-bg p-3"
            >
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-custom-sm text-xs font-bold text-white"
                style={{ background: "var(--cat-accent)" }}
              >
                {index + 1}
              </span>

              <NumberField
                label="Column start"
                value={item.columnStart}
                min={1}
                onChange={(value) =>
                  setItems((current) =>
                    current.map((entry) =>
                      entry.id === item.id ? { ...entry, columnStart: value } : entry,
                    ),
                  )
                }
              />
              <NumberField
                label="Span"
                value={item.columnSpan}
                min={1}
                onChange={(value) =>
                  setItems((current) =>
                    current.map((entry) =>
                      entry.id === item.id ? { ...entry, columnSpan: value } : entry,
                    ),
                  )
                }
              />
              <NumberField
                label="Row start"
                value={item.rowStart}
                min={1}
                onChange={(value) =>
                  setItems((current) =>
                    current.map((entry) =>
                      entry.id === item.id ? { ...entry, rowStart: value } : entry,
                    ),
                  )
                }
              />
              <NumberField
                label="Span"
                value={item.rowSpan}
                min={1}
                onChange={(value) =>
                  setItems((current) =>
                    current.map((entry) =>
                      entry.id === item.id ? { ...entry, rowSpan: value } : entry,
                    ),
                  )
                }
              />

              {items.length > 1 && (
                <SmallButton
                  tone="danger"
                  icon={<Trash2 size={13} />}
                  onClick={() =>
                    setItems((current) => current.filter((entry) => entry.id !== item.id))
                  }
                >
                  Remove
                </SmallButton>
              )}
            </li>
          ))}
        </ul>
        <p className="mt-2 text-xs text-text-2">
          Grid lines are numbered from 1, and they sit between tracks rather than on them —
          which is why the first column runs from line 1 to line 2.
        </p>
      </div>

      {/* Real CSS Grid rendered by the browser */}
      <div>
        <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-text-2">
          Preview
        </p>
        <div
          className="min-h-[220px] rounded-custom-md border border-dashed border-border-custom bg-surface p-3"
          style={{
            display: "grid",
            gridTemplateColumns: templateColumns,
            gridTemplateRows: templateRows,
            columnGap: `${columnGap}px`,
            rowGap: `${rowGap}px`,
          }}
        >
          {items.map((item, index) => (
            <div
              key={item.id}
              className="flex min-h-[56px] items-center justify-center rounded-custom-sm text-sm font-semibold text-white"
              style={{
                background: "var(--cat-accent)",
                gridColumn: `${item.columnStart} / span ${item.columnSpan}`,
                gridRow: `${item.rowStart} / span ${item.rowSpan}`,
              }}
            >
              {index + 1}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3 border-t border-border-custom pt-4">
        <pre className="overflow-x-auto rounded-custom-sm border border-border-custom bg-surface p-4 font-mono text-xs leading-relaxed text-text-custom">
          {css}
        </pre>
        <pre className="overflow-x-auto rounded-custom-sm border border-border-custom bg-surface p-4 font-mono text-xs leading-relaxed text-text-custom">
          {html}
        </pre>
        <div className="flex flex-col gap-3 sm:flex-row">
          <CopyButton text={css} label="Copy CSS" />
          <CopyButton text={html} label="Copy HTML" />
        </div>
      </div>
    </ToolShell>
  );
}

function TrackEditor({
  legend,
  tracks,
  onChange,
  onAdd,
  onRemove,
  disabled,
}: {
  legend: string;
  tracks: Track[];
  onChange: (id: string, size: string) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
  disabled?: boolean;
}) {
  return (
    <fieldset disabled={disabled} className={disabled ? "opacity-50" : undefined}>
      <div className="mb-2 flex items-center justify-between">
        <legend className="text-xs font-semibold uppercase tracking-wider text-text-2">
          {legend} ({tracks.length})
        </legend>
        <SmallButton icon={<Plus size={13} />} onClick={onAdd} disabled={disabled}>
          Add
        </SmallButton>
      </div>

      <ul className="space-y-2">
        {tracks.map((track, index) => (
          <li key={track.id} className="flex items-center gap-2">
            <span className="w-5 shrink-0 text-xs tabular-nums text-text-2">
              {index + 1}
            </span>
            <select
              value={SIZE_PRESETS.includes(track.size) ? track.size : "custom"}
              onChange={(event) => onChange(track.id, event.target.value)}
              className="h-9 min-w-0 flex-grow rounded-custom-sm border border-border-custom bg-bg px-2 text-xs text-text-custom focus:border-primary focus:outline-none"
            >
              {SIZE_PRESETS.map((preset) => (
                <option key={preset} value={preset}>
                  {preset}
                </option>
              ))}
            </select>
            {tracks.length > 1 && (
              <button
                type="button"
                onClick={() => onRemove(track.id)}
                aria-label={`Remove ${legend.toLowerCase()} ${index + 1}`}
                className="shrink-0 rounded p-1.5 text-text-2 transition-colors hover:text-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
              >
                <Trash2 size={13} />
              </button>
            )}
          </li>
        ))}
      </ul>
    </fieldset>
  );
}

function NumberField({
  label,
  value,
  min,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[11px] uppercase tracking-wider text-text-2">{label}</span>
      <input
        type="number"
        min={min}
        value={value}
        onChange={(event) =>
          onChange(Math.max(min, Number(event.target.value) || min))
        }
        className="h-9 w-20 rounded-custom-sm border border-border-custom bg-bg px-2 text-xs text-text-custom focus:border-primary focus:outline-none"
      />
    </label>
  );
}

function GapSlider({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-text-2">
        {label}
      </label>
      <input
        id={id}
        type="range"
        min={0}
        max={48}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-40 accent-[var(--cat-accent)]"
      />
      <span className="ml-2 text-xs tabular-nums text-text-2">{value}px</span>
    </div>
  );
}
