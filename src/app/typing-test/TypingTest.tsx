"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Keyboard, RotateCcw } from "lucide-react";

import type { QuoteLength, TestMode } from "@/lib/typing/words";
import ResultsPanel from "./ResultsPanel";
import WordsDisplay from "./WordsDisplay";
import { useTypingTest, type TypingSettings } from "./useTypingTest";

const DURATIONS = [15, 30, 60, 120];
const WORD_COUNTS = [10, 25, 50, 100];
const QUOTE_LENGTHS: QuoteLength[] = ["short", "medium", "long"];

const MODES: { id: TestMode; label: string }[] = [
  { id: "time", label: "Time" },
  { id: "words", label: "Words" },
  { id: "quotes", label: "Quotes" },
];

export default function TypingTest() {
  const [settings, setSettings] = useState<TypingSettings>({
    mode: "time",
    duration: 30,
    wordCount: 25,
    quoteLength: "medium",
  });

  const settingValue =
    settings.mode === "time"
      ? settings.duration
      : settings.mode === "words"
        ? settings.wordCount
        : settings.quoteLength;

  return (
    <div className="rounded-custom-md border border-border-custom bg-bg p-4 shadow-custom-sm sm:p-6">
      <ModeBar settings={settings} onChange={setSettings} />
      {/* Remounting on a settings change resets the session cleanly, so no
          effect has to watch the settings and tear state down by hand. */}
      <TypingSession key={`${settings.mode}-${settingValue}`} settings={settings} />
    </div>
  );
}

function TypingSession({ settings }: { settings: TypingSettings }) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const {
    words,
    completed,
    input,
    status,
    live,
    secondsLeft,
    progress,
    result,
    personalBest,
    isNewRecord,
    handleInput,
    handleBackspaceAtStart,
    reset,
    stop,
  } = useTypingTest(settings);

  /**
   * Focuses the field and forces the caret to the end.
   *
   * Tapping the middle of the text would otherwise drop the caret mid-word, and
   * the next keystroke would be inserted there instead of appended.
   */
  const focusInput = useCallback(() => {
    const field = inputRef.current;
    if (!field) return;

    field.focus();
    const end = field.value.length;
    field.setSelectionRange(end, end);
  }, []);

  // Restart shortcut, and Escape to abandon a run. Bound to the window so it
  // works whether or not the hidden field currently holds focus.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Tab") {
        event.preventDefault();
        reset();
        // Focus has to be restored explicitly since Tab was suppressed.
        requestAnimationFrame(focusInput);
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        if (status === "running") stop();
        else reset();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [focusInput, reset, status, stop]);

  const modeLabel =
    settings.mode === "time"
      ? `${settings.duration} seconds`
      : settings.mode === "words"
        ? `${settings.wordCount} words`
        : `${settings.quoteLength} quote`;

  const isFinished = status === "finished";
  const showPrompt = !isFocused && !isFinished;

  return (
    <>
      {isFinished && result ? (
        <ResultsPanel
          result={result}
          personalBest={personalBest}
          isNewRecord={isNewRecord}
          modeLabel={modeLabel}
          onRestart={() => {
            reset();
            requestAnimationFrame(focusInput);
          }}
          onRepeat={() => {
            reset(true);
            requestAnimationFrame(focusInput);
          }}
        />
      ) : (
        <>
          {/* Live figures */}
          <div className="mb-4 flex items-center justify-between gap-4">
            <div className="flex items-baseline gap-1.5">
              <span
                aria-live="polite"
                aria-label={
                  settings.mode === "time"
                    ? `${secondsLeft} seconds remaining`
                    : `${completed.length} of ${words.length} words typed`
                }
                className="text-3xl font-bold tabular-nums text-primary"
              >
                {settings.mode === "time"
                  ? secondsLeft
                  : `${completed.length}/${words.length}`}
              </span>
              <span className="text-xs font-medium uppercase tracking-wider text-text-2">
                {settings.mode === "time" ? "sec left" : "words"}
              </span>
            </div>

            <div className="flex gap-5 text-right">
              <LiveStat label="WPM" value={live.wpm} />
              <LiveStat label="Accuracy" value={`${live.accuracy}%`} />
            </div>
          </div>

          {/* Progress */}
          <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress * 100)}
            aria-label="Test progress"
            className="mb-5 h-1 overflow-hidden rounded-full bg-border-custom"
          >
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-150"
              style={{ width: `${progress * 100}%` }}
            />
          </div>

          {/* Typing surface. The textarea covers the words so a tap anywhere
              opens the keyboard on a phone; it is transparent rather than
              hidden because off-screen fields do not reliably receive input
              from mobile keyboards. */}
          {/* No preventDefault here: suppressing the default pointer action
              stops iOS Safari from opening the on-screen keyboard. The textarea
              covers this area, so a tap focuses it natively. */}
          <div className="relative cursor-text" onPointerDown={focusInput}>
            <WordsDisplay
              words={words}
              completed={completed}
              input={input}
              isBlurred={showPrompt}
              isRunning={status === "running"}
            />

            <label htmlFor="typing-input" className="sr-only">
              Type the words shown above
            </label>
            <textarea
              id="typing-input"
              ref={inputRef}
              value={input}
              onChange={(event) => handleInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Backspace" && input.length === 0) {
                  if (handleBackspaceAtStart()) event.preventDefault();
                }
              }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              // Keeps the caret at the end if the browser placed it elsewhere.
              onSelect={(event) => {
                const field = event.currentTarget;
                const end = field.value.length;
                if (field.selectionStart !== end || field.selectionEnd !== end) {
                  field.setSelectionRange(end, end);
                }
              }}
              // Pasting the text would report a speed nobody typed.
              onPaste={(event) => event.preventDefault()}
              onDrop={(event) => event.preventDefault()}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              // enterKeyHint keeps the on-screen keyboard from offering a
              // newline, which would otherwise break the word flow.
              enterKeyHint="done"
              rows={1}
              aria-describedby="typing-help"
              className="absolute inset-0 h-full w-full resize-none border-0 bg-transparent p-0 text-transparent caret-transparent outline-none"
            />

            {showPrompt && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <span className="inline-flex items-center gap-2 rounded-full border border-border-custom bg-bg px-4 py-2 text-sm font-medium text-text-2 shadow-custom-sm">
                  <Keyboard size={15} aria-hidden="true" />
                  Tap or click here to start typing
                </span>
              </div>
            )}
          </div>

          <div className="mt-5 flex flex-col items-center gap-3 border-t border-border-custom pt-4 sm:flex-row sm:justify-between">
            <p id="typing-help" className="text-xs text-text-2">
              The timer starts on your first keystroke.{" "}
              <span className="hidden sm:inline">
                Press <Kbd>Tab</Kbd> for a new test, <Kbd>Esc</Kbd> to stop.
              </span>
            </p>

            <button
              type="button"
              onClick={() => {
                reset();
                requestAnimationFrame(focusInput);
              }}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-custom-sm border border-border-custom bg-bg px-4 text-sm font-medium text-text-2 transition-colors hover:border-primary hover:text-text-custom focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
            >
              <RotateCcw size={14} aria-hidden="true" />
              Restart
            </button>
          </div>
        </>
      )}
    </>
  );
}

