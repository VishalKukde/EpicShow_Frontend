"use client";

import Link from "next/link";
import {
  Clapperboard,
  Code2,
  ExternalLink,
  Github,
  Layers3,
  LayoutDashboard,
  Linkedin,
  ServerCog,
  Sparkles,
  Train,
  UserRound,
  WalletCards,
} from "lucide-react";
import { useThemeStore } from "@/store/themeStore";

const platformStats = [
  { label: "Entertainment Verticals", value: "5+", subtext: "Movies, Sports, Events & Gaming" },
  { label: "Payment Gateways", value: "Razorpay & Wallet", subtext: "Instant Top-up & Ledger Credits" },
  { label: "Realtime Seat Engine", value: "Expiry Lock", subtext: "Concurrency Protected Checkout" },
  { label: "Railway Travel", value: "Live PNR", subtext: "Train Search & Automated Refunds" },
];

const corePillars = [
  {
    title: "Omnichannel Ticketing",
    description:
      "Unified reservation system for cinema, stadium sports, live events, and e-sports with dynamic seat selection and instant mobile pass generation.",
    icon: Clapperboard,
    accent: "text-amber-500 bg-amber-500/10 border-amber-500/20",
  },
  {
    title: "Rail & Travel Engine",
    description:
      "Integrated train booking module supporting PNR status tracking, passenger management, departure expiry tags, and automated refund processing.",
    icon: Train,
    accent: "text-cyan-500 bg-cyan-500/10 border-cyan-500/20",
  },
  {
    title: "Financial Ledger & Wallet",
    description:
      "Secure wallet infrastructure with top-up options, instant refund credits for cancelled tickets, discount coupon tracking, and statement downloads.",
    icon: WalletCards,
    accent: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
  },
  {
    title: "Admin Command Intelligence",
    description:
      "Real-time analytics dashboard monitoring venue sales, booking status KPIs, train revenue mix, customer lifecycle, and refund approvals.",
    icon: LayoutDashboard,
    accent: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20",
  },
];

const techStack = {
  frontend: [
    { label: "Framework", val: "Next.js App Router (React 19)" },
    { label: "Language & Types", val: "TypeScript (Strict Mode)" },
    { label: "Styling & UI", val: "Tailwind CSS v4 + Framer Motion" },
    { label: "State Engine", val: "Zustand Global Stores" },
  ],
  backend: [
    { label: "Server Runtime", val: "Node.js + Express Async Router" },
    { label: "Database System", val: "MongoDB + Mongoose Aggregations" },
    { label: "Security & Auth", val: "JWT Access & Refresh Session Flow" },
    { label: "Payments", val: "Razorpay Signature Verification" },
  ],
};

const developerLinks = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/vishal-kukde", icon: Linkedin },
  { label: "GitHub", href: "https://github.com/vishalkukde", icon: Github },
  { label: "Portfolio", href: "https://vishalkukde.vercel.app", icon: ExternalLink },
];

