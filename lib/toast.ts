"use client";

type ToastLevel = "success" | "error" | "warning" | "info";

const DEFAULT_TIMER_MS = 5000;

async function getSwal() {
  const mod = await import("sweetalert2");
  return mod.default;
}

async function fireToast(level: ToastLevel, message: string, title?: string) {
  if (typeof window === "undefined") return;

  const Swal = await getSwal();

  await Swal.fire({
    toast: true,
    icon: level,
    title: title || message,
    text: title ? message : undefined,
    position: "bottom-end",
    timer: DEFAULT_TIMER_MS,
    timerProgressBar: false,
    showConfirmButton: false,
    showCloseButton: true,
    showClass: {
      popup: "",
    },
    hideClass: {
      popup: "",
    },
    customClass: {
      popup: "app-toast-popup",
      title: "app-toast-title",
      htmlContainer: "app-toast-text",
      closeButton: "app-toast-close",
    },
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });
}

export const toast = {
  success: (message: string, title?: string) => {
    void fireToast("success", message, title);
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
