/** On-page content for the typing test, kept apart from the interactive code. */

export const TYPING_STEPS = [
  {
    name: "Pick a mode",
    text: "Choose Time for a fixed-length test, Words for a set number of words, or Quotes to practise punctuation and capitalisation.",
  },
  {
    name: "Start typing",
    text: "Click or tap the text and type. There is no countdown — the timer starts on your first keystroke.",
  },
  {
    name: "Correct as you go",
    text: "Wrong letters turn red. Backspace fixes the current word, and backspacing past the start steps back to the previous one.",
  },
  {
    name: "Read your result",
    text: "You get WPM, accuracy, raw speed, consistency and a second-by-second speed chart. Press Tab for a fresh test.",
  },
];

export const TYPING_FAQS = [
  {
    id: "how-wpm",
    question: "How is WPM calculated?",
    answer:
      "WPM is correct characters divided by five, divided by minutes elapsed. A 'word' is standardised to five characters including the space, so the score does not depend on whether the text happens to use long or short words.",
  },
  {
    id: "net-vs-raw",
    question: "What is the difference between WPM and raw WPM?",
    answer:
      "WPM counts only the characters you typed correctly, so mistakes reduce it. Raw WPM counts every character you typed, right or wrong. A large gap between the two means errors are costing you more speed than they appear to.",
  },
  {
    id: "accuracy",
    question: "How is accuracy measured?",
    answer:
      "Accuracy is correct characters as a percentage of all characters you attempted. Typing 98 of 100 characters correctly gives 98%. Spaces count too — a space is correct only when the word before it was typed exactly.",
  },
  {
    id: "consistency",
    question: "What does the consistency score mean?",
    answer:
      "Consistency compares your speed each second against your average. A high score means you held a steady pace; a low one means bursts followed by pauses. Steady typing is usually more accurate and less tiring than sprinting.",
  },
  {
    id: "average-wpm",
    question: "What is a good typing speed?",
    answer:
      "Around 40 WPM is typical for an adult using a keyboard regularly. 60 to 70 WPM is a comfortable professional pace, and above 100 WPM is fast by any measure. Accuracy above 95% matters more than raw speed for real work.",
  },
  {
    id: "mobile",
    question: "Does this work on a phone or tablet?",
    answer:
      "Yes. Tap the text and your keyboard opens. The test reads the whole field as it changes rather than listening for individual key presses, so virtual keyboards, swipe typing and autocomplete all register correctly.",
  },
  {
    id: "backspace",
    question: "Can I go back and fix a previous word?",
    answer:
      "Yes. Pressing Backspace at the start of a word returns you to the end of the previous one so you can correct it. The score is recalculated from what you finally typed, not from your first attempt.",
  },
  {
    id: "shortcuts",
    question: "Are there keyboard shortcuts?",
    answer:
      "Tab starts a fresh test at any time, and Escape ends a run early so you can see your result. Both work whether or not the text has focus.",
  },
  {
    id: "storage",
    question: "Where are my personal bests stored?",
    answer:
      "In your browser's local storage, separately for each mode and setting, so a 15-second record is never compared against a 60-second one. Nothing is sent to a server, and clearing your browser data removes them.",
  },
  {
    id: "privacy",
    question: "Are my keystrokes recorded?",
    answer:
      "No. The whole test runs in your browser. Your keystrokes, results and records never leave your device, and no account is required.",
  },
  {
    id: "improve",
    question: "How do I actually get faster?",
    answer:
      "Slow down until you can type at 98% accuracy, then let speed build on its own. Practising errors trains them in. Short daily sessions of five to ten minutes beat occasional long ones.",
  },
  {
    id: "free",
    question: "Is the typing test free?",
    answer:
      "Yes, entirely — no account, no limit on attempts and no paid tier. Your results are calculated in the browser and are not uploaded, so nothing about your typing is recorded anywhere.",
  },
];

export const TYPING_BENEFITS = [
  {
    title: "Measures what matters",
    description:
      "WPM, accuracy, raw speed and consistency together, rather than a single speed figure that hides how many mistakes you made.",
  },
  {
    title: "Works on a phone",
    description:
      "Input is read from the field itself, so virtual keyboards, swipe typing and predictive text all register properly.",
  },
  {
    title: "Three practice modes",
    description:
      "Timed tests for a quick benchmark, fixed word counts for a fair comparison, and quotes for punctuation and capitals.",
  },
  {
    title: "See where you slowed down",
    description:
      "The per-second chart shows exactly where you sped up, stalled or made errors — far more useful than one average.",
  },
  {
    title: "Records that stay private",
    description:
      "Personal bests are kept per mode in your own browser. Nothing is uploaded and no account is needed.",
  },
];

export const TYPING_LIMITATIONS = [
  "Results vary with the keyboard you use. Comparing a laptop keyboard against a mechanical one is not a fair test of your speed.",
  "Personal bests live in one browser. Clearing site data, or switching browser or device, starts them from scratch.",
  "The word list is common English. Speeds on code, other languages or technical terms will be lower.",
  "A single short run is noisy — take several before treating a number as your real speed.",
];

export const TYPING_TAKEAWAYS = [
  "WPM = correct characters ÷ 5 ÷ minutes; a word is standardised to five characters.",
  "Raw WPM counts every keystroke, so the gap between it and WPM is the cost of your errors.",
  "About 40 WPM is average, 60–70 is a solid professional pace, and 100+ is fast.",
  "Accuracy above 95% is worth more than raw speed — practising mistakes trains them in.",
];

export const TYPING_EXAMPLES = [
  {
    title: "A clean run",
    input: "300 correct characters in 60 seconds, 2 wrong",
    output: "60 WPM · 99% accuracy",
    explanation:
      "300 ÷ 5 = 60 words in one minute. With only two wrong characters, WPM and raw WPM are almost identical.",
  },
  {
    title: "Fast but error-prone",
    input: "420 characters typed in 60 seconds, 60 wrong",
    output: "72 WPM · 86% accuracy · 84 raw WPM",
    explanation:
      "The 12-point gap between raw and net WPM is what the mistakes cost. Slowing down slightly would likely raise the net score.",
  },
  {
    title: "Uneven pacing",
    input: "50 WPM average, ranging between 20 and 90 each second",
    output: "50 WPM · 58% consistency",
    explanation:
      "The average looks fine, but the low consistency shows bursts and stalls — usually a sign of hunting for less familiar keys.",
  },
];
