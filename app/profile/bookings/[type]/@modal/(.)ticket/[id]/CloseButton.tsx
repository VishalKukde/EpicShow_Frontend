"use client";

import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";

export default function CloseButton({ closeHref }: { closeHref: string }) {
  const router = useRouter();
    const mode = useThemeStore((s) => s.mode);
    const dark = mode === "dark";

  const closeModal = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(closeHref);
    }
  };

  return (
    <button
      onClick={closeModal}
      className={`absolute right-3 top-3 z-20 rounded-full ${dark ? "bg-zinc-800" : "white/90"} p-1.5 shadow transition hover:bg-white cursor-pointer sm:right-4 sm:top-4 sm:p-2`}
    >
      <X size={14} className="sm:h-4 sm:w-4" />
    </button>
  );
}
