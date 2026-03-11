"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Bot, SendHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
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
} from "../ruleEngine";

type ChatMessage = {
  id: string;
  role: "bot" | "user";
  text: string;
  timestamp: string;
  quickReplies?: QuickReply[];
};

export type RuleBasedChatbotHandle = {
  resetChat: () => void;
  clearChat: () => void;
};

const formatTime = () =>
  new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(new Date());

const randomId = () => `${Date.now()}_${Math.random().toString(16).slice(2)}`;

const RuleBasedChatbot = forwardRef<RuleBasedChatbotHandle>(function RuleBasedChatbot(_, ref) {
  const router = useRouter();
  const { user } = useAuth();
  const mode = useThemeStore((s) => s.mode);
  const dark = mode === "dark";

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeNodeId, setActiveNodeId] = useState(rootNodeId);
  const historyRef = useRef<string[]>([]);
  const listRef = useRef<HTMLDivElement>(null);
  const typingTimer = useRef<number | null>(null);

  const scrollToBottom = (behavior: ScrollBehavior = "auto") => {
    if (!listRef.current) return;
    listRef.current.scrollTo({ top: listRef.current.scrollHeight, behavior });
  };

  const pushBotNode = (nodeId: string, pushHistory = false) => {
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
          id: randomId(),
          role: "bot",
          text: getNodeText(node.id, { userName: user?.name }),
          timestamp: formatTime(),
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
    pushBotNode(rootNodeId);
  };

  const clearConversation = () => {
    setMessages([]);
    setInput("");
    historyRef.current = [];
    setActiveNodeId(rootNodeId);
    pushBotNode(rootNodeId);
  };

  useImperativeHandle(ref, () => ({
    resetChat: resetConversation,
    clearChat: clearConversation,
  }));

  const processQuickAction = (reply: QuickReply) => {
    const action = reply.action;

    if (action.type === "node") {
      pushBotNode(action.target, true);
      return;
    }

    if (action.type === "intent") {
      const targetIntent = intents.find((item) => item.id === action.intentId);
      if (!targetIntent) {
        pushBotNode("fallback", true);
      } else {
        pushBotNode(targetIntent.nodeId, true);
      }
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
      pushBotNode(rootNodeId, true);
      return;
    }

    if (action.type === "escalate") {
      pushBotNode("escalation", true);
      return;
    }

    if (action.type === "navigate") {
      router.push(action.href);
      return;
    }

    if (action.type === "back") {
      const previousNodeId = historyRef.current.pop();
      if (previousNodeId) {
        pushBotNode(previousNodeId, false);
      } else {
        pushBotNode(rootNodeId, false);
      }
    }
  };

  const submitMessage = (rawText?: string, quickReply?: QuickReply) => {
    const text = (rawText ?? input).trim();
    if (!text) return;

    setMessages((prev) => [
      ...prev,
      {
        id: randomId(),
        role: "user",
        text,
        timestamp: formatTime(),
      },
    ]);

    setInput("");
    requestAnimationFrame(() => scrollToBottom("smooth"));

    if (quickReply) {
      processQuickAction(quickReply);
      return;
    }

    const normalized = text.toLowerCase();
    if (normalized === "reset") {
      resetConversation();
      return;
    }
    if (normalized === "clear") {
      clearConversation();
      return;
    }

    const currentQuick = resolveQuickReplyFromText(activeNodeId, text);
    if (currentQuick) {
      processQuickAction(currentQuick);
      return;
    }

    const intent = detectIntentFromText(text);
    if (intent) {
      pushBotNode(intent.nodeId, true);
      return;
    }

    pushBotNode("fallback", true);
  };

  useEffect(() => {
    if (!messages.length) {
      pushBotNode(rootNodeId);
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
    <div
      className={`flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border ${
        dark ? "border-zinc-700 bg-zinc-900" : "border-[#bfcfff] bg-[#eff4ff]"
      }`}
    >
      <div
        ref={listRef}
        className={`chat-scroll min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-[5px] py-[5px] sm:px-4 sm:py-3.5 ${
          dark
            ? "bg-zinc-900"
            : "bg-[#f5f8ff] bg-[linear-gradient(rgba(59,130,246,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.08)_1px,transparent_1px)] bg-[size:22px_22px]"
        }`}
      >
        <div className="space-y-2.5">
          {messages.map((message) => {
            const isUser = message.role === "user";
            return (
              <div
                key={message.id}
                className={`animate-[fadeIn_0.2s_ease-out] flex w-full ${isUser ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex max-w-[92%] flex-col ${isUser ? "items-end" : "items-start"} sm:max-w-[84%] lg:max-w-[72%]`}>
                  <article
                    className={`w-fit max-w-full rounded-2xl px-3 py-2 shadow-sm ${
                      isUser
                        ? dark
                          ? "rounded-br-md bg-[#1d4ed8] text-[#eaf2ff]"
                          : "rounded-br-md bg-[#dbeafe] text-[#1e3a8a]"
                        : dark
                          ? "rounded-bl-md bg-zinc-800 text-zinc-100"
                          : "rounded-bl-md bg-white text-[#0f172a] ring-1 ring-[#d7e4ff]"
                    }`}
                  >
                    <p className="text-sm leading-6">{message.text}</p>

                    {!isUser && message.quickReplies?.length ? (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {message.quickReplies.map((reply) => (
                          <button
                            key={`${message.id}_${reply.label}`}
                            type="button"
                            onClick={() => submitMessage(reply.label, reply)}
                            className={`cursor-pointer rounded-full border px-2.5 py-1 text-[11px] transition ${
                              dark
                                ? "border-zinc-600 bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
                                : "border-[#bfdbfe] bg-[#eef4ff] text-[#1d4ed8] hover:bg-[#e0ecff]"
                            }`}
                          >
                            {reply.label}
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </article>
                  <p className={`mt-1 px-1 text-[10px] ${dark ? "text-zinc-400" : "text-[#64748b]"}`}>
                    {message.timestamp}
                  </p>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex justify-start">
              <div
                className={`inline-flex items-center gap-2 rounded-2xl rounded-bl-md px-3 py-2 text-xs ${
                  dark ? "bg-zinc-800 text-zinc-200" : "bg-white text-[#475569] ring-1 ring-[#d7e4ff]"
                }`}
              >
                <Bot className="h-3.5 w-3.5" />
                <span className="inline-flex gap-1">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.2s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.1s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current" />
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div
        className={`sticky bottom-0 z-10 shrink-0 border-t px-3 pt-2 pb-[calc(env(safe-area-inset-bottom)+0.55rem)] ${
          dark ? "border-zinc-700 bg-zinc-900" : "border-[#bfcfff] bg-[#eff4ff]"
        }`}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submitMessage();
          }}
          className={`flex items-center gap-2 rounded-xl px-1.5 py-1.5 shadow-xl ${
            dark ? "bg-zinc-800 ring-1 ring-zinc-600" : "bg-white ring-1 ring-[#c7d7ff]"
          }`}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your issue (example: payment failed)"
            className={`min-w-0 flex-1 rounded-xl bg-transparent px-2 py-2 text-sm outline-none transition ${
              dark
                ? "text-zinc-100 placeholder-zinc-400"
                : "text-[#0f172a] placeholder-[#64748b]"
            }`}
          />
          <button
            type="submit"
            className="inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#1d4ed8] text-white transition hover:bg-[#1e40af]"
            aria-label="Send message"
          >
            <SendHorizontal className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
});

RuleBasedChatbot.displayName = "RuleBasedChatbot";

export default RuleBasedChatbot;
