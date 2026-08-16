import type { SeoToolConfig } from "@/lib/seo-tools/types";

/**
 * Content for the text tool pages.
 *
 * Shares the SeoToolConfig shape with the other categories so one page shell
 * and one set of schema builders serve them all.
 */
export const TEXT_TOOLS: Record<string, SeoToolConfig> = {
  "word-counter": {
    slug: "word-counter",
    name: "Word Counter",
    title: "Word Counter — Count Words & Reading Time",
    description:
      "Count words, sentences and paragraphs as you type, with reading time and the words you lean on most. Runs in your browser.",
    h1: "Word Counter",
    intro:
      "A word counter reports how many words, sentences and paragraphs a piece of writing contains, and estimates how long it takes to read aloud or in silence. This one counts sentences using the Unicode text rules, so an abbreviation like “Dr.” or a price like 9.99 does not get mistaken for the end of a sentence. Everything is measured in your browser as you type.",
    iconName: "AlignLeft",
    applicationCategory: "UtilitiesApplication",
    features: [
      "Live word, sentence and paragraph counts",
      "Reading and speaking time estimates",
      "Most-used words with stop words filtered out",
      "Average and longest sentence length",
      "Works with any language, including Chinese and Japanese",
    ],
    steps: [
      {
        name: "Add your text",
        text: "Type directly into the box, paste from the clipboard, or drop in a .txt file. Counting starts immediately — there is no button to press.",
      },
      {
        name: "Read the counts",
        text: "Words, characters, sentences and paragraphs update on every keystroke, alongside estimated reading and speaking times.",
      },
      {
        name: "Check the sentence length",
        text: "Average words per sentence and the longest sentence tell you whether the writing will feel heavy. Anything past roughly 25 words tends to lose readers.",
      },
      {
        name: "Look at your repeated words",
        text: "The most-used list filters out “the”, “and” and similar, leaving the words you actually lean on. Copy the summary when you are done.",
      },
    ],
    examples: [
      {
        title: "An abbreviation is not a sentence end",
        input: "Dr. Smith arrived. He paid 9.99 for it.",
        output: "2 sentences, 8 words",
        explanation:
          "Splitting on every full stop would report four sentences here — one for “Dr.”, one for the decimal in 9.99. Sentence detection skips abbreviations and numbers.",
      },
      {
        title: "A blog post",
        input: "1,400 words of draft copy",
        output: "≈ 6 min read, ≈ 11 min spoken",
        explanation:
          "Reading time uses 238 words per minute, the average for adults reading prose silently. Speaking time uses 130, which is a comfortable presentation pace.",
      },
      {
        title: "Text without spaces",
        input: "你好世界你好",
        output: "3 words",
        explanation:
          "Chinese and Japanese do not separate words with spaces. Splitting on whitespace would call this one word; the Unicode word rules segment it properly.",
      },
    ],
    benefits: [
      {
        title: "Counts that hold up",
        description:
          "Sentence detection ignores abbreviations, decimals, initials and URLs, so the number matches what you would get counting by hand.",
      },
      {
        title: "Reading time you can quote",
        description:
          "Estimates come from measured adult reading and speaking rates rather than a round number, and both are shown so you can pick the relevant one.",
      },
      {
        title: "Repetition made visible",
        description:
          "The most-used words list strips out filler, which makes an overused phrase obvious in a way that reading the draft again rarely does.",
      },
      {
        title: "Nothing is uploaded",
        description:
          "Counting happens in the page. An unpublished manuscript or a confidential report never leaves your machine.",
      },
    ],
    limitations: [
      "Reading time is an average. Dense technical writing reads slower and light fiction faster, sometimes by half.",
      "Sentence detection uses a list of common abbreviations. An unusual one followed by a capital letter may still be read as a sentence break.",
      "Only plain text is read. Pasting from a word processor keeps the words but drops formatting, footnotes and comments.",
      "Very large documents past a few hundred thousand words will make typing feel sluggish, since every keystroke recounts.",
    ],
    keyTakeaways: [
      "Words, sentences, paragraphs, reading time and speaking time update as you type.",
      "Sentence counting skips abbreviations, decimals and initials instead of splitting on every full stop.",
      "Average and longest sentence length flag writing that has become hard to follow.",
      "Chinese, Japanese and other scripts without spaces are segmented correctly.",
      "Everything runs in your browser, so nothing is uploaded.",
    ],
    faqs: [
      {
        id: "how-counted",
        question: "How is a word counted?",
        answer:
          "By the Unicode word rules, which treat a hyphenated compound like “well-known” as one word and a contraction like “don’t” as one word, while excluding stray punctuation. It matches what a word processor reports for ordinary prose.",
      },
      {
        id: "sentences",
        question: "Why does my sentence count differ from other tools?",
        answer:
          "Most tools split on every full stop, so “Dr. Smith paid 9.99” counts as three sentences. Abbreviations, decimals, initials and web addresses are skipped here, which usually gives a lower and more accurate number.",
      },
      {
        id: "reading-time",
        question: "Where does the reading time come from?",
        answer:
          "238 words per minute, the mean for adults reading English prose silently, from a meta-analysis of reading rate studies. Speaking time uses 130 words per minute, roughly the pace of an unhurried presentation.",
      },
      {
        id: "paragraphs",
        question: "What counts as a paragraph?",
        answer:
          "A block of text separated from the next by a blank line. A single line break inside a block does not start a new paragraph, which matches how word processors and Markdown both behave.",
      },
      {
        id: "stop-words",
        question: "Why are common words missing from the most-used list?",
        answer:
          "Words like “the”, “and” and “of” top the list in every text ever written, so they are filtered out. What remains is the vocabulary specific to your writing, which is where repetition actually shows.",
      },
      {
        id: "other-languages",
        question: "Does it work with languages other than English?",
        answer:
          "Yes. Accented words are counted and listed intact, and scripts without spaces between words — Chinese, Japanese, Thai — are segmented by the Unicode rules rather than being treated as one long word.",
      },
      {
        id: "sentence-length",
        question: "What is a good average sentence length?",
        answer:
          "Between 15 and 20 words suits most general writing. Past about 25 the reader starts having to hold too much in mind at once, which is why the longest sentence is shown separately — one runaway sentence can undo an otherwise readable page.",
      },
      {
        id: "files",
        question: "Can I load a file instead of pasting?",
        answer:
          "Yes, plain .txt files can be dropped straight in. Word documents and PDFs are not read, because their text is wrapped in formatting this tool deliberately does not parse.",
      },
      {
        id: "privacy",
        question: "Is my writing sent anywhere?",
        answer:
          "No. The text stays in the page and is never transmitted, stored or logged. Closing the tab discards it, which is what you want for an unpublished draft or anything under embargo.",
      },
    ],
    relatedSlugs: ["character-counter", "case-converter"],
  },

  "character-counter": {
    slug: "character-counter",
    name: "Character Counter",
    title: "Character Counter — Live Limits for Posts & SMS",
    description:
      "Count characters against Twitter, Instagram, SMS and meta tag limits. Counts emoji as one character, the way readers see them.",
    h1: "Character Counter",
    intro:
      "A character counter measures text against a length limit — a social post, a meta description, a text message. The catch is that a single emoji is two units to JavaScript and eleven for a family emoji, so most counters report a number no reader would recognise. This one counts what people actually see, and shows the underlying units separately for the systems that bill by them.",
    iconName: "Hash",
    applicationCategory: "UtilitiesApplication",
    features: [
      "Emoji and accented characters counted as one",
      "Presets for Twitter, Instagram, LinkedIn, SMS and meta tags",
      "Real SMS segmentation with GSM-7 and UCS-2 detection",
      "Live over-limit warning with remaining count",
      "Custom limits for any platform",
    ],
    steps: [
      {
        name: "Pick where the text is going",
        text: "Choose a preset — a tweet, an Instagram caption, an SMS, a meta description — or set your own limit. Each preset explains what the platform actually truncates.",
      },
      {
        name: "Type or paste your text",
        text: "The count updates on every keystroke, with the remaining allowance and a bar that turns amber as you approach the limit and red once you pass it.",
      },
      {
        name: "Check how emoji are counted",
        text: "The visible character count sits alongside the UTF-16 code unit count. They differ whenever emoji or accents are present, and the difference is what trips up other counters.",
      },
      {
        name: "For a text message, read the segments",
        text: "One non-GSM character switches the whole message to UCS-2 and cuts the limit from 160 to 70. The segment count shows how many messages will actually be billed.",
      },
    ],
    examples: [
      {
        title: "One emoji, eleven characters",
        input: "Great news 👨‍👩‍👧‍👦 from the team",
        output: "29 visible characters, 40 code units",
        explanation:
          "The family emoji is a single glyph built from four people joined by invisible characters. Counters using string length report 40 and tell you the post is longer than it looks.",
      },
      {
        title: "An emoji quadruples the SMS bill",
        input: "A 140-character message ending in 👍",
        output: "UCS-2, 3 segments",
        explanation:
          "Without the emoji this is one 160-character message. The emoji forces UCS-2, which caps segments at 67 characters, so the same text becomes three billed messages.",
      },
      {
        title: "A meta description",
        input: "A 178-character summary",
        output: "18 over the limit",
        explanation:
          "Google truncates descriptions around 160 characters. The counter shows how far past you are so you can cut precisely rather than guessing.",
      },
    ],
    benefits: [
      {
        title: "The number readers would count",
        description:
          "Emoji, flags, skin tone variants and accented letters each count as one character, because that is what appears on screen.",
      },
      {
        title: "Both numbers when they differ",
        description:
          "Database columns and older APIs count UTF-16 units, so that figure is shown too — useful when a field rejects text that looked short enough.",
      },
      {
        title: "Honest SMS costs",
        description:
          "Detects whether your message fits the GSM alphabet and shows the real segment count, including which character forced the expensive encoding.",
      },
      {
        title: "Limits with context",
        description:
          "Each preset explains what the platform truncates rather than just capping you — Instagram cuts captions at 125 in the feed even though 2,200 are allowed.",
      },
    ],
    limitations: [
      "Twitter weights some characters differently under its own counting rules, so its editor may show a slightly different number for text mixing scripts.",
      "Platform limits change without notice. The presets reflect published limits at the time of writing.",
      "SMS segmentation assumes a standard GSM 03.38 gateway. Some carriers and shortcode providers apply their own rules.",
      "Counting visible characters is the right default, but a system that truncates by bytes will cut a long string earlier than the count suggests.",
    ],
    keyTakeaways: [
      "Emoji count as one character here and as two or more almost everywhere else.",
      "Visible characters and UTF-16 code units are both shown, because different systems count differently.",
      "One non-GSM character drops the SMS limit from 160 to 70 and multiplies the cost.",
      "Presets cover Twitter, Instagram, LinkedIn, SMS, meta tags and custom limits.",
      "Text is never uploaded — the count is computed in the page.",
    ],
    faqs: [
      {
        id: "emoji",
        question: "Why do other counters give a bigger number for emoji?",
        answer:
          "They measure the string's length in UTF-16 units. A thumbs-up is two of those, a flag four, and a family emoji eleven — even though each is one glyph. Counting grapheme clusters gives the number a reader would arrive at.",
      },
      {
        id: "which-number",
        question: "Which count should I trust for a form field?",
        answer:
          "If the limit is enforced by a browser's maxlength or an older database column, the UTF-16 figure is what gets checked. For anything showing text to people — a post, a headline, a description — the visible count is the one that matters.",
      },
      {
        id: "sms-limit",
        question: "Why did my text message become three messages?",
        answer:
          "SMS uses a 7-bit alphabet that holds 160 characters. Anything outside it — an emoji, a curly quote, an em dash — switches the message to 16-bit encoding, where a single message holds only 70 characters and each further part holds 67.",
      },
      {
        id: "curly-quotes",
        question: "Can punctuation really change the SMS cost?",
        answer:
          "Yes, and it is the most common cause. A word processor turns a straight apostrophe into a curly one automatically, and that single character is outside the GSM alphabet, so a 160-character message silently becomes three parts.",
      },
      {
        id: "spaces",
        question: "Are spaces and line breaks counted?",
        answer:
          "Yes. Every platform counts them, and a line break can count as two characters in some systems. The count without spaces is shown separately for the rare cases where you need it.",
      },
      {
        id: "twitter",
        question: "Does 280 characters mean 280 letters on Twitter?",
        answer:
          "Not quite. Every link is counted as 23 characters regardless of its real length, and characters from some scripts count double under Twitter's own weighting. For ordinary Latin text the visible count matches.",
      },
      {
        id: "meta-description",
        question: "What length should a meta description be?",
        answer:
          "Around 150 to 160 characters. Google measures the rendered width in pixels rather than counting characters, so a description full of wide letters can be cut earlier — treat 160 as a ceiling, not a target.",
      },
      {
        id: "custom-limit",
        question: "Can I set my own limit?",
        answer:
          "Yes. Choose the custom preset and enter any number, which is useful for a content management system, a product field or an internal style rule that no standard preset covers.",
      },
      {
        id: "privacy",
        question: "Does my draft post get sent to a server?",
        answer:
          "No. The text is counted in your browser and never transmitted. An embargoed announcement or an unsent message stays entirely on your machine.",
      },
    ],
    relatedSlugs: ["word-counter", "case-converter"],
  },

  "case-converter": {
    slug: "case-converter",
    name: "Case Converter",
    title: "Case Converter — camelCase, snake_case & More",
    description:
      "Convert text between UPPERCASE, Title Case, camelCase, snake_case and kebab-case. Splits existing camelCase properly and keeps accents.",
    h1: "Case Converter",
    intro:
      "A case converter rewrites text in a different capitalisation style — sentence case for prose, camelCase or snake_case for code. Two things usually go wrong elsewhere: converting getUserName to snake_case gives getusername because the existing word boundaries are ignored, and any accented or non-Latin character is silently deleted. Both are handled correctly here.",
    iconName: "Type",
    applicationCategory: "UtilitiesApplication",
    features: [
      "Ten styles including camelCase, snake_case and CONSTANT_CASE",
      "Splits existing camelCase and acronyms into words",
      "Keeps accented and non-Latin characters intact",
      "Title case that leaves iPhone and NASA alone",
      "Converts a pasted list line by line",
    ],
    steps: [
      {
        name: "Add your text",
        text: "Type, paste, or drop in a .txt file. A list of names can be pasted whole — each line is converted separately rather than being run together.",
      },
      {
        name: "Choose a style",
        text: "Pick from prose styles like Title Case and Sentence case, or identifier styles like camelCase, snake_case, kebab-case and CONSTANT_CASE. Each button previews what it produces.",
      },
      {
        name: "Check the result",
        text: "The output appears beside your input. Existing word boundaries are respected, so getUserName becomes get_user_name rather than getusername.",
      },
      {
        name: "Copy or download",
        text: "Copy the result to the clipboard, download it as a text file, or swap it back into the input to chain another conversion.",
      },
    ],
    examples: [
      {
        title: "An existing identifier",
        input: "XMLHttpRequest",
        output: "xml_http_request",
        explanation:
          "The acronym and the word after it are separate. Converters that only split on spaces and underscores return xmlhttprequest, which is the single most common failure of this kind of tool.",
      },
      {
        title: "Accented text",
        input: "café münchen",
        output: "caféMünchen",
        explanation:
          "Stripping anything outside a-z would produce cafMnchen. Word splitting uses Unicode letter properties, so accents and non-Latin scripts survive the round trip.",
      },
      {
        title: "A headline",
        input: "the lord of the rings",
        output: "The Lord of the Rings",
        explanation:
          "Articles and short prepositions stay lowercase unless they open or close the title, which is what both Chicago and AP style require.",
      },
    ],
    benefits: [
      {
        title: "Understands existing casing",
        description:
          "camelCase, PascalCase and acronym boundaries are detected, so converting between identifier styles works in both directions instead of only from spaced text.",
      },
      {
        title: "No silent data loss",
        description:
          "Accented letters, Cyrillic, Greek and CJK all pass through. Nothing is deleted for being outside the ASCII range.",
      },
      {
        title: "Deliberate capitals respected",
        description:
          "Title case leaves iPhone, macOS and NASA as they are rather than flattening them to Iphone, Macos and Nasa.",
      },
      {
        title: "Lists stay lists",
        description:
          "Identifier styles convert one line at a time, so a pasted column of field names comes back as a column, not a single run-on identifier.",
      },
    ],
    limitations: [
      "Sentence case cannot restore proper nouns it has lowercased. Names already in lowercase stay that way, since no tool can tell a name from a common word without context.",
      "Title case follows English minor-word conventions. Other languages capitalise differently and are only partly served.",
      "Splitting an all-caps identifier like PARSEHTML is ambiguous — with no case boundary to read, it becomes one word.",
      "Emoji and symbols are preserved but ignored when deciding word boundaries.",
    ],
    keyTakeaways: [
      "getUserName converts to get_user_name, not getusername.",
      "Accented and non-Latin characters survive every conversion.",
      "Title case keeps minor words down and leaves deliberate capitals like iPhone alone.",
      "Sentence case repairs all-caps text while preserving genuine acronyms.",
      "Conversion happens in your browser, so nothing is uploaded.",
    ],
    faqs: [
      {
        id: "camel-split",
        question: "Why do other converters turn getUserName into getusername?",
        answer:
          "They split only on spaces, hyphens and underscores, so an identifier with no separators looks like one word. Splitting also on the lowercase-to-uppercase boundary recovers the words, giving get_user_name.",
      },
      {
        id: "acronyms",
        question: "How are acronyms handled in identifiers?",
        answer:
          "A run of capitals followed by a capitalised word is split between them, so XMLHttpRequest becomes xml_http_request rather than x_m_l_http_request. An acronym at the end, like parseHTML, stays whole.",
      },
      {
        id: "accents",
        question: "Will accented characters be removed?",
        answer:
          "No. Word boundaries are found using Unicode letter properties instead of an a-to-z range, so café, naïve and Müller convert intact. Cyrillic, Greek, Arabic and CJK are preserved the same way.",
      },
      {
        id: "title-case",
        question: "Why are some words left lowercase in Title Case?",
        answer:
          "Articles, short conjunctions and short prepositions stay down in English titles unless they are the first or last word — which is why it is “The Lord of the Rings” and not “The Lord Of The Rings”.",
      },
      {
        id: "iphone",
        question: "Does Title Case ruin words like iPhone?",
        answer:
          "No. A word with a capital anywhere after the first letter, or one in all capitals, is treated as deliberately cased and left alone. iPhone, macOS, NASA and McDonald all survive.",
      },
      {
        id: "sentence-case",
        question: "How does Sentence case decide where sentences start?",
        answer:
          "It uses the same boundary detection as the word counter, so a full stop inside “Dr.”, “e.g.” or a price like 9.99 does not start a new sentence. Each real sentence gets its opening letter capitalised.",
      },
      {
        id: "all-caps",
        question: "Can it fix text typed with caps lock on?",
        answer:
          "Yes. Sentence case detects that most of the text is uppercase and treats it as shouting, lowering everything before recapitalising each sentence. Short acronyms in otherwise normal text are still preserved.",
      },
      {
        id: "lists",
        question: "What happens if I paste a list of names?",
        answer:
          "Identifier styles convert each line on its own, so twenty field names come back as twenty snake_case names. Prose styles read the whole text at once, since sentence detection needs the surrounding context.",
      },
      {
        id: "privacy",
        question: "Is the text I convert uploaded anywhere?",
        answer:
          "No. Every conversion is a string operation performed in the page. Internal field names or an unreleased product description never leave your browser.",
      },
    ],
    relatedSlugs: ["word-counter", "character-counter"],
  },
};

export function getTextTool(slug: string): SeoToolConfig {
  const tool = TEXT_TOOLS[slug];
  if (!tool) {
    throw new Error(
      `Unknown text tool "${slug}". Add it to TEXT_TOOLS in src/lib/text/tools.config.ts.`,
    );
  }
  return tool;
}

export function getRelatedTextTools(slug: string): SeoToolConfig[] {
  return getTextTool(slug)
    .relatedSlugs.map((related) => TEXT_TOOLS[related])
    .filter((tool): tool is SeoToolConfig => Boolean(tool));
}
