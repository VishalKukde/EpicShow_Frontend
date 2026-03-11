"use client";

import { useState } from "react";
import { MessageCircleMore } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useThemeStore } from "@/store/themeStore";
import { useAuth } from "@/context/AuthContext";

export default function FloatingChatButton() {
  const pathname = usePathname();
  const router = useRouter();
  const mode = useThemeStore((s) => s.mode);
  const { user, loading } = useAuth();
  const dark = mode === "dark";
  const [showGuestPrompt, setShowGuestPrompt] = useState(false);

  const isAuthEntryPage = pathname === "/login" || pathname === "/register";
  const isHomePage = pathname === "/";
  const isProfileRoute = pathname.startsWith("/profile");
  const isProfileMenuPage = pathname === "/profile/menu";
  const isCheckoutFlowPage =
    pathname.includes("/seat-layout") ||
    pathname.includes("/review") ||
    pathname.includes("/payment");

  const shouldHideOnProfile = isProfileRoute && !isProfileMenuPage;

  if (
    loading ||
    pathname === "/profile/chat" ||
    shouldHideOnProfile ||
    isAuthEntryPage ||
    isCheckoutFlowPage
  ) {
    return null;
  }
  if (!user && !isHomePage) return null;

  const handleOpenChat = () => {
    if (user) {
      router.push("/profile/chat");
      return;
    }
    setShowGuestPrompt(true);
  };

  return (
    <>
      {showGuestPrompt && !user ? (
        <div
          className={`fixed bottom-22 right-4 z-[75] hidden w-[280px] rounded-2xl border p-3 shadow-xl sm:bottom-24 sm:right-6 sm:block cursor-pointer ${
            dark ? "border-zinc-700 bg-zinc-900 text-zinc-100" : "border-gray-200 bg-white text-gray-800"
          }`}
        >
          <p className="text-sm font-semibold">Chat Support</p>
          <p className={`mt-1 text-xs ${dark ? "text-zinc-300" : "text-gray-600"}`}>
            Please log in to use the full chatbot support.
          </p>
          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={() => router.push("/login?redirect=/profile/chat")}
              className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-500"
            >
              Login to Continue
            </button>
            <button
              type="button"
              onClick={() => setShowGuestPrompt(false)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                dark ? "bg-zinc-800 text-zinc-200 hover:bg-zinc-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Close
            </button>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        onClick={handleOpenChat}
        aria-label="Open chat support"
        title="Chat With Us"
        className={`group fixed bottom-20 right-4 z-[70] hidden items-center justify-center rounded-full border shadow-[0_10px_35px_rgba(0,0,0,0.25)] backdrop-blur-xl transition-all duration-300 hover:scale-110 hover:shadow-[0_0_35px_rgba(99,102,241,0.55)] sm:bottom-6 sm:right-6 sm:flex sm:h-14 sm:w-14 animate-[chatPulse_2.6s_ease-in-out_infinite] cursor-pointer ${
          dark
            ? "border-zinc-600 bg-zinc-800/70 text-zinc-100"
            : "border-white/40 bg-white/45 text-indigo-700"
        }`}
      >
        <MessageCircleMore className="h-5 w-5 sm:h-6 sm:w-6" />
        <span className="pointer-events-none absolute -top-9 right-0 hidden whitespace-nowrap rounded-lg bg-gray-900 px-2 py-1 text-[11px] font-medium text-white opacity-0 transition group-hover:block group-hover:opacity-100">
          Chat With Us
        </span>
      </button>
    </>
  );
}
