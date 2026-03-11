"use client";

import Link from "next/link";
import type { ComponentType } from "react";
import {
  BadgeCheck,
  BookOpenCheck,
  Boxes,
  Code2,
  Coffee,
  CreditCard,
  ExternalLink,
  FileText,
  Github,
  Layers2,
  LayoutDashboard,
  Linkedin,
  LockKeyhole,
  ServerCog,
  Sparkles,
  Ticket,
  UserRound,
} from "lucide-react";
import { useThemeStore } from "@/store/themeStore";

const productFeatures = [
  "User registration, login, logout, and refresh-token based session flow",
  "Password change security flow that invalidates active token sessions and requires re-login",
  "Movie listing, movie details, and show/cinema selection journey",
  "Live seat locking and unlock flow with lock expiry protection",
  "Secure payment flow with Razorpay order creation and signature verification",
  "Wallet payment support plus wallet top-up flow with Razorpay verification",
  "Reward points earn and redeem logic with booking-level rules and transaction history",
  "Payment center with show-type enriched transactions, status/show-type filters, and export statement",
  "Subscription module with monthly, quarterly, and yearly billing cycle options",
  "FAQ center with search + tag based category filtering",
  "Booking states: pending, paid, failed, cancelled, refunded, and expired",
  "Profile module with overview, wallet, activity, payment center, security, FAQs, chat, and feedback",
];

const frontendStack = [
  "Next.js App Router",
  "React 19 + TypeScript",
  "Tailwind CSS v4",
  "Framer Motion",
  "Zustand (state management)",
  "Profile-focused modular component architecture",
  "Lucide Icons",
];

const backendStack = [
  "Node.js + Express",
  "MongoDB + Mongoose",
  "JWT access and refresh token authentication",
  "Token version strategy for session invalidation",
  "Cookie-based auth flow with token refresh endpoint",
  "Razorpay payment integration",
  "Aggregation pipelines for payment analytics and statement export",
  "Express middleware architecture (auth, error handling)",
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
    icon: ExternalLink,
  },
  {
    label: "Dining & Delivery",
    href: "https://dininganddelivery.vercel.app",
    icon: ExternalLink,
  },
  {
    label: "SilkStreet Shop",
    href: "https://silkstreetshop.vercel.app/",
    icon: ExternalLink,
  },
];

export default function AboutPage() {
  const mode = useThemeStore((s) => s.mode);
  const dark = mode === "dark";

  return (
    <div className="space-y-6 px-3 py-3 pb-6 select-none sm:px-4 lg:px-0">
      <section
        className={`rounded-3xl border p-6 text-white shadow-lg sm:p-8 ${
          dark
            ? "border-zinc-700 bg-zinc-900"
            : "border-gray-200 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900"
        }`}
      >
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-indigo-200">
          About This Application
        </p>
        <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">
          Booking platform with secure checkout
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-indigo-100/90">
          A complete full-stack booking system covering authentication, seat
          locking, secure payment verification, wallet and reward flows,
          bookings lifecycle, and a rich profile management experience.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm xl:col-span-1">
          <p className="text-xs font-medium uppercase tracking-wide text-indigo-600">
            Creator
          </p>
          <h2 className="mt-2 text-xl font-semibold text-gray-900">
            Vishal Kukde
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Full-stack developer focused on practical product engineering and
            scalable architecture.
          </p>

          <div className="mt-5 flex items-center gap-3">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-600 text-white">
              <UserRound className="h-10 w-10" />
            </div>
            <div className="ml-auto flex flex-col items-end gap-2">
              <button
                type="button"
                className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
              >
                <FileText className="h-3.5 w-3.5" />
                Resume
              </button>
              <button
                type="button"
                className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-amber-600 px-3 py-2 text-xs font-medium text-white"
              >
                <Coffee className="h-3.5 w-3.5" />
                Buy Me Coffee
              </button>
            </div>
          </div>

          <div className="mt-5 space-y-2">
            {socialLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-100"
              >
                <span className="inline-flex items-center gap-2">
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </span>
                <ExternalLink className="h-3.5 w-3.5 text-gray-500" />
              </Link>
            ))}
          </div>

          <div className="my-4 border-t border-gray-200" />

          <div className="space-y-2">
            {projectLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-100"
              >
                <span className="inline-flex items-center gap-2">
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </span>
                <ExternalLink className="h-3.5 w-3.5 text-gray-500" />
              </Link>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm xl:col-span-2">
          <div className="mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-indigo-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Application Highlights
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {productFeatures.map((feature) => (
              <div
                key={feature}
                className="rounded-xl border border-gray-200 bg-gray-50/80 p-3 text-sm text-gray-700"
              >
                <span className="inline-flex items-start gap-2">
                  <BadgeCheck className="mt-0.5 h-4 w-4 text-emerald-600" />
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <StackCard
          title="Frontend Tech Stack"
          icon={LayoutDashboard}
          items={frontendStack}
        />
        <StackCard
          title="Backend Tech Stack"
          icon={ServerCog}
          items={backendStack}
        />
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MiniCard
          title="Authentication"
          icon={LockKeyhole}
          text="JWT access/refresh flow with token-version based session invalidation."
        />
        <MiniCard
          title="Seat Engine"
          icon={Ticket}
          text="Seat lock, unlock, sold-state conversion, and expiry handling."
        />
        <MiniCard
          title="Payments + Wallet"
          icon={CreditCard}
          text="Razorpay verification, wallet top-up, and wallet-based booking payments."
        />
        <MiniCard
          title="Payment Insights"
          icon={LayoutDashboard}
          text="Show-type transaction data with filter modal and statement export support."
        />
        <MiniCard
          title="Rewards System"
          icon={Sparkles}
          text="Reward points earning/redeeming with transaction-level tracking."
        />
        <MiniCard
          title="Modular Design"
          icon={Boxes}
          text="Structured route modules for profile, subscription, booking, and payment flows."
        />
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
          <BookOpenCheck className="h-4 w-4 text-indigo-600" />
          <span>
            Built as a full-stack learning and production-style architecture
            exercise.
          </span>
          <Layers2 className="h-4 w-4 text-indigo-600" />
          <Code2 className="h-4 w-4 text-indigo-600" />
        </div>
      </section>
    </div>
  );
}

function StackCard({
  title,
  icon: Icon,
  items,
}: {
  title: string;
  icon: ComponentType<{ className?: string }>;
  items: string[];
}) {
  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Icon className="h-5 w-5 text-indigo-600" />
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <p
            key={item}
            className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700"
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
}: {
  title: string;
  icon: ComponentType<{ className?: string }>;
  text: string;
}) {
  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <Icon className="h-5 w-5 text-indigo-600" />
      <h4 className="mt-2 font-semibold text-gray-900">{title}</h4>
      <p className="mt-1 text-sm text-gray-600">{text}</p>
    </article>
  );
}
