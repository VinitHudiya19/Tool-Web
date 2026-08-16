"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { AlertTriangle, Info, MessageSquare } from "lucide-react";

import { ErrorBanner, StatCard, TextInput, ToolShell } from "@/components/text/ui";
import { analyseText } from "@/lib/text/stats";
import { segmentSms } from "@/lib/text/sms";
import { truncateGraphemes } from "@/lib/text/segment";

interface Preset {
  id: string;
  name: string;
  limit: number;
  note: string;
}

/** Limits as published at the time of writing; the note explains the catch. */
const PRESETS: Preset[] = [
  {
    id: "twitter-post",
    name: "X / Twitter post",
    limit: 280,
    note: "Every link counts as 23 characters no matter how long it is.",
  },
  {
    id: "instagram-caption",
    name: "Instagram caption",
    limit: 2200,
    note: "The feed cuts the caption at 125 characters, so lead with the hook.",
  },
  {
    id: "linkedin-post",
    name: "LinkedIn post",
    limit: 3000,
    note: "Truncated at about 140 characters in the feed behind a “see more”.",
  },
  {
    id: "meta-description",
    name: "Meta description",
    limit: 160,
    note: "Google measures pixel width, so wide letters get cut before 160.",
  },
  {
    id: "meta-title",
    name: "Page title",
    limit: 60,
    note: "Titles past roughly 60 characters are truncated in search results.",
  },
  {
    id: "sms",
    name: "SMS",
    limit: 160,
    note: "One emoji or curly quote drops the real limit to 70. See below.",
  },
  {
    id: "custom",
    name: "Custom",
    limit: 500,
    note: "Set any limit for a CMS field or an internal style rule.",
  },
];

