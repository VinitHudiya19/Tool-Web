import type { Metadata } from "next";
import Link from "next/link";

import LegalPage, { type LegalSection } from "@/components/legal/LegalPage";
import { SITE } from "@/lib/site.config";

const PATH = "/terms";
const DESCRIPTION =
  "The terms for using MicroTool: what you may do with the tools and their output, what we do and do not guarantee, and the limits of our liability.";

export const metadata: Metadata = {
  title: "Terms of Service — Using MicroTool",
  description: DESCRIPTION,
  alternates: { canonical: `${SITE.url}${PATH}` },
  openGraph: {
    title: `Terms of Service | ${SITE.name}`,
    description: DESCRIPTION,
    url: `${SITE.url}${PATH}`,
    siteName: SITE.name,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: `Terms of Service | ${SITE.name}`,
    description: DESCRIPTION,
  },
};

const SECTIONS: LegalSection[] = [
  {
    id: "acceptance",
    heading: "Accepting these terms",
    body: (
      <p>
        By using {SITE.name} you agree to these terms. If you do not agree with
        them, please do not use the site. We may revise these terms as the site
        changes; the date at the top of this page shows when they were last
        updated, and continuing to use the site after a revision means you accept
        it.
      </p>
    ),
  },
  {
    id: "using-the-tools",
    heading: "Using the tools",
    body: (
      <>
        <p>
          Every tool is free to use for personal and commercial work. There is no
          account, no licence key, no usage quota and no paid tier.
        </p>
        <p>You agree not to:</p>
        <ul>
          <li>
            Use the site to process content you have no legal right to process —
            for example removing password protection from a document you do not
            own or are not authorised to modify.
          </li>
          <li>
            Attempt to disrupt the service, probe it for vulnerabilities, or send
            automated traffic at a volume that degrades it for other people.
          </li>
          <li>
            Scrape the site in bulk in order to republish it, in whole or
            substantial part, as a competing directory.
          </li>
          <li>Use the site for anything unlawful.</li>
        </ul>
        <p>
          Occasional, reasonable automated access — a search engine crawler, or a
          script that uses a tool now and then — is fine.
        </p>
      </>
    ),
  },
  {
    id: "your-content",
    heading: "Your files and your output",
    body: (
      <>
        <p>
          <strong>
            You keep all rights to the files you use and everything you produce.
          </strong>{" "}
          We claim no ownership of your documents, images, text or the output of
          any tool, and we place no restriction on how you use that output. A PDF
          you merge here is yours to sell, publish or file exactly as if you had
          merged it with desktop software.
        </p>
        <p>
          Every tool runs in your browser and we never receive your file
          at all. The two that use a server — Compress PDF and Unlock PDF —
          process the file and discard it, as described in our{" "}
          <Link href="/privacy">privacy policy</Link>. We do not store, index or
          reuse it.
        </p>
        <p>
          <strong>Keep your own backups.</strong> Because processing happens on
          your device, we cannot recover anything you lose. Closing the tab,
          clearing your browser data or a crash mid-operation will lose unsaved
          work, and we have no copy to restore.
        </p>
      </>
    ),
  },
  {
    id: "accuracy",
    heading: "Accuracy and professional advice",
    body: (
      <>
        <p>
          We build the calculators on published, standard formulas and test them,
          but{" "}
          <strong>
            results are provided for information only and are not professional
            advice.
          </strong>
        </p>
        <ul>
          <li>
            Financial calculators produce estimates. They do not account for
            fees, tax treatment, rate changes or your personal circumstances, and
            they are not financial advice.
          </li>
          <li>
            Health calculators such as BMI and calorie estimates are general
            indicators, not a medical assessment or diagnosis.
          </li>
          <li>
            Document generators produce templates. Whether an invoice or receipt
            satisfies your local tax rules is for you or your accountant to
            confirm.
          </li>
        </ul>
        <p>
          Verify anything that matters — a loan decision, a medical concern, a
          tax filing — with a qualified professional before acting on it.
        </p>
      </>
    ),
  },
  {
    id: "availability",
    heading: "Availability and changes",
    body: (
      <p>
        The site is provided on an &quot;as is&quot; and &quot;as
        available&quot; basis. We may change, add, deprecate or withdraw any tool
        at any time, and we do not guarantee uninterrupted access. Tools that
        fetch a URL may be briefly unavailable during maintenance; tools
        that run in your browser generally keep working even if our server is
        down, once the page has loaded.
      </p>
    ),
  },
  {
    id: "warranties",
    heading: "Disclaimer of warranties",
    body: (
      <p>
        To the fullest extent permitted by law, we disclaim all warranties,
        express or implied, including fitness for a particular purpose,
        merchantability and non-infringement. We do not warrant that the site
        will be error-free, that results will be accurate or complete, or that
        any defect will be corrected.
      </p>
    ),
  },
  {
    id: "liability",
    heading: "Limitation of liability",
    body: (
      <>
        <p>
          To the fullest extent permitted by law, we are not liable for any
          indirect, incidental, special or consequential loss arising from your
          use of the site — including lost data, lost profits, or decisions made
          on the basis of a tool&apos;s output.
        </p>
        <p>
          Nothing in these terms limits liability that cannot lawfully be
          limited, such as liability for death or personal injury caused by
          negligence, or for fraud.
        </p>
      </>
    ),
  },
  {
    id: "intellectual-property",
    heading: "Our content",
    body: (
      <p>
        The site&apos;s name, design, written guides and underlying code belong
        to us or our licensors. You may link to any page freely, and you may
        quote short extracts with attribution. Copying the site&apos;s content or
        design wholesale to republish elsewhere is not permitted.
      </p>
    ),
  },
  {
    id: "third-party",
    heading: "Advertising and external links",
    body: (
      <>
        {SITE.showsAds && (
          <p>
            The site carries third-party advertising, which is what keeps the
            tools free. We do not control which ads are shown and do not endorse
            the products in them.
          </p>
        )}
        <p>
          Some pages link to external sites for reference. We are not responsible
          for their content, accuracy or practices.
        </p>
      </>
    ),
  },
  {
    id: "contact",
    heading: "Contact",
    body: (
      <p>
        Questions about these terms can go to{" "}
        <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>, or
        through the <Link href="/contact">contact page</Link>.
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      h1="Terms of Service"
      description={DESCRIPTION}
      path={PATH}
      intro={
        <p>
          These terms cover using {SITE.name}. In plain terms: the tools are free
          for personal and commercial work, everything you create belongs to you,
          and results are estimates rather than professional advice. The detail
          is below.
        </p>
      }
      sections={SECTIONS}
    />
  );
}
