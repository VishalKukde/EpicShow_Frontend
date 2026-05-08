"use client";

import { BadgeCheck, Crown, Loader2, Rocket, Sparkles, XCircle } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";
import type { SubscriptionStatusResponse } from "../types";

type ProPlanCardProps = {
  amount: number;
  label: string;
  features: string[];
  status: SubscriptionStatusResponse | null;
  loading: boolean;
  busyAction: "upgrade" | "cancel" | null;
  onUpgrade: () => void;
  onCancel: () => void;
};

function formatDate(value?: string) {
  if (!value) return "";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export default function ProPlanCard({
  amount,
  label,
  features,
  status,
  loading,
  busyAction,
  onUpgrade,
  onCancel,
}: ProPlanCardProps) {
  const mode = useThemeStore((s) => s.mode);
  const dark = mode === "dark";
  const isPro = Boolean(status?.isPro);
  const subscription = status?.subscription;
  const isCancelled = subscription?.status === "cancelled";
  const disabled = loading || busyAction !== null;

  return (
    <article
      className={`rounded-3xl border p-5 shadow-sm ${
        dark
          ? "border-indigo-500/30 bg-zinc-900 shadow-[0_12px_30px_rgba(0,0,0,0.3)]"
          : "border-indigo-200 bg-indigo-50"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className={`text-xs font-medium uppercase tracking-wide ${dark ? "text-indigo-300" : "text-indigo-600"}`}>
            {isPro ? "Current Plan" : "Recommended"}
          </p>
          <h2 className={`mt-1 inline-flex items-center gap-2 text-xl font-semibold ${dark ? "text-zinc-100" : "text-gray-900"}`}>
            Pro
            <Crown className={`h-5 w-5 ${dark ? "text-indigo-300" : "text-current"}`} />
          </h2>
        </div>
        <Sparkles className={`h-5 w-5 ${dark ? "text-indigo-300" : "text-indigo-600"}`} />
      </div>

      <p className={`mt-4 text-3xl font-semibold ${dark ? "text-zinc-100" : "text-gray-900"}`}>₹{amount}</p>
      <p className={`text-sm ${dark ? "text-zinc-300" : "text-gray-700"}`}>{label}</p>
      {subscription?.endDate && (
        <p className={`mt-2 text-sm ${dark ? "text-indigo-200" : "text-indigo-700"}`}>
          {isCancelled ? "Access ends" : "Renews"} on {formatDate(subscription.endDate)}
        </p>
      )}

      <ul className="mt-4 space-y-2">
        {features.map((feature) => (
          <li key={feature} className={`flex items-start gap-2 text-sm ${dark ? "text-zinc-200" : "text-gray-800"}`}>
            <BadgeCheck className={`mt-0.5 h-4 w-4 ${dark ? "text-indigo-300" : "text-indigo-600"}`} />
            {feature}
          </li>
        ))}
      </ul>

      <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
        <button
          type="button"
          disabled={disabled || isPro}
          onClick={onUpgrade}
          className={`inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-white transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-65 ${
            dark ? "bg-indigo-500 hover:bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {busyAction === "upgrade" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Rocket className="h-4 w-4" />
          )}
          {isPro ? "Pro Active" : "Upgrade to Pro"}
        </button>

        <button
          type="button"
          disabled={disabled || !isPro || isCancelled}
          onClick={onCancel}
          className={`inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-65 ${
            dark
              ? "border-zinc-600 bg-zinc-900 text-zinc-100 hover:bg-zinc-800"
              : "border-indigo-200 bg-white text-indigo-700 hover:bg-indigo-50"
          }`}
        >
          {busyAction === "cancel" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <XCircle className="h-4 w-4" />
          )}
          {isCancelled ? "Cancellation Set" : "Cancel"}
        </button>
      </div>
    </article>
  );
}
