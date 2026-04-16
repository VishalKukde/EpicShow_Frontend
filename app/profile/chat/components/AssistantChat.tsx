"use client";

import {
  FormEvent,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { ArrowLeft, Loader2, SendHorizontal } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useThemeStore } from "@/store/themeStore";
import { apiFetch } from "@/lib/api";
import { getToken } from "@/lib/tokenStore";
import { socket } from "@/app/Socket";
import { toast } from "@/lib/toast";

type ChatMessage = {
  id: string;
  conversationUserId: string;
  senderId: string;
  senderRole: "user" | "admin";
  recipientId: string | null;
  recipientRole: "user" | "admin";
  text: string;
  createdAt: string;
  updatedAt: string;
  sender?: {
    id: string;
    name: string;
    role: "user" | "admin";
    avatar: string | null;
  } | null;
};

type ChatUser = {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  online: boolean;
  unreadCount: number;
  lastMessage: string;
  lastMessageAt: string | null;
  lastSenderRole: "user" | "admin" | null;
  lastLogin: string | null;
  createdAt: string | null;
};

type ChatSendAck = {
  ok: boolean;
  message?: string;
};

type TypingPayload = {
  conversationUserId?: string;
  userId?: string;
  role?: "user" | "admin";
  isTyping?: boolean;
};

type AdminPresencePayload = {
  online?: boolean;
  onlineCount?: number;
};

type ConversationClearedPayload = {
  conversationUserId?: string;
  clearedByUserId?: string | null;
  clearedByRole?: "user" | "admin";
  clearedAt?: string;
};

type ChatAvatarProps = {
  name: string;
  avatar: string | null | undefined;
  sizeClass: string;
  toneClass: string;
  textClass: string;
};

type OnlineDotProps = {
  dark: boolean;
  small?: boolean;
};

export type AssistantChatHandle = {
  resetChat: (options?: { skipConfirm?: boolean }) => Promise<void>;
  clearChat: (options?: { skipConfirm?: boolean }) => Promise<void>;
};

const formatTime = (value?: string | null) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
};

