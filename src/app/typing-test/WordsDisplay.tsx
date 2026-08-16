"use client";

import { memo, useEffect, useRef } from "react";

interface WordsDisplayProps {
  words: string[];
  completed: string[];
  input: string;
  isBlurred: boolean;
  isRunning: boolean;
}

/**
 * The scrolling text the user types against.
 *
 * The caret is an inline element placed between characters rather than an
 * absolutely positioned bar measured from the DOM. That means it stays correct
 * through line wrapping, window resizes, browser zoom and font scaling, none of
 * which the previous measured caret handled.
 */
function WordsDisplay({
  words,
  completed,
  input,
  isBlurred,
  isRunning,
}: WordsDisplayProps) {
  const activeWordRef = useRef<HTMLSpanElement>(null);
  const activeIndex = completed.length;

  // Keep the line being typed in view without moving the page itself.
  useEffect(() => {
    activeWordRef.current?.scrollIntoView({ block: "nearest", behavior: "auto" });
  }, [activeIndex]);

  // Only a window around the cursor is rendered; a timed test holds 260 words
  // and rendering every character of them costs far more than it shows.
  const from = Math.max(0, activeIndex - 30);
  const to = Math.min(words.length, activeIndex + 90);

  return (
    <div
      aria-hidden="true"
      className={`h-[8.5rem] overflow-hidden font-mono text-[1.35rem] leading-[2.125rem] tracking-wide transition-[filter,opacity] duration-200 sm:h-[10.5rem] sm:text-[1.6rem] sm:leading-[3.5rem] ${
        isBlurred ? "pointer-events-none select-none blur-[5px] opacity-50" : ""
      }`}
    >
      {words.slice(from, to).map((word, offset) => {
        const index = from + offset;

        if (index < activeIndex) {
          return (
            <CompletedWord key={index} target={word} typed={completed[index] ?? ""} />
          );
        }

        if (index === activeIndex) {
          return (
            <ActiveWord
              key={index}
              ref={activeWordRef}
              target={word}
              typed={input}
              isRunning={isRunning}
            />
          );
        }

        return (
          <span key={index} className="mr-[0.6em] inline-block text-text-2/45">
            {word}
          </span>
        );
      })}
    </div>
  );
}

/** A word already committed — every character is settled right or wrong. */
const CompletedWord = memo(function CompletedWord({
  target,
  typed,
}: {
  target: string;
  typed: string;
}) {
  const isWrong = typed !== target;

  return (
    <span
      className={`mr-[0.6em] inline-block ${
        isWrong ? "underline decoration-red-500 decoration-2 underline-offset-4" : ""
      }`}
    >
      {target.split("").map((char, index) => (
        <span
          key={index}
          className={
            index >= typed.length
              ? "text-text-2/40"
              : typed[index] === char
                ? "text-text-custom"
                : "text-red-500"
          }
        >
          {char}
        </span>
      ))}
      {/* Anything typed past the end of the word */}
      {typed.length > target.length && (
        <span className="text-red-400/80">{typed.slice(target.length)}</span>
      )}
    </span>
  );
});

const ActiveWord = memo(function ActiveWord({
  ref,
  target,
  typed,
  isRunning,
}: {
  ref: React.Ref<HTMLSpanElement>;
  target: string;
  typed: string;
  isRunning: boolean;
}) {
  const overflow = typed.slice(target.length);

  return (
    <span ref={ref} className="mr-[0.6em] inline-block">
      {target.split("").map((char, index) => (
        <span key={index} className="relative">
          {index === typed.length && <Caret isRunning={isRunning} />}
          <span
            className={
              index >= typed.length
                ? "text-text-2/45"
                : typed[index] === char
                  ? "text-text-custom"
                  : "text-red-500"
            }
          >
            {char}
          </span>
        </span>
      ))}

      {overflow.split("").map((char, index) => (
        <span key={`extra-${index}`} className="relative text-red-400/80">
          {index === overflow.length - 1 && null}
          {char}
        </span>
      ))}

      {/* Caret sits after the last character once the word is fully typed */}
      {typed.length >= target.length && (
        <span className="relative">
          <Caret isRunning={isRunning} />
        </span>
      )}
    </span>
  );
});

function Caret({ isRunning }: { isRunning: boolean }) {
  return (
    <span
      className={`absolute -left-[1px] top-[0.1em] inline-block h-[1.25em] w-[2px] rounded-full bg-primary ${
        isRunning ? "" : "animate-pulse"
      }`}
    />
  );
}

export default memo(WordsDisplay);