export default function CharacterCounterTool() {
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [presetId, setPresetId] = useState("twitter-post");
  const [customLimit, setCustomLimit] = useState(500);

  const deferredText = useDeferredValue(text);
  const stats = useMemo(() => analyseText(deferredText), [deferredText]);
  const sms = useMemo(() => segmentSms(deferredText), [deferredText]);

  const preset = PRESETS.find((entry) => entry.id === presetId) ?? PRESETS[0];
  const limit = preset.id === "custom" ? customLimit : preset.limit;

  const count = stats.characters;
  const remaining = limit - count;
  const percent = limit > 0 ? Math.min((count / limit) * 100, 100) : 0;
  const isOver = limit > 0 && count > limit;

  // Emoji and accents are the reason the two numbers disagree.
  const unitsDiffer = stats.codeUnits !== stats.characters;

  const barColour = isOver
    ? "#DC2626"
    : percent >= 90
      ? "#D97706"
      : "var(--cat-accent)";

  return (
    <ToolShell>
      <ErrorBanner message={error} onDismiss={() => setError("")} />

      <fieldset>
        <legend className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-2">
          Where is this going?
        </legend>
        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map((entry) => (
            <button
              key={entry.id}
              type="button"
              onClick={() => setPresetId(entry.id)}
              aria-pressed={presetId === entry.id}
              className={`h-9 rounded-custom-sm px-3.5 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${
                presetId === entry.id
                  ? "text-white"
                  : "border border-border-custom bg-bg text-text-2 hover:text-text-custom"
              }`}
              style={
                presetId === entry.id ? { background: "var(--cat-accent)" } : undefined
              }
            >
              {entry.name}
            </button>
          ))}
        </div>

        {preset.id === "custom" && (
          <div className="mt-3">
            <label
              htmlFor="custom-limit"
              className="mb-1.5 block text-sm font-medium text-text-2"
            >
              Character limit
            </label>
            <input
              id="custom-limit"
              type="number"
              min={1}
              value={customLimit}
              onChange={(event) =>
                setCustomLimit(Math.max(1, Number(event.target.value) || 1))
              }
              className="h-11 w-32 rounded-custom-sm border border-border-custom bg-bg px-3.5 text-sm text-text-custom focus:border-primary focus:outline-none focus:ring-[3px] focus:ring-primary/20"
            />
          </div>
        )}

        <p className="mt-2 flex items-start gap-1.5 text-xs leading-relaxed text-text-2">
          <Info size={13} className="mt-0.5 shrink-0" aria-hidden="true" />
          {preset.note}
        </p>
      </fieldset>

      <TextInput
        value={text}
        onChange={setText}
        onError={setError}
        label="Your text"
        placeholder="Type or paste the text you need to fit."
        rows={8}
      />

      {/* Progress against the limit */}
      <div aria-live="polite">
        <div className="mb-1.5 flex items-baseline justify-between gap-3">
          <span className="text-2xl font-bold tabular-nums text-text-custom">
            {count.toLocaleString()}
            <span className="text-base font-medium text-text-2"> / {limit.toLocaleString()}</span>
          </span>
          <span
            className={`text-sm font-semibold tabular-nums ${
              isOver ? "text-red-600" : "text-text-2"
            }`}
          >
            {isOver
              ? `${Math.abs(remaining).toLocaleString()} over`
              : `${remaining.toLocaleString()} left`}
          </span>
        </div>

        <div className="h-2.5 overflow-hidden rounded-full bg-surface">
          <div
            className="h-full rounded-full transition-[width] duration-150"
            style={{ width: `${percent}%`, background: barColour }}
          />
        </div>

        {isOver && (
          <details className="mt-2">
            <summary className="cursor-pointer text-xs font-semibold text-red-600">
              Show the text trimmed to {limit.toLocaleString()} characters
            </summary>
            {/* Trimmed by grapheme, so an emoji is never cut in half */}
            <p className="mt-2 whitespace-pre-wrap rounded-custom-sm border border-border-custom bg-surface p-3 text-sm text-text-custom">
              {truncateGraphemes(deferredText, limit)}
            </p>
          </details>
        )}
      </div>

      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Characters" value={stats.characters} hint="What a reader sees" emphasis />
        <StatCard label="No spaces" value={stats.charactersNoSpaces} />
        <StatCard label="Words" value={stats.words} />
        <StatCard
          label="Code units"
          value={stats.codeUnits}
          hint={unitsDiffer ? "What a database counts" : "Same as characters here"}
        />
      </dl>

      {unitsDiffer && (
        <p className="flex items-start gap-2 rounded-custom-sm border border-amber-200 bg-amber-50 p-3 text-xs leading-relaxed text-amber-800">
          <AlertTriangle size={14} className="mt-px shrink-0" aria-hidden="true" />
          <span>
            This text contains emoji or accented characters, so the two counts differ.
            Readers see <strong>{stats.characters.toLocaleString()}</strong> characters;
            a database column or an older API counting UTF-16 units sees{" "}
            <strong>{stats.codeUnits.toLocaleString()}</strong>. Most other counters
            report the larger number.
          </span>
        </p>
      )}

      {/* SMS is where the encoding actually costs money */}
      {(preset.id === "sms" || sms.encoding === "UCS-2") && deferredText.length > 0 && (
        <section className="rounded-custom-md border border-border-custom p-4">
          <h2 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-text-2">
            <MessageSquare size={14} aria-hidden="true" />
            How this sends as a text message
          </h2>

          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <StatCard label="Encoding" value={sms.encoding} />
            <StatCard
              label="Messages"
              value={sms.segments}
              hint={sms.segments > 1 ? "Billed separately" : "Single message"}
              emphasis={sms.segments > 1}
            />
            <StatCard label="Used" value={`${sms.used} / ${sms.capacity}`} />
          </dl>

          {sms.encoding === "UCS-2" && (
            <p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-text-2">
              <AlertTriangle
                size={13}
                className="mt-0.5 shrink-0 text-amber-600"
                aria-hidden="true"
              />
              <span>
                {sms.forcedBy.length > 0 && (
                  <>
                    <code className="rounded bg-surface px-1 py-0.5 font-mono">
                      {sms.forcedBy.join(" ")}
                    </code>{" "}
                    {sms.forcedBy.length === 1 ? "is" : "are"} outside the GSM alphabet,
                    so{" "}
                  </>
                )}
                the message switched to 16-bit encoding. That cuts a single message from
                160 characters to 70, and each further part from 153 to 67. Replacing a
                curly quote with a straight one is often enough to switch back.
              </span>
            </p>
          )}
        </section>
      )}
    </ToolShell>
  );
}
