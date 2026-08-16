"use client";

import { useCallback, useState } from "react";

import type { EditorObject } from "./types";

interface History {
  past: EditorObject[][];
  present: EditorObject[];
  future: EditorObject[][];
}

/** Depth is capped so a long editing session cannot grow memory without bound. */
const MAX_HISTORY = 50;

/**
 * Undo/redo over the object list.
 *
 * Every mutation goes through `commit`, which snapshots the previous state, so
 * undo works uniformly for adding, moving, editing and deleting.
 */
export function useEditorHistory() {
  const [history, setHistory] = useState<History>({
    past: [],
    present: [],
    future: [],
  });

  const commit = useCallback(
    (update: (objects: EditorObject[]) => EditorObject[]) => {
      setHistory((current) => {
        const next = update(current.present);
        if (next === current.present) return current;

        return {
          past: [...current.past, current.present].slice(-MAX_HISTORY),
          present: next,
          // Any new edit invalidates the redo branch.
          future: [],
        };
      });
    },
    [],
  );

  /**
   * Updates the current state without adding a history entry.
   *
   * Used for continuous gestures such as dragging: the snapshot is taken once
   * when the drag starts, so one undo returns the object to where it began
   * rather than replaying every pointer-move frame.
   */
  const replace = useCallback(
    (update: (objects: EditorObject[]) => EditorObject[]) => {
      setHistory((current) => ({ ...current, present: update(current.present) }));
    },
    [],
  );

  const undo = useCallback(() => {
    setHistory((current) => {
      const previous = current.past.at(-1);
      if (!previous) return current;

      return {
        past: current.past.slice(0, -1),
        present: previous,
        future: [current.present, ...current.future].slice(0, MAX_HISTORY),
      };
    });
  }, []);

  const redo = useCallback(() => {
    setHistory((current) => {
      const [next, ...rest] = current.future;
      if (!next) return current;

      return {
        past: [...current.past, current.present].slice(-MAX_HISTORY),
        present: next,
        future: rest,
      };
    });
  }, []);

  const reset = useCallback(() => {
    setHistory({ past: [], present: [], future: [] });
  }, []);

  return {
    objects: history.present,
    commit,
    replace,
    undo,
    redo,
    reset,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
  };
}
