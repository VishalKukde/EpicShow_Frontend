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
    const intervalMs = 14 * 60 * 1000;

    const warm = () => {
      try {
        void fetch(healthUrl, { cache: "no-store" }).catch(() => {});
      } catch {}
    };

    const w = window as unknown as {
      requestIdleCallback?: (callback: () => void, options?: { timeout?: number }) => number;
      cancelIdleCallback?: (handle: number) => void;
    };

    let idleHandle: number | undefined;
    let timeoutId: number | undefined;
    let intervalId: number | undefined;

    if (typeof w.requestIdleCallback === "function") {
      idleHandle = w.requestIdleCallback(warm, { timeout: 2000 });
    } else {
      timeoutId = window.setTimeout(warm, 500);
    }

    intervalId = window.setInterval(warm, intervalMs);

    return () => {
      if (idleHandle !== undefined) w.cancelIdleCallback?.(idleHandle);
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
      if (intervalId !== undefined) window.clearInterval(intervalId);
    };
  }, []);

  return null;
}
