"use client";

import { useState } from "react";
import { ExternalLink, Mail } from "lucide-react";

import { SITE } from "@/lib/site.config";

const TOPICS = [
  { value: "Bug report", hint: "Something gave a wrong result or would not work" },
  { value: "Tool request", hint: "A tool you would like us to build" },
  { value: "Privacy question", hint: "How your data is handled" },
  { value: "Advertising", hint: "Ad placement and sponsorship" },
  { value: "Something else", hint: "" },
];

/**
 * Composes a pre-filled email and hands it to the visitor's mail client.
 *
 * The previous version faked a submission with a timeout and always showed
 * "Message sent" — nothing was ever delivered. Rather than claim a delivery we
 * cannot perform without a mail backend, this opens a real, addressed draft and
 * shows the address in full so it can be copied instead.
 */
export default function ContactForm() {
  const [topic, setTopic] = useState(TOPICS[0].value);
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);

  const subject = `[${SITE.name}] ${topic}`;
  const mailtoHref = `mailto:${SITE.contactEmail}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(message)}`;

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(SITE.contactEmail);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can be blocked; the address is visible on screen anyway.
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-custom-md border border-border-custom bg-surface p-5">
        <h2 className="mb-1 flex items-center gap-2 text-base font-semibold text-text-custom">
          <Mail size={17} className="text-primary" aria-hidden="true" />
          Email us directly
        </h2>
        <p className="mb-3 text-sm text-text-2">
          The quickest route. We reply within {SITE.responseTimeDays}.
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <a
            href={`mailto:${SITE.contactEmail}`}
            className="text-base font-semibold text-primary underline underline-offset-2 transition-colors hover:text-primary-h"
          >
            {SITE.contactEmail}
          </a>
          <button
            type="button"
            onClick={copyAddress}
            className="rounded-custom-sm border border-border-custom bg-bg px-2.5 py-1 text-xs font-medium text-text-2 transition-colors hover:text-text-custom focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>

      <form
        className="space-y-5 rounded-custom-md border border-border-custom bg-bg p-5"
        onSubmit={(event) => {
          event.preventDefault();
          window.location.href = mailtoHref;
        }}
      >
        <div>
          <h2 className="text-base font-semibold text-text-custom">
            Or draft it here
          </h2>
          <p className="mt-1 text-sm text-text-2">
            Fill this in and we will open a pre-addressed message in your email
            app. Nothing is sent until you send it yourself.
          </p>
        </div>

        <div>
          <label
            htmlFor="contact-topic"
            className="mb-1.5 block text-sm font-medium text-text-2"
          >
            What is it about?
          </label>
          <select
            id="contact-topic"
            value={topic}
            onChange={(event) => setTopic(event.target.value)}
            className="h-12 w-full rounded-custom-sm border border-border-custom bg-bg px-3 text-sm text-text-custom transition-colors focus:border-primary focus:outline-none focus:ring-[3px] focus:ring-primary/20"
          >
            {TOPICS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.value}
                {option.hint ? ` — ${option.hint}` : ""}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="contact-message"
            className="mb-1.5 block text-sm font-medium text-text-2"
          >
            Your message
          </label>
          <textarea
            id="contact-message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            rows={6}
            placeholder="If you are reporting a problem, tell us which tool, what you did and what happened. That is usually enough for us to reproduce it."
            aria-describedby="contact-message-hint"
            className="w-full resize-y rounded-custom-sm border border-border-custom bg-bg p-3 text-sm leading-relaxed text-text-custom transition-colors placeholder:text-text-2 focus:border-primary focus:outline-none focus:ring-[3px] focus:ring-primary/20"
          />
          <p id="contact-message-hint" className="mt-1.5 text-xs text-text-2">
            Please do not attach confidential documents. We rarely need the file
            itself to fix a problem.
          </p>
        </div>

        <button
          type="submit"
          disabled={!message.trim()}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-custom-sm bg-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-primary-h focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          <ExternalLink size={15} aria-hidden="true" />
          Open in my email app
        </button>
      </form>
    </div>
  );
}
