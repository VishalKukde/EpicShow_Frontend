"use client";

import type { ReactNode } from "react";
import { ShieldCheck } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";
import CheckoutNavbar from "./CheckoutNavbar";

export type SummaryItem = {
  label: string;
  value: ReactNode;
  valueClassName?: string;
};

type PaymentLayoutProps = {
  backUrl: string;
  title?: string;
  badgeText?: string;
  payableLabel?: string;
  payableAmount: number;
  payableNotes?: ReactNode;
  leftContent: ReactNode;
  summaryTitle?: string;
  summaryItems: SummaryItem[];
  totalLabel: string;
  totalValue: ReactNode;
  secureNoteTitle: string;
  secureNoteText: string;
  footerNote?: ReactNode;
  secureNoteIcon?: ReactNode;
};

export default function PaymentLayout({
  backUrl,
  title,
  badgeText,
  payableLabel = "Total Payable",
  payableAmount,
  payableNotes,
  leftContent,
  summaryTitle = "Order Summary",
  summaryItems,
  totalLabel,
  totalValue,
  secureNoteTitle,
  secureNoteText,
  footerNote,
  secureNoteIcon,
}: PaymentLayoutProps) {
  const mode = useThemeStore((s) => s.mode);
  const dark = mode === "dark";

  return (
    <div className={`min-h-screen px-4 pb-10 pt-28 ${dark ? "bg-zinc-950" : "bg-gradient-to-b from-slate-50 to-white"}`}>
      <CheckoutNavbar backUrl={backUrl} title={title} badgeText={badgeText} />

      <div className="mx-auto grid w-full max-w-4xl gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <section className={`rounded-3xl border p-5 shadow-[0_12px_40px_rgba(15,23,42,0.08)] sm:p-6 ${dark ? "border-zinc-700 bg-zinc-900" : "border-slate-200 bg-white"}`}>
          <div className={`rounded-2xl border p-4 ${dark ? "border-zinc-700 bg-zinc-800" : "border-indigo-100 bg-gradient-to-r from-indigo-50 to-cyan-50"}`}>
            <p className={`text-xs font-semibold uppercase tracking-[0.2em] ${dark ? "text-indigo-300" : "text-indigo-700"}`}>
              {payableLabel}
            </p>
            <p className={`mt-1 text-3xl font-bold ${dark ? "text-white" : "text-slate-900"}`}>
              ₹{payableAmount.toFixed(2)}
            </p>
            {payableNotes}
          </div>

          <div className="mt-5">
            {leftContent}
          </div>
        </section>

        <aside className={`rounded-3xl border p-5 shadow-[0_12px_40px_rgba(15,23,42,0.08)] sm:p-6 ${dark ? "border-zinc-700 bg-zinc-900" : "border-slate-200 bg-white"}`}>
          <h3 className={`text-base font-semibold ${dark ? "text-zinc-100" : "text-slate-900"}`}>{summaryTitle}</h3>
          <div className="mt-4 space-y-3 text-sm">
            {summaryItems.map((item) => (
              <div
                key={item.label}
                className={`flex items-center justify-between ${dark ? "text-zinc-300" : "text-slate-600"}`}
              >
                <span>{item.label}</span>
                <span
                  className={`max-w-[65%] truncate text-right font-medium ${item.valueClassName || (dark ? "text-zinc-100" : "text-slate-900")}`}
                >
                  {item.value}
                </span>
              </div>
            ))}
          </div>

          <div className={`my-4 h-px ${dark ? "bg-zinc-700" : "bg-slate-200"}`} />

          <div className={`flex items-center justify-between text-base font-semibold ${dark ? "text-zinc-100" : "text-slate-900"}`}>
            <span>{totalLabel}</span>
            <span>{totalValue}</span>
          </div>

          <div className={`mt-4 rounded-2xl border px-3 py-2.5 text-xs ${dark ? "border-zinc-700 bg-zinc-800 text-zinc-300" : "border-slate-200 bg-slate-50 text-slate-600"}`}>
            <div className={`flex items-center gap-2 font-medium ${dark ? "text-zinc-200" : "text-slate-700"}`}>
              {secureNoteIcon ?? <ShieldCheck className="h-4 w-4 text-emerald-600" />}
              {secureNoteTitle}
            </div>
            <p className="mt-1">{secureNoteText}</p>
          </div>

          {footerNote}
        </aside>
      </div>
    </div>
  );
}
