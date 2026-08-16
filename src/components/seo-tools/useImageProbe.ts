"use client";

import { useEffect, useState } from "react";

import type { ImageStatus } from "@/lib/seo-tools/metaTags";
import { isAbsoluteUrl } from "@/lib/seo-tools/jsonLd";

/**
 * Loads an image URL to confirm it is reachable and measure it.
 *
 * The load is debounced so typing a URL does not fire a request per keystroke,
 * and any in-flight load is abandoned when the URL changes.
 */
export function useImageProbe(url: string, delay = 600): ImageStatus {
  const [status, setStatus] = useState<ImageStatus>({ state: "idle" });

  useEffect(() => {
    const trimmed = url.trim();

    if (!trimmed || !isAbsoluteUrl(trimmed)) {
      // Setting state inside the timeout keeps this out of the effect body.
      const reset = setTimeout(() => setStatus({ state: "idle" }), 0);
      return () => clearTimeout(reset);
    }

    let cancelled = false;

    const timer = setTimeout(() => {
      setStatus({ state: "loading" });

      const image = new Image();

      image.onload = () => {
        if (cancelled) return;
        setStatus({
          state: "loaded",
          width: image.naturalWidth,
          height: image.naturalHeight,
        });
      };

      image.onerror = () => {
        if (!cancelled) setStatus({ state: "error" });
      };

      image.src = trimmed;
    }, delay);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [url, delay]);

  return status;
}
