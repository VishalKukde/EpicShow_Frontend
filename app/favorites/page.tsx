"use client";

import Link from "next/link";
import { ArrowRight, Clock3, Heart, RefreshCcw, Star } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";
import { apiFetch } from "@/lib/api";
import { useState, useEffect } from "react";
import type { Movie } from "@/types/Movie";
import MovieCard from "@/app/components/MovieCard";

export default function FavoritesPage() {
  const [wishlist, setWishlist] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mode = useThemeStore((s) => s.mode);
  const dark = mode === "dark";

  useEffect(() => {
    void fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiFetch("/getwishlist", {
        method: "GET",
        notifyOnError: false,
      });

      setWishlist(Array.isArray(res?.data) ? res.data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load wishlist");
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto min-h-[calc(100vh-5rem)] w-full max-w-7xl px-4 pb-24 pt-24 sm:px-6">
      <section
        className={`rounded-3xl border p-6 shadow-lg sm:p-8 ${
          dark
            ? "border-zinc-700 bg-[linear-gradient(180deg,rgba(39,39,42,0.82),rgba(24,24,27,0.94))]"
            : "border-gray-200 bg-white"
        }`}
      >
        <p
          className={`text-xs font-semibold uppercase tracking-[0.18em] ${
            dark ? "text-zinc-400" : "text-gray-500"
          }`}
        >
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

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className={`text-sm ${dark ? "text-zinc-300" : "text-gray-600"}`}>
            Your wishlist is loaded from the backend cache and refreshed from Redis-backed data.
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                dark ? "bg-zinc-800 text-zinc-200" : "bg-gray-100 text-gray-700"
              }`}
            >
              {loading ? "Loading..." : `${wishlist.length} saved ${wishlist.length === 1 ? "movie" : "movies"}`}
            </span>
            <button
              type="button"
              onClick={() => void fetchWishlist()}
              className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition ${
                dark
                  ? "border border-zinc-700 bg-zinc-900 text-zinc-100 hover:bg-zinc-800"
                  : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              <RefreshCcw className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>

        {error ? (
          <div
            className={`mt-6 rounded-2xl border px-4 py-4 text-sm ${
              dark
                ? "border-red-700 bg-red-500/10 text-red-200"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="space-y-3">
                <div
                  className={`h-[320px] animate-pulse rounded-2xl ${
                    dark ? "bg-zinc-800" : "bg-gray-200"
                  }`}
                />
                <div
                  className={`h-4 w-3/4 animate-pulse rounded-full ${
                    dark ? "bg-zinc-800" : "bg-gray-200"
                  }`}
                />
                <div
                  className={`h-3 w-1/2 animate-pulse rounded-full ${
                    dark ? "bg-zinc-800" : "bg-gray-200"
                  }`}
                />
              </div>
            ))}
          </div>
        ) : wishlist.length > 0 ? (
          <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {wishlist.map((movie) => (
              <Link key={movie._id} href={`/movies/${movie._id}`} className="group block">
                <MovieCard
                  title={movie.name}
                  imageUrl={movie.imageUrl}
                  releaseDate={movie.releaseDate}
                  showReleaseDate
                />

                <div className="mt-3 space-y-2">
                  <p
                    className={`line-clamp-2 text-sm font-semibold transition ${
                      dark
                        ? "text-zinc-100 group-hover:text-white"
                        : "text-slate-900 group-hover:text-slate-700"
                    }`}
                  >
                    {movie.name}
                  </p>

                  <div
                    className={`flex flex-wrap items-center gap-2 text-xs ${
                      dark ? "text-zinc-400" : "text-slate-500"
                    }`}
                  >
                    {movie.runtimeMinutes ? (
                      <span className="inline-flex items-center gap-1">
                        <Clock3 className="h-3.5 w-3.5" />
                        {movie.runtimeMinutes} mins
                      </span>
                    ) : null}

                    {movie.language ? (
                      <span
                        className={`rounded-full px-2 py-1 ${
                          dark ? "bg-zinc-800 text-zinc-300" : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {movie.language}
                      </span>
                    ) : null}

                    {typeof movie.rating === "number" ? (
                      <span className="inline-flex items-center gap-1 font-medium text-amber-500">
                        <Star className="h-3.5 w-3.5 fill-current" />
                        {movie.rating}
                      </span>
                    ) : null}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div
            className={`mt-8 rounded-3xl border p-8 text-center ${
              dark
                ? "border-zinc-700 bg-zinc-900/70"
                : "border-gray-200 bg-gray-50/80"
            }`}
          >
            <div
              className={`mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl ${
                dark ? "bg-rose-500/10 text-rose-300" : "bg-rose-100 text-rose-700"
              }`}
            >
              <Heart className="h-6 w-6" />
            </div>
            <h2 className={`mt-4 text-xl font-semibold ${dark ? "text-zinc-100" : "text-slate-900"}`}>
              No favorites yet
            </h2>
            <p className={`mt-2 text-sm ${dark ? "text-zinc-400" : "text-slate-600"}`}>
              Add movies to your wishlist and they will appear here until they expire from cache.
            </p>
          </div>
        )}

        <Link
          href="/movies"
          className={`mt-6 inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition ${
            dark
              ? "bg-zinc-100 text-zinc-900 hover:bg-white"
              : "bg-gray-900 text-white hover:bg-black"
          }`}
        >
          Explore Movies
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      {!loading && wishlist.length > 0 ? (
        <section className="mt-6">
          <p className={`text-xs font-medium uppercase tracking-[0.18em] ${dark ? "text-zinc-500" : "text-slate-500"}`}>
            Synced from cache-backed wishlist
          </p>
          <p className={`mt-2 text-sm ${dark ? "text-zinc-400" : "text-slate-600"}`}>
            Wishlist entries are stored in Redis and automatically expire after their configured TTL.
          </p>
        </section>
      ) : null}
    </main>
  );
}