const truncate = (text: string, max = 42) => {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1)}...`;
};

const sortChatUsers = (users: ChatUser[]) =>
  [...users].sort((a, b) => {
    const aTime = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
    const bTime = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
    if (aTime !== bTime) return bTime - aTime;

    const aCreated = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const bCreated = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return bCreated - aCreated;
  });

const getInitials = (name: string) => {
  const value = name.trim();
  if (!value) return "U";
  const parts = value.split(/\s+/).slice(0, 2);
  return parts
    .map((part) => part[0]?.toUpperCase() || "")
    .join("") || "U";
};

function ChatAvatar({
  name,
  avatar,
  sizeClass,
  toneClass,
  textClass,
}: ChatAvatarProps) {
  const initials = getInitials(name);

  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full ${sizeClass} ${toneClass}`}
      aria-label={`${name} avatar`}
      title={name}
    >
      {avatar ? (
        <span
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${avatar})` }}
        />
      ) : null}
      <span className={`relative z-10 text-[11px] font-semibold ${textClass} ${avatar ? "opacity-0" : ""}`}>
        {initials}
      </span>
    </span>
  );
}

function OnlineDot({ dark, small = false }: OnlineDotProps) {
  const size = small ? "h-2 w-2" : "h-2.5 w-2.5";
  return (
    <span
      className={`${size} inline-block rounded-full bg-emerald-500 ${
        dark
          ? "ring-2 ring-zinc-900 shadow-[0_0_10px_rgba(16,185,129,0.45)]"
          : "ring-2 ring-white shadow-[0_0_0_1px_rgba(16,185,129,0.3),0_0_10px_rgba(16,185,129,0.6)]"
      }`}
    />
  );
}

const AssistantChat = forwardRef<AssistantChatHandle>(function AssistantChat(_, ref) {
  const { user } = useAuth();
  const mode = useThemeStore((s) => s.mode);
  const dark = mode === "dark";
  const isAdmin = user?.role === "admin";

  const [chatUsers, setChatUsers] = useState<ChatUser[]>([]);
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [clearingConversation, setClearingConversation] = useState(false);
  const [typingConversationIds, setTypingConversationIds] = useState<string[]>([]);
  const [isPeerTyping, setIsPeerTyping] = useState(false);
  const [adminPresence, setAdminPresence] = useState({ online: false, onlineCount: 0 });

  const activeUserIdRef = useRef<string | null>(null);
  const chatUsersRef = useRef<ChatUser[]>([]);
  const messageListRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const typingStopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sentTypingRef = useRef(false);

  const activeChatUser = useMemo(
    () => (isAdmin ? chatUsers.find((item) => item.id === activeUserId) ?? null : null),
    [activeUserId, chatUsers, isAdmin]
  );

  const resetUnreadForUser = useCallback((userId: string) => {
    setChatUsers((prev) =>
      sortChatUsers(
        prev.map((item) => (item.id === userId ? { ...item, unreadCount: 0 } : item))
      )
    );
  }, []);

  const mergeIncomingMessage = useCallback((incoming: ChatMessage) => {
    setMessages((prev) => {
      if (prev.some((item) => item.id === incoming.id)) return prev;
      return [...prev, incoming];
    });
  }, []);

  const clearTypingTimer = useCallback(() => {
    if (!typingStopTimerRef.current) return;
    clearTimeout(typingStopTimerRef.current);
    typingStopTimerRef.current = null;
  }, []);

  const emitTypingStatus = useCallback(
    (isTyping: boolean) => {
      if (!socket.connected) return;
      if (sentTypingRef.current === isTyping) return;
      if (isAdmin && !activeUserIdRef.current) return;

      sentTypingRef.current = isTyping;
      socket.emit("chat:typing", {
        isTyping,
        ...(isAdmin ? { targetUserId: activeUserIdRef.current } : {}),
      });
    },
    [isAdmin]
  );

  const stopTyping = useCallback(() => {
    clearTypingTimer();
    emitTypingStatus(false);
  }, [clearTypingTimer, emitTypingStatus]);

  const applyConversationClearedLocally = useCallback(
    (conversationUserId: string) => {
      if (!conversationUserId) return;

      setInput("");

      if (isAdmin) {
        setTypingConversationIds((prev) =>
          prev.filter((item) => item !== conversationUserId)
        );
        setChatUsers((prev) =>
          sortChatUsers(
            prev.map((item) =>
              item.id === conversationUserId
                ? {
                    ...item,
                    unreadCount: 0,
                    lastMessage: "",
                    lastMessageAt: null,
                    lastSenderRole: null,
                  }
                : item
            )
          )
        );

        if (activeUserIdRef.current === conversationUserId) {
          setMessages([]);
        }

        return;
      }

      if (conversationUserId !== user?.id) return;
      setMessages([]);
      setIsPeerTyping(false);
    },
    [isAdmin, user?.id]
  );

  const confirmAndClearConversation = useCallback(
    async (actionLabel: "reset" | "delete", options?: { skipConfirm?: boolean }) => {
      if (!user || clearingConversation) return;

      const targetConversationId = isAdmin ? activeUserId : user.id;
      if (!targetConversationId) {
        setErrorText("Choose a user before clearing messages.");
        return;
      }

      const peerName = isAdmin ? activeChatUser?.name || "this user" : "your support chat";
      const actionName = actionLabel === "reset" ? "Reset chat" : "Delete chat";
      const confirmationText = `This will permanently delete all messages for ${peerName} from the database. Continue?`;

      if (
        !options?.skipConfirm &&
        typeof window !== "undefined" &&
        !window.confirm(confirmationText)
      ) {
        return;
      }

      setClearingConversation(true);
      setErrorText("");
      stopTyping();

      try {
        const path = isAdmin
          ? `/chat/messages?userId=${encodeURIComponent(targetConversationId)}`
          : "/chat/messages";

        await apiFetch(path, { method: "DELETE" });
        applyConversationClearedLocally(targetConversationId);
        toast.success(`${actionName} completed`);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to clear conversation";
        setErrorText(message);
      } finally {
        setClearingConversation(false);
      }
    },
    [
      activeChatUser?.name,
      activeUserId,
      applyConversationClearedLocally,
      clearingConversation,
      isAdmin,
      stopTyping,
      user,
    ]
  );

  useImperativeHandle(
    ref,
    () => ({
      resetChat: async (options) => {
        await confirmAndClearConversation("reset", options);
      },
      clearChat: async (options) => {
        await confirmAndClearConversation("delete", options);
      },
    }),
    [confirmAndClearConversation]
  );

  const loadAdminUsers = useCallback(async () => {
    if (!isAdmin) return;

    setLoadingUsers(true);
    setErrorText("");

    try {
      const response = (await apiFetch("/chat/users")) as { users?: ChatUser[] };
      const users = sortChatUsers(response?.users ?? []);
      setChatUsers(users);
      setActiveUserId((current) => {
        if (current && users.some((item) => item.id === current)) return current;
        return users[0]?.id ?? null;
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to load chat users";
      setErrorText(message);
    } finally {
      setLoadingUsers(false);
    }
  }, [isAdmin]);

  const loadConversation = useCallback(
    async (targetUserId?: string | null) => {
      if (!user) return;

      setLoadingMessages(true);
      setErrorText("");

      try {
        if (isAdmin) {
          if (!targetUserId) {
            setMessages([]);
            return;
          }

          const response = (await apiFetch(`/chat/messages/${targetUserId}`)) as {
            messages?: ChatMessage[];
          };

          setMessages(response?.messages ?? []);
          resetUnreadForUser(targetUserId);
        } else {
          const response = (await apiFetch("/chat/messages")) as { messages?: ChatMessage[] };
          setMessages(response?.messages ?? []);
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to load conversation";
        setErrorText(message);
      } finally {
        setLoadingMessages(false);
      }
    },
    [isAdmin, resetUnreadForUser, user]
  );

  useEffect(() => {
    activeUserIdRef.current = activeUserId;
  }, [activeUserId]);

  useEffect(() => {
    chatUsersRef.current = chatUsers;
  }, [chatUsers]);

  useEffect(
    () => () => {
      clearTypingTimer();
    },
    [clearTypingTimer]
  );

  useEffect(() => {
    if (!user) return;

    if (isAdmin) {
      void loadAdminUsers();
      return;
    }

    void loadConversation();
  }, [isAdmin, loadAdminUsers, loadConversation, user]);

  useEffect(() => {
    if (!user || !isAdmin) return;

    if (!activeUserId) {
      setMessages([]);
      return;
    }

    void loadConversation(activeUserId);
  }, [activeUserId, isAdmin, loadConversation, user]);

  useEffect(() => {
    if (!user) return;
    if (isAdmin && !activeUserId) return;
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  }, [activeUserId, isAdmin, user]);

  useEffect(() => {
    if (!user) return;

    const token = getToken();
    if (!token) {
      setErrorText("Socket auth token missing. Please login again.");
      return;
    }

    socket.auth = { token };
    socket.connect();
    setSocketConnected(socket.connected);

    const handleConnect = () => {
      setSocketConnected(true);
      sentTypingRef.current = false;
    };

    const handleDisconnect = () => {
      setSocketConnected(false);
      sentTypingRef.current = false;
      setIsPeerTyping(false);
      clearTypingTimer();
    };

    const handleAdminStatus = (payload: AdminPresencePayload) => {
      if (isAdmin) return;

      setAdminPresence({
        online: Boolean(payload?.online),
        onlineCount: Number(payload?.onlineCount ?? 0),
      });
    };

    const handleUserStatus = (payload: { userId: string; online: boolean }) => {
      if (!isAdmin) return;

      setChatUsers((prev) =>
        sortChatUsers(
          prev.map((item) =>
            item.id === payload.userId ? { ...item, online: payload.online } : item
          )
        )
      );
    };

    const handleTyping = (payload: TypingPayload) => {
      const conversationId = payload?.conversationUserId;
      const typing = Boolean(payload?.isTyping);

      if (isAdmin) {
        if (payload?.role !== "user" || !conversationId) return;

        setTypingConversationIds((prev) => {
          const exists = prev.includes(conversationId);
          if (typing && exists) return prev;
          if (typing) return [...prev, conversationId];
          if (!exists) return prev;
          return prev.filter((item) => item !== conversationId);
        });
        return;
      }

      if (payload?.role !== "admin") return;
      setIsPeerTyping(typing);
    };

    const handleMessage = (incoming: ChatMessage) => {
      if (!incoming?.id || !incoming?.conversationUserId) return;

      if (isAdmin) {
        setTypingConversationIds((prev) =>
          prev.filter((item) => item !== incoming.conversationUserId)
        );

        const hasConversation = chatUsersRef.current.some(
          (item) => item.id === incoming.conversationUserId
        );

        if (!hasConversation) {
          void loadAdminUsers();
        }

        setChatUsers((prev) =>
          sortChatUsers(
            prev.map((item) => {
              if (item.id !== incoming.conversationUserId) return item;

              const isActiveConversation = activeUserIdRef.current === item.id;
              const unreadCount =
                incoming.senderRole === "user" && !isActiveConversation
                  ? (item.unreadCount ?? 0) + 1
                  : isActiveConversation
                    ? 0
                    : item.unreadCount ?? 0;

              return {
                ...item,
                unreadCount,
                lastMessage: incoming.text,
                lastMessageAt: incoming.createdAt,
                lastSenderRole: incoming.senderRole,
              };
            })
          )
        );

        if (activeUserIdRef.current !== incoming.conversationUserId) return;
      } else if (incoming.senderRole === "admin") {
        setIsPeerTyping(false);
      }

      mergeIncomingMessage(incoming);
    };

    const handleConversationCleared = (payload: ConversationClearedPayload) => {
      const conversationUserId =
        typeof payload?.conversationUserId === "string"
          ? payload.conversationUserId
          : "";
      if (!conversationUserId) return;

      applyConversationClearedLocally(conversationUserId);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("chat:admin:status", handleAdminStatus);
    socket.on("chat:user:status", handleUserStatus);
    socket.on("chat:typing", handleTyping);
    socket.on("chat:message", handleMessage);
    socket.on("chat:conversation:cleared", handleConversationCleared);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("chat:admin:status", handleAdminStatus);
      socket.off("chat:user:status", handleUserStatus);
      socket.off("chat:typing", handleTyping);
      socket.off("chat:message", handleMessage);
      socket.off("chat:conversation:cleared", handleConversationCleared);
      socket.disconnect();
    };
  }, [
    applyConversationClearedLocally,
    clearTypingTimer,
    isAdmin,
    loadAdminUsers,
    mergeIncomingMessage,
    user,
  ]);

  useEffect(() => {
    if (!messageListRef.current) return;
    messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
  }, [activeUserId, isPeerTyping, loadingMessages, messages, typingConversationIds]);

  const handleInputChange = useCallback(
    (value: string) => {
      setInput(value);
      if (!socketConnected) return;

      if (!value.trim()) {
        stopTyping();
        return;
      }

      emitTypingStatus(true);
      clearTypingTimer();
      typingStopTimerRef.current = setTimeout(() => {
        emitTypingStatus(false);
      }, 1100);
    },
    [clearTypingTimer, emitTypingStatus, socketConnected, stopTyping]
  );

  const sendMessage = useCallback(
    (event: FormEvent) => {
      event.preventDefault();

      const trimmedMessage = input.trim();
      if (!trimmedMessage || sending || clearingConversation) return;

      if (!socketConnected) {
        setErrorText("Socket disconnected. Reconnecting...");
        socket.connect();
        return;
      }

      if (isAdmin && !activeUserId) {
        setErrorText("Choose a user before sending a message.");
        return;
      }

      setSending(true);
      setErrorText("");
      stopTyping();

      socket.emit(
        "chat:send",
        {
          text: trimmedMessage,
          ...(isAdmin ? { targetUserId: activeUserId } : {}),
        },
        (ack: ChatSendAck) => {
          setSending(false);
          if (!ack?.ok) {
            setErrorText(ack?.message || "Unable to send message");
            return;
          }
          setInput("");
          requestAnimationFrame(() => {
            inputRef.current?.focus();
          });
        }
      );
    },
    [activeUserId, clearingConversation, input, isAdmin, sending, socketConnected, stopTyping]
  );

  const selectUserConversation = (userId: string) => {
    if (activeUserIdRef.current !== userId) {
      stopTyping();
    }

    setActiveUserId(userId);
    resetUnreadForUser(userId);
    setTypingConversationIds((prev) => prev.filter((item) => item !== userId));
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  };

  if (!user) return null;

  const placeholder = isAdmin
    ? activeUserId
      ? `Message ${activeChatUser?.name || "user"}...`
      : "Choose a user to start chatting"
    : "Type your message...";

  const canSend =
    socketConnected &&
    !clearingConversation &&
    Boolean(input.trim()) &&
    (!isAdmin || Boolean(activeUserId));
  const showTypingIndicator = isAdmin
    ? Boolean(activeUserId && typingConversationIds.includes(activeUserId))
    : isPeerTyping;
  const headerPresenceOnline = isAdmin
    ? Boolean(activeChatUser?.online)
    : adminPresence.online;
  const headerStatusText = isAdmin
    ? activeChatUser
      ? ""
      : "Open a conversation from the list"
    : showTypingIndicator
      ? "Typing..."
      : adminPresence.online
        ? adminPresence.onlineCount > 1
          ? `${adminPresence.onlineCount} agents online`
          : "Agent online"
        : socketConnected
          ? "Waiting for support agent"
          : "Connecting...";
  const showHeaderPresenceDot = headerPresenceOnline && Boolean(activeChatUser || !isAdmin);
  const latestAdminMessage = !isAdmin
    ? [...messages].reverse().find((item) => item.senderRole === "admin")
    : null;
  const peerAvatar = isAdmin
    ? activeChatUser?.avatar ?? null
    : latestAdminMessage?.sender?.avatar ?? null;
  const peerName = isAdmin ? activeChatUser?.name ?? "User" : "Support";

  const renderMessageThread = (
    <section className="flex h-full min-h-0 flex-1 flex-col">
      <header
        className={`flex h-14 shrink-0 items-center gap-2 border-b px-3 ${
          dark
            ? "border-zinc-700 bg-zinc-900 text-zinc-100"
            : "border-[#d9e4ff] bg-[#f7f9ff] text-[#111827]"
        }`}
      >
        {isAdmin ? (
          <button
            type="button"
            onClick={() => {
              stopTyping();
              setActiveUserId(null);
            }}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-transparent text-zinc-500 hover:border-zinc-300 hover:text-zinc-800 lg:hidden dark:text-zinc-300 dark:hover:border-zinc-600 dark:hover:text-zinc-100"
            aria-label="Back to users"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
        ) : null}

        <div className="flex min-w-0 flex-1 items-center gap-2">
          <ChatAvatar
            name={peerName}
            avatar={peerAvatar}
            sizeClass="h-9 w-9"
            toneClass={dark ? "bg-zinc-800" : "bg-[#dbeafe]"}
            textClass={dark ? "text-zinc-300" : "text-[#1d4ed8]"}
          />

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="truncate text-sm font-semibold">
                {isAdmin ? activeChatUser?.name ?? "Select a user" : "Support Team"}
              </p>
              {showHeaderPresenceDot ? <OnlineDot dark={dark} /> : null}
            </div>
            {headerStatusText ? (
              <p className={`mt-0.5 truncate text-[11px] ${dark ? "text-zinc-400" : "text-zinc-500"}`}>
                {headerStatusText}
              </p>
            ) : null}
          </div>
        </div>
      </header>

      <div
        ref={messageListRef}
        className={`chat-scroll min-h-0 flex-1 overflow-y-auto px-3 py-3 sm:px-4 ${
          dark
            ? "bg-zinc-950"
            : "bg-[radial-gradient(circle_at_20%_10%,rgba(37,99,235,0.08),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(56,189,248,0.10),transparent_42%),#ffffff]"
        }`}
      >
        {loadingMessages ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-indigo-500" />
          </div>
        ) : messages.length ? (
          <div className="space-y-2.5">
            {messages.map((message) => {
              const isMine = message.senderId === user.id;
              const senderName = isMine ? user.name : isAdmin ? activeChatUser?.name ?? "User" : "Support";
              const senderAvatar = isMine
                ? user.avatar
                : isAdmin
                  ? activeChatUser?.avatar
                  : message.sender?.avatar ?? null;

              return (
                <div
                  key={message.id}
                  className={`flex items-end gap-2 ${isMine ? "justify-end" : "justify-start"}`}
                >
                  {!isMine ? (
                    <ChatAvatar
                      name={senderName}
                      avatar={senderAvatar}
                      sizeClass="h-8 w-8"
                      toneClass={dark ? "bg-zinc-800" : "bg-[#dbeafe]"}
                      textClass={dark ? "text-zinc-300" : "text-[#1d4ed8]"}
                    />
                  ) : null}
                  <article
                    className={`relative max-w-[82%] rounded-[1.15rem] px-3.5 py-2.5 text-sm shadow-[0_10px_30px_rgba(2,6,23,0.08)] ${
                      isMine
                        ? dark
                          ? "rounded-br-sm bg-gradient-to-br from-[#2563eb] to-[#4f46e5] text-[#eef4ff]"
                          : "rounded-br-sm bg-gradient-to-br from-[#3b82f6] to-[#2563eb] text-white"
                        : dark
                          ? "rounded-bl-sm bg-zinc-800/95 text-zinc-100 ring-1 ring-zinc-700"
                        : "rounded-bl-sm bg-white/95 text-zinc-800 ring-1 ring-[#dbe8ff]"
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words pr-12 pb-3 leading-6 tracking-[0.01em]">
                      {message.text}
                    </p>
                    <p
                      className={`absolute bottom-1 right-2 text-[10px] ${
                        isMine
                          ? dark
                            ? "text-blue-100/85"
                            : "text-blue-50/85"
                          : dark
                            ? "text-zinc-400"
                            : "text-zinc-500"
                      }`}
                    >
                      {formatTime(message.createdAt)}
                    </p>
                  </article>
                  {isMine ? (
                    <ChatAvatar
                      name={senderName}
                      avatar={senderAvatar}
                      sizeClass="h-8 w-8"
                      toneClass={dark ? "bg-zinc-800" : "bg-[#dbeafe]"}
                      textClass={dark ? "text-zinc-300" : "text-[#1d4ed8]"}
                    />
                  ) : null}
                </div>
              );
            })}

            {showTypingIndicator ? (
              <div className="flex justify-start">
                <div
                  className={`inline-flex items-center gap-1.5 rounded-2xl rounded-bl-sm px-3 py-2 ${
                    dark
                      ? "bg-zinc-800 text-zinc-200 ring-1 ring-zinc-700"
                      : "bg-white text-zinc-700 ring-1 ring-[#dbe8ff]"
                  }`}
                >
                  <span className="text-[11px] font-medium text-emerald-500">Typing...</span>
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-500 [animation-delay:-0.2s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-500 [animation-delay:-0.1s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-500" />
                </div>
              </div>
            ) : null}
          </div>
        ) : (
          <div
            className={`flex h-full items-center justify-center text-center text-sm ${
              dark ? "text-zinc-400" : "text-zinc-500"
            }`}
          >
            {isAdmin
              ? activeUserId
                ? "No messages yet. Start the conversation."
                : "Select a user from the left to open chat."
              : "No messages yet. Start by saying hi."}
          </div>
        )}
      </div>

      <form
        onSubmit={sendMessage}
        className={`flex items-center gap-2 border-t p-2.5 ${
          dark ? "border-zinc-700 bg-zinc-900" : "border-[#d9e4ff] bg-[#f8faff]"
        }`}
      >
        <input
          ref={inputRef}
          value={input}
          onChange={(event) => handleInputChange(event.target.value)}
          placeholder={placeholder}
          disabled={sending || clearingConversation || (isAdmin && !activeUserId)}
          className={`h-10 flex-1 rounded-xl border px-3 text-sm outline-none ${
            dark
              ? "border-zinc-700 bg-zinc-950 text-zinc-100 placeholder:text-zinc-500"
              : "border-[#c8d8ff] bg-white text-zinc-900 placeholder:text-zinc-400"
          } disabled:cursor-not-allowed disabled:opacity-70`}
        />

        <button
          type="submit"
          disabled={!canSend || sending || clearingConversation}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#2563eb] text-white transition hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <SendHorizontal className="h-4 w-4" />}
        </button>
      </form>
    </section>
  );

  return (
    <div
      className={`flex h-full min-h-0 overflow-hidden rounded-2xl border ${
        dark ? "border-zinc-700 bg-zinc-900" : "border-[#bfcfff] bg-[#eff4ff]"
      }`}
    >
      <div className="flex h-full min-h-0 w-full flex-col">
        {errorText ? (
          <div
            className={`border-b px-3 py-2 text-xs ${
              dark
                ? "border-zinc-700 bg-red-900/30 text-red-200"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {errorText}
          </div>
        ) : null}

        {!isAdmin ? (
          renderMessageThread
        ) : (
          <div className="grid h-full min-h-0 w-full lg:grid-cols-[18.5rem_minmax(0,1fr)]">
            <aside
              className={`flex h-full min-h-0 flex-col border-r ${
                dark ? "border-zinc-700 bg-zinc-900" : "border-[#d9e4ff] bg-[#f8faff]"
              } ${activeUserId ? "hidden lg:flex" : "flex"}`}
            >
              <header
                className={`flex h-14 shrink-0 items-center justify-between border-b px-3 ${
                  dark ? "border-zinc-700 text-zinc-100" : "border-[#d9e4ff] text-zinc-900"
                }`}
              >
                <div>
                  <p className="text-sm font-semibold">User Chats</p>
                  <p className={`text-[11px] ${dark ? "text-zinc-400" : "text-zinc-500"}`}>
                    {loadingUsers ? "Loading users..." : `${chatUsers.length} users`}
                  </p>
                </div>
                {socketConnected ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                    Live
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700">
                    Reconnecting
                  </span>
                )}
              </header>

              <div className="chat-scroll min-h-0 flex-1 overflow-y-auto p-1.5">
                {loadingUsers ? (
                  <div className="flex h-full items-center justify-center">
                    <Loader2 className="h-5 w-5 animate-spin text-indigo-500" />
                  </div>
                ) : chatUsers.length ? (
                  <div className="space-y-1">
                    {chatUsers.map((chatUser) => {
                      const isActive = chatUser.id === activeUserId;
                      const isTypingInList = typingConversationIds.includes(chatUser.id);

                      return (
                        <button
                          key={chatUser.id}
                          type="button"
                          onClick={() => selectUserConversation(chatUser.id)}
                          className={`w-full rounded-xl border px-2.5 py-2 text-left transition ${
                            isActive
                              ? dark
                                ? "border-zinc-700 bg-zinc-800"
                                : "border-[#d4e2ff] bg-[#e9f0ff]"
                              : dark
                                ? "border-transparent hover:bg-zinc-800/70"
                                : "border-transparent hover:bg-[#edf3ff]"
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            <ChatAvatar
                              name={chatUser.name}
                              avatar={chatUser.avatar}
                              sizeClass="h-8 w-8 mt-0.5"
                              toneClass={dark ? "bg-zinc-700" : "bg-[#dbeafe]"}
                              textClass={dark ? "text-zinc-300" : "text-[#1d4ed8]"}
                            />

                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <p
                                  className={`truncate text-sm font-medium ${
                                    dark ? "text-zinc-100" : "text-zinc-900"
                                  }`}
                                >
                                  {chatUser.name}
                                </p>
                                {chatUser.online ? <OnlineDot dark={dark} small /> : null}
                                <span
                                  className={`ml-auto shrink-0 text-[10px] ${
                                    dark ? "text-zinc-500" : "text-zinc-400"
                                  }`}
                                >
                                  {formatTime(chatUser.lastMessageAt)}
                                </span>
                              </div>

                              <div className="mt-0.5 flex items-center gap-2">
                                <p
                                  className={`truncate text-xs ${
                                    isTypingInList
                                      ? "font-medium text-emerald-500"
                                      : dark
                                        ? "text-zinc-400"
                                        : "text-zinc-500"
                                  }`}
                                  title={chatUser.lastMessage || chatUser.email}
                                >
                                  {isTypingInList
                                    ? "Typing..."
                                    : chatUser.lastMessage
                                      ? truncate(chatUser.lastMessage)
                                      : chatUser.email}
                                </p>

                                {chatUser.unreadCount > 0 ? (
                                  <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-[#1d4ed8] px-1.5 py-0.5 text-[10px] font-semibold text-white">
                                    {chatUser.unreadCount > 99 ? "99+" : chatUser.unreadCount}
                                  </span>
                                ) : null}
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div
                    className={`flex h-full items-center justify-center px-4 text-center text-sm ${
                      dark ? "text-zinc-400" : "text-zinc-500"
                    }`}
                  >
                    No users found.
                  </div>
                )}
              </div>
            </aside>

            <div className={`h-full min-h-0 ${activeUserId ? "flex" : "hidden lg:flex"}`}>
              {renderMessageThread}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

AssistantChat.displayName = "AssistantChat";

export default AssistantChat;
