"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Activity,
  Bug,
  LogOut,
  BadgeCheck,
  CreditCard,
  Crown,
  Film,
  Gamepad2,
  HelpCircle,
  Info,
  MessageCircle,
  Send,
  Settings,
  SlidersHorizontal,
  Shield,
  Ticket,
  Trophy,
  User,
  Wallet,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useThemeStore } from "@/store/themeStore";

type MenuItem = {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
};

type MenuSection = {
  title: string;
  items: MenuItem[];
};

const menuSections: MenuSection[] = [
  {
    title: "Main",
    items: [
      { href: "/profile", icon: User, label: "Overview" },
      { href: "/profile/activity", icon: Activity, label: "Your Activity" },
      { href: "/profile/wallet", icon: Wallet, label: "Wallet" },
    ],
  },
  {
    title: "Bookings",
    items: [
      { href: "/profile/bookings/movies", icon: Film, label: "Movies" },
      { href: "/profile/bookings/sports", icon: Trophy, label: "Sports" },
      { href: "/profile/bookings/games", icon: Gamepad2, label: "Games" },
      { href: "/profile/bookings/events", icon: Ticket, label: "Events" },
    ],
  },
  {
    title: "Account",
    items: [
      { href: "/profile/payments", icon: CreditCard, label: "Payments" },
      { href: "/profile/security", icon: Shield, label: "Security" },
      { href: "/profile/account-settings", icon: Settings, label: "Account Settings" },
      { href: "/profile/subscription", icon: Crown, label: "Subscription" },
    ],
  },
  {
    title: "Support",
    items: [
      { href: "/profile/faqs", icon: HelpCircle, label: "FAQs" },
      { href: "/profile/chat", icon: MessageCircle, label: "Chat with us" },
      { href: "/profile/about", icon: Info, label: "About Us" },
      { href: "/profile/feedback", icon: Send, label: "Share Feedback" },
      { href: "/profile/report-issue", icon: Bug, label: "Report Issue" },
    ],
  },
  {
    title: "Preferences",
    items: [
      { href: "/profile/preferences", icon: SlidersHorizontal, label: "Preferences" },
    ],
  },
];

function SectionTitle({ children, dark }: { children: React.ReactNode; dark: boolean }) {
  return (
    <p className={`px-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${dark ? "text-blue-300/75" : "text-blue-700/70"}`}>
      {children}
    </p>
  );
}

