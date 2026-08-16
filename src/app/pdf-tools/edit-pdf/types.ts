import type { FontMatch } from "@/lib/pdf/fontMatching";

/**
 * Every object is stored in PDF page coordinates (points, origin bottom-left),
 * not screen pixels. Zooming, resizing the window or switching device then has
 * no effect on where an edit lands in the saved file.
 */

export interface BaseObject {
  id: string;
  /** 1-indexed page number. */
  page: number;
}

/** Text the user added. */
export interface TextObject extends BaseObject {
  kind: "text";
  x: number;
  baseline: number;
  value: string;
  fontSize: number;
  color: string;
  fontMatch: FontMatch;
}

/**
 * A replacement for text already in the PDF. The original glyphs are covered
 * with `background` and the new value is drawn in their place.
 */
export interface TextEditObject extends BaseObject {
  kind: "text-edit";
  runId: string;
  x: number;
  baseline: number;
  /** Width of the original run — the replacement is fitted to it. */
  width: number;
  value: string;
  fontSize: number;
  color: string;
  background: string;
  fontMatch: FontMatch;
}

export interface StrokeObject extends BaseObject {
  kind: "stroke";
  points: { x: number; y: number }[];
  color: string;
  thickness: number;
  highlight: boolean;
}

export interface RectObject extends BaseObject {
  kind: "rect";
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string | null;
  stroke: string | null;
  thickness: number;
  opacity: number;
}

export interface ImageObject extends BaseObject {
  kind: "image";
  x: number;
  y: number;
  width: number;
  height: number;
  format: "png" | "jpg";
  bytes: Uint8Array;
  /** Object URL used only for the on-screen preview. */
  previewUrl: string;
}

export type EditorObject =
  | TextObject
  | TextEditObject
  | StrokeObject
  | RectObject
  | ImageObject;

export type EditorTool =
  | "select"
  | "edit-text"
  | "text"
  | "draw"
  | "highlight"
  | "rect"
  | "whiteout"
  | "image";

export interface PageGeometry {
  width: number;
  height: number;
}
