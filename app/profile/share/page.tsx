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
} from "lucide-react";
import Image from "next/image";

import { useAuth } from "@/context/AuthContext";
import { toast } from "@/lib/toast";
import { useThemeStore } from "@/store/themeStore";

const FALLBACK_INVITE_CODE = "VISHAL50";

const REWARD_LINES = [
  "Friend booking rewards",
  "Wallet cashback",
  "Works across EpicShow",
  "Early access offers",
  "Bonus coupon drops",
  "Referral streak perks",
  "Priority seat picks",
  "Weekend deal boosts",
  "Invite milestone gifts",
];

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

  const [copiedTarget, setCopiedTarget] = useState<
    "code" | "link" | null
  >(null);

  const origin = useSyncExternalStore(
    subscribeToOriginChange,
    getClientOrigin,
    getDefaultOrigin
  );

  const inviteCode = useMemo(
    () => buildInviteCode(user?.name),
    [user?.name]
  );

  const inviteLink = useMemo(
    () =>
      `${origin}/profile/share?code=${encodeURIComponent(inviteCode)}`,
    [inviteCode, origin]
  );

  const shareTitle = "Join me on EpicShow";

  const shareText = `Use my EpicShow invite code ${inviteCode} for rewards on your next booking.`;

  const fullShareText = `${shareText}\n${inviteLink}`;

  const encodedShareText = encodeURIComponent(fullShareText);

  const encodedLink = encodeURIComponent(inviteLink);

  const ogImageUrl = `/api/og/invite?code=${encodeURIComponent(inviteCode)}`;

  const markCopied = (target: "code" | "link") => {
    setCopiedTarget(target);

    window.setTimeout(() => {
      setCopiedTarget(null);
    }, 1800);
  };

  const copyValue = async (
    target: "code" | "link",
    value: string
  ) => {
    try {
      await copyToClipboard(value);

      markCopied(target);

      toast.success(
        target === "code"
          ? "Invite code copied."
          : "Invite link copied."
      );
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
        if (
          error instanceof Error &&
          error.name === "AbortError"
        ) {
          return;
        }
      }
    }

    await copyValue("link", inviteLink);
  };

  const quickShares = [
    {
      label: "WhatsApp",
      icon: MessageCircle,
      href: `https://wa.me/?text=${encodedShareText}`,
      className: dark
        ? "text-emerald-300 hover:bg-emerald-400/10"
        : "text-emerald-700 hover:bg-emerald-50",
    },
    {
      label: "Telegram",
      icon: Send,
      href: `https://t.me/share/url?url=${encodedLink}&text=${encodeURIComponent(
        shareText
      )}`,
      className: dark
        ? "text-sky-300 hover:bg-sky-400/10"
        : "text-sky-700 hover:bg-sky-50",
    },
    {
      label: "Facebook",
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedLink}`,
      className: dark
        ? "text-blue-300 hover:bg-blue-400/10"
        : "text-blue-700 hover:bg-blue-50",
    },
    {
      label: "X",
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?text=${encodedShareText}`,
      className: dark
        ? "text-zinc-200 hover:bg-white/10"
        : "text-slate-800 hover:bg-slate-100",
    },
  ];

  return (
    <div
      className="w-full px-3 py-4 pb-10 transition-colors duration-300 sm:px-5 lg:px-4"
    >
      <section
        className={`w-full rounded-lg p-4 transition-all duration-300 sm:p-6 lg:p-4 `}
      >
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-4xl">
            <div
              className={`mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] transition-all duration-300 ${dark
                  ? "border-indigo-300/30 bg-indigo-400/10 text-indigo-100"
                  : "border-indigo-200 bg-indigo-50 text-indigo-800"
                }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              Invite and earn
            </div>

            <h1
              className={`text-4xl font-black leading-tight tracking-tight sm:text-5xl ${dark ? "text-white" : "text-slate-950"
                }`}
            >
              Share EpicShow with one clean invite.
            </h1>

            <p
              className={`mt-4 max-w-2xl text-base leading-7 ${dark ? "text-zinc-400" : "text-slate-600"
                }`}
            >
              Copy your code, share the link anywhere, and preview
              exactly what your friends will see.
            </p>
          </div>

          <button
            type="button"
            onClick={shareInvite}
            className={`inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-lg px-6 text-sm font-black transition-all duration-300 cursor-pointer ${dark
                 ? "bg-blue-300 text-zinc-950 hover:bg-blue-200"
                        : "bg-indigo-600 text-white hover:bg-indigo-500"
              }`}
          >
            <Share2 className="h-4 w-4" />
            Share on Any App
          </button>
        </div>

        <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(360px,460px)]">
          <div className="grid min-w-0 gap-5">
            <div
              className={`min-w-0 rounded-lg border px-5 pb-5 pt-4 transition-all duration-300 sm:px-6 sm:pb-6 sm:pt-4 ${dark
                  ? "border-zinc-800 bg-zinc-900"
                  : "border-indigo-300 bg-indigo-50/60"
              }`}
            >
              <div className="flex min-w-0 flex-col justify-start">
                <div className="flex items-start justify-between gap-3">

                  <div className="flex min-w-0 items-center gap-2">
                    <Ticket
                      className={
                        dark
                          ? "h-4 w-4 shrink-0 text-indigo-200"
                          : "h-4 w-4 shrink-0 text-indigo-700"
                      }
                    />

                    <p
                      className={`truncate text-xs font-bold uppercase tracking-[0.16em] ${dark
                          ? "text-indigo-300"
                          : "text-indigo-700"
                        }`}
                    >
                      Invite code
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      copyValue("code", inviteCode)
                    }
                    className={`inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg px-4 text-sm font-black transition-all duration-300 cursor-pointer ${dark
                        ? "bg-blue-300 text-zinc-950 hover:bg-blue-200"
                        : "bg-indigo-600 text-white hover:bg-indigo-500"
                      }`}
                  >
                    {copiedTarget === "code" ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}

                    {copiedTarget === "code"
                      ? "Copied"
                      : "Copy Code"}
                  </button>

                </div>

                <div className="mt-5 flex min-w-0 items-center gap-4">
                  <div
                    className={`min-w-0 flex-1 whitespace-nowrap text-[clamp(1.5rem,4.5vw,3.75rem)] font-black leading-none tracking-[0.06em] ${dark
                        ? "text-blue-300"
                        : "text-indigo-700"
                      }`}
                  >
                    {inviteCode}
                  </div>

                </div>
              </div>
            </div>

            <div className="grid min-w-0 gap-5">
              <div
                className={`w-full min-w-0 rounded-lg border p-5 transition-all duration-300 ${dark
                    ? "border-zinc-800 bg-zinc-900"
                    : "border-slate-200 bg-white"
                  }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p
                      className={`text-xs font-bold uppercase tracking-[0.16em] ${dark
                          ? "text-zinc-500"
                          : "text-slate-400"
                        }`}
                    >
                      Invite link
                    </p>

                    <p
                      className={`mt-1 text-sm ${dark
                          ? "text-zinc-400"
                          : "text-slate-500"
                        }`}
                    >
                      Share this exact URL.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      copyValue("link", inviteLink)
                    }
                    className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-all duration-300  cursor-pointer ${dark
                        ? "bg-zinc-800 text-zinc-100 hover:bg-zinc-700"
                        : "bg-slate-900 text-white hover:bg-slate-800"
                      }`}
                    aria-label="Copy invite link"
                    title="Copy invite link"
                  >
                    {copiedTarget === "link" ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>

                <p
                  className={`mt-4 break-all rounded-lg border px-3 py-3 text-sm font-semibold leading-6 ${dark
                      ? "border-zinc-800 bg-zinc-950 text-zinc-200"
                      : "border-slate-200 bg-white text-slate-700"
                    }`}
                >
                  {inviteLink}
                </p>
              </div>

              <div
                className={`w-full rounded-lg border p-5 transition-all duration-300 ${dark
                    ? "border-zinc-800 bg-zinc-900"
                    : "border-slate-200 bg-white"
                  }`}
              >
                <p
                  className={`text-xs font-bold uppercase tracking-[0.16em] ${dark
                      ? "text-zinc-500"
                      : "text-slate-400"
                    }`}
                >
                  Reward basics
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {REWARD_LINES.map((line) => (
                    <div
                      key={line}
                      className="flex items-center gap-2 text-sm font-semibold"
                    >
                      <Check
                        className={
                          dark
                            ? "h-4 w-4 shrink-0 text-blue-300"
                            : "h-4 w-4 shrink-0 text-indigo-600"
                        }
                      />

                      <span
                        className={
                          dark
                            ? "text-zinc-200"
                            : "text-slate-700"
                        }
                      >
                        {line}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {quickShares.map((item) => {
                const Icon = item.icon;

                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className={`inline-flex h-11 items-center justify-center gap-2 rounded-lg border text-sm font-bold transition-all duration-300 ${dark
                        ? `border-white/10 bg-white/[0.04] hover:bg-white/[0.08] backdrop-blur-lg ${item.className}`
                        : `border-slate-200/80 bg-white/80 hover:bg-white ${item.className}`
                      }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </a>
                );
              })}
            </div>
          </div>

          <aside
            className={`min-w-0 rounded-lg border p-5 sm:p-6 transition-all duration-300 ${dark
                ? "border-zinc-800 bg-zinc-900"
                : "border-slate-200 bg-white"
              }`}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p
                  className={`text-xs font-bold uppercase tracking-[0.16em] ${dark
                      ? "text-indigo-100/75"
                      : "text-indigo-800/75"
                    }`}
                >
                  Share preview
                </p>

                <h2
                  className={`mt-2 text-2xl font-black tracking-tight ${dark ? "text-white" : "text-slate-950"
                    }`}
                >
                  Join me on EpicShow
                </h2>
              </div>

              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-sm font-black ${dark
                    ? "bg-blue-300 text-zinc-950"
                    : "bg-indigo-700 text-white"
                  }`}
              >
                ES
              </div>
            </div>

            <div
              className={`mt-8 rounded-lg border p-5 transition-all duration-300 ${dark
                  ? "border-white/10 bg-black/20"
                  : "border-white/80 bg-white/75"
                }`}
            >
              <p
                className={`text-sm leading-6 ${dark ? "text-zinc-200" : "text-slate-700"
                  }`}
              >
                {shareText}
              </p>

              <p
                className={`mt-5 break-all text-xs font-semibold leading-5 ${dark
                    ? "text-blue-200"
                    : "text-indigo-800"
                  }`}
              >
                {inviteLink}
              </p>
            </div>

            <div
              className={`mt-5 rounded-lg border p-4 transition-all duration-300 ${dark
                  ? "border-white/10 bg-white/[0.04]"
                  : "border-white/80 bg-white/70"
                }`}
            >
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em]">
                <Gift className="h-4 w-4 text-rose-400" />

                <span
                  className={
                    dark
                      ? "text-zinc-300"
                      : "text-slate-600"
                  }
                >
                  OG image ready
                </span>
              </div>

              <div
                className={`mt-3 overflow-hidden rounded-lg border ${
                  dark
                    ? "border-white/10 bg-zinc-950"
                    : "border-slate-200 bg-white"
                }`}
              >
                <Image
                  src={ogImageUrl}
                  alt={`EpicShow invite image for ${inviteCode}`}
                  width={1200}
                  height={630}
                  className="aspect-[1200/630] h-auto w-full object-cover"
                  unoptimized
                />
              </div>

              <a
                href={ogImageUrl}
                target="_blank"
                rel="noreferrer"
                className={`mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-bold transition-all duration-300 ${dark
                    ? "border-white/10 text-zinc-200 hover:bg-white/10"
                    : "border-slate-200 text-slate-700 hover:bg-white"
                  }`}
              >
                Open OG Image

                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
