/**
 * Typing statistics, derived rather than accumulated.
 *
 * The previous implementation incremented counters on every keystroke, which
 * drifted whenever a word was corrected or a backspace crossed a word boundary.
 * Everything here is a pure function of the typed history, so the numbers are
 * always internally consistent and the same input always gives the same result.
 */

export interface CharCounts {
  correct: number;
  incorrect: number;
  /** Every character the user actually produced, right or wrong. */
  typed: number;
}

/** Compares one typed word against its target. */
export function countWord(target: string, typed: string): CharCounts {
  let correct = 0;
  let incorrect = 0;

  const length = Math.max(target.length, typed.length);
  for (let i = 0; i < length; i++) {
    if (i >= typed.length) continue; // unfinished, not yet an error
    if (typed[i] === target[i]) correct++;
    else incorrect++;
  }

  return { correct, incorrect, typed: typed.length };
}

/**
 * Totals across every completed word plus the word in progress.
 *
 * A space is scored as one character, correct only when the word before it was
 * typed exactly — the same convention used by mainstream typing tests.
 */
export function countAll(
  targets: string[],
  completed: string[],
  current: string,
): CharCounts {
  const total: CharCounts = { correct: 0, incorrect: 0, typed: 0 };

  completed.forEach((typed, index) => {
    const target = targets[index] ?? "";
    const counts = countWord(target, typed);

    total.correct += counts.correct;
    total.incorrect += counts.incorrect;
    total.typed += counts.typed + 1; // + the space that committed the word

    if (typed === target) total.correct += 1;
    else total.incorrect += 1;
  });

  if (current.length > 0) {
    const counts = countWord(targets[completed.length] ?? "", current);
    total.correct += counts.correct;
    total.incorrect += counts.incorrect;
    total.typed += counts.typed;
  }

  return total;
}

/**
 * Words per minute, using the standard five-characters-per-word convention.
 *
 * The floor stops the first fraction of a second producing a meaningless
 * figure, while still being short enough that a genuinely quick run reports a
 * real number rather than zero.
 */
const MIN_ELAPSED_MS = 200;

export function wpm(characters: number, elapsedMs: number): number {
  if (elapsedMs < MIN_ELAPSED_MS) return 0;
  return Math.round(characters / 5 / (elapsedMs / 60000));
}

export function accuracy(counts: CharCounts): number {
  const attempted = counts.correct + counts.incorrect;
  if (attempted === 0) return 100;
  return Math.round((counts.correct / attempted) * 100);
}

export interface Sample {
  /** Seconds since the test started. */
  second: number;
  wpm: number;
  raw: number;
  /** Errors committed during this second, for the results chart. */
  errors: number;
}

/**
 * How steady the pace was, as a percentage.
 *
 * Derived from the coefficient of variation of the per-second WPM samples:
 * 100% would be a perfectly even pace, while bursts and pauses pull it down.
 */
export function consistency(samples: Sample[]): number {
  const speeds = samples.map((sample) => sample.wpm).filter((value) => value > 0);
  if (speeds.length < 2) return 100;

  const mean = speeds.reduce((sum, value) => sum + value, 0) / speeds.length;
  if (mean === 0) return 0;

  const variance =
    speeds.reduce((sum, value) => sum + (value - mean) ** 2, 0) / speeds.length;
  const deviation = Math.sqrt(variance);

  return Math.max(0, Math.min(100, Math.round((1 - deviation / mean) * 100)));
}

export interface TestResult {
  wpm: number;
  rawWpm: number;
  accuracy: number;
  consistency: number;
  correctChars: number;
  incorrectChars: number;
  correctWords: number;
  incorrectWords: number;
  durationMs: number;
  samples: Sample[];
}

export function buildResult(
  targets: string[],
  completed: string[],
  current: string,
  durationMs: number,
  samples: Sample[],
): TestResult {
  const counts = countAll(targets, completed, current);

  const correctWords = completed.filter(
    (typed, index) => typed === targets[index],
  ).length;

  return {
    wpm: wpm(counts.correct, durationMs),
    rawWpm: wpm(counts.typed, durationMs),
    accuracy: accuracy(counts),
    consistency: consistency(samples),
    correctChars: counts.correct,
    incorrectChars: counts.incorrect,
    correctWords,
    incorrectWords: completed.length - correctWords,
    durationMs,
    samples,
  };
}
