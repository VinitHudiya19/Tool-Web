import type { Metadata, Viewport } from "next";
import "./globals.css";
import { getTotalToolCount } from "@/lib/categories/derive";
import { SITE } from "@/lib/site.config";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";

/** Counted from the registry so site-wide copy never states a stale figure. */
const TOTAL_TOOLS = getTotalToolCount();

const inter = { variable: "font-sans" };

export const metadata: Metadata = {
  metadataBase: new URL("https://www.quicktoolz.tech"),
  title: {
    default: "MicroTool — 73 Free Online Tools, No Sign-up",
    template: "%s | MicroTool",
  },
  description:
    `${TOTAL_TOOLS} free online tools — calculators, PDF, image, SEO, text and developer utilities. No sign-up, and every tool runs in your browser.`,
  keywords: [
    "free online tools",
    "online calculators",
    "developer tools",
    "pdf tools",
    "image compressor",
    "image converter",
    "seo tools",
    "schema generator",
    "word counter",
    "json formatter",
    "sip calculator",
    "emi calculator",
    "bmi calculator",
    "merge pdf",
    "compress pdf",
    "qr code generator",
    "invoice generator",
    "base64 encoder",
    "uuid generator",
    "typing test",
  ],
  authors: [{ name: "MicroTool Team" }],
  creator: "MicroTool",
  publisher: "MicroTool",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://www.quicktoolz.tech",
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.quicktoolz.tech",
    siteName: "MicroTool",
    title: "MicroTool — Free Online Calculators, Developer Tools & Converters",
    description:
      `${TOTAL_TOOLS} free online tools: calculators, JSON formatters, PDF merge & compress, image converters, SEO schema generators and text utilities. No sign-up.`,
  },
  twitter: {
    card: "summary_large_image",
    title: `MicroTool — ${TOTAL_TOOLS} Free Online Tools | Calculators, PDF & Dev Tools`,
    description: `${TOTAL_TOOLS} free online tools: calculators, JSON formatters, PDF merge & compress, image converters, SEO schema generators and text utilities. No sign-up.`,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#4F46E5",
};

// The @id values are referenced by every page's `isPartOf` / publisher links,
// so the whole site resolves to one WebSite and one Organization entity.
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://www.quicktoolz.tech#website",
  name: "MicroTool",
  url: "https://www.quicktoolz.tech",
  publisher: { "@id": "https://www.quicktoolz.tech#organization" },
  description: `MicroTool is a free online utility platform with ${TOTAL_TOOLS} tools: calculators, developer utilities, PDF tools, image converters, SEO generators, text tools and business document generators. Every tool runs locally in your browser.`,
  potentialAction: {
    "@type": "SearchAction",
    target: "https://www.quicktoolz.tech/all-tools?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://www.quicktoolz.tech#organization",
  name: "MicroTool",
  url: "https://www.quicktoolz.tech",
  logo: "https://www.quicktoolz.tech/logo.png",
  email: SITE.contactEmail,
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    email: SITE.contactEmail,
    availableLanguage: "English",
  },
  description: `MicroTool provides ${TOTAL_TOOLS} free, privacy-first online tools. Calculators, developer tools, PDF tools, image converters, SEO generators, text utilities and business document generators.`,
  sameAs: [],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-white text-[#111827]">
        {children}
        <GoogleAnalytics />
      </body>
    </html>
  );
}
