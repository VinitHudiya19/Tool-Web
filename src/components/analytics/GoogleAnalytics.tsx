import Script from "next/script";

import { SITE } from "@/lib/site.config";

/**
 * Google Analytics 4.
 *
 * Loaded with `afterInteractive` so it never blocks first paint — analytics
 * must not cost the Core Web Vitals score the rest of the site is built to
 * protect.
 *
 * Renders nothing when no measurement ID is configured, which keeps local
 * development and preview deployments out of the production property, and
 * means the privacy policy's cookie disclosure and the actual behaviour cannot
 * drift apart.
 */
export default function GoogleAnalytics() {
  const id = SITE.analyticsId;
  if (!id) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${id}', {
            anonymize_ip: true
          });
        `}
      </Script>
    </>
  );
}
