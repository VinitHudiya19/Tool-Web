"use client";

import Link from "next/link";
import { Terminal, Send } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border-custom bg-surface py-16 text-sm text-text-2">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        {/* Main Grid */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-5 lg:gap-16">
          {/* Logo / Tagline / Newsletter Column (Spans 2 columns) */}
          <div className="md:col-span-2 flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <Link
                href="/"
                className="flex items-center gap-2.5 font-sans font-extrabold text-text-custom transition-custom hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
                aria-label="MicroTool Homepage"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-border-custom text-primary shadow-sm">
                  <Terminal size={16} />
                </div>
                <span className="text-lg tracking-tight font-extrabold text-text-custom">
                  Micro<span className="text-primary font-bold">Tool</span>
                </span>
              </Link>
              <p className="text-sm font-normal text-text-2 leading-relaxed max-w-sm">
                Fast, secure, and precise online utilities for development, calculations, SEO, and document actions. Every tool runs client-side.
              </p>
            </div>

            {/* Newsletter Subscription Box */}
            <div className="flex flex-col gap-3 max-w-sm p-5 rounded-xl border border-border-custom bg-bg shadow-custom-sm">
              <h4 className="text-sm font-bold text-text-custom leading-none">
                Get new tools in your inbox
              </h4>
              <p className="text-xs text-text-2 leading-normal">
                Weekly notifications when we launch new calculators and dev utilities.
              </p>
              <form
                onSubmit={(e) => e.preventDefault()}
                className="flex gap-2 mt-1"
              >
                <input
                  type="email"
                  placeholder="name@email.com"
                  required
                  className="flex-grow h-9 px-3 text-xs rounded-custom-sm border border-border-custom bg-surface text-text-custom placeholder-text-2 focus:border-primary focus:ring-1 focus:ring-primary/20 focus-visible:outline-none"
                  aria-label="Email address for newsletter"
                />
                <button
                  type="submit"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-custom-sm bg-primary text-white hover:bg-primary-h shadow-sm transition-colors cursor-pointer"
                  aria-label="Subscribe"
                >
                  <Send size={14} />
                </button>
              </form>
            </div>
          </div>

          {/* Column 2: Categories (With Tool Counts) */}
          <div>
            <h3 className="text-xs font-bold text-text-custom mb-5 uppercase tracking-wider">
              Categories
            </h3>
            <ul className="space-y-3 font-medium">
              <li>
                <Link
                  href="/calculators"
                  className="flex items-center justify-between text-text-2 hover:text-primary transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                >
                  <span>Calculators</span>
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-surface border border-border-custom text-text-2">24</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/seo-tools"
                  className="flex items-center justify-between text-text-2 hover:text-primary transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                >
                  <span>SEO Tools</span>
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-surface border border-border-custom text-text-2">15</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/developer-tools"
                  className="flex items-center justify-between text-text-2 hover:text-primary transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                >
                  <span>Developer Tools</span>
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-surface border border-border-custom text-text-2">20</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/text-tools"
                  className="flex items-center justify-between text-text-2 hover:text-primary transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                >
                  <span>Text Tools</span>
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-surface border border-border-custom text-text-2">12</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/pdf-tools"
                  className="flex items-center justify-between text-text-2 hover:text-primary transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                >
                  <span>PDF Tools</span>
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-surface border border-border-custom text-text-2">12</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/image-tools"
                  className="flex items-center justify-between text-text-2 hover:text-primary transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                >
                  <span>Image Tools</span>
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-surface border border-border-custom text-text-2">10</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/business-tools"
                  className="flex items-center justify-between text-text-2 hover:text-primary transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                >
                  <span>Business Tools</span>
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-surface border border-border-custom text-text-2">3</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Popular Tools */}
          <div>
            <h3 className="text-xs font-bold text-text-custom mb-5 uppercase tracking-wider">
              Popular Tools
            </h3>
            <ul className="space-y-3 font-medium">
              <li>
                <Link
                  href="/calculators/age-calculator"
                  className="text-text-2 hover:text-primary transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                >
                  Age Calculator
                </Link>
              </li>
              <li>
                <Link
                  href="/pdf-tools/merge-pdf"
                  className="text-text-2 hover:text-primary transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                >
                  Merge PDF
                </Link>
              </li>
              <li>
                <Link
                  href="/seo-tools/schema-generator"
                  className="text-text-2 hover:text-primary transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                >
                  Schema Generator
                </Link>
              </li>
              <li>
                <Link
                  href="/calculators/finance/sip-calculator"
                  className="text-text-2 hover:text-primary transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                >
                  SIP Calculator
                </Link>
              </li>
              <li>
                <Link
                  href="/text-tools/word-counter"
                  className="text-text-2 hover:text-primary transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                >
                  Word Counter
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: New & Updated */}
          <div>
            <h3 className="text-xs font-bold text-text-custom mb-5 uppercase tracking-wider">
              New &amp; Updated
            </h3>
            <ul className="space-y-3 font-medium">
              <li>
                <Link
                  href="/calculators/health/bmi-calculator"
                  className="text-text-2 hover:text-primary transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                >
                  BMI Calculator
                </Link>
              </li>
              <li>
                <Link
                  href="/calculators/finance/retirement-calculator"
                  className="text-text-2 hover:text-primary transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                >
                  Retirement Calculator
                </Link>
              </li>
              <li>
                <Link
                  href="/image-tools/image-compressor"
                  className="text-text-2 hover:text-primary transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                >
                  Image Compressor
                </Link>
              </li>
              <li>
                <Link
                  href="/pdf-tools/split-pdf"
                  className="text-text-2 hover:text-primary transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                >
                  Split PDF
                </Link>
              </li>
              <li>
                <Link
                  href="/seo-tools/sitemap-generator"
                  className="text-text-2 hover:text-primary transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                >
                  Sitemap Generator
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 border-t border-border-custom/80 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col gap-1 text-center sm:text-left">
            <div className="text-xs text-text-2 font-medium">
              &copy; {currentYear} MicroTool. All rights reserved. Calculations are client-side only.
            </div>
            <div className="text-[11px] text-text-2/80">
              Last updated: June 20, 2026 &bull; Search indexed &amp; verified.
            </div>
          </div>
          <div className="flex gap-4 text-xs font-semibold">
            <Link
              href="/privacy"
              className="text-text-2 hover:text-primary transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-text-2 hover:text-primary transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
            >
              Terms
            </Link>
            <Link
              href="/contact"
              className="text-text-2 hover:text-primary transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
