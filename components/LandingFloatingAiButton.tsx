"use client";

import { usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";
import { useAskEpicAiStore } from "@/store/askEpicAiStore";
import { useThemeStore } from "@/store/themeStore";

export default function LandingFloatingAiButton() {
  const pathname = usePathname();
  const openAskEpicAi = useAskEpicAiStore((state) => state.open);
  const isOpen = useAskEpicAiStore((state) => state.isOpen);
  const mode = useThemeStore((s) => s.mode);
  const dark = mode === "dark";

  // Strict route check: only render on the exact root landing page route "/"
  if (pathname !== "/") return null;

  // If the drawer is already open, hide the button so it doesn't overlap
  if (isOpen) return null;

  return (
    <div className="fixed bottom-20 right-4 sm:bottom-7 sm:right-7 z-[60] select-none">
      <button
        type="button"
        onClick={openAskEpicAi}
        aria-label="Ask EpicShow AI"
        className={`group relative flex cursor-pointer items-center rounded-full p-3 sm:p-3.5 text-white shadow-lg shadow-indigo-600/30 transition-all duration-300 ease-out active:scale-95 ${
          dark
            ? "bg-indigo-600 hover:bg-indigo-500 hover:shadow-indigo-500/40"
            : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-700/40"
        }`}
      >
        {/* Single-color Sparkles Icon */}
        <span className="relative flex items-center justify-center">
          <Sparkles
            className="h-5 w-5 text-white transition-transform duration-300 ease-out group-hover:rotate-12 group-hover:scale-110"
          />
        </span>

        {/* Hover expanding text: "Ask EpicShow" */}
        <span className="max-w-0 overflow-hidden whitespace-nowrap text-xs sm:text-sm font-semibold tracking-tight opacity-0 transition-all duration-300 ease-out group-hover:max-w-[130px] group-hover:pl-2.5 group-hover:pr-1 group-hover:opacity-100">
          Epic AI
        </span>
      </button>
    </div>
  );
}
