"use client";

import { useEffect } from "react";

function getHealthUrl(baseUrl: string) {
  return `${baseUrl.replace(/\/+$/, "")}/health`;
}

export default function BackendWarmup() {
  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!baseUrl) return;

    const healthUrl = getHealthUrl(baseUrl);

    const warm = () => {
      try {
        void fetch(healthUrl, { cache: "no-store" }).catch(() => {});
      } catch {}
    };

    const w = window as unknown as {
      requestIdleCallback?: (callback: () => void, options?: { timeout?: number }) => number;
      cancelIdleCallback?: (handle: number) => void;
    };

    if (typeof w.requestIdleCallback === "function") {
      const handle = w.requestIdleCallback(warm, { timeout: 2000 });
      return () => w.cancelIdleCallback?.(handle);
    }

    const timeoutId = window.setTimeout(warm, 500);
    return () => window.clearTimeout(timeoutId);
  }, []);

  return null;
}

