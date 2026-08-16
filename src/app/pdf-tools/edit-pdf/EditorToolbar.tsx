"use client";

import {
  Eraser,
  Highlighter,
  ImagePlus,
  MousePointer2,
  PenLine,
  Redo2,
  Square,
  TextCursorInput,
  Trash2,
  Type,
  Undo2,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

import type { EditorTool } from "./types";

const TOOLS: { id: EditorTool; label: string; Icon: typeof Type; hint: string }[] = [
  { id: "edit-text", label: "Edit text", Icon: TextCursorInput, hint: "Click existing text to change it" },
  { id: "select", label: "Select", Icon: MousePointer2, hint: "Drag images and boxes to reposition them, or press Delete to remove one. Ctrl+Z undoes anything else." },
  { id: "text", label: "Add text", Icon: Type, hint: "Click to place new text" },
  { id: "draw", label: "Draw", Icon: PenLine, hint: "Drag to draw or sign" },
  { id: "highlight", label: "Highlight", Icon: Highlighter, hint: "Drag across text to highlight" },
  { id: "rect", label: "Box", Icon: Square, hint: "Drag to draw a rectangle" },
  { id: "whiteout", label: "Whiteout", Icon: Eraser, hint: "Drag to cover content" },
  { id: "image", label: "Image", Icon: ImagePlus, hint: "Place a PNG or JPG" },
];

const COLORS = ["#111827", "#DC2626", "#2563EB", "#059669", "#D97706", "#FACC15"];
const SIZES = [10, 12, 14, 18, 24, 32];

export default function EditorToolbar({
  tool,
  onToolChange,
  color,
  onColorChange,
  fontSize,
  onFontSizeChange,
  zoom,
  onZoomChange,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onPickImage,
  selectedId,
  onDeleteSelected,
}: {
  tool: EditorTool;
  onToolChange: (tool: EditorTool) => void;
  color: string;
  onColorChange: (color: string) => void;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onPickImage: () => void;
  selectedId: string | null;
  onDeleteSelected: () => void;
}) {
  const activeTool = TOOLS.find((entry) => entry.id === tool);

  return (
    <div className="space-y-3 rounded-custom-sm border border-border-custom bg-surface p-3">
      <div className="flex flex-wrap items-center gap-3">
        {/* Tools */}
        <div role="toolbar" aria-label="Editing tools" className="flex flex-wrap items-center gap-1">
          {TOOLS.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => (id === "image" ? onPickImage() : onToolChange(id))}
              aria-pressed={tool === id}
              title={label}
              className={`inline-flex h-9 items-center gap-1.5 rounded-custom-sm px-2.5 text-xs font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${
                tool === id
                  ? "bg-pdf-accent text-white"
                  : "bg-bg text-text-2 hover:text-text-custom"
              }`}
            >
              <Icon size={14} aria-hidden="true" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={onUndo}
            disabled={!canUndo}
            aria-label="Undo"
            title="Undo (Ctrl+Z)"
            className="rounded-custom-sm bg-bg p-2 text-text-2 transition-colors hover:text-text-custom disabled:pointer-events-none disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
          >
            <Undo2 size={15} />
          </button>
          <button
            type="button"
            onClick={onRedo}
            disabled={!canRedo}
            aria-label="Redo"
            title="Redo (Ctrl+Shift+Z)"
            className="rounded-custom-sm bg-bg p-2 text-text-2 transition-colors hover:text-text-custom disabled:pointer-events-none disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
          >
            <Redo2 size={15} />
          </button>

          {selectedId && (
            <button
              type="button"
              onClick={onDeleteSelected}
              aria-label="Delete selected item"
              title="Delete (Del)"
              className="rounded-custom-sm bg-bg p-2 text-red-600 transition-colors hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
            >
              <Trash2 size={15} />
            </button>
          )}

          <span className="mx-1 h-6 w-px bg-border-custom" aria-hidden="true" />

          <button
            type="button"
            onClick={() => onZoomChange(Math.max(0.5, Number((zoom - 0.25).toFixed(2))))}
            disabled={zoom <= 0.5}
            aria-label="Zoom out"
            className="rounded-custom-sm bg-bg p-2 text-text-2 transition-colors hover:text-text-custom disabled:pointer-events-none disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
          >
            <ZoomOut size={15} />
          </button>
          <span className="w-12 text-center text-xs font-medium text-text-2">
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            onClick={() => onZoomChange(Math.min(2.5, Number((zoom + 0.25).toFixed(2))))}
            disabled={zoom >= 2.5}
            aria-label="Zoom in"
            className="rounded-custom-sm bg-bg p-2 text-text-2 transition-colors hover:text-text-custom disabled:pointer-events-none disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
          >
            <ZoomIn size={15} />
          </button>
        </div>
      </div>

      {/* Style controls, only where they apply */}
      {tool !== "select" && tool !== "whiteout" && (
        <div className="flex flex-wrap items-center gap-4 border-t border-border-custom pt-3">
          <fieldset className="flex items-center gap-1.5">
            <legend className="sr-only">Colour</legend>
            <span className="text-xs font-medium text-text-2">Colour</span>
            {COLORS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => onColorChange(option)}
                aria-pressed={color === option}
                aria-label={`Use colour ${option}`}
                style={{ backgroundColor: option }}
                className={`h-6 w-6 rounded-full border border-black/10 transition-transform focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${
                  color === option ? "scale-110 ring-2 ring-text-custom ring-offset-2" : ""
                }`}
              />
            ))}
          </fieldset>

          {tool === "text" && (
            <div className="flex items-center gap-2">
              <label htmlFor="editor-font-size" className="text-xs font-medium text-text-2">
                Size
              </label>
              <select
                id="editor-font-size"
                value={fontSize}
                onChange={(event) => onFontSizeChange(Number(event.target.value))}
                className="h-9 rounded-custom-sm border border-border-custom bg-bg px-2 text-xs text-text-custom focus:border-primary focus:outline-none"
              >
                {SIZES.map((size) => (
                  <option key={size} value={size}>
                    {size} pt
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {activeTool && (
        <p className="text-xs text-text-2">{activeTool.hint}</p>
      )}
    </div>
  );
}
