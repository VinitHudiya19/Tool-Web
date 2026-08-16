"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

import {
  accuracy as accuracyOf,
  buildResult,
  countAll,
  wpm as wpmOf,
  type Sample,
  type TestResult,
} from "@/lib/typing/stats";
import { generateTest, type QuoteLength, type TestMode } from "@/lib/typing/words";
import {
  getPersonalBestServerSnapshot,
  getPersonalBestSnapshot,
  savePersonalBest,
  subscribeToPersonalBests,
} from "@/lib/typing/storage";

export type TestStatus = "idle" | "running" | "finished";

export interface TypingSettings {
  mode: TestMode;
  duration: number;
  wordCount: number;
  quoteLength: QuoteLength;
}

const SAMPLE_INTERVAL_MS = 1000;
const TICK_INTERVAL_MS = 100;

/**
 * The typing test state machine.
 *
 * Input is handled by processing the whole field value on every change rather
 * than by listening for individual key presses. That is what makes the test work
 * with virtual keyboards, autocomplete and IME composition on phones — the
 * previous keypress-based approach did not fire reliably on mobile.
 */
export function useTypingTest(settings: TypingSettings) {
  // The text is generated once per mount. The caller remounts this hook with a
  // new key when the mode changes, so no effect is needed to react to settings.
  const [words, setWords] = useState<string[]>(
    () =>
      generateTest(settings.mode, settings.wordCount, settings.quoteLength).words,
  );
  const [completed, setCompleted] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<TestStatus>("idle");

  const [elapsedMs, setElapsedMs] = useState(0);
  const [samples, setSamples] = useState<Sample[]>([]);
  const [result, setResult] = useState<TestResult | null>(null);

  const [isNewRecord, setIsNewRecord] = useState(false);

  const startedAtRef = useRef<number | null>(null);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sampleRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastSampleRef = useRef({ correct: 0, typed: 0, incorrect: 0 });

  // Interval callbacks and the finish routine read live values through refs, so
  // they never close over a stale render.
  const stateRef = useRef({ words, completed, input, settings });
  const samplesRef = useRef<Sample[]>(samples);

  useEffect(() => {
    stateRef.current = { words, completed, input, settings };
    samplesRef.current = samples;
  });

  const settingValue =
    settings.mode === "time"
      ? settings.duration
      : settings.mode === "words"
        ? settings.wordCount
        : settings.quoteLength;

  const clearTimers = useCallback(() => {
    if (tickRef.current) clearInterval(tickRef.current);
    if (sampleRef.current) clearInterval(sampleRef.current);
    tickRef.current = null;
    sampleRef.current = null;
  }, []);

  /** Loads a fresh text and returns the test to its starting state. */
  const reset = useCallback(
    (keepText = false) => {
      clearTimers();
      startedAtRef.current = null;
      lastSampleRef.current = { correct: 0, typed: 0, incorrect: 0 };

      setCompleted([]);
      setInput("");
      setElapsedMs(0);
      setSamples([]);
      setResult(null);
      setIsNewRecord(false);
      setStatus("idle");

      if (!keepText) {
        const { words: next } = generateTest(
          settings.mode,
          settings.wordCount,
          settings.quoteLength,
        );
        setWords(next);
      }
    },
    [clearTimers, settings.mode, settings.quoteLength, settings.wordCount],
  );

  const personalBest = useSyncExternalStore(
    subscribeToPersonalBests,
    () => getPersonalBestSnapshot(settings.mode, settingValue),
    getPersonalBestServerSnapshot,
  );

  useEffect(() => clearTimers, [clearTimers]);

  const finish = useCallback(
    (finalCompleted: string[], finalInput: string) => {
      clearTimers();

      const startedAt = startedAtRef.current;
      const duration = startedAt ? Date.now() - startedAt : 0;

      const complete = buildResult(
        stateRef.current.words,
        finalCompleted,
        finalInput,
        duration,
        samplesRef.current,
      );

      setResult(complete);
      setStatus("finished");

      const { mode, duration: seconds, wordCount, quoteLength } =
        stateRef.current.settings;
      const value =
        mode === "time" ? seconds : mode === "words" ? wordCount : quoteLength;

      // Runs shorter than a few seconds produce wild figures, so they are not
      // eligible to set a record.
      if (complete.wpm > 0 && duration > 3000) {
        // The store notifies subscribers, so personalBest updates on its own.
        if (savePersonalBest(mode, value, complete)) setIsNewRecord(true);
      }
    },
    [clearTimers],
  );

  const start = useCallback(() => {
    const now = Date.now();
    startedAtRef.current = now;
    setStatus("running");

    tickRef.current = setInterval(() => {
      const startedAt = startedAtRef.current;
      if (!startedAt) return;

      const elapsed = Date.now() - startedAt;
      setElapsedMs(elapsed);

      const { settings: live, words: liveWords, completed: liveCompleted, input: liveInput } =
        stateRef.current;

      if (live.mode === "time" && elapsed >= live.duration * 1000) {
        finish(liveCompleted, liveInput);
        return;
      }

      // Safety net: a very fast typist can exhaust a timed word buffer.
      if (live.mode !== "time" && liveCompleted.length >= liveWords.length) {
        finish(liveCompleted, liveInput);
      }
    }, TICK_INTERVAL_MS);

    sampleRef.current = setInterval(() => {
      const startedAt = startedAtRef.current;
      if (!startedAt) return;

      const elapsed = Date.now() - startedAt;
      const { words: liveWords, completed: liveCompleted, input: liveInput } =
        stateRef.current;

      const counts = countAll(liveWords, liveCompleted, liveInput);
      const previous = lastSampleRef.current;

      setSamples((current) => [
        ...current,
        {
          second: Math.round(elapsed / 1000),
          wpm: wpmOf(counts.correct, elapsed),
          raw: wpmOf(counts.typed, elapsed),
          errors: Math.max(0, counts.incorrect - previous.incorrect),
        },
      ]);

      lastSampleRef.current = counts;
    }, SAMPLE_INTERVAL_MS);
  }, [finish]);

  /**
   * Handles the whole field value, so pastes, autocomplete and virtual
   * keyboards that insert several characters at once all behave correctly.
   */
  const handleInput = useCallback(
    (value: string) => {
      if (status === "finished") return;
      if (status === "idle" && value.length > 0) start();

      // A leading space should not commit an empty word.
      if (!value.trim() && !value.includes(" ")) {
        setInput(value);
        return;
      }

      if (!value.includes(" ")) {
        setInput(value);
        return;
      }

      const segments = value.split(" ");
      const trailing = segments.pop() ?? "";
      const committed = segments.filter(
        (segment, index) => segment.length > 0 || index > 0,
      );

      if (committed.length === 0) {
        setInput(trailing);
        return;
      }

      setCompleted((current) => {
        const next = [...current, ...committed];
        const target = stateRef.current.words;

        if (
          stateRef.current.settings.mode !== "time" &&
          next.length >= target.length
        ) {
          // Finish on the last word rather than waiting for the next tick.
          queueMicrotask(() => finish(next.slice(0, target.length), ""));
          return next.slice(0, target.length);
        }

        return next;
      });

      setInput(trailing);
    },
    [finish, start, status],
  );

  /** Backspace at the start of a word steps back to the previous one. */
  const handleBackspaceAtStart = useCallback(() => {
    if (status !== "running") return false;

    let didStepBack = false;
    setCompleted((current) => {
      if (current.length === 0) return current;
      didStepBack = true;
      setInput(current[current.length - 1]);
      return current.slice(0, -1);
    });

    return didStepBack;
  }, [status]);

  const stop = useCallback(() => {
    if (status !== "running") return;
    finish(stateRef.current.completed, stateRef.current.input);
  }, [finish, status]);

  // Live figures for the stats bar.
  const live = useMemo(() => {
    const counts = countAll(words, completed, input);
    return {
      wpm: wpmOf(counts.correct, elapsedMs),
      raw: wpmOf(counts.typed, elapsedMs),
      accuracy: accuracyOf(counts),
    };
  }, [words, completed, input, elapsedMs]);

  const secondsLeft =
    settings.mode === "time"
      ? Math.max(0, settings.duration - Math.floor(elapsedMs / 1000))
      : null;

  const progress =
    settings.mode === "time"
      ? Math.min(1, elapsedMs / (settings.duration * 1000))
      : words.length === 0
        ? 0
        : Math.min(1, completed.length / words.length);

  return {
    words,
    completed,
    input,
    status,
    live,
    secondsLeft,
    progress,
    result,
    samples,
    personalBest,
    isNewRecord,
    handleInput,
    handleBackspaceAtStart,
    reset,
    stop,
  };
}
