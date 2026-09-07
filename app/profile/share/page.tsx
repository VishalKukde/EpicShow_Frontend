"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import {
  ArrowUpRight,
  Check,
  Copy,
  Facebook,
  Gift,
  MessageCircle,
  Send,
  Share2,
  Sparkles,
  Ticket,
  Twitter,
  Wallet,
} from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/lib/toast";
import { useThemeStore } from "@/store/themeStore";

const FALLBACK_INVITE_CODE = "VISHAL50";

function buildInviteCode(name?: string) {
  const token = name?.replace(/[^a-z0-9]/gi, "").slice(0, 6).toUpperCase();
  return token ? `${token}50` : FALLBACK_INVITE_CODE;
}

function getDefaultOrigin() {
  return process.env.NEXT_PUBLIC_SITE_URL || "https://epicshow.vercel.app";
}

function subscribeToOriginChange(onStoreChange: () => void) {
  window.addEventListener("popstate", onStoreChange);
  window.addEventListener("hashchange", onStoreChange);

  return () => {
    window.removeEventListener("popstate", onStoreChange);
    window.removeEventListener("hashchange", onStoreChange);
  };
}

function getClientOrigin() {
  return window.location.origin;
}

async function copyToClipboard(value: string) {
  if (navigator.clipboard?.writeText && window.isSecureContext) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textArea = document.createElement("textarea");
  textArea.value = value;
  textArea.setAttribute("readonly", "");
  textArea.style.position = "fixed";
  textArea.style.left = "-9999px";
  textArea.style.top = "0";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  const copied = document.execCommand("copy");
  document.body.removeChild(textArea);

  if (!copied) {
    throw new Error("Copy command failed");
  }
}

