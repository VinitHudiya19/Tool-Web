"use client";

import { useState } from "react";
import { Eye, EyeOff, Loader2, ShieldCheck, Unlock } from "lucide-react";

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
import { isPasswordError, loadPdfJs } from "@/lib/pdf/pdfjs";

/** What kind of protection the uploaded file turned out to have. */
type Protection = "unknown" | "none" | "permissions-only" | "password";

export default function UnlockTool() {
  const [file, setFile] = useState<File | null>(null);
  const [protection, setProtection] = useState<Protection>("unknown");
  const [isInspecting, setIsInspecting] = useState(false);

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isUnlocking, setIsUnlocking] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Blob | null>(null);

  /**
   * Works out whether the file needs a password before asking for one.
   * pdf.js reports this reliably, so the user is never prompted needlessly.
   */
  const inspect = async (candidate: File): Promise<Protection> => {
    const pdfjs = await loadPdfJs();
    const buffer = await candidate.arrayBuffer();
    const task = pdfjs.getDocument({ data: buffer });

    try {
      const document = await task.promise;
      const permissions = await document.getPermissions();
      await task.destroy();
      // Permissions present means an owner password restricts what readers allow.
      return permissions === null ? "none" : "permissions-only";
    } catch (cause) {
      await task.destroy().catch(() => undefined);
      if (isPasswordError(cause)) return "password";
      throw cause;
    }
  };

  const handleFile = async (fileList: FileList) => {
    const candidate = fileList[0];
    if (!candidate) return;

    const problem = validatePdfFile(candidate);
    if (problem) {
      setError(problem);
      return;
    }

    setError("");
    setResult(null);
    setPassword("");
    setIsInspecting(true);

    try {
      const kind = await inspect(candidate);
      setProtection(kind);
      setFile(candidate);
    } catch {
      setError(`"${candidate.name}" is not a valid PDF, or the file is damaged.`);
      setFile(null);
      setProtection("unknown");
    } finally {
      setIsInspecting(false);
    }
  };

  const handleUnlock = async () => {
    if (!file) return;

    if (protection === "password" && !password) {
      setError("Enter the password used to open this PDF.");
      return;
    }

    setIsUnlocking(true);
    setError("");

    try {
      // Runs in the browser: the document is rebuilt from its decrypted
      // objects, so text and links survive and the file is never uploaded.
      const { unlockPdf } = await import("@/lib/pdf/localOps");
      const bytes = new Uint8Array(await file.arrayBuffer());

      const unlocked = await unlockPdf(bytes, password || undefined);

      setResult(new Blob([unlocked.bytes as BlobPart], { type: "application/pdf" }));
      // Do not keep the password in memory once it has served its purpose.
      setPassword("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unlocking failed.");
    } finally {
      setIsUnlocking(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setProtection("unknown");
    setPassword("");
    setShowPassword(false);
    setResult(null);
    setError("");
  };

  if (isUnlocking) {
    return (
      <ToolShell>
        <ProgressPanel
          title="Unlocking your PDF"
          status="Removing the encryption — text and quality are preserved…"
        />
      </ToolShell>
    );
  }

  if (result && file) {
    return (
      <ToolShell>
        <ResultPanel
          title="Your PDF is unlocked"
          summary="It now opens without a password, and printing and copying are allowed."
          stats={[{ label: "Size", value: formatBytes(result.size) }]}
          onDownload={() => downloadBlob(result, addFileNameSuffix(file.name, "unlocked"))}
          downloadLabel="Download unlocked PDF"
          onReset={handleReset}
          resetLabel="Unlock another PDF"
        />
      </ToolShell>
    );
  }

  return (
    <ToolShell>
      <ErrorBanner message={error} onDismiss={() => setError("")} />

      {!file ? (
        <>
          <Dropzone
            onFiles={handleFile}
            accept=".pdf,application/pdf"
            multiple={false}
            title="Drop your locked PDF here"
            hint={`One PDF · up to ${formatBytes(MAX_FILE_BYTES)}`}
            disabled={isInspecting}
          />
          {isInspecting && (
            <p className="flex items-center justify-center gap-2 text-sm text-text-2">
              <Loader2 size={14} className="animate-spin" aria-hidden="true" />
              Checking how this file is protected…
            </p>
          )}
        </>
      ) : (
        <form
          className="space-y-6"
          onSubmit={(event) => {
            event.preventDefault();
            void handleUnlock();
          }}
        >
          <FileSummary name={file.name} size={file.size} onChange={handleReset} />

          {protection === "none" && (
            <p className="flex items-start gap-2.5 rounded-custom-sm border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              <ShieldCheck size={16} className="mt-px shrink-0" aria-hidden="true" />
              This PDF is not protected — there is no password or restriction to remove.
              You can use it with any other tool as it is.
            </p>
          )}

          {protection === "permissions-only" && (
            <p className="flex items-start gap-2.5 rounded-custom-sm border border-border-custom bg-surface p-4 text-sm text-text-2">
              <ShieldCheck size={16} className="mt-px shrink-0 text-pdf-accent" aria-hidden="true" />
              This PDF opens freely but restricts printing, copying or editing. No password
              is needed — unlocking will lift those restrictions.
            </p>
          )}

          {protection === "password" && (
            <div>
              <label
                htmlFor="pdf-password"
                className="mb-1.5 block text-sm font-medium text-text-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="pdf-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="off"
                  aria-describedby="pdf-password-help"
                  className="h-12 w-full rounded-custom-sm border border-border-custom bg-bg px-3.5 pr-12 text-sm text-text-custom transition-colors focus:border-primary focus:outline-none focus:ring-[3px] focus:ring-primary/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((previous) => !previous)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-1 top-1/2 -translate-y-1/2 rounded p-2 text-text-2 transition-colors hover:text-text-custom focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <p id="pdf-password-help" className="mt-1.5 text-xs text-text-2">
                This is the password you normally type to open the document. It is used
                once to decrypt the file and is never stored.
              </p>
            </div>
          )}

          {protection !== "none" && (
            <div className="border-t border-border-custom pt-4">
              <ActionButton
                type="submit"
                disabled={protection === "password" && !password}
                icon={<Unlock size={16} aria-hidden="true" />}
              >
                Unlock PDF
              </ActionButton>
            </div>
          )}
        </form>
      )}
    </ToolShell>
  );
}
