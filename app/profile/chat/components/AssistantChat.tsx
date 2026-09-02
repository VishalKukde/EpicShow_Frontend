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
import { ArrowLeft, Loader2, RefreshCw, SendHorizontal, Trash2 } from "lucide-react";
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

  const focusInput = useCallback(() => {
    const focusNow = () => {
      const input = inputRef.current;
      if (!input) return;
      input.focus({ preventScroll: true });
      const length = input.value.length;
      if (length > 0) {
        input.setSelectionRange(length, length);
      }
    };

    if (typeof window === "undefined") return;
    requestAnimationFrame(() => {
      focusNow();
      window.setTimeout(focusNow, 60);
    });
  }, []);

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
    focusInput();
  }, [activeUserId, focusInput, isAdmin, user]);

  useEffect(() => {
    if (!user) return;

    socket.auth = { token: getToken() || "" };

    if (!socket.connected) {
      socket.connect();
    } else {
      socket.disconnect();
      socket.connect();
    }

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

        if (activeUserIdRef.current === incoming.conversationUserId) {
          focusInput();
        }

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
    focusInput,
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

      const sendPayload = {
        text: trimmedMessage,
        ...(isAdmin ? { targetUserId: activeUserId } : {}),
      };

      const sendRequest = isAdmin
        ? new Promise<ChatSendAck>((resolve) => {
            socket.emit("chat:send", sendPayload, (ack: ChatSendAck) => resolve(ack));
          })
        : apiFetch("/chat/messages", {
            method: "POST",
            body: JSON.stringify({ text: trimmedMessage }),
            notifyOnError: false,
          }).then((response: { message?: ChatMessage } | null) => {
            const payload = response?.message;
            if (!payload) {
              return { ok: false, message: "Unable to send message" };
            }
            return { ok: true, message: payload.id };
          });

      sendRequest
        .then((ack: ChatSendAck) => {
          setSending(false);
          if (!ack?.ok) {
            setErrorText(ack?.message || "Unable to send message");
            return;
          }
          setInput("");
          focusInput();
        })
        .catch((error: unknown) => {
          setSending(false);
          const message = error instanceof Error ? error.message : "Unable to send message";
          setErrorText(message);
        });
    },
    [activeUserId, clearingConversation, focusInput, input, isAdmin, sending, socketConnected, stopTyping]
  );

  const selectUserConversation = (userId: string) => {
    if (activeUserIdRef.current !== userId) {
      stopTyping();
    }

    setActiveUserId(userId);
    resetUnreadForUser(userId);
    setTypingConversationIds((prev) => prev.filter((item) => item !== userId));
    focusInput();
  };

  if (!user) return null;

  const placeholder = isAdmin
    ? activeUserId
      ? `Message ${activeChatUser?.name || "user"}...`
      : "Choose a user to start chatting"
    : "Type your message...";

  const canSend =
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
    <section className="flex h-full min-h-0 flex-1 flex-col overflow-hidden border border-slate-200 bg-white/80 dark:border-zinc-800 dark:bg-zinc-950/80">
      <header
        className={`flex h-[4.5rem] shrink-0 items-center gap-3 border-b px-4 sm:px-5 ${
          dark
            ? "border-zinc-800 bg-zinc-950/90 text-zinc-100"
            : "border-slate-200 bg-white/90 text-slate-900"
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

        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="rounded-full bg-slate-100 p-0.5 shadow-sm dark:bg-zinc-800">
            <ChatAvatar
              name={peerName}
              avatar={peerAvatar}
              sizeClass="h-11 w-11"
              toneClass={dark ? "bg-zinc-700" : "bg-slate-200"}
              textClass={dark ? "text-zinc-200" : "text-slate-700"}
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="truncate text-sm font-semibold tracking-[0.01em] sm:text-[15px]">
                {isAdmin ? activeChatUser?.name ?? "Select a user" : "Support Team"}
              </p>
              {showHeaderPresenceDot ? <OnlineDot dark={dark} /> : null}
            </div>
            {headerStatusText ? (
              <p className={`mt-1 truncate text-[11px] font-medium ${dark ? "text-zinc-400" : "text-zinc-500"}`}>
                {headerStatusText}
              </p>
            ) : null}
          </div>
        </div>

        {isAdmin && activeUserId ? (
          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                void confirmAndClearConversation("delete", { skipConfirm: false });
              }}
              className={`inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border text-red-600 transition ${
                dark ? "border-red-500/30 bg-red-500/10 hover:bg-red-500/20" : "border-red-200 bg-red-50 hover:bg-red-100"
              }`}
              aria-label="Delete chat"
              title="Delete chat"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ) : null}
      </header>

      <div
        ref={messageListRef}
        className={`chat-scroll min-h-0 flex-1 overflow-y-auto px-3 py-4 sm:px-5 ${
          dark ? "bg-zinc-950" : "bg-slate-50"
        }`}
      >
        {loadingMessages ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-indigo-500" />
          </div>
        ) : messages.length ? (
          <div className="space-y-3">
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
                  className={`flex items-end gap-2.5 ${isMine ? "justify-end" : "justify-start"}`}
                >
                  {!isMine ? (
                    <ChatAvatar
                      name={senderName}
                      avatar={senderAvatar}
                      sizeClass="h-7 w-7"
                      toneClass={dark ? "bg-zinc-700" : "bg-slate-200"}
                      textClass={dark ? "text-zinc-200" : "text-slate-700"}
                    />
                  ) : null}
                  <article
                    className={`relative max-w-[80%] rounded-[1.2rem] px-3 py-2.5 text-sm ${
                      isMine
                        ? dark
                          ? "bg-zinc-700 text-zinc-50 rounded-br-[0.5rem]"
                          : "bg-slate-900 text-white rounded-br-[0.5rem]"
                        : dark
                          ? "bg-zinc-800 text-zinc-100 ring-1 ring-zinc-700 rounded-bl-[0.5rem]"
                          : "bg-white text-slate-800 ring-1 ring-slate-200 rounded-bl-[0.5rem]"
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words pr-11 leading-6 tracking-[0.01em]">
                      {message.text}
                    </p>
                    <p
                      className={`absolute bottom-1.5 right-2.5 text-[9px] font-medium ${
                        isMine
                          ? dark
                            ? "text-zinc-200/85"
                            : "text-white/75"
                          : dark
                            ? "text-zinc-400"
                            : "text-slate-400"
                      }`}
                    >
                      {formatTime(message.createdAt)}
                    </p>
                  </article>
                  {isMine ? (
                    <ChatAvatar
                      name={senderName}
                      avatar={senderAvatar}
                      sizeClass="h-7 w-7"
                      toneClass={dark ? "bg-zinc-700" : "bg-slate-200"}
                      textClass={dark ? "text-zinc-200" : "text-slate-700"}
                    />
                  ) : null}
                </div>
              );
            })}

            {showTypingIndicator ? (
              <div className="flex justify-start">
                <div
                  className={`inline-flex items-center gap-1.5 rounded-[1.2rem] rounded-bl-md px-3.5 py-2.5 shadow-[0_10px_28px_rgba(15,23,42,0.08)] ${
                    dark
                      ? "bg-zinc-800 text-zinc-200 ring-1 ring-zinc-700/80"
                      : "bg-white/95 text-zinc-700 ring-1 ring-[#dfe9ff]"
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
        className={`flex items-center gap-3 border-t p-3 sm:p-4 ${
          dark ? "border-zinc-800 bg-zinc-950/95" : "border-slate-200 bg-white/90"
        }`}
      >
        <input
          ref={inputRef}
          value={input}
          onChange={(event) => handleInputChange(event.target.value)}
          placeholder={placeholder}
          disabled={sending || clearingConversation || (isAdmin && !activeUserId)}
          className={`h-12 flex-1 rounded-2xl border px-4 text-sm shadow-inner outline-none transition-all duration-200 ${
            dark
              ? "border-zinc-700 bg-zinc-900 text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-500"
              : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-slate-400"
          } disabled:cursor-not-allowed disabled:opacity-70`}
        />

        <button
          type="submit"
          disabled={!canSend || sending || clearingConversation}
          className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
        >
          {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <SendHorizontal className="h-4 w-4" />}
        </button>
      </form>
    </section>
  );

  return (
    <div
      className={`flex h-full min-h-0 overflow-hidden border-0 bg-transparent ${
        dark ? "bg-transparent" : "bg-transparent"
      }`}
    >
      <div className="flex h-full min-h-0 w-full flex-col">
        {errorText ? (
          <div
            className={`flex items-center justify-between gap-3 border-b px-3 py-2 text-xs ${
              dark
                ? "border-zinc-700 bg-red-900/30 text-red-200"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            <span>
              {errorText.includes("Socket disconnected")
                ? "Socket disconnected. Refresh the chat to reconnect."
                : errorText}
            </span>
            {(errorText.includes("Socket disconnected") || errorText.includes("Reconnect")) && (
              <button
                type="button"
                onClick={() => window.location.reload()}
                className={`inline-flex cursor-pointer items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-semibold ${
                  dark ? "border-red-300/40 bg-red-500/10 text-red-100 hover:bg-red-500/20" : "border-red-200 bg-white text-red-700 hover:bg-red-100"
                }`}
              >
                <RefreshCw className="h-3 w-3" />
                Refresh
              </button>
            )}
          </div>
        ) : null}

        {!isAdmin ? (
          renderMessageThread
        ) : (
          <div className="grid h-full min-h-0 w-full gap-0 lg:grid-cols-[19rem_minmax(0,1fr)]">
            <aside
              className={`flex h-full min-h-0 flex-col border-r ${
                dark ? "border-zinc-800 bg-zinc-950" : "border-slate-200 bg-slate-50"
              } ${activeUserId ? "hidden lg:flex" : "flex"}`}
            >
              <header
                className={`flex h-[4.5rem] shrink-0 items-center justify-between border-b px-4 ${
                  dark ? "border-zinc-800 text-zinc-100" : "border-slate-200 text-slate-900"
                }`}
              >
                <div>
                  <p className="text-sm font-semibold tracking-[0.02em]">User Chats</p>
                  <p className={`text-[11px] ${dark ? "text-zinc-400" : "text-zinc-500"}`}>
                    {loadingUsers ? "Loading users..." : `${chatUsers.length} users`}
                  </p>
                </div>
                {socketConnected ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-semibold text-emerald-700 shadow-[inset_0_0_0_1px_rgba(16,185,129,0.1)]">
                    Live
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-semibold text-amber-700 shadow-[inset_0_0_0_1px_rgba(245,158,11,0.1)]">
                    Reconnecting
                  </span>
                )}
              </header>

              <div className="chat-scroll min-h-0 flex-1 overflow-y-auto p-2.5">
                {loadingUsers ? (
                  <div className="flex h-full items-center justify-center">
                    <Loader2 className="h-5 w-5 animate-spin text-indigo-500" />
                  </div>
                ) : chatUsers.length ? (
                  <div className="space-y-2">
                    {chatUsers.map((chatUser) => {
                      const isActive = chatUser.id === activeUserId;
                      const isTypingInList = typingConversationIds.includes(chatUser.id);

                      return (
                        <button
                          key={chatUser.id}
                          type="button"
                          onClick={() => selectUserConversation(chatUser.id)}
                          className={`w-full rounded-[1.2rem] border px-3 py-3 text-left transition-all duration-200 ${
                            isActive
                              ? dark
                                ? "border-zinc-700 bg-zinc-800 shadow-sm"
                                : "border-slate-200 bg-white shadow-sm"
                              : dark
                                ? "border-transparent hover:bg-zinc-800/80"
                                : "border-transparent hover:bg-white"
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            <ChatAvatar
                              name={chatUser.name}
                              avatar={chatUser.avatar}
                              sizeClass="h-8 w-8 mt-0.5"
                              toneClass={dark ? "bg-zinc-700" : "bg-slate-200"}
                              textClass={dark ? "text-zinc-300" : "text-slate-700"}
                            />

                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <p
                                  className={`truncate text-sm font-semibold ${
                                    dark ? "text-zinc-100" : "text-zinc-900"
                                  }`}
                                >
                                  {chatUser.name}
                                </p>
                                {chatUser.online ? <OnlineDot dark={dark} small /> : null}
                                <span
                                  className={`ml-auto shrink-0 text-[10px] font-medium ${
                                    dark ? "text-zinc-500" : "text-zinc-400"
                                  }`}
                                >
                                  {formatTime(chatUser.lastMessageAt)}
                                </span>
                              </div>

                              <div className="mt-1.5 flex items-center gap-2">
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
                                  <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-slate-900 px-1.5 py-0.5 text-[10px] font-semibold text-white dark:bg-slate-100 dark:text-slate-900">
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
