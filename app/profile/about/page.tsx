"use client";

import Link from "next/link";
import type { ComponentType } from "react";
import {
  BadgeCheck,
  Bot,
  CalendarDays,
  CircleDollarSign,
  Clapperboard,
  Code2,
  CreditCard,
  ExternalLink,
  Github,
  Layers3,
  LayoutDashboard,
  Linkedin,
  LockKeyhole,
  MessageSquareText,
  ReceiptText,
  RefreshCcw,
  ServerCog,
  ShieldCheck,
  Sparkles,
  Ticket,
  Train,
  Trophy,
  UserRound,
  WalletCards,
  Zap,
} from "lucide-react";
import { useThemeStore } from "@/store/themeStore";

const platformStats = [
  { label: "Booking Verticals", value: "5+", tone: "emerald" },
  { label: "Payment Paths", value: "4", tone: "sky" },
  { label: "Admin Views", value: "8", tone: "amber" },
  { label: "Profile Tools", value: "12", tone: "rose" },
];

const featureTiles = [
  {
    title: "Movies, Sports, Events, Gaming",
    text: "Browse shows, reserve seats, review orders, and track every ticket from one profile hub.",
    icon: Clapperboard,
    accent: "text-rose-600 bg-rose-50 border-rose-100",
  },
  {
    title: "Train Booking Module",
    text: "Train search, passenger details, PNR tickets, journey expiry tags, cancellations, and refund history.",
    icon: Train,
    accent: "text-cyan-700 bg-cyan-50 border-cyan-100",
  },
  {
    title: "Refund Operations",
    text: "Cancelled bookings move into a refund queue for admins, then appear in the user's refund history.",
    icon: RefreshCcw,
    accent: "text-amber-700 bg-amber-50 border-amber-100",
  },
  {
    title: "Wallet And Rewards",
    text: "Wallet payments, top-ups, refund credits, reward earning, redemption, and transaction history.",
    icon: WalletCards,
    accent: "text-emerald-700 bg-emerald-50 border-emerald-100",
  },
  {
    title: "Admin Command Center",
    text: "Dashboard KPIs, train-aware booking tables, refunds, orders, customers, venues, and route analytics.",
    icon: LayoutDashboard,
    accent: "text-indigo-700 bg-indigo-50 border-indigo-100",
  },
  {
    title: "Live Assistance",
    text: "Profile chat, notifications, feedback, FAQs, and rule-based help keep user support close to the flow.",
    icon: Bot,
    accent: "text-violet-700 bg-violet-50 border-violet-100",
  },
];

const productHighlights = [
  "Secure auth with access and refresh tokens",
  "Password change flow that invalidates active sessions",
  "Realtime seat locking with expiry protection",
  "Razorpay order creation and signature verification",
  "Wallet payment, wallet top-up, and refund credit flows",
  "Coupon, reward points, and booking discount tracking",
  "Payment center with filters and statement export",
  "Subscription plans with flexible billing cycles",
  "Saved train passengers and PNR status checks",
  "Booking states for pending, paid, failed, cancelled, refunded, and expired",
  "Admin dashboard with train data in KPIs and category stats",
  "User refund history across movies, sports, events, gaming, and trains",
];

const frontendStack = [
  "Next.js App Router",
  "React 19 + TypeScript",
  "Tailwind CSS v4",
  "Framer Motion",
  "Zustand stores",
  "Lucide icon system",
  "Responsive profile shell",
];

const backendStack = [
  "Node.js + Express",
  "MongoDB + Mongoose",
  "JWT access and refresh auth",
  "Razorpay payment integration",
  "Wallet transaction ledger",
  "Mongo aggregation analytics",
  "Modular route/controller structure",
];

const socialLinks = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/vishal-kukde",
    icon: Linkedin,
  },
  {
    label: "GitHub",
    href: "https://github.com/vishalkukde",
    icon: Github,
  },
  {
    label: "Portfolio",
    href: "https://vishalkukde.vercel.app",
    icon: ExternalLink,
  },
];

const projectLinks = [
  {
    label: "GetEpicShow",
    href: "https://getepicshow.vercel.app/login",
    icon: Ticket,
  },
  {
    label: "Dining & Delivery",
    href: "https://dininganddelivery.vercel.app",
    icon: ReceiptText,
  },
  {
    label: "SilkStreet Shop",
    href: "https://silkstreetshop.vercel.app/",
    icon: Sparkles,
  },
];

