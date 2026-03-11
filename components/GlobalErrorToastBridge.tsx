"use client";

import { useEffect } from "react";
import { toast } from "@/lib/toast";

export default function GlobalErrorToastBridge() {
  useEffect(() => {
    const onWindowError = (event: ErrorEvent) => {
      const message = event.error?.message || event.message || "Unexpected error occurred.";
      if (message) {
        toast.error(message);
      }
    };

    const onUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      const message =
        reason instanceof Error
          ? reason.message
          : typeof reason === "string"
            ? reason
            : "Unexpected request failure. Please try again.";
      toast.error(message);
    };

    window.addEventListener("error", onWindowError);
    window.addEventListener("unhandledrejection", onUnhandledRejection);

    return () => {
      window.removeEventListener("error", onWindowError);
      window.removeEventListener("unhandledrejection", onUnhandledRejection);
    };
  }, []);

  return null;
}

