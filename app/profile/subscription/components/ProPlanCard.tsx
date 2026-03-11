"use client";

import { BadgeCheck, Crown, Rocket, Sparkles } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";

type ProPlanCardProps = {
  amount: number;
  label: string;
  features: string[];
};

export default function ProPlanCard({ amount, label, features }: ProPlanCardProps) {
  const mode = useThemeStore((s) => s.mode);
  const dark = mode === "dark";

  return (
    <article
      className={`rounded-2xl border p-5 shadow-sm ${
        dark
          ? "border-indigo-500/30 bg-zinc-900 shadow-[0_12px_30px_rgba(0,0,0,0.3)]"
          : "border-indigo-200 bg-indigo-50"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className={`text-xs font-medium uppercase tracking-wide ${dark ? "text-indigo-300" : "text-indigo-600"}`}>
            Recommended
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

      <ul className="mt-4 space-y-2">
        {features.map((feature) => (
          <li key={feature} className={`flex items-start gap-2 text-sm ${dark ? "text-zinc-200" : "text-gray-800"}`}>
            <BadgeCheck className={`mt-0.5 h-4 w-4 ${dark ? "text-indigo-300" : "text-indigo-600"}`} />
            {feature}
          </li>
        ))}
      </ul>

      <button
        className={`mt-5 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-white transition ${
          dark ? "bg-indigo-500 hover:bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700"
        }`}
      >
        <Rocket className="h-4 w-4" />
        Upgrade to Pro
      </button>
    </article>
  );
}