export default function AboutPage() {
  const dark = useThemeStore((s) => s.mode === "dark");

  return (
    <div className="select-none space-y-4 px-3 py-2 pb-6 sm:px-4 lg:px-0">
      {/* Compact Luxury Hero Banner */}
      <section
        className={`relative overflow-hidden rounded-2xl border ${dark
            ? "border-zinc-800 bg-[#18181b] text-zinc-100"
            : "border-slate-200 bg-white text-slate-900"
          } dark:bg-[#18181b] dark:border-zinc-800 shadow-md`}
      >
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="relative p-4 sm:p-5 lg:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wider ${dark
                  ? "border-indigo-400/30 bg-indigo-500/15 text-indigo-300"
                  : "border-indigo-200 bg-indigo-50 text-indigo-700"
                }`}
            >
              <Sparkles className="h-3 w-3" />
              Platform Architecture
            </span>
            <span
              className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${dark ? "border-zinc-700 bg-zinc-900/80 text-zinc-300" : "border-slate-200 bg-slate-100 text-slate-700"
                }`}
            >
              Enterprise Full-Stack System
            </span>
          </div>

          <h1 className="mt-3 max-w-2xl text-xl font-black tracking-tight sm:text-2xl lg:text-3xl leading-tight">
            EpicShow Booking & Financial Platform
          </h1>

          <p
            className={`mt-2 max-w-2xl text-xs font-medium leading-relaxed sm:text-sm ${dark ? "text-zinc-300" : "text-slate-600"
              }`}
          >
            A high-performance reservation platform engineered for multi-category ticketing, train travel management, digital wallet transactions, and administrative operational intelligence.
          </p>

          {/* Key Metrics Grid */}
          <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {platformStats.map((stat) => (
              <div
                key={stat.label}
                className={`rounded-xl border p-3 transition-all duration-200 hover:border-indigo-500/40 ${dark ? "border-zinc-800 bg-zinc-900/60" : "border-slate-200 bg-slate-50/80"
                  }`}
              >
                <p className="text-lg sm:text-xl font-black text-indigo-500">{stat.value}</p>
                <p className={`mt-0.5 text-xs font-bold ${dark ? "text-zinc-200" : "text-slate-900"}`}>{stat.label}</p>
                <p className={`text-[10px] ${dark ? "text-zinc-400" : "text-slate-500"}`}>{stat.subtext}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Systems Pillars */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 px-1">
          <Layers3 className="h-4.5 w-4.5 text-indigo-500" />
          <h2 className={`text-base font-bold ${dark ? "text-zinc-100" : "text-slate-900"} dark:text-white`}>
            Core Ecosystem Capabilities
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {corePillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <article
                key={pillar.title}
                className={`rounded-xl border p-4 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm ${dark ? "border-zinc-800 bg-[#18181b]" : "border-slate-200 bg-white"
                  } dark:bg-[#18181b] dark:border-zinc-800`}
              >
                <div className="flex items-center gap-3">
                  <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl border ${pillar.accent}`}>
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <h3 className={`text-base font-bold ${dark ? "text-zinc-100" : "text-slate-900"} dark:text-white`}>
                    {pillar.title}
                  </h3>
                </div>
                <p className={`mt-2 text-xs leading-relaxed ${dark ? "text-zinc-400" : "text-slate-600"}`}>
                  {pillar.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      {/* Tech Stack & Architecture */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 px-1">
          <Code2 className="h-4.5 w-4.5 text-indigo-500" />
          <h2 className={`text-base font-bold ${dark ? "text-zinc-100" : "text-slate-900"} dark:text-white`}>
            Technical Architecture
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {/* Frontend */}
          <article
            className={`rounded-xl border p-4 shadow-xs ${dark ? "border-zinc-800 bg-[#18181b]" : "border-slate-200 bg-white"
              } dark:bg-[#18181b] dark:border-zinc-800`}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                <Code2 className="h-4 w-4" />
              </span>
              <h3 className={`text-sm font-bold ${dark ? "text-white" : "text-slate-900"}`}>
                Frontend Engineering
              </h3>
            </div>
            <div className="space-y-2">
              {techStack.frontend.map((item) => (
                <div
                  key={item.label}
                  className={`flex flex-wrap items-center justify-between gap-2 rounded-lg border px-3 py-2 text-xs ${dark ? "border-zinc-800 bg-zinc-900/60" : "border-slate-100 bg-slate-50"
                    }`}
                >
                  <span className={`font-semibold ${dark ? "text-zinc-400" : "text-slate-500"}`}>{item.label}</span>
                  <span className={`font-bold ${dark ? "text-zinc-100" : "text-slate-900"}`}>{item.val}</span>
                </div>
              ))}
            </div>
          </article>

          {/* Backend */}
          <article
            className={`rounded-xl border p-4 shadow-xs ${dark ? "border-zinc-800 bg-[#18181b]" : "border-slate-200 bg-white"
              } dark:bg-[#18181b] dark:border-zinc-800`}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">
                <ServerCog className="h-4 w-4" />
              </span>
              <h3 className={`text-sm font-bold ${dark ? "text-white" : "text-slate-900"}`}>
                Backend Architecture
              </h3>
            </div>
            <div className="space-y-2">
              {techStack.backend.map((item) => (
                <div
                  key={item.label}
                  className={`flex flex-wrap items-center justify-between gap-2 rounded-lg border px-3 py-2 text-xs ${dark ? "border-zinc-800 bg-zinc-900/60" : "border-slate-100 bg-slate-50"
                    }`}
                >
                  <span className={`font-semibold ${dark ? "text-zinc-400" : "text-slate-500"}`}>{item.label}</span>
                  <span className={`font-bold ${dark ? "text-zinc-100" : "text-slate-900"}`}>{item.val}</span>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      {/* Compact Developer Footer Banner */}
      <section
        className={`rounded-2xl border p-4 sm:p-5 shadow-xs ${dark ? "border-zinc-800 bg-[#18181b]" : "border-slate-200 bg-white"
          } dark:bg-[#18181b] dark:border-zinc-800`}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-indigo-600 text-white shadow-xs">
              <UserRound className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className={`text-base font-bold ${dark ? "text-white" : "text-slate-900"}`}>
                  Vishal Kukde
                </h3>
                <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-500 border border-emerald-500/30">
                  Lead Engineer
                </span>
              </div>
              <p className={`mt-0.5 text-[11px] font-medium ${dark ? "text-zinc-400" : "text-slate-500"}`}>
                Full-stack specialist building scalable booking applications and intuitive interfaces.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {developerLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-bold transition cursor-pointer ${dark
                      ? "border-zinc-700 bg-zinc-900 text-zinc-100 hover:bg-zinc-800"
                      : "border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100"
                    }`}
                >
                  <Icon className="h-3.5 w-3.5 text-indigo-500" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
