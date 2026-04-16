"use client";

import { useEffect, useRef, useState } from "react";
import { AlertTriangle, Bot, Loader2, RotateCcw, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useThemeStore } from "@/store/themeStore";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import RuleBasedChatbot, { type RuleBasedChatbotHandle } from "./components/RuleBasedChatbot";
import AssistantChat, { type AssistantChatHandle } from "./components/AssistantChat";

type SupportTab = "chatbot" | "assistant";
type ChatAction = "reset" | "delete";

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
  const assistantRef = useRef<AssistantChatHandle>(null);
  const [mobileViewportHeight, setMobileViewportHeight] = useState<number | null>(null);
  const [confirmationState, setConfirmationState] = useState<{
    action: ChatAction;
    tab: SupportTab;
  } | null>(null);
  const [confirmingAction, setConfirmingAction] = useState(false);

  const onResetChat = () => setConfirmationState({ action: "reset", tab: activeTab });

  const onClearChat = () => setConfirmationState({ action: "delete", tab: activeTab });

  const handleConfirmAction = async () => {
    if (!confirmationState || confirmingAction) return;

    setConfirmingAction(true);

    try {
      if (confirmationState.tab === "assistant") {
        if (confirmationState.action === "reset") {
          await assistantRef.current?.resetChat({ skipConfirm: true });
        } else {
          await assistantRef.current?.clearChat({ skipConfirm: true });
        }
        return;
      }

      if (confirmationState.action === "reset") {
        chatbotRef.current?.resetChat();
      } else {
        chatbotRef.current?.clearChat();
      }
    } finally {
      setConfirmingAction(false);
      setConfirmationState(null);
    }
  };
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

  useEffect(() => {
    if (!confirmationState) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !confirmingAction) {
        setConfirmationState(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [confirmationState, confirmingAction]);

  const confirmationTitle =
    confirmationState?.action === "reset" ? "Reset this chat?" : "Delete this chat history?";
  const confirmationDescription =
    confirmationState?.tab === "assistant"
      ? confirmationState.action === "reset"
        ? "You are about to reset this Live Assistant conversation. All messages will be permanently removed from the database and cannot be recovered."
        : "You are about to delete this Live Assistant conversation. All messages will be permanently removed from the database and cannot be recovered."
      : confirmationState?.action === "reset"
        ? "This will reset the current chatbot session and remove all messages shown in this window."
        : "This will clear the current chatbot session and remove all messages shown in this window.";
  const confirmationButtonLabel =
    confirmationState?.action === "reset" ? "Yes, reset chat" : "Yes, delete chat";
  const confirmationContextLabel =
    confirmationState?.tab === "assistant" ? "Live Assistant Support" : "Epic Chatbot Session";

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
                <p className="truncate text-sm font-semibold text-white">
                  {activeTab === "chatbot" ? "Epic Chatbot" : "Live Assistant Support"}
                </p>
                <p className="truncate text-[11px] text-blue-100">
                  {activeTab === "chatbot" ? "Rule-Based Support Chatbot" : "Real-time support with admin team"}
                </p>
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
                className={`inline-flex cursor-pointer items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-medium transition sm:text-[11px] ${
                  "border-white/35 bg-white/10 text-white hover:bg-white/20"
                }`}
                title="Reset chat"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
              <button
                type="button"
                onClick={onClearChat}
                className={`inline-flex cursor-pointer items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-medium transition sm:text-[11px] ${
                  "border-red-200/60 bg-red-500/20 text-red-100 hover:bg-red-500/35"
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
            <AssistantChat ref={assistantRef} />
          )}
        </div>
      </section>

      {confirmationState ? (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 px-4 backdrop-blur-[2px]"
          onClick={() => {
            if (!confirmingAction) setConfirmationState(null);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="chat-confirm-title"
            aria-describedby="chat-confirm-description"
            className={`w-full max-w-md rounded-2xl border shadow-2xl ${
              dark ? "border-zinc-700 bg-zinc-900 text-zinc-100" : "border-gray-200 bg-white text-gray-900"
            }`}
            onClick={(event) => event.stopPropagation()}
          >
            <div className={`border-b px-5 py-4 ${dark ? "border-zinc-700" : "border-gray-200"}`}>
              <span
                className={`inline-flex h-9 w-9 items-center justify-center rounded-full ${
                  confirmationState.action === "delete"
                    ? dark
                      ? "bg-red-500/20 text-red-300"
                      : "bg-red-50 text-red-600"
                    : dark
                      ? "bg-blue-500/20 text-blue-300"
                      : "bg-blue-50 text-blue-600"
                }`}
              >
                <AlertTriangle className="h-4 w-4" />
              </span>
              <p
                className={`mt-3 text-[11px] font-semibold uppercase tracking-[0.14em] ${
                  dark ? "text-zinc-300" : "text-gray-500"
                }`}
              >
                Confirmation Required
              </p>
              <h3 id="chat-confirm-title" className="mt-1 text-lg font-semibold">
                {confirmationTitle}
              </h3>
              <p id="chat-confirm-description" className={`mt-2 text-sm leading-relaxed ${dark ? "text-zinc-300" : "text-gray-600"}`}>
                {confirmationDescription}
              </p>
              <p
                className={`mt-3 inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${
                  dark ? "bg-zinc-800 text-zinc-200" : "bg-gray-100 text-gray-700"
                }`}
              >
                {confirmationContextLabel}
              </p>
            </div>

            <div className={`flex items-center justify-end gap-2 px-5 py-4 ${dark ? "bg-zinc-900" : "bg-white"}`}>
              <button
                type="button"
                disabled={confirmingAction}
                onClick={() => setConfirmationState(null)}
                className={`cursor-pointer rounded-lg px-4 py-2 text-sm font-medium transition ${
                  dark
                    ? "bg-zinc-800 text-zinc-100 hover:bg-zinc-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                } disabled:cursor-not-allowed disabled:opacity-70`}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={confirmingAction}
                onClick={() => {
                  void handleConfirmAction();
                }}
                className={`inline-flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-80 ${
                  confirmationState.action === "delete"
                    ? dark
                      ? "bg-red-500 hover:bg-red-400"
                      : "bg-red-600 hover:bg-red-500"
                    : dark
                      ? "bg-blue-500 hover:bg-blue-400"
                      : "bg-blue-600 hover:bg-blue-500"
                }`}
              >
                {confirmingAction ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  confirmationButtonLabel
                )}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
