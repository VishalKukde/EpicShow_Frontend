"use client";

import { useThemeStore } from "@/store/themeStore";
import type { SubscriptionStatusResponse } from "../types";

type SubscriptionHeroProps = {
  status: SubscriptionStatusResponse | null;
  loading: boolean;
};

function formatDate(value?: string) {
  if (!value) return "";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export default function SubscriptionHero({ status, loading }: SubscriptionHeroProps) {
  const mode = useThemeStore((s) => s.mode);
  const dark = mode === "dark";
  const subscription = status?.subscription;
  const headline = status?.isPro
    ? "Your Pro benefits are active"
    : "Choose the plan that fits your booking style";
  const copy = subscription?.endDate
    ? `Current access runs until ${formatDate(subscription.endDate)}.`
    : "Compare Free vs Pro and upgrade using your wallet balance.";

  return (
    <section
      className={`rounded-3xl border p-6 text-white shadow-lg sm:p-8 ${
        dark
          ? "border-zinc-700 bg-zinc-900"
          : "border-gray-200 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900"
      }`}
    >
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-indigo-200">
        Subscription Plans
      </p>
      <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">
        {loading ? "Checking your subscription" : headline}
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-indigo-100/90">
        {loading ? "Keeping your membership status in sync." : copy}
      </p>
    </section>
  );
}
