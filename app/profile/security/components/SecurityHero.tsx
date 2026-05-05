"use client";

import { useThemeStore } from "@/store/themeStore";

export default function SecurityHero() {
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
        Security Center
      </p>
      <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">Protect your account</h1>
      <p className={`mt-2 max-w-xl text-sm ${dark ? "text-zinc-400" : "text-gray-500"}`}>
        Control password, verification, and device sessions from one secure place.
      </p>
    </section>
  );
}
