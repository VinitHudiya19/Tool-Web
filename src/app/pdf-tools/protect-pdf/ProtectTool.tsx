"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";

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
import { describePdfError } from "@/lib/pdf/pdfjs";

interface Permission {
  id: "allowPrinting" | "allowCopying" | "allowModifying" | "allowAnnotating";
  label: string;
  hint: string;
}

const PERMISSIONS: Permission[] = [
  { id: "allowPrinting", label: "Allow printing", hint: "Readers can print the document" },
  { id: "allowCopying", label: "Allow copying text", hint: "Text can be selected and copied" },
  { id: "allowModifying", label: "Allow editing", hint: "Content can be changed" },
  { id: "allowAnnotating", label: "Allow comments", hint: "Notes and highlights can be added" },
];

/** Length matters more than symbol variety, so it is weighted accordingly. */
function scorePassword(password: string): number {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return Math.min(score, 4);
}

const STRENGTH = [
  { label: "Very weak", bar: "w-1/12 bg-red-500", text: "text-red-600" },
  { label: "Weak", bar: "w-1/4 bg-red-500", text: "text-red-600" },
  { label: "Fair", bar: "w-1/2 bg-amber-500", text: "text-amber-600" },
  { label: "Good", bar: "w-3/4 bg-emerald-500", text: "text-emerald-600" },
  { label: "Strong", bar: "w-full bg-emerald-600", text: "text-emerald-700" },
];

