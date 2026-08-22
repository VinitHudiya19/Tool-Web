/**
 * Single source of truth for site-wide facts.
 *
 * Anything stated publicly — the contact address, the tool count, whether ads
 * run — belongs here so it cannot drift between pages, and so a claim only has
 * to be corrected in one place.
 */

import { SITE_URL } from "@/lib/seo/schema";

export const SITE = {
  name: "QuickToolz",
  /** Derived from SITE_URL so the canonical host is defined in exactly one place. */
  url: SITE_URL,
  domain: SITE_URL.replace(/^https?:\/\//, ""),

  /**
   * Public contact address. Used on the contact page, in the privacy policy and
   * in the Organization schema.
   *
   * Change this to a branded address (for example hello@quicktoolz.tech) once
   * that mailbox exists — it is shown publicly and must be monitored.
   */
  contactEmail: "teamworkhive@gmail.com",

  /** How quickly the contact page promises a reply. Keep this achievable. */
  responseTimeDays: "2–3 business days",

  /**
   * Set to true once Google AdSense (or any ad network) is live.
   * The privacy policy renders its advertising and cookie disclosures from
   * this flag, so the policy can never fall out of step with reality.
   */
  showsAds: false,

  /**
   * Analytics in use, or null when none is running.
   *
   * Google Analytics sets first-party cookies, so naming it here makes the
   * privacy policy render its cookie disclosure. Leave this null if the
   * measurement ID is ever removed, or the policy will describe tracking the
   * site is not doing.
   */
  analytics: "Google Analytics 4" as string | null,

  /** GA4 measurement ID. Empty disables analytics entirely. */
  analyticsId: process.env.NEXT_PUBLIC_GA_ID ?? "G-NCWT4XME65",
} as const;

/** ISO date these documents were last reviewed. Update when you edit them. */
export const LEGAL_LAST_UPDATED = "2026-08-02";

export function formatLegalDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
