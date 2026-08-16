export interface TextStats {
  words: number;
  charsWithSpaces: number;
  charsWithoutSpaces: number;
  sentences: number;
  paragraphs: number;
  lines: number;
  readingTimeSeconds: number;
  speakingTimeSeconds: number;
  topWords: Array<{ word: string; count: number }>;
}

export const STOP_WORDS = new Set([
  "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with",
  "by", "from", "is", "are", "was", "were", "be", "been", "being", "have", "has",
  "had", "do", "does", "did", "will", "would", "could", "should", "may", "might",
  "shall", "can", "i", "you", "he", "she", "it", "we", "they", "this", "that",
  "these", "those", "not", "as", "if", "so", "than", "then", "when", "where",
  "which", "who", "what", "how", "all", "any", "both", "each", "few", "more",
  "most", "other", "some", "such", "no", "nor", "only", "same", "too", "very",
  "just", "about", "up", "out", "its", "also", "into", "through"
]);

export function countText(text: string): TextStats {
  if (!text || text.trim() === "") {
    return {
      words: 0,
      charsWithSpaces: 0,
      charsWithoutSpaces: 0,
      sentences: 0,
      paragraphs: 0,
      lines: 0,
      readingTimeSeconds: 0,
      speakingTimeSeconds: 0,
      topWords: [],
    };
  }

  // Words: split by whitespace, filter empty strings
  const wordMatches = text.trim().match(/\S+/g) || [];
  const words = wordMatches.length;

  // Characters
  const charsWithSpaces = text.length;
  const charsWithoutSpaces = text.replace(/\s/g, "").length;

  // Sentences: split by . ! ? followed by space or end, filter empty
  const sentenceMatches = text
    .trim()
    .split(/[.!?]+/)
    .filter((s) => s.trim().length > 0);
  const sentences = sentenceMatches.length;

  // Paragraphs: split by one or more blank lines
  const paragraphMatches = text
    .trim()
    .split(/\n\s*\n/)
    .filter((p) => p.trim().length > 0);
  const paragraphs = paragraphMatches.length;

  // Lines: split by single newline
  const lines = text.split("\n").length;

  // Reading and speaking time
  const readingTimeSeconds = Math.ceil((words / 200) * 60);
  const speakingTimeSeconds = Math.ceil((words / 130) * 60);

  // Top words (excluding stop words)
  const wordFreq: Record<string, number> = {};
  wordMatches.forEach((word) => {
    const clean = word.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (clean.length > 1 && !STOP_WORDS.has(clean)) {
      wordFreq[clean] = (wordFreq[clean] || 0) + 1;
    }
  });

  const topWords = Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word, count]) => ({ word, count }));

  return {
    words,
    charsWithSpaces,
    charsWithoutSpaces,
    sentences,
    paragraphs,
    lines,
    readingTimeSeconds,
    speakingTimeSeconds,
    topWords,
  };
}
