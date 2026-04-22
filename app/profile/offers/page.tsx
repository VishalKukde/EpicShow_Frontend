"use client";

import Link from "next/link";
import { ArrowRight, BadgePercent, Sparkles, TicketPercent } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";

const offerHighlights = [
  {
    title: "Weekend movie drop",
    detail: "Flat 15% off on selected movie bookings every Friday night.",
    tag: "Movies",
  },
  {
    title: "Wallet booster days",
    detail: "Top-up bonus campaigns and cashback-ready wallet offers appear here.",
    tag: "Wallet",
  },
  {
    title: "Premium early deals",
    detail: "Exclusive offer bundles for upcoming events, sports, and gaming slots.",
    tag: "Events",
  },
];

export default function ProfileOffersPage() {
  const mode = useThemeStore((s) => s.mode);
  const dark = mode === "dark";

  return (
    <div className="space-y-6 px-3 py-3 pb-6 select-none sm:px-4 lg:px-0">
      <section
        className={`rounded-3xl border p-6 shadow-lg sm:p-8 ${
          dark
            ? "border-zinc-700 bg-zinc-900"
            : "border-gray-200 bg-gradient-to-br from-indigo-50 via-white to-cyan-50"
        }`}
      >
        <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${dark ? "text-zinc-400" : "text-indigo-600"}`}>
          Offers
        </p>
        <div className="mt-3 flex items-center gap-3">
          <div
            className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl ${
              dark ? "bg-indigo-500/15 text-indigo-300" : "bg-indigo-100 text-indigo-700"
            }`}
          >
            <BadgePercent className="h-5 w-5" />
          </div>
          <h1 className={`text-2xl font-semibold ${dark ? "text-zinc-100" : "text-gray-900"}`}>
            Deals & Offers
          </h1>
        </div>
        <p className={`mt-3 max-w-2xl text-sm ${dark ? "text-zinc-300" : "text-gray-600"}`}>
          Explore savings, campaign drops, wallet bonus windows, and booking-friendly offers right from your profile.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        {offerHighlights.map((offer) => (
          <article
            key={offer.title}
            className={`rounded-2xl border p-5 shadow-sm ${
              dark ? "border-zinc-700 bg-zinc-900/85" : "border-gray-200 bg-white"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div
                className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl ${
                  dark ? "bg-indigo-500/15 text-indigo-300" : "bg-indigo-100 text-indigo-700"
                }`}
              >
                <TicketPercent className="h-5 w-5" />
              </div>
              <span
                className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${
                  dark ? "bg-zinc-800 text-zinc-300" : "bg-slate-100 text-slate-600"
                }`}
              >
                {offer.tag}
              </span>
            </div>

            <h2 className={`mt-4 text-lg font-semibold ${dark ? "text-zinc-100" : "text-slate-900"}`}>
              {offer.title}
            </h2>
            <p className={`mt-2 text-sm leading-6 ${dark ? "text-zinc-400" : "text-slate-600"}`}>
              {offer.detail}
            </p>
          </article>
        ))}
      </section>

      <section
        className={`rounded-3xl border p-6 sm:p-7 ${
          dark ? "border-zinc-700 bg-zinc-900/85" : "border-gray-200 bg-white"
        }`}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className={`inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] ${dark ? "text-cyan-300" : "text-cyan-700"}`}>
              <Sparkles className="h-4 w-4" />
              More deals coming soon
            </p>
            <h3 className={`mt-2 text-xl font-semibold ${dark ? "text-zinc-100" : "text-slate-900"}`}>
              Browse shows and catch the next offer drop
            </h3>
          </div>

          <Link
            href="/movies"
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition ${
              dark
                ? "bg-zinc-100 text-zinc-900 hover:bg-white"
                : "bg-gray-900 text-white hover:bg-black"
            }`}
          >
            Browse Shows
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