const roadmap = [
  { label: "Customer Flow", text: "Search, select, book, pay, cancel, and track refunds.", icon: Ticket },
  { label: "Admin Flow", text: "Review bookings, process refunds, and monitor route performance.", icon: ShieldCheck },
  { label: "Money Flow", text: "Payments, wallet ledger, rewards, coupons, and statements.", icon: CircleDollarSign },
];

export default function AboutPage() {
  const dark = useThemeStore((s) => s.mode === "dark");

  return (
    <div className="space-y-5 px-3 py-3 pb-6 select-none sm:px-4 lg:px-0">
      <section
        className={`overflow-hidden rounded-3xl border ${
          dark
            ? "border-zinc-800 bg-zinc-950 text-zinc-50"
            : "border-slate-200 bg-white text-slate-950"
        } shadow-[0_22px_70px_rgba(15,23,42,0.10)]`}
      >
        <div className="grid gap-0 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="relative p-5 sm:p-7 lg:p-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] ${
                dark ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-200" : "border-emerald-200 bg-emerald-50 text-emerald-700"
              }`}>
                <Zap className="h-3.5 w-3.5" />
                EpicShow Platform
              </span>
              <span className={`rounded-full border px-3 py-1.5 text-xs font-bold ${
                dark ? "border-zinc-700 bg-zinc-900 text-zinc-300" : "border-slate-200 bg-slate-50 text-slate-600"
              }`}>
                Full-stack booking system
              </span>
            </div>

            <h1 className="mt-5 max-w-4xl text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              Book tickets, manage payments, and run operations from one polished workspace.
            </h1>
            <p className={`mt-4 max-w-3xl text-sm leading-6 sm:text-base ${
              dark ? "text-zinc-300" : "text-slate-600"
            }`}>
              EpicShow brings together consumer booking flows, wallet payments, rewards,
              train PNR tickets, refund tracking, and admin analytics in one practical
              production-style application.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {platformStats.map((stat) => (
                <StatPill key={stat.label} {...stat} dark={dark} />
              ))}
            </div>
          </div>

          <aside className={`${dark ? "bg-zinc-900/70" : "bg-slate-950"} p-5 text-white sm:p-7 lg:p-8`}>
            <div className="flex items-center gap-3">
              <div className="grid h-14 w-14 place-items-center rounded-2xl border border-white/10 bg-white/10">
                <UserRound className="h-7 w-7" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.14em] text-cyan-200">Created By</p>
                <h2 className="text-xl font-black">Vishal Kukde</h2>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-300">
              A full-stack developer focused on practical systems, thoughtful interfaces,
              and features that feel complete from user action to admin resolution.
            </p>

            <div className="mt-5 grid gap-2">
              {socialLinks.map((item) => (
                <ProfileLink key={item.label} item={item} />
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="grid gap-4 xl:col-span-2">
          <div className="grid gap-4 md:grid-cols-2">
            {featureTiles.map((feature) => (
              <FeatureTile key={feature.title} feature={feature} dark={dark} />
            ))}
          </div>
        </div>

        <aside className={`rounded-3xl border p-5 shadow-sm ${
          dark ? "border-zinc-800 bg-zinc-950" : "border-slate-200 bg-white"
        }`}>
          <div className="flex items-center gap-2">
            <Layers3 className="h-5 w-5 text-emerald-600" />
            <h2 className={`text-lg font-black ${dark ? "text-zinc-50" : "text-slate-950"}`}>
              Recently Added
            </h2>
          </div>
          <div className="mt-4 space-y-3">
            <Capability
              dark={dark}
              icon={Train}
              title="Train expiry and cancellation"
              text="Past train departures show as expired, and active train tickets enter the refund queue after cancellation."
            />
            <Capability
              dark={dark}
              icon={RefreshCcw}
              title="Train refunds everywhere"
              text="Refund status appears in train ticket modals, admin refunds, and user refund history."
            />
            <Capability
              dark={dark}
              icon={LayoutDashboard}
              title="Train-aware admin analytics"
              text="Admin bookings, dashboard totals, revenue mix, and refund operations now include train data."
            />
          </div>
        </aside>
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <article className={`rounded-3xl border p-5 shadow-sm ${
          dark ? "border-zinc-800 bg-zinc-950" : "border-slate-200 bg-white"
        }`}>
          <div className="flex items-center gap-2">
            <BadgeCheck className="h-5 w-5 text-cyan-600" />
            <h2 className={`text-lg font-black ${dark ? "text-zinc-50" : "text-slate-950"}`}>
              Product Highlights
            </h2>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {productHighlights.map((feature) => (
              <div
                key={feature}
                className={`rounded-2xl border p-3 text-sm font-semibold ${
                  dark
                    ? "border-zinc-800 bg-zinc-900/70 text-zinc-300"
                    : "border-slate-200 bg-slate-50 text-slate-700"
                }`}
              >
                <span className="flex items-start gap-2">
                  <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </article>

        <article className={`rounded-3xl border p-5 shadow-sm ${
          dark ? "border-zinc-800 bg-zinc-950" : "border-slate-200 bg-white"
        }`}>
          <div className="flex items-center gap-2">
            <MessageSquareText className="h-5 w-5 text-violet-600" />
            <h2 className={`text-lg font-black ${dark ? "text-zinc-50" : "text-slate-950"}`}>
              Experience Map
            </h2>
          </div>
          <div className="mt-4 grid gap-3">
            {roadmap.map((item) => (
              <RoadmapRow key={item.label} item={item} dark={dark} />
            ))}
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            {projectLinks.map((item) => (
              <ProjectLink key={item.label} item={item} dark={dark} />
            ))}
          </div>
        </article>
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <StackCard title="Frontend Stack" icon={Code2} items={frontendStack} dark={dark} />
        <StackCard title="Backend Stack" icon={ServerCog} items={backendStack} dark={dark} />
      </section>

      <section className={`grid gap-3 rounded-3xl border p-5 shadow-sm sm:grid-cols-2 xl:grid-cols-4 ${
        dark ? "border-zinc-800 bg-zinc-950" : "border-slate-200 bg-white"
      }`}>
        <MiniCard dark={dark} title="Auth Security" icon={LockKeyhole} text="Token refresh, protected routes, and session invalidation." />
        <MiniCard dark={dark} title="Seat Engine" icon={Ticket} text="Lock, unlock, sold-state conversion, and expiry handling." />
        <MiniCard dark={dark} title="Payments" icon={CreditCard} text="Razorpay, wallet payments, refunds, and transaction records." />
        <MiniCard dark={dark} title="Live Sports" icon={Trophy} text="Sports bookings with teams, schedules, venues, and seats." />
        <MiniCard dark={dark} title="Events" icon={CalendarDays} text="Event and gaming flows share reusable checkout behavior." />
        <MiniCard dark={dark} title="Admin Tools" icon={LayoutDashboard} text="Bookings, orders, refunds, venues, customers, and KPIs." />
        <MiniCard dark={dark} title="Train Tickets" icon={Train} text="PNR details, passenger data, expiry tags, and refund tracking." />
        <MiniCard dark={dark} title="Assistant" icon={Bot} text="Profile chat, FAQs, feedback, and notification support." />
      </section>
    </div>
  );
}

function StatPill({
  label,
  value,
  tone,
  dark,
}: {
  label: string;
  value: string;
  tone: string;
  dark: boolean;
}) {
  const toneClass =
    tone === "emerald"
      ? "text-emerald-600"
      : tone === "sky"
        ? "text-sky-600"
        : tone === "amber"
          ? "text-amber-600"
          : "text-rose-600";

  return (
    <div className={`rounded-2xl border p-3 ${
      dark ? "border-zinc-800 bg-zinc-900/70" : "border-slate-200 bg-slate-50"
    }`}>
      <p className={`text-2xl font-black ${toneClass}`}>{value}</p>
      <p className={dark ? "mt-1 text-xs font-bold text-zinc-400" : "mt-1 text-xs font-bold text-slate-500"}>
        {label}
      </p>
    </div>
  );
}

function FeatureTile({
  feature,
  dark,
}: {
  feature: {
    title: string;
    text: string;
    icon: ComponentType<{ className?: string }>;
    accent: string;
  };
  dark: boolean;
}) {
  const Icon = feature.icon;
  return (
    <article className={`rounded-3xl border p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg ${
      dark ? "border-zinc-800 bg-zinc-950" : "border-slate-200 bg-white"
    }`}>
      <div className={`grid h-11 w-11 place-items-center rounded-2xl border ${feature.accent}`}>
        <Icon className="h-5 w-5" />
      </div>
      <h3 className={`mt-4 text-base font-black ${dark ? "text-zinc-50" : "text-slate-950"}`}>
        {feature.title}
      </h3>
      <p className={`mt-2 text-sm leading-6 ${dark ? "text-zinc-400" : "text-slate-600"}`}>
        {feature.text}
      </p>
    </article>
  );
}

function Capability({
  dark,
  icon: Icon,
  title,
  text,
}: {
  dark: boolean;
  icon: ComponentType<{ className?: string }>;
  title: string;
  text: string;
}) {
  return (
    <div className={`rounded-2xl border p-3 ${
      dark ? "border-zinc-800 bg-zinc-900/70" : "border-slate-200 bg-slate-50"
    }`}>
      <div className="flex items-start gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-cyan-50 text-cyan-700">
          <Icon className="h-4 w-4" />
        </span>
        <div>
          <p className={`text-sm font-black ${dark ? "text-zinc-100" : "text-slate-900"}`}>{title}</p>
          <p className={`mt-1 text-xs leading-5 ${dark ? "text-zinc-400" : "text-slate-600"}`}>{text}</p>
        </div>
      </div>
    </div>
  );
}

function RoadmapRow({
  item,
  dark,
}: {
  item: { label: string; text: string; icon: ComponentType<{ className?: string }> };
  dark: boolean;
}) {
  const Icon = item.icon;
  return (
    <div className={`flex items-start gap-3 rounded-2xl border p-3 ${
      dark ? "border-zinc-800 bg-zinc-900/70" : "border-slate-200 bg-slate-50"
    }`}>
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className={`text-sm font-black ${dark ? "text-zinc-100" : "text-slate-900"}`}>{item.label}</p>
        <p className={`mt-1 text-sm leading-5 ${dark ? "text-zinc-400" : "text-slate-600"}`}>{item.text}</p>
      </div>
    </div>
  );
}

function StackCard({
  title,
  icon: Icon,
  items,
  dark,
}: {
  title: string;
  icon: ComponentType<{ className?: string }>;
  items: string[];
  dark: boolean;
}) {
  return (
    <article className={`rounded-3xl border p-5 shadow-sm ${
      dark ? "border-zinc-800 bg-zinc-950" : "border-slate-200 bg-white"
    }`}>
      <div className="mb-4 flex items-center gap-2">
        <Icon className="h-5 w-5 text-indigo-600" />
        <h3 className={`text-lg font-black ${dark ? "text-zinc-50" : "text-slate-950"}`}>{title}</h3>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {items.map((item) => (
          <p
            key={item}
            className={`rounded-2xl border px-3 py-2 text-sm font-semibold ${
              dark
                ? "border-zinc-800 bg-zinc-900/70 text-zinc-300"
                : "border-slate-200 bg-slate-50 text-slate-700"
            }`}
          >
            {item}
          </p>
        ))}
      </div>
    </article>
  );
}

function MiniCard({
  title,
  icon: Icon,
  text,
  dark,
}: {
  title: string;
  icon: ComponentType<{ className?: string }>;
  text: string;
  dark: boolean;
}) {
  return (
    <article className={`rounded-2xl border p-4 ${
      dark ? "border-zinc-800 bg-zinc-900/70" : "border-slate-200 bg-slate-50"
    }`}>
      <Icon className="h-5 w-5 text-indigo-600" />
      <h4 className={`mt-3 font-black ${dark ? "text-zinc-100" : "text-slate-950"}`}>{title}</h4>
      <p className={`mt-1 text-sm leading-5 ${dark ? "text-zinc-400" : "text-slate-600"}`}>{text}</p>
    </article>
  );
}

function ProfileLink({
  item,
}: {
  item: { label: string; href: string; icon: ComponentType<{ className?: string }> };
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      target="_blank"
      rel="noreferrer"
      className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.06] px-3 py-2.5 text-sm font-bold text-slate-100 transition hover:bg-white/[0.10]"
    >
      <span className="inline-flex items-center gap-2">
        <Icon className="h-4 w-4" />
        {item.label}
      </span>
      <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
    </Link>
  );
}

function ProjectLink({
  item,
  dark,
}: {
  item: { label: string; href: string; icon: ComponentType<{ className?: string }> };
  dark: boolean;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      target="_blank"
      rel="noreferrer"
      className={`flex min-h-11 items-center justify-between rounded-2xl border px-3 py-2 text-xs font-black transition ${
        dark
          ? "border-zinc-800 bg-zinc-900/70 text-zinc-200 hover:bg-zinc-900"
          : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-white"
      }`}
    >
      <span className="inline-flex items-center gap-2">
        <Icon className="h-4 w-4" />
        {item.label}
      </span>
      <ExternalLink className="h-3.5 w-3.5 opacity-60" />
    </Link>
  );
}
