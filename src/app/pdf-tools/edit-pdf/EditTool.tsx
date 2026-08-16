"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, Save } from "lucide-react";

import ActionButton from "@/components/pdf/ui/ActionButton";
import Dropzone from "@/components/pdf/ui/Dropzone";
import ErrorBanner from "@/components/pdf/ui/ErrorBanner";
import FileSummary from "@/components/pdf/ui/FileSummary";
import ProgressPanel from "@/components/pdf/ui/ProgressPanel";
import ResultPanel from "@/components/pdf/ui/ResultPanel";
import ToolShell from "@/components/pdf/ui/ToolShell";
import {
  addFileNameSuffix,
  downloadBlob,
  formatBytes,
  MAX_FILE_BYTES,
  validatePdfFile,
} from "@/lib/pdf/files";
import {
  describePdfError,
  openPdfDocument,
  renderPageToCanvas,
} from "@/lib/pdf/pdfjs";
import type { PDFDocumentProxy } from "@/lib/pdf/pdfjs";
import { sampleTextStyle, toHex } from "@/lib/pdf/colorSampling";
import { extractTextRuns, runToPreviewRect, type TextRun } from "@/lib/pdf/textRuns";

import EditorToolbar from "./EditorToolbar";
import EditorOverlay from "./EditorOverlay";
import PageNavigator from "./PageNavigator";
import { applyEdits, hasUnsupportedCharacters } from "./savePdf";
import { useEditorHistory } from "./useEditorHistory";
import type { EditorObject, EditorTool, PageGeometry } from "./types";

const BASE_SCALE = 1.4;

