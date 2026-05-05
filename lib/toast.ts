"use client";

type ToastLevel = "success" | "error" | "warning" | "info";
type ToastOptions = {
  position?: "top-end" | "bottom-end";
  slide?: boolean;
};

const DEFAULT_TIMER_MS = 5000;

function getToastTimer() {
  if (typeof window === "undefined") return DEFAULT_TIMER_MS;
  const root = document.documentElement;
  const raw = getComputedStyle(root).getPropertyValue("--app-toast-timer").trim();
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) ? parsed : DEFAULT_TIMER_MS;
}

async function getSwal() {
  const mod = await import("sweetalert2");
  return mod.default;
}

async function fireToast(
  level: ToastLevel,
  message: string,
  title?: string,
  options: ToastOptions = {}
) {
  if (typeof window === "undefined") return;

  const Swal = await getSwal();
  const timer = getToastTimer();
  const popupClass = options.slide
    ? "app-toast-popup app-toast-slide"
    : "app-toast-popup";

  await Swal.fire({
    toast: true,
    icon: level,
    title: title || message,
    text: title ? message : undefined,
    position: options.position || "bottom-end",
    timer,
    timerProgressBar: false,
    showConfirmButton: false,
    showCloseButton: true,
    showClass: {
      popup: options.slide ? "app-toast-slide-in" : "",
    },
    hideClass: {
      popup: options.slide ? "app-toast-slide-out" : "",
    },
    customClass: {
      container: "app-toast-container",
      popup: popupClass,
      title: "app-toast-title",
      htmlContainer: "app-toast-text",
      closeButton: "app-toast-close",
    },
    didOpen: (toast) => {
      const container = toast.parentElement as HTMLElement | null;
      if (container) {
        const root = document.documentElement;
        const bottomOffset = getComputedStyle(root)
          .getPropertyValue("--app-toast-bottom")
          .trim();
        const topOffset = getComputedStyle(root)
          .getPropertyValue("--app-toast-top")
          .trim();
        if (topOffset || options.position === "top-end") {
          container.style.top = topOffset || "1rem";
          container.style.bottom = "auto";
        } else {
          container.style.bottom = bottomOffset || "1rem";
          container.style.top = "auto";
        }
        container.style.right = "1rem";
        container.style.left = "auto";
        container.style.padding = "0";
      }
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });
}

export const toast = {
  success: (message: string, title?: string) => {
    void fireToast("success", message, title);
  },
  walletCredit: (message: string) => {
    void fireToast("success", message, undefined, {
      position: "bottom-end",
      slide: true,
    });
  },
  error: (message: string, title?: string) => {
    void fireToast("error", message, title);
  },
  warning: (message: string, title?: string) => {
    void fireToast("warning", message, title);
  },
  info: (message: string, title?: string) => {
    void fireToast("info", message, title);
  },
};
