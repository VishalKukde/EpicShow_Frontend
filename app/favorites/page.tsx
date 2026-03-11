"use client";

import Link from "next/link";
import { ArrowRight, Heart } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";

export default function FavoritesPage() {
  const mode = useThemeStore((s) => s.mode);
  const dark = mode === "dark";

  return (
    <main className="mx-auto min-h-[calc(100vh-5rem)] w-full max-w-4xl px-4 pb-24 pt-24 sm:px-6">
      <section
        className={`rounded-3xl border p-6 shadow-lg sm:p-8 ${
          dark
            ? "border-zinc-700 bg-[linear-gradient(180deg,rgba(39,39,42,0.82),rgba(24,24,27,0.94))]"
            : "border-gray-200 bg-white"
        }`}
      >
        <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${dark ? "text-zinc-400" : "text-gray-500"}`}>
          Favorites
        </p>
        <div className="mt-3 flex items-center gap-3">
          <div
            className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl ${
              dark ? "bg-rose-500/15 text-rose-300" : "bg-rose-100 text-rose-700"
            }`}
          >
            <Heart className="h-5 w-5" />
          </div>
          <h1 className={`text-2xl font-semibold ${dark ? "text-zinc-100" : "text-gray-900"}`}>
            Your Favorites
          </h1>
        </div>
        <p className={`mt-3 text-sm ${dark ? "text-zinc-300" : "text-gray-600"}`}>
          Favorite titles list is coming soon. Explore movies and bookmark flow will appear here.
        </p>

        <Link
          href="/movies"
          className={`mt-6 inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition ${
            dark ? "bg-zinc-100 text-zinc-900 hover:bg-white" : "bg-gray-900 text-white hover:bg-black"
          }`}
        >
          Explore Movies
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </main>
  );
}
