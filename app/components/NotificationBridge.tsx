"use client";

import { useEffect, useRef } from "react";
import { io, type Socket } from "socket.io-client";
import { apiFetch } from "@/lib/api";
import { toast } from "@/lib/toast";
import { useAuth } from "@/context/AuthContext";

type AppNotification = {
  id: string;
  type: string;
  title: string;
  message: string;
  amount?: number | null;
  readAt?: string | null;
  createdAt: string;
};

const SUPPORT_CHAT_STORAGE_KEY = "epicshow_support_chat_new_message";

function isWalletRefund(notification: AppNotification) {
  return notification.type === "wallet_refund";
}

function setSupportChatUnread(value: boolean) {
  if (typeof window === "undefined") return;
  if (value) {
    window.localStorage.setItem(SUPPORT_CHAT_STORAGE_KEY, "1");
    window.dispatchEvent(new CustomEvent("support-chat:new-message"));
    return;
  }

  window.localStorage.removeItem(SUPPORT_CHAT_STORAGE_KEY);
  window.dispatchEvent(new CustomEvent("support-chat:read"));
}

export default function NotificationBridge() {
  const { user, accessToken } = useAuth();
  const seenIds = useRef<Set<string>>(new Set());
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    let cancelled = false;

    const markRead = async (ids: string[]) => {
      if (!ids.length) return;
      try {
        await apiFetch("/notifications/read", {
          method: "PATCH",
          body: JSON.stringify({ ids }),
          notifyOnError: false,
        });
      } catch {
        // Notifications are best-effort; unread fetch on next login covers misses.
      }
    };

    const showNotification = (notification: AppNotification) => {
      if (!notification?.id || seenIds.current.has(notification.id)) return;
      seenIds.current.add(notification.id);

      const safeMessage = typeof notification.message === "string" ? notification.message.trim() : "";
      const isChatPage =
        typeof window !== "undefined" && window.location.pathname.startsWith("/profile/chat");

      if (notification.type === "support_chat") {
        if (!isChatPage) {
          setSupportChatUnread(true);
          if (safeMessage) {
            toast.info(safeMessage);
          }
        }
        void markRead([notification.id]);
        return;
      }

      if (isWalletRefund(notification)) {
        toast.walletCredit(safeMessage || notification.title);
      } else if (safeMessage || notification.title) {
        toast.info(safeMessage || notification.title, safeMessage ? undefined : notification.title);
      }

      void markRead([notification.id]);
    };

    const fetchUnread = async () => {
      try {
        const data: { notifications?: AppNotification[] } = await apiFetch(
          "/notifications?unread=true&limit=10",
          { notifyOnError: false }
        );
        if (cancelled) return;
        (data.notifications || []).reverse().forEach(showNotification);
      } catch {
        // Keep login quiet if notification fetch has a transient problem.
      }
    };

    if (!user?.id) {
      socketRef.current?.disconnect();
      socketRef.current = null;
      seenIds.current.clear();
      return;
    }

    void fetchUnread();

    // const socket = io(process.env.NEXT_PUBLIC_API_URL || "", {
    //   auth: { token: accessToken },
    //   transports: ["websocket"],
    //   withCredentials: true,
    //   reconnection: true,
    //   reconnectionAttempts: 20,
    //   forceNew: true,
    // });

    const socket = io(process.env.NEXT_PUBLIC_API_URL || "", {
      auth: { token: accessToken || "" },
      withCredentials: true,
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 20,
      forceNew: true,
    });

    socketRef.current = socket;
    socket.on("notification:new", showNotification);
    socket.on("connect", fetchUnread);

    return () => {
      cancelled = true;
      socket.off("notification:new", showNotification);
      socket.off("connect", fetchUnread);
      socket.disconnect();
      if (socketRef.current === socket) socketRef.current = null;
    };
  }, [accessToken, user?.id]);

  return null;
}
