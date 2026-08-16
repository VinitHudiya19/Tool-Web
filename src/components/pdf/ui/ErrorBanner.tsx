"use client";

import { AlertCircle, X } from "lucide-react";

/**
 * The single error presentation for all PDF tools.
 *
 * role="alert" means the message is announced as soon as it appears, so a
 * screen reader user is not left waiting for a result that never arrives.
 */
export default function ErrorBanner({
  message,
  onDismiss,
}: {
  message: string;
  onDismiss?: () => void;
}) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-custom-sm border border-red-200 bg-red-50 p-4"
    >
      <AlertCircle size={18} className="mt-px shrink-0 text-red-600" aria-hidden="true" />
      <p className="flex-grow text-sm font-medium leading-relaxed text-red-700">
        {message}
      </p>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss error"
          className="shrink-0 rounded p-0.5 text-red-500 transition-colors hover:text-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
