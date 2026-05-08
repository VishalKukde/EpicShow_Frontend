"use client";

import { BadgeCheck, CalendarClock, Crown, Loader2, ShieldCheck, Sparkles, XCircle } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";
import type { SubscriptionRecord } from "../types";

type CurrentSubscriptionDetailsProps = {
  subscription: SubscriptionRecord | null;
  busyAction: "upgrade" | "cancel" | null;
  onCancelClick: () => void;
};

const proPerks = [
  "Book up to 5 tickets per transaction",
  "10 minute seat hold on supported shows",
  "Double reward points on eligible paid bookings",
  "Priority booking and premium support access",
];

function formatDate(value?: string) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(value));
}

function formatStatus(status?: string) {
  if (!status) return "Active";
  return status
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function CurrentSubscriptionDetails({
  subscription,
  busyAction,
  onCancelClick,
}: CurrentSubscriptionDetailsProps) {
  const mode = useThemeStore((s) => s.mode);
  const dark = mode === "dark";
  const isCancelled = subscription?.status === "cancelled";

  return (
    <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1.15fr_0.85fr]">
      <article
        className={`rounded-3xl border p-5 shadow-sm sm:p-6 ${
          dark
            ? "border-indigo-500/30 bg-zinc-900 shadow-[0_12px_30px_rgba(0,0,0,0.3)]"
            : "border-indigo-200 bg-white"
        }`}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className={`text-xs font-semibold uppercase tracking-[0.2em] ${dark ? "text-indigo-300" : "text-indigo-600"}`}>
              Current Subscription
            </p>
            <h2 className={`mt-2 flex items-center gap-2 text-2xl font-semibold ${dark ? "text-zinc-100" : "text-slate-900"}`}>
              EpicShow Pro
              <Crown className={`h-5 w-5 ${dark ? "text-indigo-300" : "text-indigo-600"}`} />
            </h2>
            <p className={`mt-1 text-sm ${dark ? "text-zinc-400" : "text-slate-600"}`}>
              {isCancelled
                ? "Cancellation is scheduled. Your Pro benefits continue until expiry."
                : "Your Pro benefits are active on this account."}
            </p>
          </div>

          <span
            className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${
              isCancelled
                ? dark
                  ? "border-amber-500/40 bg-amber-500/10 text-amber-300"
                  : "border-amber-300 bg-amber-50 text-amber-700"
                : dark
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                  : "border-emerald-300 bg-emerald-50 text-emerald-700"
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            {formatStatus(subscription?.status)}
          </span>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <DetailTile label="Plan" value={(subscription?.plan || "pro").toUpperCase()} />
          <DetailTile label="Provider" value={subscription?.paymentProvider || "razorpay"} />
          <DetailTile label="Started" value={formatDate(subscription?.startDate)} />
          <DetailTile label={isCancelled ? "Access Ends" : "Expires On"} value={formatDate(subscription?.endDate)} />
        </div>

        {subscription?.externalSubscriptionId && (
          <div className={`mt-4 rounded-2xl border px-4 py-3 text-sm ${dark ? "border-zinc-700 bg-zinc-950 text-zinc-300" : "border-slate-200 bg-slate-50 text-slate-600"}`}>
            <span className="font-semibold">External ID:</span> {subscription.externalSubscriptionId}
          </div>
        )}

        <button
          type="button"
          onClick={onCancelClick}
          disabled={busyAction !== null || isCancelled}
          className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto ${
            dark
              ? "border-red-500/40 bg-red-500/10 text-red-300 hover:bg-red-500/15"
              : "border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
          }`}
        >
          {busyAction === "cancel" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <XCircle className="h-4 w-4" />
          )}
          {isCancelled ? "Cancellation Scheduled" : "Cancel Subscription"}
        </button>
      </article>

      <article
        className={`rounded-3xl border p-5 shadow-sm sm:p-6 ${
          dark
            ? "border-zinc-700 bg-zinc-900 shadow-[0_12px_30px_rgba(0,0,0,0.3)]"
            : "border-slate-200 bg-white"
        }`}
      >
        <div className="flex items-center gap-2">
          <Sparkles className={`h-5 w-5 ${dark ? "text-indigo-300" : "text-indigo-600"}`} />
          <h3 className={`text-lg font-semibold ${dark ? "text-zinc-100" : "text-slate-900"}`}>
            Pro Benefits
          </h3>
        </div>

        <ul className="mt-4 space-y-3">
          {proPerks.map((perk) => (
            <li key={perk} className={`flex items-start gap-2 text-sm ${dark ? "text-zinc-200" : "text-slate-700"}`}>
              <BadgeCheck className={`mt-0.5 h-4 w-4 ${dark ? "text-indigo-300" : "text-indigo-600"}`} />
              <span>{perk}</span>
            </li>
          ))}
        </ul>

        <div className={`mt-5 rounded-2xl border px-4 py-3 text-sm ${dark ? "border-zinc-700 bg-zinc-950 text-zinc-300" : "border-indigo-100 bg-indigo-50 text-indigo-900"}`}>
          <CalendarClock className="mb-2 h-4 w-4" />
          Your membership is synced from the active subscription record, not from profile flags.
        </div>
      </article>
    </section>
  );
}

function DetailTile({ label, value }: { label: string; value: string }) {
  const mode = useThemeStore((s) => s.mode);
  const dark = mode === "dark";

  return (
    <div className={`rounded-2xl border px-4 py-3 ${dark ? "border-zinc-700 bg-zinc-950" : "border-slate-200 bg-slate-50"}`}>
      <p className={`text-xs font-semibold uppercase tracking-[0.16em] ${dark ? "text-zinc-500" : "text-slate-500"}`}>
        {label}
      </p>
      <p className={`mt-1 text-sm font-semibold ${dark ? "text-zinc-100" : "text-slate-900"}`}>
        {value}
      </p>
    </div>
  );
}