/** Mode and setting selection. Lives outside the session so changing a setting
    remounts the session rather than mutating it mid-run. */
function ModeBar({
  settings,
  onChange,
}: {
  settings: TypingSettings;
  onChange: React.Dispatch<React.SetStateAction<TypingSettings>>;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 border-b border-border-custom pb-5 sm:flex-row sm:items-center sm:justify-between">
      <div role="group" aria-label="Test type" className="flex flex-wrap gap-1.5">
        {MODES.map((mode) => (
          <Chip
            key={mode.id}
            isActive={settings.mode === mode.id}
            onClick={() => onChange((s) => ({ ...s, mode: mode.id }))}
          >
            {mode.label}
          </Chip>
        ))}
      </div>

      <div
        role="group"
        aria-label={
          settings.mode === "time"
            ? "Test duration"
            : settings.mode === "words"
              ? "Word count"
              : "Quote length"
        }
        className="flex flex-wrap gap-1.5"
      >
        {settings.mode === "time" &&
          DURATIONS.map((value) => (
            <Chip
              key={value}
              isActive={settings.duration === value}
              onClick={() => onChange((s) => ({ ...s, duration: value }))}
            >
              {value}s
            </Chip>
          ))}

        {settings.mode === "words" &&
          WORD_COUNTS.map((value) => (
            <Chip
              key={value}
              isActive={settings.wordCount === value}
              onClick={() => onChange((s) => ({ ...s, wordCount: value }))}
            >
              {value}
            </Chip>
          ))}

        {settings.mode === "quotes" &&
          QUOTE_LENGTHS.map((value) => (
            <Chip
              key={value}
              isActive={settings.quoteLength === value}
              onClick={() => onChange((s) => ({ ...s, quoteLength: value }))}
            >
              {value}
            </Chip>
          ))}
      </div>
    </div>
  );
}

function Chip({
  children,
  isActive,
  onClick,
}: {
  children: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      className={`h-9 rounded-custom-sm px-3.5 text-sm font-medium capitalize transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 ${
        isActive
          ? "bg-primary text-white"
          : "bg-surface text-text-2 hover:text-text-custom"
      }`}
    >
      {children}
    </button>
  );
}

function LiveStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <div className="text-xl font-bold tabular-nums text-text-custom">{value}</div>
      <div className="text-[10px] font-semibold uppercase tracking-wider text-text-2">
        {label}
      </div>
    </div>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="rounded border border-border-custom bg-surface px-1.5 py-0.5 font-mono text-[10px] font-semibold text-text-2">
      {children}
    </kbd>
  );
}