export default function ProtectTool() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");

  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [permissions, setPermissions] = useState({
    allowPrinting: true,
    allowCopying: true,
    allowModifying: false,
    allowAnnotating: false,
  });

  const [isProtecting, setIsProtecting] = useState(false);
  const [result, setResult] = useState<Blob | null>(null);

  const strength = STRENGTH[scorePassword(password)];
  const mismatch = confirmation.length > 0 && password !== confirmation;
  const canSubmit = password.length > 0 && password === confirmation;

  const handleFile = (fileList: FileList) => {
    const candidate = fileList[0];
    if (!candidate) return;

    const problem = validatePdfFile(candidate);
    if (problem) {
      setError(problem);
      return;
    }

    setError("");
    setResult(null);
    setFile(candidate);
  };

  const handleProtect = async () => {
    if (!file || !canSubmit) return;

    setIsProtecting(true);
    setError("");

    try {
      const { encryptPDF } = await import("@pdfsmaller/pdf-encrypt");
      const buffer = await file.arrayBuffer();

      const encrypted = await encryptPDF(new Uint8Array(buffer), password, {
        algorithm: "AES-256",
        ...permissions,
      });

      setResult(new Blob([encrypted as BlobPart], { type: "application/pdf" }));
      setPassword("");
      setConfirmation("");
    } catch (cause) {
      const message = cause instanceof Error ? cause.message.toLowerCase() : "";
      setError(
        message.includes("encrypt")
          ? "This PDF is already password-protected. Remove the existing password with the Unlock PDF tool first."
          : describePdfError(cause, file.name),
      );
    } finally {
      setIsProtecting(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPassword("");
    setConfirmation("");
    setShowPassword(false);
    setResult(null);
    setError("");
    setPermissions({
      allowPrinting: true,
      allowCopying: true,
      allowModifying: false,
      allowAnnotating: false,
    });
  };

  if (isProtecting) {
    return (
      <ToolShell>
        <ProgressPanel
          title="Encrypting your PDF"
          status="Applying AES-256 encryption in your browser…"
        />
      </ToolShell>
    );
  }

  if (result && file) {
    return (
      <ToolShell>
        <ResultPanel
          title="Your PDF is protected"
          summary="It now requires your password to open. Test it before sending the file on — the password cannot be recovered."
          stats={[
            { label: "Encryption", value: "AES-256" },
            { label: "Size", value: formatBytes(result.size) },
          ]}
          onDownload={() => downloadBlob(result, addFileNameSuffix(file.name, "protected"))}
          downloadLabel="Download protected PDF"
          onReset={handleReset}
          resetLabel="Protect another PDF"
        />
      </ToolShell>
    );
  }

  return (
    <ToolShell>
      <ErrorBanner message={error} onDismiss={() => setError("")} />

      {!file ? (
        <Dropzone
          onFiles={handleFile}
          accept=".pdf,application/pdf"
          multiple={false}
          title="Drop your PDF here"
          hint={`One PDF · up to ${formatBytes(MAX_FILE_BYTES)}`}
        />
      ) : (
        <form
          className="space-y-6"
          onSubmit={(event) => {
            event.preventDefault();
            void handleProtect();
          }}
        >
          <FileSummary name={file.name} size={file.size} onChange={handleReset} />

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="new-password"
                className="mb-1.5 block text-sm font-medium text-text-2"
              >
                Password to open the file
              </label>
              <div className="relative">
                <input
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="new-password"
                  aria-describedby="password-strength"
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

              <div id="password-strength" aria-live="polite" className="mt-2">
                <div className="h-1 overflow-hidden rounded-full bg-border-custom">
                  <div
                    className={`h-full rounded-full transition-all ${password ? strength.bar : "w-0"}`}
                  />
                </div>
                <p className={`mt-1 text-xs font-medium ${password ? strength.text : "text-text-2"}`}>
                  {password
                    ? `Strength: ${strength.label}`
                    : "Four unrelated words make a strong, memorable password."}
                </p>
              </div>
            </div>

            <div>
              <label
                htmlFor="confirm-password"
                className="mb-1.5 block text-sm font-medium text-text-2"
              >
                Confirm password
              </label>
              <input
                id="confirm-password"
                type={showPassword ? "text" : "password"}
                value={confirmation}
                onChange={(event) => setConfirmation(event.target.value)}
                autoComplete="new-password"
                aria-invalid={mismatch}
                aria-describedby="confirm-help"
                className={`h-12 w-full rounded-custom-sm border bg-bg px-3.5 text-sm text-text-custom transition-colors focus:outline-none focus:ring-[3px] ${
                  mismatch
                    ? "border-red-500 focus:ring-red-500/20"
                    : "border-border-custom focus:border-primary focus:ring-primary/20"
                }`}
              />
              <p id="confirm-help" className="mt-2 text-xs" aria-live="polite">
                {mismatch ? (
                  <span className="font-medium text-red-600">
                    The two passwords do not match.
                  </span>
                ) : (
                  <span className="text-text-2">
                    There is no password recovery — store it somewhere safe.
                  </span>
                )}
              </p>
            </div>
          </div>

          <fieldset>
            <legend className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-2">
              What readers may do
            </legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {PERMISSIONS.map((permission) => (
                <label
                  key={permission.id}
                  className="flex cursor-pointer items-start gap-2.5 rounded-custom-sm border border-border-custom bg-bg p-3 transition-colors hover:border-pdf-accent-soft has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-primary"
                >
                  <input
                    type="checkbox"
                    checked={permissions[permission.id]}
                    onChange={(event) =>
                      setPermissions((previous) => ({
                        ...previous,
                        [permission.id]: event.target.checked,
                      }))
                    }
                    className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--pdf-accent)]"
                  />
                  <span>
                    <span className="block text-sm font-medium text-text-custom">
                      {permission.label}
                    </span>
                    <span className="block text-xs text-text-2">{permission.hint}</span>
                  </span>
                </label>
              ))}
            </div>
            <p className="mt-2 text-xs text-text-2">
              Permissions are honoured by mainstream readers but are not a hard barrier.
              The open password is the real protection.
            </p>
          </fieldset>

          <div className="border-t border-border-custom pt-4">
            <ActionButton
              type="submit"
              disabled={!canSubmit}
              icon={<Lock size={16} aria-hidden="true" />}
            >
              Protect PDF
            </ActionButton>
          </div>
        </form>
      )}
    </ToolShell>
  );
}
