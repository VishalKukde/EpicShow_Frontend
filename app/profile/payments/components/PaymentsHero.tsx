"use client";

import { Download } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";

type PaymentsHeroProps = {
  onExportClick: () => void;
};

export default function PaymentsHero({ onExportClick }: PaymentsHeroProps) {
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
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-indigo-200">
            Payment Center
          </p>
          <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">
            Manage your payments
          </h1>
          <p className="mt-2 max-w-xl text-sm text-indigo-100/90">
            Track transactions, download receipts, and manage methods with a
            secure and premium payment experience.
          </p>
        </div>

        <button
          type="button"
          onClick={onExportClick}
          className={`inline-flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition ${
            dark
              ? "border-zinc-600 bg-zinc-900/85 text-zinc-100 hover:bg-zinc-800"
              : "border-gray-300 bg-white text-gray-900 hover:bg-gray-100"
          }`}
        >
          <Download className="h-4 w-4" />
          Export Statement
        </button>
      </div>
    </section>
  );
}
