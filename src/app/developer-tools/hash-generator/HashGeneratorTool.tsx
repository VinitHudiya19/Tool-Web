"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Check, Loader2, ShieldAlert, Upload, X } from "lucide-react";

import {
  CodeArea,
  CopyButton,
  ErrorBanner,
  OptionGroup,
  ToolShell,
  formatBytes,
} from "@/components/dev/ui";
import {
  ALGORITHMS,
  digestsMatch,
  getAlgorithm,
  hashFile,
  hashText,
  type HashAlgorithm,
} from "@/lib/dev/hash";

type Source = "text" | "file";

export default function HashGeneratorTool() {
  const [algorithm, setAlgorithm] = useState<HashAlgorithm>("SHA-256");
  const [source, setSource] = useState<Source>("text");
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [digest, setDigest] = useState("");
  const [isWorking, setIsWorking] = useState(false);
  const [error, setError] = useState("");
  const [expected, setExpected] = useState("");

  const spec = getAlgorithm(algorithm);

  // Hashing is async, so it runs in an effect rather than during render.
  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (source === "text" && !text) {
        setDigest("");
        return;
      }
      if (source === "file" && !file) {
        setDigest("");
        return;
      }

      setIsWorking(true);
      setError("");

      try {
        const result =
          source === "file" && file
            ? await hashFile(file, algorithm)
            : await hashText(text, algorithm);

        if (!cancelled) setDigest(result);
      } catch (cause) {
        if (!cancelled) {
          setDigest("");
          setError(
            cause instanceof Error
              ? `That could not be hashed: ${cause.message}`
              : "That could not be hashed.",
          );
        }
      } finally {
        if (!cancelled) setIsWorking(false);
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [algorithm, source, text, file]);

  const verification = expected.trim()
    ? digestsMatch(digest, expected)
    : null;

  return (
    <ToolShell>
      <ErrorBanner message={error} onDismiss={() => setError("")} />

      <OptionGroup<HashAlgorithm>
        legend="Algorithm"
        value={algorithm}
        onChange={setAlgorithm}
        options={ALGORITHMS.map((entry) => ({
          id: entry.id,
          label: entry.label,
          hint: entry.hint,
        }))}
      />

      {spec.warning && (
        <p className="flex items-start gap-2.5 rounded-custom-sm border border-amber-200 bg-amber-50 p-3 text-xs leading-relaxed text-amber-800">
          <ShieldAlert size={14} className="mt-px shrink-0" aria-hidden="true" />
          <span>
            <strong className="font-semibold">{spec.label} is not secure.</strong>{" "}
            {spec.warning}
          </span>
        </p>
      )}

      <OptionGroup<Source>
        legend="What to hash"
        value={source}
        onChange={setSource}
        options={[
          { id: "text", label: "Text" },
          { id: "file", label: "File", hint: "Read locally — the file is never uploaded." },
        ]}
      />

      {source === "text" ? (
        <CodeArea
          value={text}
          onChange={setText}
          onError={setError}
          label="Text to hash"
          placeholder="Type or paste anything. Text is hashed as UTF-8."
          rows={6}
        />
      ) : (
        <FilePicker file={file} onPick={setFile} />
      )}

      {(digest || isWorking) && (
        <div aria-live="polite" className="space-y-3 border-t border-border-custom pt-4">
          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-text-2">
              {spec.label} digest
            </p>
            <p className="break-all rounded-custom-sm border border-border-custom bg-surface p-3 font-mono text-sm text-text-custom">
              {isWorking ? (
                <span className="flex items-center gap-2 text-text-2">
                  <Loader2 size={14} className="animate-spin" aria-hidden="true" />
                  Hashing…
                </span>
              ) : (
                digest
              )}
            </p>
            {digest && (
              <p className="mt-1 text-xs text-text-2">
                {digest.length} hex characters · {digest.length * 4} bits
              </p>
            )}
          </div>

          {digest && <CopyButton text={digest} label="Copy digest" />}

          {/* Verification against a published checksum */}
          {digest && (
            <div className="border-t border-border-custom pt-4">
              <label
                htmlFor="expected-digest"
                className="mb-1.5 block text-sm font-medium text-text-2"
              >
                Verify against a published checksum
              </label>
              <input
                id="expected-digest"
                type="text"
                value={expected}
                onChange={(event) => setExpected(event.target.value)}
                placeholder="Paste the expected hash — a trailing filename is fine"
                spellCheck={false}
                className="h-11 w-full rounded-custom-sm border border-border-custom bg-bg px-3.5 font-mono text-xs text-text-custom focus:border-primary focus:outline-none focus:ring-[3px] focus:ring-primary/20"
              />

              {verification !== null && (
                <p
                  className={`mt-2 flex items-center gap-2 rounded-custom-sm p-3 text-sm font-medium ${
                    verification
                      ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
                      : "border border-red-200 bg-red-50 text-red-700"
                  }`}
                >
                  {verification ? (
                    <>
                      <Check size={15} aria-hidden="true" />
                      The checksums match.
                    </>
                  ) : (
                    <>
                      <X size={15} aria-hidden="true" />
                      They do not match. Check you are comparing the same algorithm —
                      a SHA-256 is 64 characters and an MD5 is 32.
                    </>
                  )}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      <p className="flex items-start gap-2 text-xs leading-relaxed text-text-2">
        <AlertTriangle size={13} className="mt-0.5 shrink-0" aria-hidden="true" />
        Hashing is not password storage. A password needs a deliberately slow algorithm
        such as Argon2 or bcrypt, with a salt stored alongside it.
      </p>
    </ToolShell>
  );
}

function FilePicker({
  file,
  onPick,
}: {
  file: File | null;
  onPick: (file: File | null) => void;
}) {
  const [isDragOver, setIsDragOver] = useState(false);

  return (
    <div
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(event) => {
        event.preventDefault();
        setIsDragOver(false);
        const dropped = event.dataTransfer.files?.[0];
        if (dropped) onPick(dropped);
      }}
    >
      <input
        id="hash-file"
        type="file"
        className="sr-only"
        onChange={(event) => {
          onPick(event.target.files?.[0] ?? null);
          event.target.value = "";
        }}
      />
      <label
        htmlFor="hash-file"
        className={`flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-custom-md border border-dashed px-4 py-8 text-center transition-colors ${
          isDragOver
            ? "bg-[var(--cat-surface)]"
            : "border-border-custom bg-surface hover:bg-bg"
        }`}
        style={isDragOver ? { borderColor: "var(--cat-accent)" } : undefined}
      >
        <Upload size={20} className="text-text-2" aria-hidden="true" />
        <span className="text-sm font-medium text-text-custom">
          {file ? file.name : "Drop a file here, or click to browse"}
        </span>
        <span className="text-xs text-text-2">
          {file
            ? formatBytes(file.size)
            : "Read in your browser — nothing is uploaded"}
        </span>
      </label>
    </div>
  );
}