function Item({
  href,
  icon: Icon,
  label,
  dark,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  dark: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group flex items-center gap-3 rounded-2xl border px-3 py-3 text-sm font-medium transition-all duration-300 ${
        dark
          ? "border-zinc-800 bg-zinc-900/90 text-zinc-200 hover:border-zinc-700 hover:bg-zinc-800/90"
          : "border-zinc-200 bg-white/95 text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50"
      }`}
    >
      <span
        className={`inline-flex h-8 w-8 items-center justify-center rounded-xl transition ${
          dark
            ? "bg-zinc-800 text-zinc-300 group-hover:bg-zinc-700"
            : "bg-zinc-100 text-zinc-600 group-hover:bg-zinc-200 group-hover:text-zinc-800"
        }`}
      >
        <Icon className="h-4 w-4" />
      </span>
      <span>{label}</span>
    </Link>
  );
}

export default function MobileProfileMenuPanel() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const mode = useThemeStore((s) => s.mode);
  const dark = mode === "dark";
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const displayName = user?.name || "Guest User";
  const email = user?.email || "guest@moviebook.app";
  const membership = user?.membership === "pro" ? "Pro Member" : "Free Member";
  const walletBalance = user?.walletBalance ?? 0;
  const rewardPoints = user?.rewardPoints ?? 0;

  const handleConfirmLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      router.replace("/login");
    } finally {
      setIsLoggingOut(false);
      setShowLogoutConfirm(false);
    }
  };

  return (
    <div className="space-y-5 px-3 pb-[calc(env(safe-area-inset-bottom)+5.5rem)] pt-2 sm:px-4 lg:hidden">
      <div
        className={`relative overflow-hidden rounded-3xl border p-4 shadow-lg ${
          dark
            ? "border-slate-700/80 bg-[linear-gradient(145deg,#0f172a_0%,#111827_50%,#090f1a_100%)]"
            : "border-blue-100 bg-[linear-gradient(145deg,#ffffff_0%,#f1f6ff_55%,#e9f1ff_100%)]"
        }`}
      >
        <div
          className={`pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full blur-xl ${
            dark ? "bg-blue-400/14" : "bg-blue-300/24"
          }`}
        />
        <div
          className={`pointer-events-none absolute -bottom-8 -left-8 h-24 w-24 rounded-full blur-xl ${
            dark ? "bg-indigo-500/14" : "bg-indigo-200/30"
          }`}
        />

        <div className="relative">
          <p className={`text-[11px] font-medium uppercase tracking-[0.16em] ${dark ? "text-blue-200" : "text-blue-700"}`}>
            Profile Menu
          </p>
          <div className="mt-3 flex items-center gap-3">
            <div className="h-14 w-14 overflow-hidden rounded-2xl ring-2 ring-white/30">
              {loading ? (
                <div className={`h-full w-full animate-pulse ${dark ? "bg-zinc-700" : "bg-zinc-100"}`} />
              ) : (
                <Image
                  src={user?.avatar || "/assets/profiles/user.webp"}
                  alt={displayName}
                  width={56}
                  height={56}
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className={`truncate text-base font-semibold ${dark ? "text-zinc-100" : "text-zinc-900"}`}>
                {loading ? "Loading..." : displayName}
              </p>
              <p className={`truncate text-xs ${dark ? "text-zinc-300" : "text-zinc-600"}`}>{email}</p>
            </div>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold ${
                dark ? "bg-blue-500/20 text-blue-100" : "bg-blue-100 text-blue-800"
              }`}
            >
              <BadgeCheck className="h-3 w-3" />
              {membership}
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className={`rounded-xl border px-3 py-2 ${dark ? "border-slate-700 bg-slate-950/70" : "border-blue-100 bg-white/90"}`}>
              <p className={`text-[10px] ${dark ? "text-zinc-400" : "text-zinc-500"}`}>Wallet Balance</p>
              <p className={`mt-0.5 text-sm font-semibold ${dark ? "text-zinc-100" : "text-zinc-900"}`}>
                Rs {walletBalance.toLocaleString("en-IN")}
              </p>
            </div>
            <div className={`rounded-xl border px-3 py-2 ${dark ? "border-slate-700 bg-slate-950/70" : "border-blue-100 bg-white/90"}`}>
              <p className={`text-[10px] ${dark ? "text-zinc-400" : "text-zinc-500"}`}>Reward Points</p>
              <p className={`mt-0.5 text-sm font-semibold ${dark ? "text-zinc-100" : "text-zinc-900"}`}>
                {rewardPoints.toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {menuSections.map((section) => (
        <div
          key={section.title}
          className={`space-y-2 rounded-2xl border p-3 ${
            dark ? "border-zinc-800 bg-zinc-900/70" : "border-zinc-200 bg-white/85"
          }`}
        >
          <SectionTitle dark={dark}>{section.title}</SectionTitle>
          <div className="space-y-2">
            {section.items.map((item) => (
              <Item
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
                dark={dark}
              />
            ))}
          </div>
        </div>
      ))}

      <div
        className={`rounded-2xl border p-3 ${
          dark ? "border-red-900/50 bg-red-950/25" : "border-red-200 bg-red-50/70"
        }`}
      >
        <button
          type="button"
          onClick={() => setShowLogoutConfirm((prev) => !prev)}
          className={`flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition ${
            dark
              ? "bg-red-900/40 text-red-200 hover:bg-red-900/55"
              : "bg-red-100 text-red-700 hover:bg-red-200"
          }`}
          disabled={isLoggingOut}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>

        {showLogoutConfirm ? (
          <div className={`mt-3 rounded-xl border p-3 ${dark ? "border-red-900/60 bg-zinc-950/60" : "border-red-200 bg-white"}`}>
            <p className={`text-sm font-medium ${dark ? "text-zinc-100" : "text-zinc-900"}`}>
              Are you sure you want to logout?
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                disabled={isLoggingOut}
                className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                  dark
                    ? "border-zinc-700 text-zinc-200 hover:bg-zinc-800"
                    : "border-zinc-300 text-zinc-700 hover:bg-zinc-100"
                }`}
              >
                No
              </button>
              <button
                type="button"
                onClick={handleConfirmLogout}
                disabled={isLoggingOut}
                className={`rounded-lg px-3 py-2 text-sm font-semibold text-white transition ${
                  dark ? "bg-red-600 hover:bg-red-500" : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {isLoggingOut ? "Logging out..." : "Yes"}
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
