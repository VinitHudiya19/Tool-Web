/** Word and quote sources for the typing test. */

/** The 200 most common English words — the standard corpus for speed tests. */
export const COMMON_WORDS: string[] = [
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "it",
  "for", "not", "on", "with", "he", "as", "you", "do", "at", "this",
  "but", "his", "by", "from", "they", "we", "say", "her", "she", "or",
  "an", "will", "my", "one", "all", "would", "there", "their", "what", "so",
  "up", "out", "if", "about", "who", "get", "which", "go", "me", "when",
  "make", "can", "like", "time", "no", "just", "him", "know", "take", "people",
  "into", "year", "your", "good", "some", "could", "them", "see", "other", "than",
  "then", "now", "look", "only", "come", "its", "over", "think", "also", "back",
  "after", "use", "two", "how", "our", "work", "first", "well", "way", "even",
  "new", "want", "because", "any", "these", "give", "day", "most", "us", "great",
  "between", "need", "large", "often", "hand", "high", "place", "hold", "turn", "help",
  "here", "why", "ask", "men", "change", "went", "light", "kind", "off", "house",
  "picture", "again", "animal", "point", "mother", "world", "near", "build", "self", "earth",
  "father", "head", "stand", "own", "page", "should", "country", "found", "answer", "school",
  "grow", "study", "still", "learn", "plant", "cover", "food", "sun", "four", "state",
  "keep", "eye", "never", "last", "let", "thought", "city", "tree", "cross", "farm",
  "hard", "start", "might", "story", "saw", "far", "sea", "draw", "left", "late",
  "run", "while", "press", "close", "night", "real", "life", "few", "north", "open",
  "seem", "together", "next", "white", "children", "begin", "got", "walk", "example", "ease",
  "paper", "group", "always", "music", "those", "both", "mark", "book", "letter", "until",
];

/** Adds the punctuation and capitalisation that word lists leave out. */
export const QUOTES: Record<QuoteLength, string[]> = {
  short: [
    "The only way to do great work is to love what you do.",
    "In the middle of every difficulty lies opportunity.",
    "It does not matter how slowly you go, as long as you do not stop.",
    "Life is what happens when you are busy making other plans.",
    "The future belongs to those who believe in the beauty of their dreams.",
    "Success is not final and failure is not fatal; it is the courage to continue that counts.",
    "Whether you think you can, or you think you cannot, you are right.",
    "Simplicity is the ultimate sophistication.",
  ],
  medium: [
    "The greatest glory in living lies not in never falling, but in rising every time we fall. The way to get started is to quit talking and begin doing.",
    "It is during our darkest moments that we must focus to see the light. The best time to plant a tree was twenty years ago; the second best time is now.",
    "Tell me and I forget, teach me and I remember, involve me and I learn. The secret of getting ahead is simply getting started.",
    "Programs must be written for people to read, and only incidentally for machines to execute. Any fool can write code that a computer understands.",
  ],
  long: [
    "Twenty years from now you will be more disappointed by the things that you did not do than by the ones you did do. So throw off the bowlines, sail away from the safe harbour, and catch the trade winds in your sails. Explore. Dream. Discover. The two most important days in your life are the day you are born and the day you find out why.",
    "I have not failed; I have simply found ten thousand ways that will not work. Our greatest weakness lies in giving up, and the most certain way to succeed is always to try just one more time. Many of life's failures are people who did not realise how close they were to success when they gave up.",
    "The people who are crazy enough to think they can change the world are the ones who do. Here is to the misfits, the rebels, the troublemakers, the round pegs in the square holes, the ones who see things differently. They are not fond of rules, and they have no respect for the status quo.",
  ],
};

export type QuoteLength = "short" | "medium" | "long";
export type TestMode = "time" | "words" | "quotes";

/** Enough words that a fast typist cannot run out during a timed test. */
const TIMED_WORD_BUFFER = 260;

/** Fisher-Yates — an unbiased shuffle, unlike sort() with a random comparator. */
function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/** Draws `count` words, reshuffling the pool rather than repeating in order. */
function drawWords(count: number): string[] {
  const drawn: string[] = [];
  while (drawn.length < count) {
    drawn.push(...shuffle(COMMON_WORDS));
  }
  return drawn.slice(0, count);
}

export interface TestSource {
  words: string[];
  /** Set when the text came from a quote, for attribution-free display. */
  isQuote: boolean;
}

export function generateTest(
  mode: TestMode,
  wordCount: number,
  quoteLength: QuoteLength,
): TestSource {
  if (mode === "quotes") {
    const pool = QUOTES[quoteLength];
    const quote = pool[Math.floor(Math.random() * pool.length)];
    return { words: quote.split(/\s+/), isQuote: true };
  }

  return {
    words: drawWords(mode === "time" ? TIMED_WORD_BUFFER : wordCount),
    isQuote: false,
  };
}
