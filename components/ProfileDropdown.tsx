"use client";

import { useAuth } from "@/context/AuthContext";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useThemeStore } from "@/store/themeStore";
import {
  User,
  Settings,
  Sparkles,
  ChevronRight,
  Ticket,
  Crown,
  Bug,
  MessageCircle,
  BadgeCheck,
} from "lucide-react";
import type { ComponentType, ReactNode } from "react";
import Image from "next/image";

type NavAction = {
  icon: ComponentType<{ className?: string }>;
  label: string;
  href: string;
  hint?: string;
};

const MENU_ACTIONS: NavAction[] = [
  { icon: User, label: "My Profile", href: "/profile" },
  { icon: Ticket, label: "My Bookings", href: "/profile/bookings/movies" },
  { icon: Crown, label: "Subscription", href: "/profile/subscription" },
  { icon: Settings, label: "Settings", href: "/profile/account-settings" },
];

export default function ProfileDropdown() {
  const { user } = useAuth();
  const mode = useThemeStore((s) => s.mode);
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<NodeJS.Timeout | null>(null);
  const dark = mode === "dark";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleMouseEnter = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
    }
  };

  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => {
      setOpen(false);
    }, 180);
  };

  useEffect(() => {
    return () => {
      if (closeTimer.current) {
        clearTimeout(closeTimer.current);
      }
    };
  }, []);

  if (!user) return null;

  const handleNavigate = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  const membershipLabel = user.membership || "Free";
  const isProMember = String(membershipLabel).toLowerCase() === "pro";

  return (
    <div
      className="relative z-50"
      ref={ref}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Open profile menu"
        className={`group relative flex items-center rounded-full border p-0.5 transition-all duration-300 cursor-pointer ${
          open
            ? dark
              ? "border-indigo-400/60 bg-zinc-900 ring-2 ring-indigo-400/25"
              : "border-indigo-300 bg-white ring-2 ring-indigo-300/35"
            : dark
              ? "border-zinc-700 bg-zinc-900/70 hover:border-zinc-500"
              : "border-slate-200 bg-white/85 hover:border-slate-300"
        }`}
      >
        <div className="relative h-11 w-11 overflow-hidden rounded-full">
          <Image
            src={user.avatar || "/assets/profiles/user.webp"}
            alt="Profile avatar"
            fill
            className="object-cover"
            sizes="44px"
          />
        </div>
        <span
          className={`absolute bottom-0.5 right-0.5 h-3 w-3 rounded-full border-2 ${
            dark ? "border-zinc-900 bg-emerald-400" : "border-white bg-emerald-500"
          }`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className={`absolute right-0 mt-4 w-[22rem] overflow-hidden rounded-3xl border shadow-[0_24px_60px_-16px_rgba(15,23,42,0.35)] ring-1 select-none ${
              dark
                ? "border-zinc-700/70 bg-zinc-950/95 ring-white/5"
                : "border-slate-200 bg-white/95 ring-black/5"
            }`}
          >
            <div
              className={`px-4 pb-4 pt-4 ${
                dark
                  ? "bg-[radial-gradient(circle_at_top_right,rgba(79,70,229,0.22),transparent_58%),linear-gradient(180deg,rgba(39,39,42,0.95),rgba(24,24,27,0.98))]"
                  : "bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.14),transparent_58%),linear-gradient(180deg,#ffffff,#f8fafc)]"
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div
  className={`relative h-12 w-12 rounded-3xl p-[2px] ${
    user?.membership === "pro"
      ? "bg-gradient-to-br from-purple-500 via-indigo-500 to-purple-600"
      : ""
  }`}
>
  <div className="relative h-full w-full overflow-hidden rounded-2xl border border-white/50 shadow-sm">
    <Image
      src={user.avatar || "/assets/profiles/user.webp"}
      alt="Profile avatar"
      fill
      className="object-cover"
      sizes="50px"
    />
  </div>
</div>

                <div className="min-w-0 flex-1">
                  <p className={`truncate text-sm font-semibold ${dark ? "text-zinc-100" : "text-slate-900"}`}>
                    {user.name}
                  </p>
                  <p className={`truncate text-xs ${dark ? "text-zinc-400" : "text-slate-500"}`}>
                    {user.email}
                  </p>
                </div>

                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] ${
                    isProMember
                      ? dark
                        ? "border-amber-400/40 bg-amber-400/10 text-amber-200"
                        : "border-amber-200 bg-amber-50 text-amber-700"
                      : dark
                        ? "border-indigo-400/40 bg-indigo-400/10 text-indigo-200"
                        : "border-indigo-200 bg-indigo-50 text-indigo-700"
                  }`}
                >
                  <Sparkles className="h-3 w-3" />
                  {membershipLabel}
                </span>
              </div>

            </div>

            <div className="p-2">
              {MENU_ACTIONS.map((item) => (
                <MenuItem
                  key={item.label}
                  dark={dark}
                  icon={<item.icon className="h-4 w-4" />}
                  label={item.label}
                  onClick={() => handleNavigate(item.href)}
                />
              ))}
            </div>

            <div className={`px-3 pb-3 pt-1 text-[11px] ${dark ? "text-zinc-500" : "text-slate-500"}`}>
              <div className="inline-flex items-center gap-1">
                <BadgeCheck className="h-3.5 w-3.5" />
                Account secured and active
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MenuItem({
  icon,
  label,
  onClick,
  dark,
}: {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
  dark: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition cursor-pointer ${
        dark
          ? "text-zinc-200 hover:bg-zinc-900 hover:text-white"
          : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
      }`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`inline-flex h-7 w-7 items-center justify-center rounded-lg transition ${
            dark
              ? "bg-zinc-800 text-zinc-400 group-hover:bg-zinc-700 group-hover:text-indigo-300"
              : "bg-slate-100 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600"
          }`}
        >
          {icon}
        </span>
        {label}
      </div>
      <ChevronRight
        className={`h-4 w-4 transition-transform group-hover:translate-x-0.5 ${
          dark ? "text-zinc-600" : "text-slate-300"
        }`}
      />
    </button>
  );
}
