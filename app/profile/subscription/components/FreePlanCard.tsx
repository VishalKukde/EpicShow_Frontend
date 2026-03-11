"use client";

import { BadgeCheck, ShieldCheck } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";

type FreePlanCardProps = {
  features: string[];
};

export default function FreePlanCard({ features }: FreePlanCardProps) {
  const mode = useThemeStore((s) => s.mode);
  const dark = mode === "dark";

  return (
    <article
      className={`rounded-2xl border p-5 shadow-sm ${
        dark
          ? "border-zinc-700/45 bg-zinc-900 shadow-[0_12px_30px_rgba(0,0,0,0.3)]"
          : "border-gray-200 bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className={`text-xs font-medium uppercase tracking-wide ${dark ? "text-zinc-400" : "text-gray-500"}`}>
            Current Plan
          </p>
          <h2 className={`mt-1 text-xl font-semibold ${dark ? "text-zinc-100" : "text-gray-900"}`}>Free</h2>
        </div>
        <ShieldCheck className={`h-5 w-5 ${dark ? "text-zinc-300" : "text-gray-500"}`} />
      </div>

      <p className={`mt-4 text-3xl font-semibold ${dark ? "text-zinc-100" : "text-gray-900"}`}>₹0</p>
      <p className={`text-sm ${dark ? "text-zinc-400" : "text-gray-500"}`}>No recurring cost</p>

      <ul className="mt-4 space-y-2">
        {features.map((feature) => (
          <li key={feature} className={`flex items-start gap-2 text-sm ${dark ? "text-zinc-200" : "text-gray-700"}`}>
            <BadgeCheck className={`mt-0.5 h-4 w-4 ${dark ? "text-zinc-400" : "text-gray-500"}`} />
            {feature}
          </li>
        ))}
      </ul>

      <button
        className={`mt-5 w-full cursor-pointer rounded-xl border px-4 py-2 text-sm font-medium transition ${
          dark
            ? "border-zinc-600 bg-zinc-800 text-zinc-100 hover:bg-zinc-700"
            : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
        }`}
      >
        Continue Free
      </button>
    </article>
  );
}
