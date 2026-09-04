"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Award,
  Bell,
  Calendar,
  Check,
  ChevronDown,
  Clock,
  Copy,
  Key,
  LogOut,
  Mail,
  Moon,
  Phone,
  ShieldCheck,
  Sparkles,
  Sun,
  UserCheck,
  Wallet,
  X,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useThemeStore } from "@/store/themeStore";
import LiveClock from "./LiveClock";

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
    <header
      style={{
        height: 65,
        flexShrink: 0,
        background: "var(--profile-header-bg)",
        borderBottom: "1px solid var(--admin-border)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
        backdropFilter: "blur(20px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        zIndex: 30,
      }}
      className="select-none"
    >
      {/* Left Section: Breadcrumb & Title */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: "#6C63FF",
            display: "grid",
            placeItems: "center",
            color: "#FFFFFF",
            boxShadow: "0 4px 14px rgba(108, 99, 255, 0.28)",
          }}
        >
          <ShieldCheck size={18} strokeWidth={2.2} />
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ color: "var(--admin-text-muted)", fontSize: 10.5, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".06em" }}>
              Admin
            </span>
            <span style={{ color: "var(--admin-text-muted)", fontSize: 10 }}>/</span>
            <span style={{ color: "#6C63FF", fontSize: 11, fontWeight: 800 }}>
              {activeArea}
            </span>
          </div>
          <p style={{ margin: 0, color: "var(--admin-text)", fontSize: 14, fontWeight: 900, letterSpacing: "-.02em" }}>
            {activeLabel}
          </p>
        </div>
      </div>

      {/* Right Section: Controls & Profile Button */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {/* Center Section: Live Clock Pill */}
        <div className="hidden lg:flex items-center gap-3">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              background: "var(--admin-soft-solid)",
              border: "1px solid var(--admin-border)",
              borderRadius: 999,
              padding: "5px 14px",
              color: "var(--admin-text-secondary)",
              fontSize: 11.5,
              fontWeight: 800,
            }}
          >
            <Clock size={13} style={{ color: "#0EA5E9" }} />
            <LiveClock />
          </div>
        </div>
        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          title={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          aria-label={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          style={{
            height: 36,
            borderRadius: 12,
            border: "1px solid var(--admin-border)",
            background: "var(--admin-surface)",
            padding: "0 12px",
            display: "flex",
            alignItems: "center",
            gap: 6,
            color: "var(--admin-text)",
            fontSize: 12,
            fontWeight: 800,
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
          className="cursor-pointer select-none"
        >
          {mode === "dark" ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} className="text-indigo-500" />}
          <span>{mode === "dark" ? "Light" : "Dark"}</span>
        </button>

        {/* Bell Notifications */}
        <button
          style={{
            width: 36,
            height: 36,
            borderRadius: 12,
            border: "1px solid var(--admin-border)",
            background: "var(--admin-surface)",
            cursor: "pointer",
            color: "var(--admin-text-secondary)",
            display: "grid",
            placeItems: "center",
            position: "relative",
          }}
          title="Notifications"
          className="cursor-pointer select-none"
        >
          <Bell size={16} />
          <span
            style={{
              position: "absolute",
              top: 7,
              right: 7,
              width: 7,
              height: 7,
              borderRadius: 999,
              background: "#EF4444",
              boxShadow: "0 0 0 2px var(--admin-surface)",
            }}
          />
        </button>

        {/* Profile Button */}
        <motion.button
          whileHover={{ y: -1, boxShadow: "0 8px 22px rgba(108, 99, 255, 0.22)" }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setProfileOpen(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            border: "1px solid var(--admin-border)",
            background: "var(--admin-surface)",
            borderRadius: 14,
            padding: "5px 12px 5px 6px",
            cursor: "pointer",
            boxShadow: "0 4px 14px rgba(15, 13, 26, 0.04)",
          }}
          className="cursor-pointer select-none"
        >
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: 8,
              background: "#6366F1",
              color: "#FFFFFF",
              fontSize: 11,
              fontWeight: 900,
              display: "grid",
              placeItems: "center",
            }}
          >
            {initials(displayName)}
          </div>
          <span style={{ color: "var(--admin-text)", fontSize: 12.5, fontWeight: 800 }}>
            {displayName}
          </span>
          <ChevronDown size={14} style={{ color: "var(--admin-text-muted)" }} />
        </motion.button>
      </div>

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
  const [copied, setCopied] = useState(false);

  function handleCopyEmail() {
    if (!email) return;
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[100] grid place-items-center bg-slate-950/70 p-4 backdrop-blur-md cursor-pointer select-none"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="flex max-h-[min(85vh,680px)] w-full max-w-[700px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,.35)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-[0_24px_70px_rgba(0,0,0,.65)] cursor-default select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fixed Top Header with Solid Background (No gradients) */}
        <div className="shrink-0 flex flex-col justify-between border-b border-slate-700/40 bg-slate-900 px-5 py-4 text-white">
          {/* Top Control Bar */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/20 px-2.5 py-0.5 text-[9.5px] font-black uppercase tracking-wider text-emerald-300">
              <ShieldCheck size={12} strokeWidth={2.5} className="text-emerald-400" />
              <span>Verified Super Admin</span>
            </div>
            <button
              aria-label="Close admin profile panel"
              onClick={onClose}
              className="grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-white/20 bg-white/10 text-white transition hover:bg-white/25 active:scale-95 cursor-pointer"
            >
              <X size={14} strokeWidth={2.4} />
            </button>
          </div>

          {/* Compact Profile Identity Card */}
          <div className="mt-3 flex flex-wrap items-center gap-4">
            {/* Avatar Ring with Solid Indigo Border */}
            <div className="relative rounded-xl border-2 border-indigo-500 bg-slate-950 p-0.5 shadow-md">
              {profile?.avatar ? (
                <Image
                  src={profile.avatar}
                  alt={name}
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-[10px] object-cover"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-[10px] bg-indigo-600 text-base font-black text-white">
                  {initials(name)}
                </div>
              )}
              <span className="absolute -bottom-1 -right-1 grid h-4 w-4 place-items-center rounded-full border-2 border-slate-900 bg-emerald-500 text-white shadow-sm" title="Account Active">
                <Check size={9} strokeWidth={3} />
              </span>
            </div>

            {/* Identity Info */}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="m-0 text-xl font-black tracking-tight text-white">{name}</h3>
                <span className="rounded border border-purple-400/30 bg-purple-500/20 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-purple-200">
                  {profile?.role ? titleCase(profile.role) : "Super Admin"}
                </span>
              </div>

              <div className="mt-1 flex flex-wrap items-center gap-2.5">
                <button
                  onClick={handleCopyEmail}
                  className="group flex items-center gap-1.5 rounded-md border border-white/15 bg-white/10 px-2 py-0.5 text-[11px] font-bold text-slate-200 transition hover:bg-white/20 active:scale-95 cursor-pointer"
                  title="Click to copy email address"
                >
                  <Mail size={11} className="text-indigo-300" />
                  <span>{email}</span>
                  {copied ? (
                    <span className="ml-0.5 text-[9.5px] font-black text-emerald-400">Copied!</span>
                  ) : (
                    <Copy size={10} className="opacity-60 transition group-hover:opacity-100" />
                  )}
                </button>

                <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-300">
                  <UserCheck size={12} className="text-emerald-400" />
                  <span>Tier: {titleCase(profile?.membership || "VIP Pro")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Body Container */}
        <div className="grid gap-3.5 overflow-auto p-4.5">
          {/* Loading Indicator */}
          {loading && (
            <div className="flex items-center justify-center gap-2.5 py-8 font-bold text-xs text-slate-600 dark:text-slate-400">
              <svg className="h-5 w-5 animate-spin text-indigo-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              <span>Fetching admin profile telemetry...</span>
            </div>
          )}

          {/* Error Banner */}
          {error && !loading && (
            <div className="flex items-center justify-between gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
              <span className="text-[11px] font-bold">{error}</span>
              <button
                onClick={onRetry}
                className="rounded-lg border border-rose-300 bg-white px-2.5 py-1 text-[11px] font-black text-rose-800 transition hover:bg-rose-100 dark:border-rose-800 dark:bg-rose-900 dark:text-rose-100 cursor-pointer"
              >
                Retry
              </button>
            </div>
          )}

          {/* Main Dashboard Details Grid */}
          {!loading && !error && (
            <>
              {/* Financial & Rewards Overview Highlight Cards (Solid backgrounds, no gradients) */}
              <div className="grid gap-2.5 sm:grid-cols-2">
                <div className="rounded-xl border border-indigo-100 bg-indigo-50/70 p-3 shadow-sm dark:border-indigo-900/40 dark:bg-indigo-950/40">
                  <div className="flex items-center justify-between">
                    <span className="text-[9.5px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      Admin Wallet Balance
                    </span>
                    <div className="grid h-6 w-6 place-items-center rounded-md bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
                      <Wallet size={13} />
                    </div>
                  </div>
                  <p className="mt-1.5 text-xl font-black tracking-tight text-slate-900 dark:text-white">
                    {formatCurrency(profile?.walletBalance || 0)}
                  </p>
                  <p className="mt-0.5 text-[10px] font-bold text-slate-500 dark:text-slate-400">
                    Instant settlement ready
                  </p>
                </div>

                <div className="rounded-xl border border-purple-100 bg-purple-50/70 p-3 shadow-sm dark:border-purple-900/40 dark:bg-purple-950/40">
                  <div className="flex items-center justify-between">
                    <span className="text-[9.5px] font-black uppercase tracking-wider text-purple-600 dark:text-purple-400">
                      Accumulated Reward Points
                    </span>
                    <div className="grid h-6 w-6 place-items-center rounded-md bg-purple-500/15 text-purple-600 dark:text-purple-400">
                      <Award size={13} />
                    </div>
                  </div>
                  <p className="mt-1.5 text-xl font-black tracking-tight text-slate-900 dark:text-white">
                    {String(profile?.rewardPoints || 0)} <span className="text-xs font-extrabold text-purple-500">PTS</span>
                  </p>
                  <p className="mt-0.5 text-[10px] font-bold text-slate-500 dark:text-slate-400">
                    VIP Loyalty rank active
                  </p>
                </div>
              </div>

              {/* Account Telemetry & Contact Specifications */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 dark:border-slate-800 dark:bg-slate-900/50">
                <div className="mb-2 flex items-center gap-1.5">
                  <Sparkles size={13} className="text-indigo-500" />
                  <h4 className="m-0 text-[11px] font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    Account Profile Metadata
                  </h4>
                </div>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  <LuxuryTile icon={<Mail size={12} />} label="Email Address" value={email} />
                  <LuxuryTile icon={<Phone size={12} />} label="Phone Number" value={profile?.phone || "Not linked"} />
                  <LuxuryTile icon={<ShieldCheck size={12} />} label="Assigned Role" value={titleCase(profile?.role || "Admin")} />
                  <LuxuryTile icon={<Award size={12} />} label="Membership Level" value={titleCase(profile?.membership || "Standard")} />
                  <LuxuryTile icon={<Clock size={12} />} label="Last Activity" value={formatDate(profile?.lastLogin)} />
                  <LuxuryTile icon={<Calendar size={12} />} label="Account Registered" value={formatDate(profile?.createdAt)} />
                </div>
              </div>

              {/* Security & System Configuration Row */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 dark:border-slate-800 dark:bg-slate-900/50">
                <div className="mb-2 flex items-center gap-1.5">
                  <Key size={13} className="text-emerald-500" />
                  <h4 className="m-0 text-[11px] font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    Security & Preferences
                  </h4>
                </div>
                <div className="grid gap-2 sm:grid-cols-3">
                  <StatusChip
                    label="Dark Theme Preference"
                    status={Boolean(profile?.preferences?.darkMode)}
                    activeText="Dark Mode Enabled"
                    inactiveText="Light Mode Active"
                  />
                  <StatusChip
                    label="Push Notifications"
                    status={Boolean(profile?.preferences?.notifications)}
                    activeText="Notifications On"
                    inactiveText="Notifications Off"
                  />
                  <StatusChip
                    label="Two-Factor Auth"
                    status={true}
                    activeText="2FA Clearance High"
                    inactiveText="2FA Required"
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Streamlined Footer Actions */}
        <div className="shrink-0 flex items-center justify-between border-t border-slate-100 bg-slate-50 px-5 py-3 dark:border-slate-800 dark:bg-slate-900/80">
          <span className="text-[10px] font-bold text-slate-400">
            EpicShow Admin Portal • Encrypted TLS v1.3
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-[11.5px] font-black text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 cursor-pointer"
            >
              Close Panel
            </button>
            <button
              disabled={loggingOut}
              onClick={onLogout}
              className="flex items-center gap-1.5 rounded-lg bg-rose-600 px-3.5 py-1.5 text-[11.5px] font-black text-white shadow-md shadow-rose-600/20 transition hover:bg-rose-700 active:scale-95 disabled:opacity-60 cursor-pointer"
            >
              <LogOut size={12} strokeWidth={2.4} />
              <span>{loggingOut ? "Signing out..." : "Sign Out Session"}</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>,
    document.body
  );
}

function LuxuryTile({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200/80 bg-white p-2.5 shadow-sm dark:border-slate-800 dark:bg-slate-950/60">
      <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500">
        {icon}
        <span className="text-[9px] font-black uppercase tracking-wider">{label}</span>
      </div>
      <p className="mt-0.5 text-[11.5px] font-extrabold text-slate-900 dark:text-slate-100 m-0" style={{ overflowWrap: "anywhere" }}>
        {value || "-"}
      </p>
    </div>
  );
}

function StatusChip({
  activeText,
  inactiveText,
  label,
  status,
}: {
  activeText: string;
  inactiveText: string;
  label: string;
  status: boolean;
}) {
  return (
    <div className="rounded-lg border border-slate-200/80 bg-white p-2.5 shadow-sm dark:border-slate-800 dark:bg-slate-950/60">
      <p className="text-[9px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">{label}</p>
      <div className="mt-0.5 flex items-center gap-1.5">
        <span className={`h-1.5 w-1.5 rounded-full ${status ? "bg-emerald-500 shadow-sm shadow-emerald-500/50" : "bg-slate-400"}`} />
        <span className={`text-[11px] font-extrabold ${status ? "text-emerald-600 dark:text-emerald-400" : "text-slate-600 dark:text-slate-400"}`}>
          {status ? activeText : inactiveText}
        </span>
      </div>
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
