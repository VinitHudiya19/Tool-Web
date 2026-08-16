"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";

import {
  CodeOutput,
  EmptyState,
  Field,
  TextArea,
  TextInput,
  ToolShell,
} from "@/components/seo-tools/ui";
import { toScriptTag } from "@/lib/seo-tools/jsonLd";

interface Pair {
  id: string;
  question: string;
  answer: string;
}

const emptyPair = (): Pair => ({
  id: crypto.randomUUID(),
  question: "",
  answer: "",
});

export default function FaqSchemaTool() {
  const [pairs, setPairs] = useState<Pair[]>(() => [emptyPair(), emptyPair()]);

  const update = (id: string, patch: Partial<Pair>) =>
    setPairs((current) =>
      current.map((pair) => (pair.id === id ? { ...pair, ...patch } : pair)),
    );

  const remove = (id: string) =>
    setPairs((current) =>
      // Always leave one row so the form never becomes unusable.
      current.length > 1 ? current.filter((pair) => pair.id !== id) : current,
    );

  const complete = useMemo(
    () => pairs.filter((pair) => pair.question.trim() && pair.answer.trim()),
    [pairs],
  );

  const code = useMemo(() => {
    if (complete.length === 0) return "";

    // JSON.stringify escapes quotes, backslashes and newlines correctly — the
    // step hand-written FAQ markup usually gets wrong.
    return toScriptTag({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: complete.map((pair) => ({
        "@type": "Question",
        name: pair.question.trim(),
        acceptedAnswer: {
          "@type": "Answer",
          text: pair.answer.trim(),
        },
      })),
    });
  }, [complete]);

  const incomplete = pairs.length - complete.length;

  return (
    <ToolShell>
      <div className="space-y-4">
        {pairs.map((pair, index) => (
          <fieldset
            key={pair.id}
            className="rounded-custom-sm border border-border-custom bg-surface p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <legend className="text-xs font-semibold uppercase tracking-wider text-text-2">
                Question {index + 1}
              </legend>
              <button
                type="button"
                onClick={() => remove(pair.id)}
                disabled={pairs.length === 1}
                aria-label={`Remove question ${index + 1}`}
                className="rounded p-1.5 text-text-2 transition-colors hover:bg-red-50 hover:text-red-600 disabled:pointer-events-none disabled:opacity-30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
              >
                <Trash2 size={15} />
              </button>
            </div>

            <div className="space-y-3">
              <Field
                id={`question-${pair.id}`}
                label="Question"
                hint="Word it exactly as it appears on your page."
              >
                <TextInput
                  id={`question-${pair.id}`}
                  value={pair.question}
                  onChange={(value) => update(pair.id, { question: value })}
                  placeholder="How long does delivery take?"
                />
              </Field>

              <Field
                id={`answer-${pair.id}`}
                label="Answer"
                hint="Plain text. Quotes and symbols are escaped for you."
              >
                <TextArea
                  id={`answer-${pair.id}`}
                  value={pair.answer}
                  onChange={(value) => update(pair.id, { answer: value })}
                  placeholder="Orders placed before 3pm ship the same day and arrive within two working days."
                  rows={3}
                />
              </Field>
            </div>
          </fieldset>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setPairs((current) => [...current, emptyPair()])}
        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-custom-sm border border-dashed border-border-custom bg-bg text-sm font-medium text-text-2 transition-colors hover:text-text-custom focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary sm:w-auto sm:px-6"
      >
        <Plus size={15} aria-hidden="true" />
        Add another question
      </button>

      <div className="border-t border-border-custom pt-6">
        {code ? (
          <>
            <p aria-live="polite" className="mb-3 text-sm text-text-2">
              <strong className="font-semibold text-text-custom">
                {complete.length} question{complete.length === 1 ? "" : "s"}
              </strong>{" "}
              included.
              {incomplete > 0 &&
                ` ${incomplete} row${incomplete === 1 ? " is" : "s are"} incomplete and left out.`}
            </p>
            <CodeOutput
              code={code}
              fileName="faq-schema.html"
              label="FAQPage JSON-LD"
              language="html"
            />
          </>
        ) : (
          <EmptyState message="Fill in at least one question and its answer to generate the markup." />
        )}
      </div>
    </ToolShell>
  );
}
