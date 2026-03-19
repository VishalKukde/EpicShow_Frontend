"use client";

import type { ReactNode } from "react";
import { CreditCard, ShieldCheck, Ticket } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";
import CheckoutNavbar from "./CheckoutNavbar";

export type SummaryItem = {
  label: string;
  value: ReactNode;
  valueClassName?: string;
};

export type PricingItem = {
  label: string;
  value: ReactNode;
  tone?: "default" | "success";
};

type ReviewLayoutProps = {
  backUrl: string;
  navTitle?: string;
  title: string;
  subtitle: string;
  badgeText?: string;
  payableAmount: number;
  summaryTitle?: string;
  summaryItems: SummaryItem[];
  pricingItems: PricingItem[];
  totalLabel: string;
  totalValue: ReactNode;
  secureNoteTitle: string;
  secureNoteText: string;
  actionLabel: string;
  actionLoadingLabel?: string;
  actionDisabled?: boolean;
  actionLoading?: boolean;
  onAction: () => void;
  error?: string | null;
  leftContent: ReactNode;
  summaryIcon?: ReactNode;
  secureNoteIcon?: ReactNode;
};

export default function ReviewLayout({
  backUrl,
  navTitle,
  title,
  subtitle,
  badgeText,
  payableAmount,
  summaryTitle = "Booking Summary",
  summaryItems,
  pricingItems,
  totalLabel,
  totalValue,
  secureNoteTitle,
  secureNoteText,
  actionLabel,
  actionLoadingLabel,
  actionDisabled = false,
  actionLoading = false,
  onAction,
  error,
  leftContent,
  summaryIcon,
  secureNoteIcon,
}: ReviewLayoutProps) {
  const mode = useThemeStore((s) => s.mode);
  const dark = mode === "dark";

  const actionText = actionLoading
    ? actionLoadingLabel || actionLabel
    : actionLabel;

  return (
    <div className={`min-h-screen px-4 pb-12 pt-26 ${dark ? "bg-zinc-950" : "bg-gradient-to-b from-slate-50 to-white"}`}>
      <CheckoutNavbar
        backUrl={backUrl}
        title={navTitle || title}
        badgeText={badgeText}
      />
      <div className="mx-auto grid w-full max-w-5xl gap-4 lg:grid-cols-[1.25fr_0.75fr] lg:gap-5">
        <section className="space-y-4 lg:space-y-5">
          <div className={`rounded-3xl border p-5 shadow-sm sm:p-6 ${dark ? "border-zinc-700 bg-zinc-900" : "border-slate-200 bg-white"}`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className={`text-2xl font-semibold sm:text-3xl ${dark ? "text-zinc-100" : "text-slate-900"}`}>
                  {title}
                </h1>
                <p className={`mt-1 text-sm ${dark ? "text-zinc-400" : "text-slate-500"}`}>
                  {subtitle}
                </p>
              </div>
              <div className={`rounded-2xl border px-3 py-2 text-right ${dark ? "border-zinc-700 bg-zinc-800" : "border-indigo-200 bg-indigo-50"}`}>
                <p className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${dark ? "text-indigo-300" : "text-indigo-700"}`}>
                  Payable
                </p>
                <p className={`mt-0.5 text-xl text-center font-bold ${dark ? "text-white" : "text-slate-900"}`}>
                  ₹{payableAmount}
                </p>
              </div>
            </div>
          </div>

          {leftContent}

          {error && (
            <div className={`rounded-2xl border px-4 py-3 text-sm ${dark ? "border-red-700 bg-red-500/15 text-red-300" : "border-red-300 bg-red-100/70 text-red-700"}`}>
              {error}
            </div>
          )}
        </section>

        <aside className={`h-fit rounded-3xl border p-5 shadow-sm lg:sticky lg:top-26 sm:p-6 ${dark ? "border-zinc-700 bg-zinc-900" : "border-slate-200 bg-white"}`}>
          <div className="flex items-center gap-2">
            {summaryIcon ?? <Ticket className="h-4 w-4 text-indigo-600" />}
            <h3 className={`text-base font-semibold ${dark ? "text-zinc-100" : "text-slate-900"}`}>
              {summaryTitle}
            </h3>
          </div>

          <div className="mt-4 space-y-3 text-sm">
            {summaryItems.map((item) => (
              <div
                key={item.label}
                className={`flex items-center justify-between ${dark ? "text-zinc-300" : "text-slate-600"}`}
              >
                <span>{item.label}</span>
                <span
                  className={`max-w-[62%] truncate text-right font-medium ${item.valueClassName || (dark ? "text-zinc-100" : "text-slate-900")}`}
                >
                  {item.value}
                </span>
              </div>
            ))}
          </div>

          <div className={`my-4 h-px ${dark ? "bg-zinc-700" : "bg-slate-200"}`} />

          <div className="space-y-2 text-sm">
            {pricingItems.map((item) => {
              const toneClass =
                item.tone === "success"
                  ? dark
                    ? "text-emerald-300"
                    : "text-emerald-700"
                  : dark
                    ? "text-zinc-300"
                    : "text-slate-600";
              return (
                <div key={item.label} className={`flex items-center justify-between ${toneClass}`}>
                  <span>{item.label}</span>
                  <span>{item.value}</span>
                </div>
              );
            })}
            <div className={`flex items-center justify-between text-base font-semibold ${dark ? "text-zinc-100" : "text-slate-900"}`}>
              <span>{totalLabel}</span>
              <span>{totalValue}</span>
            </div>
          </div>

          <div className={`mt-4 rounded-2xl border px-3 py-2.5 text-xs ${dark ? "border-zinc-700 bg-zinc-800 text-zinc-300" : "border-slate-200 bg-slate-50 text-slate-600"}`}>
            <div className={`flex items-center gap-2 font-medium ${dark ? "text-zinc-200" : "text-slate-700"}`}>
              {secureNoteIcon ?? <ShieldCheck className="h-4 w-4 text-emerald-600" />}
              {secureNoteTitle}
            </div>
            <p className="mt-1">{secureNoteText}</p>
          </div>

          <button
            className={`mt-5 w-full cursor-pointer rounded-2xl py-4 font-medium text-white shadow-lg transition disabled:cursor-not-allowed disabled:opacity-60 ${dark ? "bg-indigo-600 hover:bg-indigo-500" : "bg-gray-900 hover:bg-gray-800"}`}
            onClick={onAction}
            disabled={actionDisabled || actionLoading}
          >
            <span className="inline-flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              {actionText}
            </span>
          </button>
        </aside>
      </div>
    </div>
  );
}
