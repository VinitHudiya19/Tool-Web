"use client";

import { useRef, useState, type RefObject } from "react";

import { matchStandardFont, toCssFontFamily } from "@/lib/pdf/fontMatching";
import { runToPreviewRect, type TextRun } from "@/lib/pdf/textRuns";

import type { EditorObject, EditorTool, PageGeometry, TextEditObject } from "./types";

interface Point {
  x: number;
  y: number;
}

/**
 * The interactive layer sitting on top of the rendered page.
 *
 * Screen pixels are converted to PDF points on the way in and back again on the
 * way out, so what is shown here is exactly what gets written to the file.
 */
export default function EditorOverlay({
  canvasRef,
  tool,
  color,
  fontSize,
  scale,
  geometry,
  currentPage,
  objects,
  textRuns,
  selectedId,
  editingRunId,
  onSelect,
  onEditRun,
  onEditRunDone,
  onAdd,
  onUpdate,
  onPreview,
  onGestureStart,
}: {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  tool: EditorTool;
  color: string;
  fontSize: number;
  scale: number;
  geometry: PageGeometry;
  currentPage: number;
  objects: EditorObject[];
  textRuns: TextRun[];
  selectedId: string | null;
  editingRunId: string | null;
  onSelect: (id: string | null) => void;
  onEditRun: (run: TextRun) => void;
  onEditRunDone: () => void;
  onAdd: (object: EditorObject) => void;
  onUpdate: (id: string, patch: Partial<EditorObject>) => void;
  onPreview: (id: string, patch: Partial<EditorObject>) => void;
  onGestureStart: () => void;
}) {
  const surfaceRef = useRef<HTMLDivElement>(null);
  const [drawing, setDrawing] = useState<Point[]>([]);
  const [dragRect, setDragRect] = useState<{ from: Point; to: Point } | null>(null);
  const dragObjectRef = useRef<{ id: string; offsetX: number; offsetY: number } | null>(null);

  /** Screen coordinates to PDF points (origin bottom-left). */
  const toPdfPoint = (event: React.PointerEvent): Point | null => {
    const surface = surfaceRef.current;
    if (!surface || geometry.height === 0) return null;

    const bounds = surface.getBoundingClientRect();
    return {
      x: ((event.clientX - bounds.left) / bounds.width) * geometry.width,
      y: geometry.height - ((event.clientY - bounds.top) / bounds.height) * geometry.height,
    };
  };

  const handlePointerDown = (event: React.PointerEvent) => {
    if (tool === "edit-text" || tool === "image") return;

    const point = toPdfPoint(event);
    if (!point) return;

    if (tool === "select") {
      onSelect(null);
      return;
    }

    if (tool === "text") {
      const value = window.prompt("Text to add:");
      if (!value?.trim()) return;

      onAdd({
        id: crypto.randomUUID(),
        kind: "text",
        page: currentPage,
        x: point.x,
        baseline: point.y,
        value,
        fontSize,
        color,
        fontMatch: matchStandardFont("Helvetica", "sans-serif"),
      });
      return;
    }

    event.currentTarget.setPointerCapture(event.pointerId);

    if (tool === "draw" || tool === "highlight") {
      setDrawing([point]);
      return;
    }

    setDragRect({ from: point, to: point });
  };

  const handlePointerMove = (event: React.PointerEvent) => {
    const point = toPdfPoint(event);
    if (!point) return;

    const dragging = dragObjectRef.current;
    if (dragging) {
      // Preview rather than commit: the undo step was taken at drag start, so
      // one Ctrl+Z returns the object to where it was picked up.
      onPreview(dragging.id, {
        x: point.x - dragging.offsetX,
        y: point.y - dragging.offsetY,
      } as Partial<EditorObject>);
      return;
    }

    if (drawing.length > 0) {
      setDrawing((previous) => [...previous, point]);
      return;
    }

    if (dragRect) setDragRect({ ...dragRect, to: point });
  };

  const handlePointerUp = () => {
    dragObjectRef.current = null;

    if (drawing.length > 1) {
      onAdd({
        id: crypto.randomUUID(),
        kind: "stroke",
        page: currentPage,
        points: drawing,
        color,
        thickness: tool === "highlight" ? 12 : 2,
        highlight: tool === "highlight",
      });
    }
    setDrawing([]);

    if (dragRect) {
      const x = Math.min(dragRect.from.x, dragRect.to.x);
      const y = Math.min(dragRect.from.y, dragRect.to.y);
      const width = Math.abs(dragRect.to.x - dragRect.from.x);
      const height = Math.abs(dragRect.to.y - dragRect.from.y);

      // Ignore accidental taps that produce a degenerate rectangle.
      if (width > 3 && height > 3) {
        onAdd({
          id: crypto.randomUUID(),
          kind: "rect",
          page: currentPage,
          x,
          y,
          width,
          height,
          fill: tool === "whiteout" ? "#FFFFFF" : null,
          stroke: tool === "whiteout" ? null : color,
          thickness: 1.5,
          opacity: 1,
        });
      }
      setDragRect(null);
    }
  };

  const startObjectDrag = (event: React.PointerEvent, object: EditorObject) => {
    if (tool !== "select") return;
    if (object.kind !== "image" && object.kind !== "rect") return;

    event.stopPropagation();
    const point = toPdfPoint(event);
    if (!point) return;

    onSelect(object.id);
    onGestureStart();
    dragObjectRef.current = {
      id: object.id,
      offsetX: point.x - object.x,
      offsetY: point.y - object.y,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  /** PDF points to CSS percentages, so the overlay tracks any canvas size. */
  const percent = {
    x: (value: number) => `${(value / geometry.width) * 100}%`,
    y: (value: number) => `${(value / geometry.height) * 100}%`,
    fromTop: (baseline: number) => `${((geometry.height - baseline) / geometry.height) * 100}%`,
  };

  const replacedRunIds = new Set(
    objects.filter((object): object is TextEditObject => object.kind === "text-edit")
      .map((object) => object.runId),
  );

  const cursor =
    tool === "select" ? "default" : tool === "edit-text" ? "text" : "crosshair";

  return (
    <div
      ref={surfaceRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className="relative max-w-full touch-none shadow-custom-md"
      style={{ cursor }}
    >
      <canvas ref={canvasRef} className="block max-w-full" />

      {/* Existing text runs, clickable while the edit-text tool is active */}
      {tool === "edit-text" &&
        geometry.height > 0 &&
        textRuns.map((run) => {
          if (replacedRunIds.has(run.id)) return null;
          const rect = runToPreviewRect(run, geometry.height, scale);

          return (
            <button
              key={run.id}
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onEditRun(run);
              }}
              title={`Edit: ${run.original.slice(0, 60)}`}
              aria-label={`Edit text: ${run.original}`}
              className="absolute rounded-[2px] border border-transparent transition-colors hover:border-pdf-accent hover:bg-pdf-accent/10 focus-visible:border-pdf-accent focus-visible:bg-pdf-accent/10 focus-visible:outline-none"
              style={{
                left: `${(rect.x / (geometry.width * scale)) * 100}%`,
                top: `${(rect.y / (geometry.height * scale)) * 100}%`,
                width: `${(rect.width / (geometry.width * scale)) * 100}%`,
                height: `${(rect.height / (geometry.height * scale)) * 100}%`,
              }}
            />
          );
        })}

      {/* Committed objects */}
      {objects.map((object) => {
        if (object.kind === "text-edit") {
          const isEditing = editingRunId === object.runId;

          return (
            <div
              key={object.id}
              className="absolute flex items-center"
              style={{
                left: percent.x(object.x),
                top: percent.fromTop(object.baseline + object.fontSize * 0.8),
                width: percent.x(object.width),
                height: percent.y(object.fontSize * 1.05),
                backgroundColor: object.background,
              }}
            >
              {isEditing ? (
                <input
                  autoFocus
                  value={object.value}
                  onChange={(event) => onUpdate(object.id, { value: event.target.value })}
                  onBlur={onEditRunDone}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === "Escape") {
                      event.currentTarget.blur();
                    }
                  }}
                  aria-label="Edit text"
                  className="w-full border border-pdf-accent bg-white px-0.5 outline-none"
                  style={{
                    fontSize: `${object.fontSize * scale}px`,
                    fontFamily: toCssFontFamily(object.fontMatch),
                    color: object.color,
                    lineHeight: 1,
                  }}
                />
              ) : (
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    onEditRun({
                      id: object.runId,
                      original: object.value,
                      x: object.x,
                      baseline: object.baseline,
                      width: object.width,
                      fontSize: object.fontSize,
                      fontMatch: object.fontMatch,
                    });
                  }}
                  className="w-full truncate whitespace-pre text-left hover:ring-1 hover:ring-pdf-accent"
                  style={{
                    fontSize: `${object.fontSize * scale}px`,
                    fontFamily: toCssFontFamily(object.fontMatch),
                    color: object.color,
                    fontWeight: object.fontMatch.bold ? 700 : 400,
                    fontStyle: object.fontMatch.italic ? "italic" : "normal",
                    lineHeight: 1,
                  }}
                >
                  {object.value}
                </button>
              )}
            </div>
          );
        }

        if (object.kind === "text") {
          return (
            <span
              key={object.id}
              onPointerDown={(event) => {
                if (tool === "select") {
                  event.stopPropagation();
                  onSelect(object.id);
                }
              }}
              className={`absolute whitespace-pre leading-none ${
                selectedId === object.id ? "ring-1 ring-pdf-accent" : ""
              }`}
              style={{
                left: percent.x(object.x),
                top: percent.fromTop(object.baseline + object.fontSize * 0.8),
                fontSize: `${object.fontSize * scale}px`,
                fontFamily: toCssFontFamily(object.fontMatch),
                color: object.color,
              }}
            >
              {object.value}
            </span>
          );
        }

        if (object.kind === "rect") {
          return (
            <div
              key={object.id}
              onPointerDown={(event) => startObjectDrag(event, object)}
              className={`absolute ${tool === "select" ? "cursor-move" : ""} ${
                selectedId === object.id ? "ring-2 ring-pdf-accent" : ""
              }`}
              style={{
                left: percent.x(object.x),
                top: percent.fromTop(object.y + object.height),
                width: percent.x(object.width),
                height: percent.y(object.height),
                backgroundColor: object.fill ?? "transparent",
                border: object.stroke ? `1.5px solid ${object.stroke}` : undefined,
              }}
            />
          );
        }

        if (object.kind === "image") {
          return (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              key={object.id}
              src={object.previewUrl}
              alt=""
              onPointerDown={(event) => startObjectDrag(event, object)}
              draggable={false}
              className={`absolute ${tool === "select" ? "cursor-move" : ""} ${
                selectedId === object.id ? "ring-2 ring-pdf-accent" : ""
              }`}
              style={{
                left: percent.x(object.x),
                top: percent.fromTop(object.y + object.height),
                width: percent.x(object.width),
                height: percent.y(object.height),
              }}
            />
          );
        }

        return null;
      })}

      {/* Strokes, plus whatever is being drawn right now */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox={`0 0 ${geometry.width || 1} ${geometry.height || 1}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {objects.map((object) =>
          object.kind === "stroke" ? (
            <polyline
              key={object.id}
              points={object.points
                .map((point) => `${point.x},${geometry.height - point.y}`)
                .join(" ")}
              fill="none"
              stroke={object.color}
              strokeWidth={object.thickness}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={object.highlight ? 0.35 : 1}
            />
          ) : null,
        )}

        {drawing.length > 1 && (
          <polyline
            points={drawing
              .map((point) => `${point.x},${geometry.height - point.y}`)
              .join(" ")}
            fill="none"
            stroke={color}
            strokeWidth={tool === "highlight" ? 12 : 2}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={tool === "highlight" ? 0.35 : 1}
          />
        )}

        {dragRect && (
          <rect
            x={Math.min(dragRect.from.x, dragRect.to.x)}
            y={geometry.height - Math.max(dragRect.from.y, dragRect.to.y)}
            width={Math.abs(dragRect.to.x - dragRect.from.x)}
            height={Math.abs(dragRect.to.y - dragRect.from.y)}
            fill={tool === "whiteout" ? "#FFFFFF" : "none"}
            stroke={tool === "whiteout" ? "#94A3B8" : color}
            strokeWidth={1.5}
            strokeDasharray="4 3"
          />
        )}
      </svg>
    </div>
  );
}