export default function EditTool() {
  const [file, setFile] = useState<File | null>(null);
  const [documentProxy, setDocumentProxy] = useState<PDFDocumentProxy | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [geometry, setGeometry] = useState<PageGeometry>({ width: 0, height: 0 });
  const [textRuns, setTextRuns] = useState<TextRun[]>([]);

  const [isReading, setIsReading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Blob | null>(null);

  const [tool, setTool] = useState<EditorTool>("edit-text");
  const [color, setColor] = useState("#111827");
  const [fontSize, setFontSize] = useState(14);
  const [zoom, setZoom] = useState(1);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingRunId, setEditingRunId] = useState<string | null>(null);

  const { objects, commit, replace, undo, redo, reset, canUndo, canRedo } =
    useEditorHistory();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const scale = BASE_SCALE * zoom;
  const pageObjects = objects.filter((object) => object.page === currentPage);

  // Rendering state is derived by comparing what is on screen with what is
  // wanted, rather than being flipped on inside the effect.
  const renderKey = `${currentPage}@${scale}`;
  const [renderedKey, setRenderedKey] = useState("");
  const isRendering = documentProxy !== null && renderedKey !== renderKey;

  /** Renders the page and re-reads its editable text runs. */
  useEffect(() => {
    if (!documentProxy) return;

    let cancelled = false;

    const render = async () => {
      try {
        const page = await documentProxy.getPage(currentPage);
        if (cancelled) return;

        const viewport = page.getViewport({ scale: 1 });
        setGeometry({ width: viewport.width, height: viewport.height });

        if (canvasRef.current) {
          await renderPageToCanvas(page, canvasRef.current, scale);
        }
        if (cancelled) return;

        // Fonts are only resolvable once the page has rendered, so runs are
        // extracted afterwards to get real font names for weight matching.
        setTextRuns(await extractTextRuns(page));
        page.cleanup();

        if (!cancelled) setRenderedKey(`${currentPage}@${scale}`);
      } catch {
        if (!cancelled) setError("Could not display this page.");
      }
    };

    void render();
    return () => {
      cancelled = true;
    };
  }, [documentProxy, currentPage, scale]);

  useEffect(
    () => () => {
      void documentProxy?.loadingTask.destroy();
    },
    [documentProxy],
  );

  // Keyboard shortcuts matching what people expect from an editor.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;

      const modifier = event.ctrlKey || event.metaKey;

      if (modifier && event.key.toLowerCase() === "z") {
        event.preventDefault();
        if (event.shiftKey) redo();
        else undo();
        return;
      }

      if (modifier && event.key.toLowerCase() === "y") {
        event.preventDefault();
        redo();
        return;
      }

      if ((event.key === "Delete" || event.key === "Backspace") && selectedId) {
        event.preventDefault();
        commit((current) => current.filter((object) => object.id !== selectedId));
        setSelectedId(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [commit, redo, undo, selectedId]);

  const handleFile = async (fileList: FileList) => {
    const candidate = fileList[0];
    if (!candidate) return;

    const problem = validatePdfFile(candidate);
    if (problem) {
      setError(problem);
      return;
    }

    setError("");
    // Release previews from a previous document before discarding its objects.
    objects.forEach((object) => {
      if (object.kind === "image") URL.revokeObjectURL(object.previewUrl);
    });
    reset();
    setResult(null);
    setCurrentPage(1);
    setSelectedId(null);
    setEditingRunId(null);
    setIsReading(true);

    try {
      const buffer = await candidate.arrayBuffer();
      const proxy = await openPdfDocument(buffer);

      // The previous proxy is torn down by the cleanup of the effect below,
      // which runs whenever documentProxy changes.
      setDocumentProxy(proxy);
      setTotalPages(proxy.numPages);
      setFile(candidate);
    } catch (cause) {
      setError(describePdfError(cause, candidate.name));
      setFile(null);
    } finally {
      setIsReading(false);
    }
  };

  /**
   * Starts editing an existing run: samples the ink and page colour behind it
   * so the replacement blends into the surrounding text.
   */
  const beginRunEdit = useCallback(
    (run: TextRun) => {
      const canvas = canvasRef.current;
      const context = canvas?.getContext("2d", { willReadFrequently: true });
      if (!context) return;

      setEditingRunId(run.id);

      const existing = objects.find(
        (object) =>
          object.kind === "text-edit" &&
          object.page === currentPage &&
          object.runId === run.id,
      );
      if (existing) return;

      const rect = runToPreviewRect(run, geometry.height, scale);
      const sampled = sampleTextStyle(context, rect);

      commit((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          kind: "text-edit",
          page: currentPage,
          runId: run.id,
          x: run.x,
          baseline: run.baseline,
          width: run.width,
          value: run.original,
          fontSize: run.fontSize,
          color: toHex(sampled.text),
          background: toHex(sampled.background),
          fontMatch: run.fontMatch,
        },
      ]);
    },
    [commit, currentPage, geometry.height, objects, scale],
  );

  const applyPatch = (id: string, patch: Partial<EditorObject>) =>
    (current: EditorObject[]) =>
      current.map((object) =>
        object.id === id ? ({ ...object, ...patch } as EditorObject) : object,
      );

  /** Records an undo step, e.g. typing a replacement. */
  const updateObject = useCallback(
    (id: string, patch: Partial<EditorObject>) => {
      commit(applyPatch(id, patch));
    },
    [commit],
  );

  /** Mid-gesture update that must not add its own undo step. */
  const previewObject = useCallback(
    (id: string, patch: Partial<EditorObject>) => {
      replace(applyPatch(id, patch));
    },
    [replace],
  );

  /** Snapshots the current state so a whole drag collapses into one undo. */
  const beginGesture = useCallback(() => {
    commit((current) => [...current]);
  }, [commit]);

  const addObject = useCallback(
    (object: EditorObject) => {
      commit((current) => [...current, object]);
    },
    [commit],
  );

  const deleteObject = useCallback(
    (id: string) => {
      commit((current) => {
        const target = current.find((object) => object.id === id);
        if (target?.kind === "image") URL.revokeObjectURL(target.previewUrl);
        return current.filter((object) => object.id !== id);
      });
      setSelectedId(null);
    },
    [commit],
  );

  const handleImagePicked = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const picked = event.target.files?.[0];
    event.target.value = "";
    if (!picked) return;

    const isPng = picked.type === "image/png";
    const isJpg = picked.type === "image/jpeg";
    if (!isPng && !isJpg) {
      setError("Only PNG and JPG images can be placed into a PDF.");
      return;
    }

    if (geometry.width === 0 || geometry.height === 0) {
      setError("Wait for the page to finish loading, then add your image.");
      return;
    }

    const bytes = new Uint8Array(await picked.arrayBuffer());
    const bitmap = await createImageBitmap(picked);

    if (bitmap.width === 0 || bitmap.height === 0) {
      bitmap.close();
      setError("That image could not be read.");
      return;
    }

    // Start at a quarter of the page width, keeping the image's proportions.
    const targetWidth = geometry.width * 0.25;
    const targetHeight = (bitmap.height / bitmap.width) * targetWidth;
    bitmap.close();

    const id = crypto.randomUUID();
    addObject({
      id,
      kind: "image",
      page: currentPage,
      x: geometry.width / 2 - targetWidth / 2,
      y: geometry.height / 2 - targetHeight / 2,
      width: targetWidth,
      height: targetHeight,
      format: isPng ? "png" : "jpg",
      bytes,
      previewUrl: URL.createObjectURL(picked),
    });

    setTool("select");
    setSelectedId(id);
  };

  const handleSave = async () => {
    if (!file) return;

    const badText = objects.find(
      (object) =>
        (object.kind === "text" || object.kind === "text-edit") &&
        hasUnsupportedCharacters(object.value),
    );

    if (badText) {
      setError(
        "Some text uses characters the built-in PDF fonts cannot draw, such as non-Latin script or emoji. Replace them with Latin characters and save again.",
      );
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      setResult(await applyEdits(file, objects));
    } catch (cause) {
      setError(describePdfError(cause, file.name));
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    objects.forEach((object) => {
      if (object.kind === "image") URL.revokeObjectURL(object.previewUrl);
    });

    setDocumentProxy(null);
    setFile(null);
    setTotalPages(0);
    setCurrentPage(1);
    setTextRuns([]);
    setResult(null);
    setError("");
    setSelectedId(null);
    setEditingRunId(null);
    reset();
  };

  if (isSaving) {
    return (
      <ToolShell>
        <ProgressPanel
          title="Saving your changes"
          status="Writing every edit into the document…"
        />
      </ToolShell>
    );
  }

  if (result && file) {
    return (
      <ToolShell>
        <ResultPanel
          title="Your edited PDF is ready"
          summary={`${objects.length} change${objects.length === 1 ? "" : "s"} written into the document.`}
          stats={[{ label: "Size", value: formatBytes(result.size) }]}
          onDownload={() => downloadBlob(result, addFileNameSuffix(file.name, "edited"))}
          downloadLabel="Download edited PDF"
          onReset={handleReset}
          resetLabel="Edit another PDF"
        />
      </ToolShell>
    );
  }

  if (!file) {
    return (
      <ToolShell>
        <ErrorBanner message={error} onDismiss={() => setError("")} />
        <Dropzone
          onFiles={handleFile}
          accept=".pdf,application/pdf"
          multiple={false}
          title="Drop your PDF here"
          hint={`One PDF · up to ${formatBytes(MAX_FILE_BYTES)}`}
          disabled={isReading}
        />
        {isReading && (
          <p className="flex items-center justify-center gap-2 text-sm text-text-2">
            <Loader2 size={14} className="animate-spin" aria-hidden="true" />
            Opening the document…
          </p>
        )}
      </ToolShell>
    );
  }

  return (
    <ToolShell>
      <ErrorBanner message={error} onDismiss={() => setError("")} />

      <FileSummary
        name={file.name}
        size={file.size}
        pageCount={totalPages}
        onChange={handleReset}
      />

      <EditorToolbar
        tool={tool}
        onToolChange={(next) => {
          setTool(next);
          setSelectedId(null);
          setEditingRunId(null);
        }}
        color={color}
        onColorChange={setColor}
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
        zoom={zoom}
        onZoomChange={setZoom}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={undo}
        onRedo={redo}
        onPickImage={() => imageInputRef.current?.click()}
        selectedId={selectedId}
        onDeleteSelected={() => selectedId && deleteObject(selectedId)}
      />

      <input
        ref={imageInputRef}
        type="file"
        accept="image/png,image/jpeg"
        onChange={handleImagePicked}
        className="sr-only"
      />

      <div className="relative flex justify-center overflow-auto rounded-custom-sm border border-border-custom bg-surface p-4">
        {isRendering && (
          <span className="absolute right-4 top-4 z-10 inline-flex items-center gap-1.5 rounded bg-bg px-2 py-1 text-xs text-text-2 shadow-custom-sm">
            <Loader2 size={12} className="animate-spin" aria-hidden="true" />
            Rendering…
          </span>
        )}

        <EditorOverlay
          canvasRef={canvasRef}
          tool={tool}
          color={color}
          fontSize={fontSize}
          scale={scale}
          geometry={geometry}
          currentPage={currentPage}
          objects={pageObjects}
          textRuns={textRuns}
          selectedId={selectedId}
          editingRunId={editingRunId}
          onSelect={setSelectedId}
          onEditRun={beginRunEdit}
          onEditRunDone={() => setEditingRunId(null)}
          onAdd={addObject}
          onUpdate={updateObject}
          onPreview={previewObject}
          onGestureStart={beginGesture}
        />
      </div>

      <PageNavigator
        currentPage={currentPage}
        totalPages={totalPages}
        onChange={(page) => {
          setCurrentPage(page);
          setSelectedId(null);
          setEditingRunId(null);
        }}
      />

      <div className="flex flex-col items-center gap-2 border-t border-border-custom pt-4">
        <ActionButton
          onClick={handleSave}
          disabled={objects.length === 0}
          icon={<Save size={16} aria-hidden="true" />}
        >
          Save changes
        </ActionButton>
        <p className="text-center text-xs text-text-2">
          {objects.length === 0
            ? "Click any text on the page to edit it, or pick a tool above."
            : `${objects.length} change${objects.length === 1 ? "" : "s"} pending. Saving writes them permanently into the file.`}
        </p>
      </div>
    </ToolShell>
  );
}
