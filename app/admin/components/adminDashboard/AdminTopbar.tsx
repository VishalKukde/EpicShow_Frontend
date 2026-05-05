"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bell, LogOut, Moon, Sun } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useThemeStore } from "@/store/themeStore";
import LiveClock from "./LiveClock";
import { createPortal } from "react-dom";

type AdminProfile = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  lastLogin?: string;
  role: string;
  membership: string;
  walletBalance: number;
  preferences?: {
    darkMode?: boolean;
    notifications?: boolean;
  };
  rewardPoints: number;
  createdAt?: string;
  updatedAt?: string;
};

type AdminTopbarProps = {
  activeArea: string;
  activeLabel: string;
};

export default function AdminTopbar({ activeArea, activeLabel }: AdminTopbarProps) {
  const router = useRouter();
  const { logout, user } = useAuth();
  const mode = useThemeStore((state) => state.mode);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);

  const loadProfile = useCallback(() => {
    setProfileLoading(true);
    setProfileError("");

    apiFetch("/profile/me", { notifyOnError: false })
      .then((payload: { user: AdminProfile }) => setProfile(payload.user))
      .catch((err) => setProfileError(err instanceof Error ? err.message : "Failed to load admin profile"))
      .finally(() => setProfileLoading(false));
  }, []);

  useEffect(() => {
    if (profileOpen && !profile && !profileLoading) {
      loadProfile();
    }
  }, [loadProfile, profile, profileLoading, profileOpen]);

  async function handleLogout() {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await logout();
      router.replace("/login");
    } finally {
      setLoggingOut(false);
    }
  }

  const displayName = profile?.name || user?.name || "Admin";
  const displayEmail = profile?.email || user?.email || "admin@epicshow";

  return (
    <header style={{ height: 58, flexShrink: 0, background: "var(--profile-header-bg)", borderBottom: "1px solid var(--admin-border)", boxShadow: "var(--profile-header-shadow)", backdropFilter: "blur(16px)", display: "flex", alignItems: "center", gap: 12, padding: "0 20px", zIndex: 20 }}>
      <div>
        <p style={{ margin: 0, color: "var(--admin-text-muted)", fontSize: 10.5, fontWeight: 800 }}>Dashboard / {activeArea}</p>
        <p style={{ margin: 0, color: "var(--admin-text)", fontSize: 13, fontWeight: 900 }}>{activeLabel}</p>
      </div>
      <div style={{ flex: 1 }} />
      <div style={{ display: "flex", alignItems: "center", gap: 7, background: "var(--admin-soft-solid)", border: "1px solid var(--admin-border)", borderRadius: 12, padding: "7px 10px", color: "var(--admin-text-secondary)", fontSize: 12, fontWeight: 800 }}>Clock <LiveClock /></div>
      <button
        type="button"
        onClick={toggleTheme}
        title={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        aria-label={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        className="admin-theme-toggle"
      >
        {mode === "dark" ? <Sun size={15} /> : <Moon size={15} />}
        <span>{mode === "dark" ? "Light" : "Dark"}</span>
      </button>
      <button style={{ width: 32, height: 32, borderRadius: 10, border: "1px solid var(--admin-border)", background: "var(--admin-surface)", cursor: "pointer", color: "var(--admin-text-secondary)", display: "grid", placeItems: "center" }} title="Notifications">
        <Bell size={15} />
      </button>
      <motion.button whileHover={{ y: -1, boxShadow: "0 10px 24px rgba(15,23,42,.08)" }} whileTap={{ scale: 0.985 }} onClick={() => setProfileOpen(true)} style={{ display: "flex", alignItems: "center", gap: 8, border: "1px solid var(--admin-border)", background: "var(--admin-surface)", borderRadius: 999, padding: "4px 10px 4px 4px", cursor: "pointer", fontWeight: 900, color: "var(--admin-text)", fontSize: 12 }}>
        <span style={{ width: 26, height: 26, display: "grid", placeItems: "center", borderRadius: 999, color: "var(--admin-on-accent)", background: "#4F5F7A", fontSize: 10.5 }}>{initials(displayName)}</span>
        {displayName}
      </motion.button>

      {profileOpen && (
        <AdminProfileModal
          error={profileError}
          loading={profileLoading}
          loggingOut={loggingOut}
          profile={profile}
          fallbackName={displayName}
          fallbackEmail={displayEmail}
          onClose={() => setProfileOpen(false)}
          onLogout={handleLogout}
          onRetry={loadProfile}
        />
      )}
    </header>
  );
}

function AdminProfileModal({
  error,
  fallbackEmail,
  fallbackName,
  loading,
  loggingOut,
  onClose,
  onLogout,
  onRetry,
  profile,
}: {
  error: string;
  fallbackEmail: string;
  fallbackName: string;
  loading: boolean;
  loggingOut: boolean;
  onClose: () => void;
  onLogout: () => void;
  onRetry: () => void;
  profile: AdminProfile | null;
}) {
  const name = profile?.name || fallbackName;
  const email = profile?.email || fallbackEmail;
 return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      style={{ background: "rgba(15,23,42,0.55)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="admin-profile-modal max-h-[90vh] w-full max-w-5xl overflow-auto rounded-3xl border shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top accent strip */}
        <div
          className="h-1.5 w-full rounded-t-3xl"
          style={{
            background: "#4F5F7A",
          }}
        />

        {/* Header */}
        <div
          className="flex items-center justify-between gap-4 border-b px-6 py-5"
          style={{ borderColor: "var(--admin-border)" }}
        >
          <div className="flex items-center gap-4">
            {/* Avatar with accent ring */}
            <div
              className="shrink-0 rounded-full p-[2.5px]"
              style={{
                background: "#4F5F7A",
              }}
            >
              {profile?.avatar ? (
                <Image
                  src={profile.avatar}
                  alt={name}
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-full object-cover"
                />
              ) : (
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-full text-sm font-extrabold"
                  style={{ background: "var(--auth-primary-bg)", color: "var(--admin-on-accent)" }}
                >
                  {initials(name)}
                </div>
              )}
            </div>

            <div>
              <p className="text-lg font-extrabold leading-tight" style={{ color: "var(--admin-text)" }}>
                {name}
              </p>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                {profile?.role && (
                  <span className="inline-flex items-center rounded-full border border-indigo-100 bg-indigo-50 px-2 py-0.5 text-[11px] font-bold text-indigo-600">
                    ● {profile.role}
                  </span>
                )}
                <p className="text-xs" style={{ color: "var(--admin-text-muted)" }}>{email}</p>
              </div>
            </div>
          </div>

          {/* Close X button */}
          <button
            onClick={onClose}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border text-base font-bold transition-colors duration-150"
            style={{
              background: "var(--admin-soft-solid)",
              borderColor: "var(--admin-border)",
              color: "var(--admin-text-secondary)",
            }}
          >
            ✕
          </button>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex items-center gap-3 px-6 py-8 font-semibold" style={{ color: "var(--admin-text-secondary)" }}>
            <svg
              className="animate-spin w-5 h-5 text-indigo-500"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              />
            </svg>
            Loading admin details...
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div
            className="mx-5 mt-5 flex items-center justify-between gap-3 rounded-2xl border px-4 py-3"
            style={{
              background: "var(--auth-error-bg)",
              borderColor: "var(--auth-error-border)",
              color: "var(--auth-error-text)",
            }}
          >
            <span className="font-semibold text-sm">{error}</span>
            <button
              onClick={onRetry}
              className="cursor-pointer rounded-xl border px-3 py-1.5 text-xs font-bold transition-colors duration-150"
              style={{
                background: "var(--admin-surface)",
                borderColor: "var(--auth-error-border)",
                color: "var(--auth-error-text)",
              }}
            >
              Retry
            </button>
          </div>
        )}

        {/* Profile details grid */}
        {!loading && !error && profile && (
          <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Detail label="Name" value={profile.name} />
            <Detail label="Email" value={profile.email} />
            <Detail label="Phone" value={profile.phone || "-"} />
            <Detail label="Role" value={titleCase(profile.role)} />
            <Detail label="Membership" value={titleCase(profile.membership)} />

            <AccentDetail label="Wallet Balance" value={formatCurrency(profile.walletBalance || 0)} tone="indigo" />
            <AccentDetail label="Reward Points" value={`${String(profile.rewardPoints || 0)} pts`} tone="violet" />
            <PreferenceDetail label="Dark Mode" enabled={Boolean(profile.preferences?.darkMode)} />
            <PreferenceDetail label="Notifications" enabled={Boolean(profile.preferences?.notifications)} />

            <Detail label="Last Login" value={formatDate(profile.lastLogin)} />
            <Detail label="Created At" value={formatDate(profile.createdAt)} />
              <Detail label="Updated At" value={formatDate(profile.updatedAt)} />
            {/* <div className="sm:col-span-2"> */}
            {/* </div> */}
          </div>
        )}

        {/* Footer actions */}
        <div className="flex justify-end gap-3 px-6 pb-6">
          <button
            onClick={onClose}
            className="cursor-pointer rounded-xl border px-5 py-2.5 text-sm font-semibold transition-colors duration-150"
            style={{
              background: "var(--admin-surface)",
              borderColor: "var(--admin-border)",
              color: "var(--admin-text-secondary)",
            }}
          >
            Close
          </button>
          <button
            disabled={loggingOut}
            onClick={onLogout}
            className="flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-bold transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
            style={{
              background: loggingOut ? "var(--admin-soft-solid)" : "var(--profile-menu-logout-bg)",
              borderColor: loggingOut ? "var(--admin-border)" : "var(--profile-menu-logout-border)",
              color: loggingOut ? "var(--admin-text-muted)" : "var(--profile-menu-logout-btn-text)",
              cursor: loggingOut ? "not-allowed" : "pointer",
            }}
          >
            <LogOut size={14} />
            {loggingOut ? "Signing out..." : "Logout"}
          </button>
        </div>
      </motion.div>
    </div>,
    document.body
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: "var(--admin-soft-solid)", border: "1px solid var(--admin-border)", borderRadius: 16, padding: 14 }}>
      <p style={{ margin: 0, color: "var(--admin-text-muted)", fontSize: 11, fontWeight: 900, letterSpacing: ".06em", textTransform: "uppercase" }}>{label}</p>
      <p style={{ margin: "5px 0 0", color: "var(--admin-text)", fontSize: 14, fontWeight: 800, overflowWrap: "anywhere" }}>{value}</p>
    </div>
  );
}

