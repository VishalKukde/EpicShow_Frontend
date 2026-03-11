"use client";

import type { FormEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Bot, SendHorizontal, Sparkles, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useAskEpicAiStore } from "@/store/askEpicAiStore";
import { useThemeStore } from "@/store/themeStore";
import {
  detectIntentFromText,
  getNodeById,
  getNodeQuickReplies,
  getNodeText,
  intents,
  resolveQuickReplyFromText,
  rootNodeId,
  type QuickReply,
} from "@/app/profile/chat/ruleEngine";

type AskMessage = {
  id: string;
  role: "assistant" | "user";
  text: string;
  time: string;
  quickReplies?: QuickReply[];
};

type AskEpicAiPanelProps = {
  className?: string;
  closeHref?: string;
  mobileBackHref?: string;
  showDesktopClose?: boolean;
  showMobileBack?: boolean;
  onDesktopClose?: () => void;
  onMobileBack?: () => void;
};

const formatTime = () =>
  new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(new Date());

const createId = () => `${Date.now()}_${Math.random().toString(16).slice(2)}`;

export default function AskEpicAiPanel({
  className,
  closeHref = "/",
  mobileBackHref = "/",
  showDesktopClose = true,
  showMobileBack = true,
  onDesktopClose,
  onMobileBack,
}: AskEpicAiPanelProps) {
  const router = useRouter();
  const { user } = useAuth();
  const closeAskEpicAi = useAskEpicAiStore((state) => state.close);
  const mode = useThemeStore((s) => s.mode);
  const dark = mode === "dark";
  const listRef = useRef<HTMLDivElement>(null);
  const typingTimer = useRef<number | null>(null);
  const historyRef = useRef<string[]>([]);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeNodeId, setActiveNodeId] = useState(rootNodeId);
  const [messages, setMessages] = useState<AskMessage[]>([]);

  const panelTone = useMemo(
    () =>
      dark
        ? {
            shell: "bg-zinc-900 border-zinc-700",
            header: "bg-zinc-800 border-zinc-700",
            chatBg: "bg-zinc-900",
            footer: "bg-zinc-900 border-zinc-700",
            input: "bg-zinc-800 text-zinc-100 placeholder-zinc-400 ring-1 ring-zinc-600",
            botBubble: "bg-zinc-800 text-zinc-100",
            userBubble: "bg-zinc-700 text-zinc-100",
            meta: "text-zinc-400",
            quick: "border-zinc-600 bg-zinc-800 text-zinc-200 hover:bg-zinc-700",
          }
        : {
            shell: "bg-[#eff4ff] border-[#bfcfff]",
            header: "bg-[#2563eb] border-[#1d4ed8]",
            chatBg:
              "bg-[#f5f8ff] bg-[linear-gradient(rgba(59,130,246,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.08)_1px,transparent_1px)] bg-[size:22px_22px]",
            footer: "bg-[#eff4ff] border-[#bfcfff]",
            input: "bg-white text-[#0f172a] placeholder-[#64748b] ring-1 ring-[#c7d7ff]",
            botBubble: "bg-white text-[#0f172a] ring-1 ring-[#d7e4ff]",
            userBubble: "bg-[#dbeafe] text-[#1e3a8a]",
            meta: "text-[#64748b]",
            quick: "border-[#bfdbfe] bg-[#eef4ff] text-[#1d4ed8] hover:bg-[#e0ecff]",
          },
    [dark],
  );

  const scrollToBottom = (behavior: ScrollBehavior = "auto") => {
    if (!listRef.current) return;
    listRef.current.scrollTo({ top: listRef.current.scrollHeight, behavior });
  };

  const pushAssistantNode = (nodeId: string, pushHistory = false) => {
    const node = getNodeById(nodeId);

    if (pushHistory) {
      historyRef.current = [...historyRef.current, activeNodeId];
    }

    setActiveNodeId(node.id);
    setIsTyping(true);

    if (typingTimer.current) {
      window.clearTimeout(typingTimer.current);
    }

    typingTimer.current = window.setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: createId(),
          role: "assistant",
          text: getNodeText(node.id, { userName: user?.name }),
          time: formatTime(),
          quickReplies: getNodeQuickReplies(node.id, { hideBack: true, includeFeedback: true }),
        },
      ]);
      setIsTyping(false);
    }, 380);
  };

  const resetConversation = () => {
    historyRef.current = [];
    setActiveNodeId(rootNodeId);
    setMessages([]);
    pushAssistantNode(rootNodeId);
  };

  const clearConversation = () => {
    setInput("");
    historyRef.current = [];
    setActiveNodeId(rootNodeId);
    setMessages([]);
    pushAssistantNode(rootNodeId);
  };

  const processQuickAction = (reply: QuickReply) => {
    const action = reply.action;

    if (action.type === "node") {
      pushAssistantNode(action.target, true);
      return;
    }

    if (action.type === "intent") {
      const intent = intents.find((item) => item.id === action.intentId);
      pushAssistantNode(intent ? intent.nodeId : "fallback", true);
      return;
    }

    if (action.type === "reset") {
      resetConversation();
      return;
    }

    if (action.type === "clear") {
      clearConversation();
      return;
    }

    if (action.type === "categories") {
      pushAssistantNode(rootNodeId, true);
      return;
    }

    if (action.type === "escalate") {
      pushAssistantNode("escalation", true);
      return;
    }

    if (action.type === "navigate") {
      closeAskEpicAi();
      router.push(action.href);
      return;
    }

    if (action.type === "back") {
      const previousNodeId = historyRef.current.pop();
      if (previousNodeId) {
        pushAssistantNode(previousNodeId, false);
      } else {
        pushAssistantNode(rootNodeId, false);
      }
    }
  };

  const sendMessage = (raw?: string, quickReply?: QuickReply) => {
    const value = (raw ?? input).trim();
    if (!value) return;

    setMessages((prev) => [
      ...prev,
      {
        id: createId(),
        role: "user",
        text: value,
        time: formatTime(),
      },
    ]);

    setInput("");
    requestAnimationFrame(() => scrollToBottom("smooth"));

    if (quickReply) {
      processQuickAction(quickReply);
      return;
    }

    const normalized = value.toLowerCase();
    if (normalized === "reset") {
      resetConversation();
      return;
    }

    if (normalized === "clear") {
      clearConversation();
      return;
    }

    const currentQuick = resolveQuickReplyFromText(activeNodeId, value);
    if (currentQuick) {
      processQuickAction(currentQuick);
      return;
    }

    const intent = detectIntentFromText(value);
    if (intent) {
      pushAssistantNode(intent.nodeId, true);
      return;
    }

    pushAssistantNode("fallback", true);
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendMessage();
  };

  useEffect(() => {
    if (!messages.length) {
      pushAssistantNode(rootNodeId);
    }

    return () => {
      if (typingTimer.current) {
        window.clearTimeout(typingTimer.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    requestAnimationFrame(() => scrollToBottom("auto"));
  }, [messages, isTyping]);

  return (
    <section
      className={`relative flex h-full min-h-0 w-full flex-col overflow-hidden overscroll-y-none border ${panelTone.shell} ${className ?? ""}`}
    >
      <header
        className={`sticky top-0 z-30 flex shrink-0 items-center gap-2 border-b px-3 pt-[calc(env(safe-area-inset-top)+0.5rem)] pb-2 text-white sm:px-4 ${panelTone.header}`}
      >
        {showMobileBack ? (
          onMobileBack ? (
            <button
              type="button"
              onClick={onMobileBack}
              className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white/15 transition hover:bg-white/25 lg:hidden"
              aria-label="Back"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          ) : (
            <Link
              href={mobileBackHref}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/15 transition hover:bg-white/25 lg:hidden"
              aria-label="Back"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
          )
        ) : null}
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
          <Bot className="h-4 w-4" />
        </span>

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">Ask Epic AI</p>
          <p className="truncate text-[11px] text-blue-100">Online now</p>
        </div>

        {showDesktopClose ? (
          onDesktopClose ? (
            <button
              type="button"
              onClick={onDesktopClose}
              className="ml-auto inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white/15 transition hover:bg-white/25"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <Link
              href={closeHref}
              className="ml-auto inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/15 transition hover:bg-white/25"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </Link>
          )
        ) : null}
      </header>

      <div
        ref={listRef}
        className={`chat-scroll min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-3 py-3 sm:px-4 sm:py-4 ${panelTone.chatBg}`}
      >
        <div className="space-y-2.5">
          {messages.map((message) => {
            const isUser = message.role === "user";
            return (
              <div key={message.id} className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}>
                <div className={`flex max-w-[84%] flex-col ${isUser ? "items-end" : "items-start"}`}>
                  <article
                    className={`w-fit rounded-2xl px-3 py-2 text-sm leading-6 shadow-sm ${isUser ? `rounded-br-md ${panelTone.userBubble}` : `rounded-bl-md ${panelTone.botBubble}`}`}
                  >
                    {message.text}

                    {!isUser && message.quickReplies?.length ? (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {message.quickReplies.map((reply) => (
                          <button
                            key={`${message.id}_${reply.label}`}
                            type="button"
                            onClick={() => sendMessage(reply.label, reply)}
                            className={`cursor-pointer rounded-full border px-2.5 py-1 text-[11px] transition ${panelTone.quick}`}
                          >
                            {reply.label}
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </article>
                  <p className={`mt-1 px-1 text-[10px] ${panelTone.meta}`}>{message.time}</p>
                </div>
              </div>
            );
          })}

          {isTyping ? (
            <div className="flex justify-start">
              <div className={`inline-flex items-center gap-2 rounded-2xl rounded-bl-md px-3 py-2 text-xs ${panelTone.botBubble}`}>
                <Sparkles className="h-3.5 w-3.5" />
                <span className="inline-flex gap-1">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.2s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.1s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current" />
                </span>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <footer
        className={`sticky bottom-0 z-20 shrink-0 border-t px-3 pt-2 pb-[calc(env(safe-area-inset-bottom)+0.55rem)] sm:px-4 ${panelTone.footer}`}
      >
        <form onSubmit={onSubmit} className={`flex items-center gap-2 rounded-xl px-1.5 py-1.5 shadow-xl ${panelTone.input}`}>
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Type your issue (example: payment failed)"
            className="hero-search-input min-w-0 flex-1 rounded-xl bg-transparent px-2 py-2 text-sm outline-none"
          />
          <button
            type="submit"
            className="inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#1d4ed8] text-white transition hover:bg-[#1e40af]"
            aria-label="Send message"
          >
            <SendHorizontal className="h-4 w-4" />
          </button>
        </form>
      </footer>
    </section>
  );
}
