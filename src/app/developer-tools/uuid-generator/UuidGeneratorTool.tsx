"use client";

import { useCallback, useMemo, useState } from "react";
import { RefreshCw } from "lucide-react";

import {
  ActionButton,
  CopyButton,
  DownloadButton,
  OptionGroup,
  ToolShell,
} from "@/components/dev/ui";
import { generateUuidV4, generateUuidV7, inspectUuid } from "@/lib/dev/hash";

type Version = "v4" | "v7";
type Format = "standard" | "uppercase" | "braces" | "compact";

const COUNTS = ["1", "10", "100", "1000"];

function applyFormat(uuid: string, format: Format): string {
  switch (format) {
    case "uppercase":
      return uuid.toUpperCase();
    case "braces":
      return `{${uuid}}`;
    case "compact":
      return uuid.replace(/-/g, "");
    default:
      return uuid;
  }
}

/** Produces a batch. Kept outside the component since it is not pure. */
function makeBatch(version: Version, count: string): string[] {
  const total = Number.parseInt(count, 10);
  const make = version === "v7" ? generateUuidV7 : generateUuidV4;
  return Array.from({ length: total }, make);
}

export default function UuidGeneratorTool() {
  const [version, setVersion] = useState<Version>("v4");
  const [format, setFormat] = useState<Format>("standard");
  const [count, setCount] = useState("10");
  const [inspecting, setInspecting] = useState("");

  // Held in state and replaced explicitly. Generating during render would be
  // impure, and generating in an effect would render twice on every change.
  const [uuids, setUuids] = useState(() => makeBatch("v4", "10"));

  const generate = useCallback(
    () => setUuids(makeBatch(version, count)),
    [version, count],
  );

  const changeVersion = (next: Version) => {
    setVersion(next);
    setUuids(makeBatch(next, count));
  };

  const changeCount = (next: string) => {
    setCount(next);
    setUuids(makeBatch(version, next));
  };

  const formatted = useMemo(
    () => uuids.map((uuid) => applyFormat(uuid, format)),
    [uuids, format],
  );

  const text = formatted.join("\n");
  const inspection = inspecting.trim() ? inspectUuid(inspecting) : null;

  return (
    <ToolShell>
      <div className="space-y-4">
        <OptionGroup<Version>
          legend="Version"
          value={version}
          onChange={changeVersion}
          options={[
            { id: "v4", label: "v4 — random", hint: "122 random bits. The usual choice." },
            {
              id: "v7",
              label: "v7 — sortable",
              hint: "Starts with a millisecond timestamp, so a batch sorts in creation order. Better as a database key.",
            },
          ]}
        />

        <div className="flex flex-wrap gap-4">
          <OptionGroup
            legend="How many"
            value={count}
            onChange={changeCount}
            options={COUNTS.map((value) => ({ id: value, label: value }))}
          />
          <OptionGroup<Format>
            legend="Format"
            value={format}
            onChange={setFormat}
            options={[
              { id: "standard", label: "Standard" },
              { id: "uppercase", label: "UPPERCASE" },
              { id: "braces", label: "{Braces}" },
              { id: "compact", label: "No hyphens" },
            ]}
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-border-custom pt-4 sm:flex-row">
        <ActionButton onClick={generate} icon={<RefreshCw size={15} aria-hidden="true" />}>
          Generate {count === "1" ? "a new one" : `${count} new`}
        </ActionButton>
        <CopyButton text={text} label={`Copy ${uuids.length === 1 ? "" : "all "}`.trim()} />
        <DownloadButton text={text} fileName="uuids.txt" />
      </div>

      <ul
        aria-live="polite"
        className="max-h-80 space-y-1 overflow-y-auto rounded-custom-sm border border-border-custom bg-surface p-3"
      >
        {formatted.map((uuid, index) => (
          <li
            key={`${uuid}-${index}`}
            className="font-mono text-xs text-text-custom"
          >
            {uuid}
          </li>
        ))}
      </ul>

      {version === "v7" && (
        <p className="text-xs text-text-2">
          These sort in creation order, which keeps database inserts at the end of the
          index. The trade-off is that each one reveals when it was made.
        </p>
      )}

      {/* Inspector */}
      <div className="border-t border-border-custom pt-4">
        <label
          htmlFor="inspect-uuid"
          className="mb-1.5 block text-sm font-medium text-text-2"
        >
          Inspect an existing UUID
        </label>
        <input
          id="inspect-uuid"
          type="text"
          value={inspecting}
          onChange={(event) => setInspecting(event.target.value)}
          placeholder="Paste any UUID to see its version and variant"
          spellCheck={false}
          className="h-11 w-full rounded-custom-sm border border-border-custom bg-bg px-3.5 font-mono text-xs text-text-custom focus:border-primary focus:outline-none focus:ring-[3px] focus:ring-primary/20"
        />

        {inspection && (
          <p
            className={`mt-2 rounded-custom-sm p-3 text-sm ${
              inspection.isValid
                ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {inspection.isValid ? (
              <>
                <strong className="font-semibold">Version {inspection.version}</strong>,{" "}
                {inspection.variant} variant.
                {inspection.version === 4 && " Entirely random."}
                {inspection.version === 7 && " Contains a creation timestamp."}
                {inspection.version === 1 && " Contains a timestamp and a MAC address."}
                {(inspection.version === 3 || inspection.version === 5) &&
                  " Derived from a name rather than generated at random."}
              </>
            ) : (
              "That is not a valid UUID. The expected shape is 8-4-4-4-12 hexadecimal characters."
            )}
          </p>
        )}
      </div>
    </ToolShell>
  );
}
