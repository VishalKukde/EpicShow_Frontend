"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";

export default function TrendingFooter() {
  const mode = useThemeStore((s) => s.mode);
  const dark = mode === "dark";

  return (
    <footer
      className={`border-t ${
        dark ? "border-slate-800 text-slate-300" : "border-slate-200 text-slate-600"
      }`}
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${dark ? "bg-indigo-400" : "bg-indigo-600"}`} />
              <p className={`text-sm font-semibold ${dark ? "text-white" : "text-slate-900"}`}>
                EpicShow
              </p>
            </div>
            <p className="max-w-sm text-xs sm:text-sm">
              Premium, minimalist cinema booking with fast checkout and smooth seat locking.
            </p>
          </div>

          <nav className="flex flex-wrap items-center gap-4 text-xs font-medium sm:text-sm">
            <Link
              href="/"
              className={`transition ${
                dark ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Home
            </Link>
            <Link
              href="/movies"
              className={`transition ${
                dark ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Movies
            </Link>
            <Link
              href="/explore"
              className={`transition ${
                dark ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Explore
            </Link>
            <Link
              href="/profile"
              className={`transition ${
                dark ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Profile
            </Link>
          </nav>
        </div>

        <div
          className={`mt-8 flex flex-col gap-3 border-t pt-4 text-[11px] sm:flex-row sm:items-center sm:justify-between ${
            dark ? "border-slate-800" : "border-slate-200"
          }`}
        >
          <p>© 2026 EpicShow. All rights reserved.</p>
          <div className="inline-flex items-center gap-2">
            <span>Built with</span>
            <Heart
              className={`h-3.5 w-3.5 ${dark ? "text-rose-400" : "text-rose-500"}`}
              fill="currentColor"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
