"use client";

import { useThemeStore } from "@/store/themeStore";

export default function RefundHero() {
  const mode = useThemeStore((s) => s.mode);
  const dark = mode === "dark";

  return (
    <section
      className={`rounded-3xl border p-6 text-white shadow-lg sm:p-8 ${
        dark
          ? "border-zinc-700 bg-zinc-900"
          : "border-gray-200 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900"
      }`}
    >
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-indigo-200">
        Refunds & Credits
      </p>
      <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">Manage your refunds and credits</h1>
      <p className={`mt-2 max-w-xl text-sm ${dark ? "text-zinc-400" : "text-gray-400"}`}>
        View and manage your refund requests and available credits.
      </p>
    </section>
  );
}
