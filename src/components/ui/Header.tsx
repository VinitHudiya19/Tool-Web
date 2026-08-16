"use client";

import Link from "next/link";
import { Terminal } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const isLinkActive = (href: string) => {
    return pathname === href;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border-custom bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-4 sm:px-6">
        {/* Logo and Brand Mark */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5 font-sans font-extrabold text-text-custom transition-custom hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
          aria-label="MicroTool Homepage"
        >
          {/* Logo Mark: Brand Accent Gradient Container */}
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 text-white shadow-sm shadow-indigo-500/20">
            <Terminal size={18} strokeWidth={2.5} />
          </div>
          <span className="text-xl tracking-tight font-extrabold text-text-custom">
            Micro<span className="text-primary font-bold">Tool</span>
          </span>
        </Link>

        {/* Navigation and CTA Buttons */}
        {/* The nav needs 1024px to sit clear of the wordmark; below that it is
            hidden rather than crowding the logo. */}
        <div className="flex shrink-0 items-center gap-6">
          <nav className="hidden lg:flex items-center gap-5">
            <Link
              href="/calculators"
              className={`text-sm font-semibold transition-custom hover:text-primary relative py-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${
                isLinkActive("/calculators")
                  ? "text-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:rounded-full"
                  : "text-text-2"
              }`}
            >
              Calculators
            </Link>
            <Link
              href="/developer-tools"
              className={`text-sm font-semibold transition-custom hover:text-primary relative py-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${
                isLinkActive("/developer-tools")
                  ? "text-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:rounded-full"
                  : "text-text-2"
              }`}
            >
              Developer Tools
            </Link>
            <Link
              href="/seo-tools"
              className={`text-sm font-semibold transition-custom hover:text-primary relative py-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${
                isLinkActive("/seo-tools")
                  ? "text-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:rounded-full"
                  : "text-text-2"
              }`}
            >
              SEO Tools
            </Link>
            <Link
              href="/pdf-tools"
              className={`text-sm font-semibold transition-custom hover:text-primary relative py-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${
                isLinkActive("/pdf-tools")
                  ? "text-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:rounded-full"
                  : "text-text-2"
              }`}
            >
              PDF Tools
            </Link>
            <Link
              href="/image-tools"
              className={`text-sm font-semibold transition-custom hover:text-primary relative py-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${
                isLinkActive("/image-tools")
                  ? "text-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:rounded-full"
                  : "text-text-2"
              }`}
            >
              Image Tools
            </Link>
            <Link
              href="/business-tools"
              className={`text-sm font-semibold transition-custom hover:text-primary relative py-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${
                isLinkActive("/business-tools")
                  ? "text-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:rounded-full"
                  : "text-text-2"
              }`}
            >
              Business Tools
            </Link>
          </nav>

          {/* CTA: Submit a Tool */}
          <Link
            href="/submit"
            className="inline-flex h-9 items-center justify-center rounded-custom-sm bg-primary px-4 text-xs font-bold text-white shadow-sm shadow-primary/10 transition-custom hover:bg-primary-h focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
          >
            Submit a Tool
          </Link>
        </div>
      </div>
    </header>
  );
}
