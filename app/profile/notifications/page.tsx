"use client";

import { useEffect, useState } from "react";
import { Bell, CheckCircle2, Clock3, Wallet } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { useThemeStore } from "@/store/themeStore";
import NotificationHero from "./component/NotificationHero";

type AppNotification = {
  id: string;
  type: string;
  title: string;
  message: string;
  amount?: number | null;
  readAt?: string | null;
  createdAt: string;
};

function formatDate(value: string) {
  try {
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return "";
  }
}

export default function NotificationsPage() {
  const dark = useThemeStore((s) => s.mode === "dark");
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadNotifications = async () => {
      try {
        setLoading(true);
        setError("");
        const data: { notifications?: AppNotification[] } = await apiFetch(
          "/notifications?limit=100",
          { notifyOnError: false }
        );
        if (!cancelled) setNotifications(data.notifications || []);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load notifications");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void loadNotifications();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-6 px-3 py-3 pb-6 select-none sm:px-4 lg:px-0">
      <NotificationHero />

      <section
        className={`rounded-2xl border p-5 shadow-sm ${
          dark ? "border-zinc-700 bg-zinc-900" : "border-gray-200 bg-white"
        }`}
      >
        {loading ? (
          <p className={`py-10 text-center text-sm ${dark ? "text-zinc-400" : "text-gray-500"}`}>
            Loading notifications...
          </p>
        ) : error ? (
          <p className="py-10 text-center text-sm text-red-500">{error}</p>
        ) : notifications.length === 0 ? (
          <p className={`py-10 text-center text-sm ${dark ? "text-zinc-400" : "text-gray-500"}`}>
             no notifications yet. Refund credits and account updates will appear here after they are saved.
          </p>
        ) : (
          <div className="space-y-3">
            {notifications.map((item) => (
              <article
                key={item.id}
                className={`rounded-xl border p-4 ${
                  dark
                    ? "border-zinc-700 bg-zinc-950/60"
                    : "border-gray-200 bg-gray-50/80"
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-3">
                    <div
                      className={`rounded-lg p-2 border ${
                        item.type === "wallet_refund"
                          ? "text-emerald-700  border-emerald-500"
                          : "text-indigo-700 border-indigo-500"
                      }`}
                    >
                      {item.type === "wallet_refund" ? (
                        <Wallet className="h-4 w-4" />
                      ) : (
                        <Bell className="h-4 w-4" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className={`font-semibold ${dark ? "text-zinc-100" : "text-gray-900"}`}>
                        {item.title}
                      </p>
                      <p className={`mt-1 text-sm ${dark ? "text-zinc-400" : "text-gray-600"}`}>
                        {item.message}
                      </p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-3 text-xs ${dark ? "text-zinc-500" : "text-gray-500"}`}>
                    {item.readAt ? (
                      <span className="inline-flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Read
                      </span>
                    ) : null}
                    <span className="inline-flex items-center gap-1">
                      <Clock3 className="h-3.5 w-3.5" />
                      {formatDate(item.createdAt)}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
