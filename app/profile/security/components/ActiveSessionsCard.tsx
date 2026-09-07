"use client";

import { useEffect, useState, useCallback } from "react";
import { Laptop, Smartphone, Tablet, Globe, Shield, RefreshCw, LogOut, CheckCircle2 } from "lucide-react";
import { apiFetch } from "@/lib/api";

export type SessionItemBackend = {
  id: string;
  sessionId: string;
  device: string;
  browser: string;
  os: string;
  deviceType: "desktop" | "mobile" | "tablet";
  ipAddress: string;
  location: string;
  lastActiveAt: string;
  createdAt: string;
  isCurrent: boolean;
};

type ActiveSessionsCardProps = {
  dark: boolean;
};

function formatLastSeen(dateString?: string, isCurrent?: boolean) {
  if (isCurrent) return "Active now";
  if (!dateString) return "Recently";
  const date = new Date(dateString);
  const diffMinutes = Math.floor((Date.now() - date.getTime()) / 60000);
  if (diffMinutes < 2) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes} mins ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} ${diffDays === 1 ? "day" : "days"} ago`;
  return date.toLocaleDateString();
}

function getDeviceIcon(deviceType?: string) {
  if (deviceType === "mobile") return Smartphone;
  if (deviceType === "tablet") return Tablet;
  return Laptop;
}

export default function ActiveSessionsCard({ dark }: ActiveSessionsCardProps) {
  const [sessions, setSessions] = useState<SessionItemBackend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const [revokingAll, setRevokingAll] = useState(false);

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await apiFetch("/auth/sessions", { notifyOnError: false });
      setSessions(data.sessions || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load active sessions");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const handleRevokeSession = async (session: SessionItemBackend) => {
    setRevokingId(session.sessionId || session.id);
    try {
      const res = await apiFetch(`/auth/sessions/${session.sessionId || session.id}`, {
        method: "DELETE",
      });

      if (session.isCurrent || res?.isCurrent) {
        window.location.href = "/login";
        return;
      }

      setSessions((prev) => prev.filter((s) => (s.sessionId || s.id) !== (session.sessionId || session.id)));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to revoke session");
    } finally {
      setRevokingId(null);
    }
  };

  const handleRevokeAllOther = async () => {
    if (!confirm("Are you sure you want to log out all other devices?")) return;
    setRevokingAll(true);
    try {
      await apiFetch("/auth/sessions/other", {
        method: "DELETE",
      });
      setSessions((prev) => prev.filter((s) => s.isCurrent));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to log out other devices");
    } finally {
      setRevokingAll(false);
    }
  };

  const otherSessionsCount = sessions.filter((s) => !s.isCurrent).length;

  return (
    <section
      className={`rounded-2xl border p-5 shadow-xs transition-colors duration-200 ${dark ? "border-zinc-800 bg-[#18181b]" : "border-gray-200 bg-white"
        }`}
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className={`text-lg font-bold ${dark ? "text-white" : "text-gray-900"}`}>
              Active Devices & Sessions
            </h2>
            <button
              onClick={fetchSessions}
              disabled={loading}
              title="Refresh sessions list"
              className="p-1 rounded-md text-slate-400 hover:text-indigo-500 transition cursor-pointer"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
          <p className={`mt-0.5 text-xs ${dark ? "text-zinc-400" : "text-gray-500"}`}>
            Manage multi-device logins and revoke access from devices you no longer recognize.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRevokeAllOther}
          disabled={revokingAll || otherSessionsCount === 0}
          className="flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold text-rose-500 hover:bg-rose-500/10 transition border border-rose-500/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>{revokingAll ? "Revoking..." : "Log out all other devices"}</span>
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-xs font-semibold text-rose-500">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-3 py-2">
          {[1, 2].map((i) => (
            <div
              key={i}
              className={`h-20 animate-pulse rounded-xl border p-4 ${dark ? "border-zinc-800 bg-zinc-900/40" : "border-gray-200 bg-gray-100/60"
                }`}
            />
          ))}
        </div>
      ) : sessions.length === 0 ? (
        <div className={`p-8 text-center text-xs font-semibold ${dark ? "text-zinc-400" : "text-gray-500"}`}>
          No active session records found.
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => {
            const Icon = getDeviceIcon(session.deviceType);
            const isRevoking = revokingId === (session.sessionId || session.id);

            return (
              <article
                key={session.sessionId || session.id}
                className={`rounded-xl border p-4 transition ${session.isCurrent
                    ? dark
                      ? "border-emerald-500/40 bg-emerald-500/5"
                      : "border-emerald-300 bg-emerald-50/50"
                    : dark
                      ? "border-zinc-800 bg-zinc-900/60 hover:border-zinc-700"
                      : "border-gray-200 bg-gray-50/70 hover:border-gray-300"
                  }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl ${session.isCurrent
                          ? "bg-emerald-500/15 text-emerald-500"
                          : dark
                            ? "bg-zinc-800 text-zinc-300"
                            : "bg-gray-200 text-gray-700"
                        }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <p className={`font-bold text-sm ${dark ? "text-white" : "text-gray-900"}`}>
                          {session.device}
                        </p>
                        {session.isCurrent && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-black uppercase text-emerald-500">
                            <CheckCircle2 className="h-3 w-3" /> Current Device
                          </span>
                        )}
                      </div>

                      <div
                        className={`mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs ${dark ? "text-zinc-400" : "text-gray-500"
                          }`}
                      >
                        <span className="flex items-center gap-1">
                          <Globe className="h-3 w-3 text-indigo-400" />
                          {session.ipAddress}
                        </span>
                        <span>•</span>
                        <span>{session.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className={`text-xs font-semibold ${session.isCurrent ? "text-emerald-500 font-bold" : dark ? "text-zinc-400" : "text-gray-500"}`}>
                        {formatLastSeen(session.lastActiveAt, session.isCurrent)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRevokeSession(session)}
                      disabled={isRevoking}
                      className={`cursor-pointer rounded-lg px-3 py-1.5 text-xs font-bold transition border ${session.isCurrent
                          ? "border-rose-500/30 text-rose-500 hover:bg-rose-500/10"
                          : "border-slate-300 dark:border-zinc-700 text-rose-500 hover:bg-rose-500/10"
                        } disabled:cursor-not-allowed disabled:opacity-50`}
                    >
                      {isRevoking ? "Revoking..." : session.isCurrent ? "Log out" : "Revoke"}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
