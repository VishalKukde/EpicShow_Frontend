"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, Headphones, MessageSquareText, RotateCcw, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useThemeStore } from "@/store/themeStore";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import RuleBasedChatbot, { type RuleBasedChatbotHandle } from "./components/RuleBasedChatbot";

type SupportTab = "chatbot" | "assistant";

const tabs: Array<{ id: SupportTab; label: string }> = [
  { id: "chatbot", label: "Chatbot" },
  { id: "assistant", label: "Assistant" },
];

export default function ChatPage() {
  return (
    <ProtectedRoute>
      <ChatPageContent />
    </ProtectedRoute>
  );
}

function ChatPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const mode = useThemeStore((s) => s.mode);
  const dark = mode === "dark";
  const queryTab = searchParams.get("tab");
  const activeTab: SupportTab = queryTab === "assistant" ? "assistant" : "chatbot";
  const chatbotRef = useRef<RuleBasedChatbotHandle>(null);
  const [mobileViewportHeight, setMobileViewportHeight] = useState<number | null>(null);

  const onResetChat = () => chatbotRef.current?.resetChat();
  const onClearChat = () => chatbotRef.current?.clearChat();
  const chatbotActive = activeTab === "chatbot";

  const handleTabChange = (tab: SupportTab) => {
    if (tab === activeTab) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    const syncViewportHeight = () => {
      const isMobile = window.matchMedia("(max-width: 1023px)").matches;
      if (!isMobile) {
        setMobileViewportHeight(null);
        return;
      }

      const nextHeight = Math.round(window.visualViewport?.height ?? window.innerHeight);
      setMobileViewportHeight(nextHeight);
      if (window.scrollY > 0) {
        window.scrollTo(0, 0);
      }
    };

    syncViewportHeight();
    window.addEventListener("resize", syncViewportHeight);
    window.visualViewport?.addEventListener("resize", syncViewportHeight);
    window.visualViewport?.addEventListener("scroll", syncViewportHeight);

    return () => {
      window.removeEventListener("resize", syncViewportHeight);
      window.visualViewport?.removeEventListener("resize", syncViewportHeight);
      window.visualViewport?.removeEventListener("scroll", syncViewportHeight);
    };
  }, []);

  return (
    <div
      className="h-[100svh] min-h-0 overflow-hidden overscroll-y-none lg:h-[calc(100dvh-7rem)] select-none"
      style={mobileViewportHeight ? { height: `${mobileViewportHeight}px` } : undefined}
    >
      <section
        className={`mx-auto flex h-full w-full flex-col overflow-hidden rounded-[1.4rem] border p-[5px] sm:p-3 ${
          dark ? "border-zinc-700 bg-zinc-900" : "border-[#bfcfff] bg-[#eff4ff]"
        }`}
      >
        <header
          className={`sticky top-0 z-20 shrink-0 rounded-xl px-[5px] py-[5px] sm:px-4 sm:py-2.5 ${
            dark ? "bg-zinc-800" : "bg-[#2563eb]"
          }`}
        >
          <div className="flex flex-wrap items-start gap-2">
            <div className="min-w-0 flex items-center gap-2.5">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white">
                <Bot className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">Epic Chatbot</p>
                <p className="truncate text-[11px] text-blue-100">Rule-Based Support Chatbot</p>
              </div>
            </div>

            <div className="ml-auto flex max-w-[75%] flex-wrap items-center justify-end gap-1.5">
              <div className="relative grid grid-cols-2 rounded-full bg-white/15 p-0.5">
                <motion.span
                  className="absolute inset-y-0.5 w-[calc(50%-2px)] rounded-full bg-white shadow-sm"
                  initial={false}
                  animate={{ x: activeTab === "chatbot" ? 2 : "calc(100% + 2px)" }}
                  transition={{ type: "spring", stiffness: 360, damping: 30 }}
                />

                {tabs.map((tab) => {
                  const active = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => handleTabChange(tab.id)}
                      className={`relative z-10 cursor-pointer rounded-full px-2.5 py-1 text-[10px] font-medium transition-colors sm:text-[11px] ${
                        active ? dark ? "text-white/90 hover:text-white" : "text-[#111b21]" : "text-white/90 hover:text-white"
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={onResetChat}
                disabled={!chatbotActive}
                className={`inline-flex cursor-pointer items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-medium transition sm:text-[11px] ${
                  chatbotActive
                    ? "border-white/35 bg-white/10 text-white hover:bg-white/20"
                    : "cursor-not-allowed border-white/15 bg-white/5 text-white/45"
                }`}
                title="Reset chat"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
              <button
                type="button"
                onClick={onClearChat}
                disabled={!chatbotActive}
                className={`inline-flex cursor-pointer items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-medium transition sm:text-[11px] ${
                  chatbotActive
                    ? "border-red-200/60 bg-red-500/20 text-red-100 hover:bg-red-500/35"
                    : "cursor-not-allowed border-white/15 bg-white/5 text-white/45"
                }`}
                title="Clear chat"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Clear</span>
              </button>
            </div>
          </div>
        </header>

        <div className="mt-2 min-h-0 flex-1 overflow-hidden">
          {activeTab === "chatbot" ? (
            <RuleBasedChatbot ref={chatbotRef} />
          ) : (
            <div
              className={`flex h-full flex-col items-center justify-center rounded-2xl border p-6 text-center ${
                dark ? "border-zinc-700 bg-zinc-900 text-zinc-200" : "border-[#bfcfff] bg-white text-gray-700"
              }`}
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1d4ed8] text-white">
                <Headphones className="h-7 w-7" />
              </div>
              <h2 className={`mt-4 text-lg font-semibold ${dark ? "text-white" : "text-gray-900"}`}>
                Assistant support coming soon
              </h2>
              <p className={`mt-2 text-sm ${dark ? "text-zinc-300" : "text-gray-600"}`}>
                Live assistant support is currently unavailable on this panel. Please use the Chatbot tab for instant
                rule-based help.
              </p>
              <div
                className={`mx-auto mt-5 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${
                  dark ? "bg-zinc-800 text-zinc-200" : "bg-indigo-50 text-indigo-700"
                }`}
              >
                <MessageSquareText className="h-3.5 w-3.5" />
                Placeholder tab only
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
