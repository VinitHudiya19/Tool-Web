"use client";

import { useState, useRef, useEffect, useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  Search as SearchIcon,
  Zap,
  Lock,
  UserCheck,
  Smartphone,
  ArrowRight,
  CircleDollarSign,
  Sparkles,
  Calendar,
  TrendingUp,
  Image as ImageIcon,
  FileText,
} from "lucide-react";
import { TOOLS, CATEGORIES, FAQS, Tool } from "@/lib/mockData";
import { getTotalToolCount } from "@/lib/categories/derive";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import ToolCard, { ToolIcon } from "@/components/ui/ToolCard";
import CategoryCard from "@/components/ui/CategoryCard";
import FAQAccordion from "@/components/ui/FAQAccordion";

/** Counted from the registry so the headline figure is never stale. */
const TOTAL_TOOLS = getTotalToolCount();

const PLACEHOLDERS = [
  "Search JSON Formatter...",
  "Search Age Calculator...",
  "Search JWT Decoder...",
  "Search XML Sitemap Generator...",
  "Search Word Counter...",
  "Search SIP Calculator...",
  "Search Regex Tester...",
];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // The keyboard hint depends on the OS, which the server cannot know. Reading
  // it through useSyncExternalStore gives the server a defined snapshot
  // ("Ctrl") and lets the client correct it without a hydration mismatch.
  const isMac = useSyncExternalStore(
    () => () => {},
    () => navigator.platform.toUpperCase().includes("MAC"),
    () => false,
  );

  // Cycle placeholder texts
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  // Focus search bar via global keyboard shortcut (⌘K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Suggestions are derived from the query rather than mirrored into state, so
  // there is no extra render pass between typing and seeing results.
  const suggestions: Tool[] = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return [];

    return TOOLS.filter(
      (tool) =>
        tool.isImplemented !== false &&
        (tool.name.toLowerCase().includes(query) ||
          tool.description.toLowerCase().includes(query) ||
          tool.category.toLowerCase().includes(query))
    ).slice(0, 6);
  }, [searchQuery]);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter lists for specific sections (Show 8 popular tools instead of 9 to fit 4-column grid perfectly)
  const popularTools = TOOLS.filter((tool) => tool.isPopular && tool.isImplemented !== false).slice(0, 8);

  // Sort tools by date added, descending (Show 8 recently added tools instead of 6 to fit 4-column grid perfectly)
  const recentlyAdded = TOOLS.filter((tool) => tool.isImplemented !== false)
    .sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
    .slice(0, 8);

  // Filter categories to only show those that have implemented tools
  const activeCategories = CATEGORIES.filter((cat) =>
    TOOLS.some(
      (t) =>
        t.isImplemented !== false &&
        (t.categorySlug === cat.slug || t.categorySlug.startsWith(cat.slug + "/"))
    )
  );

  // WebSite and Organization schema live in the root layout and apply to every
  // page, so they are deliberately not repeated here — duplicating them would
  // declare the same entity twice on one page.
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": FAQS.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <>
      {/* JSON-LD: page-specific schema only */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c"),
        }}
      />

      <div className="flex flex-col min-h-screen">
        <Header />

        <main className="flex-grow">
          {/* ───────────────────────────────────────────────
              Section 1: Hero — Redesigned Deep Purple Gradient
          ─────────────────────────────────────────────── */}
          <section className="relative overflow-hidden bg-gradient-to-b from-indigo-950 via-slate-950 to-indigo-900 py-20 px-4 sm:px-6 text-white border-b border-indigo-900/50">
            {/* Subtle Grid Overlay for Tech Vibe */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
            
            {/* Glowing Orbs */}
            <div className="absolute -top-24 left-1/4 w-[300px] h-[300px] rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none" />
            <div className="absolute -bottom-24 right-1/4 w-[250px] h-[250px] rounded-full bg-purple-500/10 blur-[80px] pointer-events-none" />

            <div className="relative mx-auto max-w-[850px] text-center flex flex-col items-center">
              {/* Eyebrow badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-xs font-semibold tracking-wider uppercase text-indigo-300 mb-6 shadow-sm">
                <Sparkles size={12} />
                <span>{TOTAL_TOOLS} Free Online Tools</span>
              </div>

              {/* Title */}
              <h1 className="text-4xl sm:text-5xl md:text-[54px] font-extrabold leading-[1.15] tracking-tight mb-4 text-white">
                The only tool site<br />you need to bookmark.
              </h1>

              {/* Subtitle description */}
              <p className="text-base sm:text-lg font-medium text-slate-300 leading-relaxed max-w-[640px] mb-8">
                Calculators, developer utilities, SEO generators, PDF and image
                tools. No sign-up, no watermarks, and every tool runs entirely
                in your browser.
              </p>

              {/* Stats — verifiable facts only. Visitor counts are deliberately
                  absent: we have no published figure to stand behind. */}
              <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-[600px] w-full border-t border-b border-indigo-800/30 py-4 mb-8 text-center bg-indigo-950/20 backdrop-blur-sm rounded-xl">
                <div>
                  <div className="text-xl sm:text-2xl font-extrabold text-white">{TOTAL_TOOLS}</div>
                  <div className="text-[11px] sm:text-xs font-semibold tracking-wide uppercase text-slate-400">Free Tools</div>
                </div>
                <div className="border-l border-indigo-800/30 border-r">
                  <div className="text-xl sm:text-2xl font-extrabold text-white">$0</div>
                  <div className="text-[11px] sm:text-xs font-semibold tracking-wide uppercase text-slate-400">Cost To Use</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-extrabold text-white">0</div>
                  <div className="text-[11px] sm:text-xs font-semibold tracking-wide uppercase text-slate-400">Sign-ups Needed</div>
                </div>
              </div>

              {/* Search Container */}
              <div ref={searchContainerRef} className="relative w-full max-w-[700px] mb-5">
                <div className="relative flex items-center shadow-lg shadow-black/30 rounded-lg">
                  <span className="absolute left-5 text-slate-400">
                    <SearchIcon size={20} />
                  </span>
                  <input
                    ref={searchInputRef}
                    autoFocus
                    type="text"
                    placeholder={PLACEHOLDERS[placeholderIndex]}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    className="w-full h-[60px] pl-12 pr-24 text-base font-medium rounded-lg border border-indigo-800 bg-white text-slate-900 placeholder-slate-400 transition-all focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 focus-visible:outline-none"
                    aria-label="Search tools"
                  />
                  {/* Keyboard Shortcut Indicator */}
                  <span className="absolute right-4 hidden sm:inline-flex items-center gap-0.5 px-2 py-1 rounded bg-slate-100 border border-slate-200 text-[10px] font-bold text-slate-500 font-mono shadow-sm pointer-events-none select-none">
                    {isMac ? "⌘" : "Ctrl"} K
                  </span>
                </div>

                {/* Suggestions Dropdown */}
                {isFocused && suggestions.length > 0 && (
                  <div className="absolute top-[66px] left-0 right-0 z-50 border border-border-custom bg-bg rounded-custom-md shadow-custom-lg p-2 max-h-[380px] overflow-y-auto text-left">
                    {suggestions.map((tool) => (
                      <Link
                        key={tool.slug}
                        href={tool.slug === "typing-test" ? "/typing-test" : `/${tool.categorySlug}/${tool.slug}`}
                        onClick={() => {
                          setSearchQuery("");
                          setIsFocused(false);
                        }}
                        className="flex items-center gap-3.5 p-3 rounded-custom-sm transition-custom hover:bg-surface border border-transparent hover:border-border-custom focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-custom-sm bg-surface border border-border-custom text-primary">
                          <ToolIcon name={tool.iconName} size={16} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-text-custom leading-tight">
                            {tool.name}
                          </span>
                          <span className="text-xs text-text-2 leading-none mt-0.5 font-medium">
                            {tool.category}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
                {isFocused && searchQuery.trim() !== "" && suggestions.length === 0 && (
                  <div className="absolute top-[66px] left-0 right-0 z-50 border border-border-custom bg-bg rounded-custom-md shadow-custom-lg p-4 text-sm text-text-2 text-center font-medium">
                    No tools found matching &quot;{searchQuery}&quot;
                  </div>
                )}
              </div>

              {/* Quick Discovery Chips */}
              <div className="flex flex-wrap items-center justify-center gap-2 max-w-[700px] text-sm">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">Quick:</span>
                <Link
                  href="/calculators/age-calculator"
                  className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full border border-indigo-800 bg-indigo-950/40 text-slate-200 transition-colors hover:border-indigo-400 hover:text-white"
                >
                  <Calendar size={13} className="text-indigo-400" />
                  <span>Age Calculator</span>
                </Link>
                <Link
                  href="/image-tools/image-compressor"
                  className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full border border-indigo-800 bg-indigo-950/40 text-slate-200 transition-colors hover:border-indigo-400 hover:text-white"
                >
                  <ImageIcon size={13} className="text-pink-400" />
                  <span>Image Compressor</span>
                </Link>
                <Link
                  href="/pdf-tools/merge-pdf"
                  className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full border border-indigo-800 bg-indigo-950/40 text-slate-200 transition-colors hover:border-indigo-400 hover:text-white"
                >
                  <FileText size={13} className="text-red-400" />
                  <span>Merge PDF</span>
                </Link>
                <Link
                  href="/calculators/finance/sip-calculator"
                  className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full border border-indigo-800 bg-indigo-950/40 text-slate-200 transition-colors hover:border-indigo-400 hover:text-white"
                >
                  <TrendingUp size={13} className="text-teal-400" />
                  <span>SIP Calculator</span>
                </Link>
                <Link
                  href="/all-tools"
                  className="inline-flex items-center gap-1 h-8 px-3 rounded-full border border-indigo-800 bg-indigo-950/20 text-slate-400 transition-colors hover:border-indigo-400 hover:text-white font-semibold"
                >
                  <span>+ {TOTAL_TOOLS - 4} more</span>
                </Link>
              </div>
            </div>
          </section>

          {/* ───────────────────────────────────────────────
              Section 2: Most Popular Tools (bg: --surface) — 4-Column Grid
          ─────────────────────────────────────────────── */}
          <section className="bg-surface py-[72px] px-4 sm:px-6">
            <div className="mx-auto max-w-[1200px]">
              {/* Section Header with Eyebrow and Accent Line */}
              <div className="flex items-end justify-between mb-8 pb-4 border-b border-border-custom">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span className="text-[11px] font-extrabold uppercase tracking-widest text-primary">Popular Utilities</span>
                  </div>
                  <h2 className="text-[28px] font-extrabold text-text-custom leading-tight tracking-tight">
                    Most Popular Tools
                  </h2>
                  <p className="text-sm font-medium text-text-2 mt-1">
                    The absolute essentials opened daily by developers, creators, and analysts.
                  </p>
                </div>
                <Link
                  href="/all-tools"
                  className="flex items-center gap-1 text-sm font-bold text-primary transition-custom hover:text-primary-h focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                >
                  <span>View all</span>
                  <ArrowRight size={14} />
                </Link>
              </div>

              {/* 4-Column Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {popularTools.map((tool) => (
                  <ToolCard key={tool.slug} {...tool} />
                ))}
              </div>
            </div>
          </section>

          {/* ───────────────────────────────────────────────
              Section 3: Browse by Category (bg: --bg) — 4-Column Grid
          ─────────────────────────────────────────────── */}
          <section className="bg-bg py-[72px] px-4 sm:px-6">
            <div className="mx-auto max-w-[1200px]">
              {/* Section Header with Eyebrow and Accent Line */}
              <div className="mb-8 pb-4 border-b border-border-custom">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span className="text-[11px] font-extrabold uppercase tracking-widest text-primary">Browse Suite</span>
                </div>
                <h2 className="text-[28px] font-extrabold text-text-custom leading-tight tracking-tight">
                  Browse by Category
                </h2>
                <p className="text-sm font-medium text-text-2 mt-1">
                  Explore tailored solutions grouped logically by practical workflows.
                </p>
              </div>

              {/* Category Grid (4 Columns) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {activeCategories.map((category) => (
                  <CategoryCard key={category.slug} {...category} />
                ))}
              </div>
            </div>
          </section>

          {/* ───────────────────────────────────────────────
              Section 4: Recently Added (bg: --bg) — 4-Column Grid
          ─────────────────────────────────────────────── */}
          <section className="bg-surface py-[72px] px-4 sm:px-6">
            <div className="mx-auto max-w-[1200px]">
              {/* Section Header with Eyebrow and Accent Line */}
              <div className="mb-8 pb-4 border-b border-border-custom">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span className="text-[11px] font-extrabold uppercase tracking-widest text-primary">New Arrivals</span>
                </div>
                <h2 className="text-[28px] font-extrabold text-text-custom leading-tight tracking-tight">
                  Recently Added Tools
                </h2>
                <p className="text-sm font-medium text-text-2 mt-1">
                  Fresh releases to help you format code, parse metrics, and compile assets.
                </p>
              </div>

              {/* 4-Column Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {recentlyAdded.map((tool) => (
                  <ToolCard key={tool.slug} {...tool} showBadge={true} />
                ))}
              </div>
            </div>
          </section>

          {/* ───────────────────────────────────────────────
              Section 5: Why Use Our Tools (bg: --bg)
          ─────────────────────────────────────────────── */}
          <section className="bg-bg py-[72px] px-4 sm:px-6 border-b border-border-custom/50">
            <div className="mx-auto max-w-[1200px]">
              <div className="text-center mb-10">
                <div className="flex items-center justify-center gap-2 mb-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span className="text-[11px] font-extrabold uppercase tracking-widest text-primary">Why MicroTool</span>
                </div>
                <h2 className="text-center text-[28px] font-extrabold text-text-custom leading-tight tracking-tight">
                  Why Use Our Tools
                </h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-center">
                {/* Free */}
                <div className="flex flex-col items-center p-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-custom-sm bg-surface border border-border-custom text-primary mb-4 shadow-sm">
                    <CircleDollarSign size={26} />
                  </div>
                  <h3 className="text-base font-bold text-text-custom mb-1">
                    Free
                  </h3>
                  <p className="text-xs text-text-2 font-medium">No hidden fees, no limits</p>
                </div>

                {/* Fast */}
                <div className="flex flex-col items-center p-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-custom-sm bg-surface border border-border-custom text-primary mb-4 shadow-sm">
                    <Zap size={26} />
                  </div>
                  <h3 className="text-base font-bold text-text-custom mb-1">
                    Instant
                  </h3>
                  <p className="text-xs text-text-2 font-medium">Processes in milliseconds</p>
                </div>

                {/* Secure */}
                <div className="flex flex-col items-center p-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-custom-sm bg-surface border border-border-custom text-primary mb-4 shadow-sm">
                    <Lock size={26} />
                  </div>
                  <h3 className="text-base font-bold text-text-custom mb-1">
                    Secure
                  </h3>
                  <p className="text-xs text-text-2 font-medium">Data never leaves browser</p>
                </div>

                {/* No Sign-Up */}
                <div className="flex flex-col items-center p-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-custom-sm bg-surface border border-border-custom text-primary mb-4 shadow-sm">
                    <UserCheck size={26} />
                  </div>
                  <h3 className="text-base font-bold text-text-custom mb-1">
                    No Sign-Up
                  </h3>
                  <p className="text-xs text-text-2 font-medium">Zero barrier to entry</p>
                </div>

                {/* Mobile Friendly */}
                <div className="flex flex-col items-center p-4 col-span-2 md:col-span-1">
                  <div className="flex h-14 w-14 items-center justify-center rounded-custom-sm bg-surface border border-border-custom text-primary mb-4 shadow-sm">
                    <Smartphone size={26} />
                  </div>
                  <h3 className="text-base font-bold text-text-custom mb-1">
                    Fully Responsive
                  </h3>
                  <p className="text-xs text-text-2 font-medium">Desktop to smartphone</p>
                </div>
              </div>
            </div>
          </section>

          {/* ───────────────────────────────────────────────
              Section 6: About / Intro (bg: --surface) — Relocated for SEO flow
          ─────────────────────────────────────────────── */}
          <section className="bg-surface py-[72px] px-4 sm:px-6">
            <div className="mx-auto max-w-[760px]">
              <div className="flex items-center gap-2 mb-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-primary">
                  About
                </span>
              </div>
              <h2 className="text-[24px] font-extrabold text-text-custom tracking-tight mb-4">
                What is MicroTool?
              </h2>

              {/* Answer-first: the opening sentence is a self-contained
                  definition, so it can be quoted without surrounding context. */}
              <p className="text-base font-normal text-text-custom leading-[1.8]">
                MicroTool is a free collection of {TOTAL_TOOLS} online tools for
                everyday tasks — calculators, PDF and image utilities, developer
                formatters, SEO generators and text tools. There is no account,
                no installation and no paid tier.
              </p>

              <h3 className="text-base font-bold text-text-custom mt-8 mb-2">
                How does it work?
              </h3>
              <p className="text-sm font-normal text-text-2 leading-[1.8]">
                Nearly every tool runs as JavaScript inside your own browser. You
                pick a tool, give it a file or some numbers, and the work happens
                on your device — so your data is not uploaded, and results appear
                immediately without a round trip to a server. Two PDF tools are
                the exception and say so on the page; everything else keeps
                working even after you go offline.
              </p>

              <h3 className="text-base font-bold text-text-custom mt-8 mb-2">
                Who is it for?
              </h3>
              <p className="text-sm font-normal text-text-2 leading-[1.8]">
                Anyone who needs a small job done once and does not want to
                install software for it: merging a PDF before emailing it,
                checking a loan repayment, resizing an image for an upload limit,
                formatting JSON while debugging, or counting words against a
                limit.
              </p>

              <h3 className="text-base font-bold text-text-custom mt-8 mb-2">
                Is it really free?
              </h3>
              <p className="text-sm font-normal text-text-2 leading-[1.8]">
                Yes. Every tool is free with no usage limit and no watermark on
                anything you produce. The site is funded by advertising, which is
                what pays for hosting — you are never asked to pay or subscribe.
              </p>
            </div>
          </section>

          {/* ───────────────────────────────────────────────
              Section 7: FAQ (bg: --bg)
          ─────────────────────────────────────────────── */}
          <section className="bg-bg py-[72px] px-4 sm:px-6 border-t border-border-custom/50">
            <div className="mx-auto max-w-[1200px]">
              <div className="text-center mb-10">
                <div className="flex items-center justify-center gap-2 mb-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span className="text-[11px] font-extrabold uppercase tracking-widest text-primary">Direct Answers</span>
                </div>
                <h2 className="text-center text-[28px] font-extrabold text-text-custom leading-tight tracking-tight">
                  Frequently Asked Questions
                </h2>
                <p className="text-sm font-medium text-text-2 mt-1 text-center">
                  Get immediate, exact details on how MicroTool handles data, pricing, and compatibility.
                </p>
              </div>

              <FAQAccordion items={FAQS} />
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
