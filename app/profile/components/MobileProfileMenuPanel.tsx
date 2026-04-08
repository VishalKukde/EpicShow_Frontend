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
      { href: "/profile/bookings/gaming", icon: Gamepad2, label: "Gaming" },
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

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="profile-menu-title px-1 text-[10px] font-semibold uppercase tracking-[0.18em]">
      {children}
    </p>
  );
}

function Item({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="profile-menu-item group flex items-center gap-3 rounded-2xl border px-3 py-3 text-sm font-medium transition-all duration-300"
    >
      <span
        className="profile-menu-icon inline-flex h-8 w-8 items-center justify-center rounded-xl transition"
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
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const displayName = user?.name || "Guest User";
  const email = user?.email || "guest@epicshow.app";
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
        className="profile-menu-hero relative overflow-hidden rounded-3xl border p-4 shadow-lg"
      >
        <div
          className="pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full blur-xl"
          style={{ background: "var(--profile-menu-orb-1)" }}
        />
        <div
          className="pointer-events-none absolute -bottom-8 -left-8 h-24 w-24 rounded-full blur-xl"
          style={{ background: "var(--profile-menu-orb-2)" }}
        />

        <div className="relative">
          <p className="profile-menu-title text-[11px] font-medium uppercase tracking-[0.16em]">
            Profile Menu
          </p>
          <div className="mt-3 flex items-center gap-3">
            <div className="h-14 w-14 overflow-hidden rounded-2xl ring-2 ring-white/30">
              {loading ? (
                <div className="h-full w-full animate-pulse" style={{ background: "var(--profile-menu-icon-bg)" }} />
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
              <p className="truncate text-base font-semibold" style={{ color: "var(--text-primary)" }}>
                {loading ? "Loading..." : displayName}
              </p>
              <p className="truncate text-xs" style={{ color: "var(--text-secondary)" }}>{email}</p>
            </div>
            <span
              className="profile-menu-badge inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold"
            >
              <BadgeCheck className="h-3 w-3" />
              {membership}
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="profile-menu-stat rounded-xl border px-3 py-2">
              <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>Wallet Balance</p>
              <p className="mt-0.5 text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                Rs {walletBalance.toLocaleString("en-IN")}
              </p>
            </div>
            <div className="profile-menu-stat rounded-xl border px-3 py-2">
              <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>Reward Points</p>
              <p className="mt-0.5 text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                {rewardPoints.toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {menuSections.map((section) => (
        <div
          key={section.title}
          className="profile-menu-section space-y-2 rounded-2xl border p-3"
        >
          <SectionTitle>{section.title}</SectionTitle>
          <div className="space-y-2">
            {section.items.map((item) => (
              <Item
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
              />
            ))}
          </div>
        </div>
      ))}

      <div
        className="profile-menu-logout rounded-2xl border p-3"
      >
        <button
          type="button"
          onClick={() => setShowLogoutConfirm((prev) => !prev)}
          className="flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition text-red-700 hover:bg-red-200 dark:bg-red-900/40 dark:text-red-200 dark:hover:bg-red-900/55"
          disabled={isLoggingOut}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>

        {showLogoutConfirm ? (
          <div className="profile-menu-confirm mt-3 rounded-xl border p-3">
            <p className="profile-menu-confirm-text text-sm font-medium">
              Are you sure you want to logout?
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                disabled={isLoggingOut}
                className="profile-menu-confirm-secondary rounded-lg border px-3 py-2 text-sm font-medium transition"
              >
                No
              </button>
              <button
                type="button"
                onClick={handleConfirmLogout}
                disabled={isLoggingOut}
                className="profile-menu-confirm-primary rounded-lg px-3 py-2 text-sm font-semibold transition"
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
