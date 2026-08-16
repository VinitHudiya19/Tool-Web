/** Text statistics built on Unicode-correct segmentation. */

import {
  countGraphemes,
  countLines,
  toParagraphs,
  toSentences,
  toWords,
} from "./segment";

/** Words per minute for silent reading of general prose. */
export const READING_WPM = 238;
/** Words per minute for comfortable speech aloud. */
export const SPEAKING_WPM = 130;

export interface WordFrequency {
  word: string;
  count: number;
}

export interface TextStatistics {
  words: number;
  /** User-perceived characters, including spaces. */
  characters: number;
  charactersNoSpaces: number;
  /** UTF-16 code units — what a database column limit usually counts. */
  codeUnits: number;
  sentences: number;
  paragraphs: number;
  lines: number;
  readingSeconds: number;
  speakingSeconds: number;
  averageWordsPerSentence: number;
  longestSentenceWords: number;
  topWords: WordFrequency[];
}

/**
 * Common English words excluded from the frequency list.
 *
 * Without this the top of every list is "the", "and", "of", which says nothing
 * about the text.
 */
export const STOP_WORDS = new Set([
  "a", "about", "above", "after", "again", "all", "also", "am", "an", "and",
  "any", "are", "as", "at", "be", "because", "been", "before", "being",
  "below", "between", "both", "but", "by", "can", "could", "did", "do",
  "does", "doing", "down", "during", "each", "few", "for", "from", "further",
  "had", "has", "have", "having", "he", "her", "here", "hers", "herself",
  "him", "himself", "his", "how", "i", "if", "in", "into", "is", "it", "its",
  "itself", "just", "me", "more", "most", "my", "myself", "no", "nor", "not",
  "now", "of", "off", "on", "once", "only", "or", "other", "our", "ours",
  "ourselves", "out", "over", "own", "same", "she", "should", "so",
  "some", "such", "than", "that", "the", "their", "theirs", "them",
  "themselves", "then", "there", "these", "they", "this", "those", "through",
  "to", "too", "under", "until", "up", "very", "was", "we", "were", "what",
  "when", "where", "which", "while", "who", "whom", "why", "will", "with",
  "would", "you", "your", "yours", "yourself", "yourselves",
]);

const EMPTY: TextStatistics = {
  words: 0,
  characters: 0,
  charactersNoSpaces: 0,
  codeUnits: 0,
  sentences: 0,
  paragraphs: 0,
  lines: 0,
  readingSeconds: 0,
  speakingSeconds: 0,
  averageWordsPerSentence: 0,
  longestSentenceWords: 0,
  topWords: [],
};

/**
 * Normalises a word for frequency counting.
 *
 * Case-folds and strips surrounding punctuation while keeping letters from
 * every script — the old version stripped anything outside `a-z0-9`, which
 * turned "café" into "caf" and erased non-Latin text entirely.
 */
function normaliseWord(word: string): string {
  return word
    .toLocaleLowerCase()
    .replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, "");
}

export function analyseText(
  text: string,
  options: { locale?: string; topWordCount?: number } = {},
): TextStatistics {
  const { locale = "en", topWordCount = 10 } = options;

  if (!text || !text.trim()) {
    // Line count is still meaningful for whitespace-only input.
    return { ...EMPTY, codeUnits: text.length, lines: text ? countLines(text) : 0 };
  }

  const words = toWords(text, locale);
  const sentences = toSentences(text);

  const sentenceWordCounts = sentences.map(
    (sentence) => toWords(sentence, locale).length,
  );

  const frequency = new Map<string, number>();
  for (const word of words) {
    const key = normaliseWord(word);
    // Single letters are noise; "I" and "a" say nothing about the text.
    if (key.length < 2 || STOP_WORDS.has(key)) continue;
    frequency.set(key, (frequency.get(key) ?? 0) + 1);
  }

  const topWords = [...frequency.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, topWordCount)
    .map(([word, count]) => ({ word, count }));

  return {
    words: words.length,
    characters: countGraphemes(text),
    charactersNoSpaces: countGraphemes(text.replace(/\s/gu, "")),
    codeUnits: text.length,
    sentences: sentences.length,
    paragraphs: toParagraphs(text).length,
    lines: countLines(text),
    readingSeconds: Math.round((words.length / READING_WPM) * 60),
    speakingSeconds: Math.round((words.length / SPEAKING_WPM) * 60),
    averageWordsPerSentence:
      sentences.length > 0
        ? Math.round((words.length / sentences.length) * 10) / 10
        : 0,
    longestSentenceWords:
      sentenceWordCounts.length > 0 ? Math.max(...sentenceWordCounts) : 0,
    topWords,
  };
}

/** Renders a duration the way a reading-time badge would. */
export function formatDuration(totalSeconds: number): string {
  if (totalSeconds <= 0) return "—";
  if (totalSeconds < 60) return `${totalSeconds} sec`;

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (seconds === 0) return `${minutes} min`;
  return `${minutes} min ${seconds} sec`;
}