function AccentDetail({
  label,
  tone,
  value,
}: {
  label: string;
  tone: "indigo" | "violet";
  value: string;
}) {
  const color = tone === "indigo" ? "#4F46E5" : "#7C3AED";

  return (
    <div
      className="rounded-2xl border px-4 py-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
      style={{
        background: `color-mix(in srgb, ${color} 10%, var(--admin-surface))`,
        borderColor: `color-mix(in srgb, ${color} 28%, var(--admin-border))`,
      }}
    >
      <p
        className="mb-0.5 text-[10px] font-bold uppercase tracking-widest"
        style={{ color }}
      >
        {label}
      </p>
      <p className="text-base font-extrabold" style={{ color }}>
        {value}
      </p>
    </div>
  );
}

function PreferenceDetail({ enabled, label }: { enabled: boolean; label: string }) {
  return (
    <div
      className="rounded-2xl border px-4 py-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
      style={{
        background: "var(--admin-soft-solid)",
        borderColor: "var(--admin-border)",
      }}
    >
      <p
        className="mb-1 text-[10px] font-bold uppercase tracking-widest"
        style={{ color: "var(--admin-text-muted)" }}
      >
        {label}
      </p>
      <span
        className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-bold"
        style={{
          background: enabled ? "var(--admin-success-bg)" : "var(--admin-surface)",
          borderColor: enabled ? "rgba(52, 211, 153, 0.35)" : "var(--admin-border)",
          color: enabled ? "var(--admin-success-text)" : "var(--admin-text-secondary)",
        }}
      >
        ● {enabled ? "Enabled" : "Disabled"}
      </span>
    </div>
  );
}

function initials(name: string) {
  return (name || "AD").split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

function titleCase(value?: string) {
  if (!value) return "-";
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

function formatDate(value?: string) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);
}
