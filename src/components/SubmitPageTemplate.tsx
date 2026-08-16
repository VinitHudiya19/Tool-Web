"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, CheckCircle2, AlertCircle, PlusCircle } from "lucide-react";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";

export default function SubmitPageTemplate() {
  const [toolName, setToolName] = useState("");
  const [category, setCategory] = useState("calculators");
  const [description, setDescription] = useState("");
  const [useCase, setUseCase] = useState("");
  const [email, setEmail] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!toolName || !description || !useCase) {
      setError("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      setToolName("");
      setCategory("calculators");
      setDescription("");
      setUseCase("");
      setEmail("");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-bg-secondary text-text-primary flex flex-col justify-between">
      <Header />

      <main className="flex-grow max-w-xl w-full mx-auto px-4 sm:px-6 py-16">
        <nav className="flex mb-6 text-xs text-text-muted" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-2">
            <li>
              <Link href="/" className="hover:text-text-primary transition-colors">
                Home
              </Link>
            </li>
            <li>
              <span className="mx-2">/</span>
              <span className="font-semibold text-text-secondary">
                Submit a Tool
              </span>
            </li>
          </ol>
        </nav>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-bg-primary shadow-sm border border-border-default text-brand-primary">
            <PlusCircle size={22} />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">
            Submit a Tool Idea
          </h1>
        </div>
        <p className="text-sm text-text-secondary mb-8 leading-relaxed">
          Help us expand our library of browser-local utilities. If you need a specific calculator, decoder, or editor for your daily workflow, tell us about it and we will build it!
        </p>

        {success ? (
          <div className="p-6 rounded-xl border border-success/20 bg-success/5 text-center flex flex-col items-center gap-4 shadow-custom-sm">
            <div className="h-12 w-12 rounded-full bg-success/10 text-success flex items-center justify-center">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-text-primary mb-1">
                Proposal Submitted!
              </h2>
              <p className="text-xs text-text-secondary">
                Thank you for your suggestion. We regularly review community proposals when designing our weekly tool updates.
              </p>
            </div>
            <button
              onClick={() => setSuccess(false)}
              className="mt-2 text-xs font-bold text-brand-primary hover:underline cursor-pointer"
            >
              Submit another idea
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 bg-bg-primary border border-border-default rounded-xl p-6 shadow-custom-sm">
            {error && (
              <div className="p-3 rounded-lg bg-error/5 border border-error/25 text-xs text-error flex items-center gap-2">
                <AlertCircle size={14} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Tool Name */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="submit-name" className="text-xs font-bold text-text-primary">
                Proposed Tool Name <span className="text-error">*</span>
              </label>
              <input
                id="submit-name"
                type="text"
                value={toolName}
                onChange={(e) => setToolName(e.target.value)}
                required
                className="h-10 w-full px-3 text-xs bg-bg-secondary border border-border-default rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary text-text-primary placeholder:text-text-muted"
                placeholder="e.g. CSV to JSON Converter"
              />
            </div>

            {/* Category Select */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="submit-category" className="text-xs font-bold text-text-primary">
                Primary Category
              </label>
              <select
                id="submit-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="h-10 w-full px-3 text-xs bg-bg-secondary border border-border-default rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary text-text-primary cursor-pointer"
              >
                <option value="calculators">Calculators / Finance</option>
                <option value="seo-tools">SEO Tools</option>
                <option value="text-tools">Text Tools</option>
                <option value="pdf-tools">PDF Tools</option>
                <option value="image-tools">Image Tools</option>
                <option value="other">Other / New Category</option>
              </select>
            </div>

            {/* Tool Description */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="submit-desc" className="text-xs font-bold text-text-primary">
                Short Description <span className="text-error">*</span>
              </label>
              <textarea
                id="submit-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={3}
                className="w-full p-3 text-xs bg-bg-secondary border border-border-default rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary text-text-primary placeholder:text-text-muted resize-y"
                placeholder="What should the tool do? (e.g. It converts comma-separated CSV text into nested JSON arrays client-side...)"
              />
            </div>

            {/* Use Case / Formulas */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="submit-usecase" className="text-xs font-bold text-text-primary">
                Use Case &amp; Required Inputs <span className="text-error">*</span>
              </label>
              <textarea
                id="submit-usecase"
                value={useCase}
                onChange={(e) => setUseCase(e.target.value)}
                required
                rows={4}
                className="w-full p-3 text-xs bg-bg-secondary border border-border-default rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary text-text-primary placeholder:text-text-muted resize-y"
                placeholder="Who will use this tool and what specific inputs/formulas are needed?"
              />
            </div>

            {/* Optional Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="submit-email" className="text-xs font-bold text-text-primary">
                Your Email <span className="text-text-muted font-normal">(Optional — to notify you when launched)</span>
              </label>
              <input
                id="submit-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 w-full px-3 text-xs bg-bg-secondary border border-border-default rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary text-text-primary placeholder:text-text-muted"
                placeholder="name@email.com"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 bg-brand-primary hover:bg-brand-primary/95 disabled:bg-brand-primary/50 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Sparkles size={14} />
                  <span>Submit Proposal</span>
                </>
              )}
            </button>
          </form>
        )}
      </main>

      <Footer />
    </div>
  );
}
