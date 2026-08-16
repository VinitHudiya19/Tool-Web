import type { Metadata } from "next";
import Link from "next/link";

import LegalPage, { type LegalSection } from "@/components/legal/LegalPage";
import { SITE } from "@/lib/site.config";

const PATH = "/privacy";
const DESCRIPTION =
  "How MicroTool handles your data: every tool runs in your browser, what the server logs contain, and your privacy rights.";

export const metadata: Metadata = {
  title: "Privacy Policy — What We Do With Your Data",
  description: DESCRIPTION,
  alternates: { canonical: `${SITE.url}${PATH}` },
  openGraph: {
    title: `Privacy Policy | ${SITE.name}`,
    description: DESCRIPTION,
    url: `${SITE.url}${PATH}`,
    siteName: SITE.name,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: `Privacy Policy | ${SITE.name}`,
    description: DESCRIPTION,
  },
};

/**
 * The policy is written to match how the site actually works.
 *
 * Every tool now runs in the browser, including PDF compression and unlocking,
 * so there is no file upload to disclose. The one exception is the Canonical
 * Tag Checker, which by its nature fetches a URL you give it. Advertising and
 * analytics disclosures render from the flags in site.config.ts, so the policy
 * cannot claim a cookie the site does not actually set.
 */
const SECTIONS: LegalSection[] = [
  {
    id: "summary",
    heading: "The short version",
    body: (
      <>
        <ul>
          <li>
            We do not ask you to create an account, and we do not collect your
            name, address or payment details.
          </li>
          <li>
            Every tool runs entirely inside your browser. The files, text and
            numbers you enter are never transmitted to us.
          </li>
          <li>
            The only exception is the <strong>Canonical Tag Checker</strong>,
            which has to fetch the public URL you give it in order to read its
            tags. It sends no file and stores nothing.
          </li>
          {SITE.showsAds && (
            <li>
              We show advertising, which means third parties including Google set
              cookies in your browser. You can opt out of personalised ads.
            </li>
          )}
        </ul>
        <p>The sections below explain each of these in full.</p>
      </>
    ),
  },
  {
    id: "what-we-collect",
    heading: "What we collect",
    body: (
      <>
        <p>
          <strong>We do not collect personal information</strong> such as your
          name, postal address, phone number or payment details, because nothing
          on this site requires them. There is no account to create.
        </p>
        <p>The only information that reaches us is:</p>
        <ul>
          <li>
            <strong>Standard server logs</strong> — your IP address, browser and
            operating system, the page requested and the referring page. These
            are generated automatically by the web server and are used to keep
            the site running and to block abusive traffic.
          </li>
          <li>
            <strong>URLs submitted to the Canonical Tag Checker</strong> — used
            once to fetch that page and not retained afterwards.
          </li>
          {SITE.analytics && (
            <li>
              <strong>Aggregate usage statistics</strong> — we use{" "}
              {SITE.analytics} to see which tools are used and which pages are
              popular. It does not identify individual visitors.
            </li>
          )}
          <li>
            <strong>Anything you put in an email to us</strong> — if you contact
            us, we hold that message so we can reply to it.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "your-files",
    heading: "Your files and what you type",
    body: (
      <>
        <p>
          <strong>Most tools never send anything anywhere.</strong> When you
          merge PDFs, convert images, format JSON, count words or calculate a
          loan repayment, the work is done by JavaScript running on your own
          device. Your file is read into your browser&apos;s memory, processed
          there, and offered back to you as a download. It does not travel over
          the internet, and we never see it.
        </p>
        <p>
          <strong>This includes PDF compression and unlocking.</strong> Both used
          to run on a server and no longer do — the file is opened, rewritten and
          saved by your own browser. A password you type into Unlock PDF is used
          once, in the page, and is never transmitted or stored.
        </p>
        <p>
          The single exception is the <strong>Canonical Tag Checker</strong>,
          which asks our server to fetch a public URL you supply so it can read
          the tags that page returns. No file is uploaded and the URL is not kept
          after the check completes.
        </p>
        <p>
          If a document is sensitive enough that you would rather it never left
          your device at all, use the Lossless compression level and avoid the
          unlock tool.
        </p>
      </>
    ),
  },
  {
    id: "browser-storage",
    heading: "Browser storage",
    body: (
      <>
        <p>
          Some tools save your input in your browser&apos;s{" "}
          <strong>local storage</strong> so your work is still there when you
          come back — for example saved entries in the Net Worth Calculator, or
          your business details in the invoice generator.
        </p>
        <p>
          This data stays on your device. It is not sent to us and we cannot read
          it. Clearing your browser&apos;s site data, or using the reset control
          inside the tool, removes it permanently.
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    heading: "Cookies and advertising",
    body: SITE.showsAds ? (
      <>
        <p>
          We do not set cookies of our own to track you across the web. However,
          this site is funded by advertising, and{" "}
          <strong>ad networks do set cookies</strong>.
        </p>
        <ul>
          <li>
            Third-party vendors, including Google, use cookies to serve ads based
            on your previous visits to this and other websites.
          </li>
          <li>
            Google&apos;s use of advertising cookies enables it and its partners
            to serve ads to you based on your visit to this site and other sites
            on the internet.
          </li>
          <li>
            You can opt out of personalised advertising by visiting{" "}
            <a
              href="https://www.google.com/settings/ads"
              rel="noopener noreferrer nofollow"
              target="_blank"
            >
              Google Ads Settings
            </a>
            .
          </li>
          <li>
            You can opt out of third-party vendors&apos; use of cookies for
            personalised advertising at{" "}
            <a
              href="https://www.aboutads.info/choices/"
              rel="noopener noreferrer nofollow"
              target="_blank"
            >
              aboutads.info/choices
            </a>
            .
          </li>
        </ul>
        <p>
          For more detail on how Google handles data from sites that use its
          services, see{" "}
          <a
            href="https://policies.google.com/technologies/partner-sites"
            rel="noopener noreferrer nofollow"
            target="_blank"
          >
            Google&apos;s partner sites policy
          </a>
          .
        </p>
        <p>
          Blocking cookies in your browser settings does not stop you using any
          tool on this site — every tool works with cookies disabled.
        </p>
      </>
    ) : (
      <p>
        We do not use tracking or advertising cookies. Preferences such as saved
        tool inputs are kept in your browser&apos;s local storage rather than in
        cookies.
      </p>
    ),
  },
  {
    id: "third-parties",
    heading: "Third parties",
    body: (
      <>
        <p>
          <strong>We do not sell your data.</strong> We have nothing to sell —
          there is no customer database.
        </p>
        <p>The parties that necessarily see some data are:</p>
        <ul>
          <li>
            <strong>Our hosting provider</strong>, which operates the servers and
            generates the access logs described above.
          </li>
          {SITE.showsAds && (
            <li>
              <strong>Advertising partners</strong>, as described in the cookies
              section.
            </li>
          )}
          {SITE.analytics && (
            <li>
              <strong>Our analytics provider</strong>, which receives aggregate
              page-view data with no personal identifiers.
            </li>
          )}
        </ul>
        <p>
          Pages on this site sometimes link to external websites. Once you follow
          such a link you are on someone else&apos;s site, governed by their
          privacy policy rather than this one.
        </p>
      </>
    ),
  },
  {
    id: "your-rights",
    heading: "Your rights",
    body: (
      <>
        <p>
          Depending on where you live, data protection law such as the UK and EU
          GDPR or the California Consumer Privacy Act gives you the right to
          access, correct, delete or restrict the use of your personal data, and
          to object to how it is processed.
        </p>
        <p>
          In practice we hold very little that could identify you: server logs,
          and any email you have sent us. To ask what we hold or to have it
          deleted, email{" "}
          <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>. We
          respond within {SITE.responseTimeDays}.
        </p>
        <p>
          Data in your browser&apos;s local storage is entirely under your
          control — clearing your site data removes it without contacting us.
        </p>
      </>
    ),
  },
  {
    id: "children",
    heading: "Children",
    body: (
      <p>
        This site is a general-purpose set of utilities and is not directed at
        children under 13. We do not knowingly collect personal information from
        children. If you believe a child has sent us personal information, email{" "}
        <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a> and we
        will delete it.
      </p>
    ),
  },
  {
    id: "changes",
    heading: "Changes to this policy",
    body: (
      <p>
        We update this policy when the site changes — for example if a new tool
        needs server-side processing, or if we add or remove an advertising or
        analytics provider. The date at the top of this page shows when it was
        last revised. Continuing to use the site after a change means you accept
        the revised policy.
      </p>
    ),
  },
  {
    id: "contact",
    heading: "Contact us",
    body: (
      <p>
        Questions about this policy, or about how a particular tool handles your
        data, can go to{" "}
        <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>, or
        through the <Link href="/contact">contact page</Link>.
      </p>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      h1="Privacy Policy"
      description={DESCRIPTION}
      path={PATH}
      intro={
        <p>
          This policy explains what {SITE.name} does with your data. The short
          answer is that nearly everything happens inside your browser and never
          reaches us — but there are two exceptions and some advertising cookies,
          and those are set out in full below rather than buried.
        </p>
      }
      sections={SECTIONS}
    />
  );
}
