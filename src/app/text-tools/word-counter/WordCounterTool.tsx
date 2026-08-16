"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { BookOpen, Mic } from "lucide-react";

import { CopyButton, ErrorBanner, StatCard, TextInput, ToolShell } from "@/components/text/ui";
import { analyseText, formatDuration } from "@/lib/text/stats";

export default function WordCounterTool() {
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  // Keeps typing responsive on a long document: the textarea updates
  // immediately while the counts catch up a frame later.
  const deferredText = useDeferredValue(text);
  const stats = useMemo(() => analyseText(deferredText), [deferredText]);

  const summary = [
    `Words: ${stats.words.toLocaleString()}`,
    `Characters: ${stats.characters.toLocaleString()}`,
    `Sentences: ${stats.sentences.toLocaleString()}`,
    `Paragraphs: ${stats.paragraphs.toLocaleString()}`,
    `Reading time: ${formatDuration(stats.readingSeconds)}`,
    `Speaking time: ${formatDuration(stats.speakingSeconds)}`,
  ].join("\n");

  const busiest = stats.topWords[0]?.count ?? 1;

  return (
    <ToolShell>
      <ErrorBanner message={error} onDismiss={() => setError("")} />

      <TextInput
        value={text}
        onChange={setText}
        onError={setError}
        label="Your text"
        placeholder="Type or paste your text here. Counting starts immediately."
        rows={12}
      />

      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard label="Words" value={stats.words} emphasis />
        <StatCard label="Characters" value={stats.characters} hint="Including spaces" />
        <StatCard label="No spaces" value={stats.charactersNoSpaces} />
        <StatCard label="Sentences" value={stats.sentences} />
        <StatCard label="Paragraphs" value={stats.paragraphs} />
        <StatCard label="Lines" value={stats.lines} />
      </dl>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex items-center gap-3 rounded-custom-md border border-border-custom p-4">
          <BookOpen size={20} className="shrink-0 text-text-2" aria-hidden="true" />
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-text-2">
              Reading time
            </p>
            <p className="text-lg font-bold tabular-nums text-text-custom">
              {formatDuration(stats.readingSeconds)}
            </p>
            <p className="text-[11px] text-text-2">Silent reading, 238 words a minute</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-custom-md border border-border-custom p-4">
          <Mic size={20} className="shrink-0 text-text-2" aria-hidden="true" />
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-text-2">
              Speaking time
            </p>
            <p className="text-lg font-bold tabular-nums text-text-custom">
              {formatDuration(stats.speakingSeconds)}
            </p>
            <p className="text-[11px] text-text-2">Read aloud, 130 words a minute</p>
          </div>
        </div>
      </div>

      {/* Readability signals, shown only once there is enough text to judge */}
      {stats.sentences > 1 && (
        <div className="grid gap-3 sm:grid-cols-2">
          <StatCard
            label="Average sentence"
            value={`${stats.averageWordsPerSentence} words`}
            hint={
              stats.averageWordsPerSentence > 25
                ? "Long. Readers lose the thread past about 25 words."
                : stats.averageWordsPerSentence < 8
                  ? "Short and punchy."
                  : "Comfortable for most readers."
            }
          />
          <StatCard
            label="Longest sentence"
            value={`${stats.longestSentenceWords} words`}
            hint={
              stats.longestSentenceWords > 40
                ? "One sentence this long can undo an otherwise readable page."
                : "Nothing runaway."
            }
          />
        </div>
      )}

      {stats.topWords.length > 0 && (
        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-2">
            Words you lean on
          </h2>
          <ul className="space-y-1.5">
            {stats.topWords.map((entry) => (
              <li key={entry.word} className="flex items-center gap-3">
                <span className="w-32 shrink-0 truncate text-sm text-text-custom">
                  {entry.word}
                </span>
                {/* Bar length is relative to the most frequent word */}
                <span className="h-2 flex-grow overflow-hidden rounded-full bg-surface">
                  <span
                    className="block h-full rounded-full"
                    style={{
                      width: `${(entry.count / busiest) * 100}%`,
                      background: "var(--cat-accent)",
                    }}
                  />
                </span>
                <span className="w-8 shrink-0 text-right text-xs tabular-nums text-text-2">
                  {entry.count}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-text-2">
            Common words such as “the” and “and” are filtered out.
          </p>
        </section>
      )}

      {stats.words > 0 && (
        <div className="border-t border-border-custom pt-4">
          <CopyButton text={summary} label="Copy summary" />
        </div>
      )}
    </ToolShell>
  );
}