export default function SharePage() {
  const dark = useThemeStore((s) => s.mode === "dark");
  const { user } = useAuth();
  const [copiedTarget, setCopiedTarget] = useState<"code" | "link" | null>(null);

  const origin = useSyncExternalStore(
    subscribeToOriginChange,
    getClientOrigin,
    getDefaultOrigin
  );

  const inviteCode = useMemo(() => buildInviteCode(user?.name), [user?.name]);
  const inviteLink = useMemo(
    () => `${origin}/profile/share?code=${encodeURIComponent(inviteCode)}`,
    [inviteCode, origin]
  );
  const ogImageUrl = useMemo(
    () => `/api/og/invite?code=${encodeURIComponent(inviteCode)}`,
    [inviteCode]
  );

  const shareTitle = "Join me on EpicShow";
  const shareText = `Use my EpicShow invite code ${inviteCode} for rewards on your next booking.`;
  const fullShareText = `${shareText}\n${inviteLink}`;
  const encodedShareText = encodeURIComponent(fullShareText);
  const encodedLink = encodeURIComponent(inviteLink);

  const copyValue = async (target: "code" | "link", value: string) => {
    try {
      await copyToClipboard(value);
      setCopiedTarget(target);
      window.setTimeout(() => setCopiedTarget(null), 1800);
      toast.success(target === "code" ? "Invite code copied." : "Invite link copied.");
    } catch {
      toast.error("Copy failed. Please try again.");
    }
  };

  const shareInvite = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: inviteLink,
        });
        toast.success("Invite shared.");
        return;
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return;
      }
    }
    await copyValue("link", inviteLink);
  };

  const quickShares = [
    {
      label: "WhatsApp",
      icon: MessageCircle,
      href: `https://wa.me/?text=${encodedShareText}`,
      tone: dark ? "text-emerald-400 border-emerald-500/20 bg-emerald-500/10 hover:bg-emerald-500/20" : "text-emerald-700 border-emerald-200 bg-emerald-50 hover:bg-emerald-100",
    },
    {
      label: "Telegram",
      icon: Send,
      href: `https://t.me/share/url?url=${encodedLink}&text=${encodeURIComponent(shareText)}`,
      tone: dark ? "text-sky-400 border-sky-500/20 bg-sky-500/10 hover:bg-sky-500/20" : "text-sky-700 border-sky-200 bg-sky-50 hover:bg-sky-100",
    },
    {
      label: "Facebook",
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedLink}`,
      tone: dark ? "text-blue-400 border-blue-500/20 bg-blue-500/10 hover:bg-blue-500/20" : "text-blue-700 border-blue-200 bg-blue-50 hover:bg-blue-100",
    },
    {
      label: "X",
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?text=${encodedShareText}`,
      tone: dark ? "text-zinc-200 border-zinc-700 bg-zinc-800 hover:bg-zinc-700" : "text-slate-800 border-slate-200 bg-slate-100 hover:bg-slate-200",
    },
  ];

  return (
    <div className="select-none space-y-4 px-3 py-2 pb-6 sm:px-4 lg:px-0">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3 border-slate-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${dark
                  ? "border-indigo-400/30 bg-indigo-500/15 text-indigo-300"
                  : "border-indigo-200 bg-indigo-50 text-indigo-700"
                }`}
            >
              <Sparkles className="h-3 w-3" />
              Referral Rewards
            </span>
          </div>
          <h1 className={`mt-1.5 text-xl font-black tracking-tight ${dark ? "text-white" : "text-slate-900"} dark:text-white`}>
            Invite & Earn
          </h1>
          <p className={`text-xs font-medium ${dark ? "text-zinc-400" : "text-slate-500"} dark:text-zinc-400`}>
            Share your invite code with friends to earn cashback and wallet booking perks.
          </p>
        </div>

        <button
          type="button"
          onClick={shareInvite}
          className={`inline-flex cursor-pointer items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold text-white transition shadow-xs ${dark ? "bg-indigo-600 hover:bg-indigo-500" : "bg-indigo-600 hover:bg-indigo-700"
            }`}
        >
          <Share2 className="h-3.5 w-3.5" />
          Share Invite
        </button>
      </div>

      {/* Main Invite Card */}
      <section
        className={`rounded-2xl border p-4 sm:p-5 shadow-xs ${dark ? "border-zinc-800 bg-[#18181b]" : "border-slate-200 bg-white"
          } dark:bg-[#18181b] dark:border-zinc-800`}
      >
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Code Box */}
          <div
            className={`rounded-xl border p-4 flex flex-col justify-between ${dark ? "border-zinc-800 bg-zinc-900/60" : "border-indigo-100 bg-indigo-50/50"
              }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-500">
                  <Ticket className="h-3.5 w-3.5" />
                  Your Unique Code
                </span>
                <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-500 border border-emerald-500/30">
                  Active Code
                </span>
              </div>
              <p className="mt-3 text-3xl font-black tracking-widest text-indigo-500">
                {inviteCode}
              </p>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <button
                type="button"
                onClick={() => copyValue("code", inviteCode)}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-indigo-500"
              >
                {copiedTarget === "code" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copiedTarget === "code" ? "Copied" : "Copy Code"}
              </button>
              <button
                type="button"
                onClick={() => copyValue("link", inviteLink)}
                className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-bold transition ${dark ? "border-zinc-700 bg-zinc-800 text-zinc-200 hover:bg-zinc-700" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                  }`}
              >
                {copiedTarget === "link" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                Copy Link
              </button>
            </div>
          </div>

          {/* Key Perks */}
          <div className="flex flex-col justify-between space-y-3">
            <h3 className={`text-xs font-bold uppercase tracking-wider ${dark ? "text-zinc-300" : "text-slate-700"}`}>
              Referral Benefits
            </h3>
            <div className="space-y-2">
              <div
                className={`flex items-start gap-2.5 rounded-xl border p-2.5 ${dark ? "border-zinc-800 bg-zinc-900/40" : "border-slate-100 bg-slate-50"
                  }`}
              >
                <Wallet className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
                <div>
                  <p className={`text-xs font-bold ${dark ? "text-zinc-100" : "text-slate-900"}`}>
                    ₹50 Instant Wallet Bonus
                  </p>
                  <p className={`text-[11px] ${dark ? "text-zinc-400" : "text-slate-500"}`}>
                    Credited automatically when your friend completes their first ticket checkout.
                  </p>
                </div>
              </div>

              <div
                className={`flex items-start gap-2.5 rounded-xl border p-2.5 ${dark ? "border-zinc-800 bg-zinc-900/40" : "border-slate-100 bg-slate-50"
                  }`}
              >
                <Gift className="h-4 w-4 shrink-0 text-indigo-500 mt-0.5" />
                <div>
                  <p className={`text-xs font-bold ${dark ? "text-zinc-100" : "text-slate-900"}`}>
                    Valid Across All Categories
                  </p>
                  <p className={`text-[11px] ${dark ? "text-zinc-400" : "text-slate-500"}`}>
                    Usable for Movies, Train Bookings, E-sports, Events, and Gaming passes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Share Links */}
        <div className="mt-4 border-t pt-4 border-slate-100 dark:border-zinc-800/80">
          <span className={`block text-xs font-bold uppercase tracking-wider mb-2.5 ${dark ? "text-zinc-400" : "text-slate-600"}`}>
            Quick Share Options
          </span>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {quickShares.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className={`inline-flex h-9 items-center justify-center gap-2 rounded-xl border text-xs font-bold transition duration-150 cursor-pointer ${item.tone}`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {item.label}
                </a>
              );
            })}
          </div>
        </div>

        {/* OG Social Preview Card */}
        <div className="mt-4 border-t pt-4 border-slate-100 dark:border-zinc-800/80">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className={`text-xs font-bold uppercase tracking-wider ${dark ? "text-zinc-400" : "text-slate-600"}`}>
              Social Card Preview (OG Image)
            </span>
            <a
              href={ogImageUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs font-bold text-indigo-500 hover:underline"
            >
              Open Image <ArrowUpRight className="h-3 w-3" />
            </a>
          </div>

          <div
            className={`overflow-hidden rounded-xl border max-w-md ${dark ? "border-zinc-800 bg-zinc-900" : "border-slate-200 bg-slate-50"
              }`}
          >
            <Image
              src={ogImageUrl}
              alt={`EpicShow invite preview for ${inviteCode}`}
              width={600}
              height={315}
              className="w-full h-auto aspect-[1200/630] object-cover"
              unoptimized
            />
          </div>
        </div>
      </section>
    </div>
  );
}
