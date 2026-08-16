import type { Metadata } from "next";
import SubmitPageTemplate from "@/components/SubmitPageTemplate";

export const metadata: Metadata = {
  title: "Submit a Tool Idea — MicroTool",
  description: "Propose a new browser-local calculator, text formatter, or file editor. Help us decide what to build next.",
  alternates: {
    canonical: "https://www.quicktoolz.tech/submit",
  },
  openGraph: {
    title: "Submit a Tool Idea — MicroTool",
    description: "Propose a new browser-local calculator, text formatter, or file editor. Help us decide what to build next.",
    url: "https://www.quicktoolz.tech/submit",
    siteName: "MicroTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Submit a Tool Idea — MicroTool",
    description: "Propose a new browser-local calculator, text formatter, or file editor. Help us decide what to build next.",
  },
};

export default function SubmitPage() {
  return <SubmitPageTemplate />;
}
