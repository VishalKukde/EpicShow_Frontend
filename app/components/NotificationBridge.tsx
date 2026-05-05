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

function isWalletRefund(notification: AppNotification) {
  return notification.type === "wallet_refund";
}

export default function NotificationBridge() {
  const { user } = useAuth();
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

      if (isWalletRefund(notification)) {
        toast.walletCredit(notification.message);
      } else {
        toast.info(notification.message, notification.title);
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
  }, [user?.id]);

  return null;
}
