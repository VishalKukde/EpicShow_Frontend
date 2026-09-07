"use client";

import Link from "next/link";
import { ArrowRight, Clock3, Heart, RefreshCcw, Star } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";
import { apiFetch } from "@/lib/api";
import { useEffect, useState } from "react";
import type { Movie } from "@/types/Movie";
import MovieCard from "@/app/components/MovieCard";

export default function ProfileFavoritePage() {
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
    <div className="space-y-5 px-3 py-2 pb-6 select-none sm:px-4 lg:px-0">
      {/* Admin-Style Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-b pb-4 border-slate-200 dark:border-zinc-800">
        <div>
          <h1 className={`text-xl sm:text-2xl font-black tracking-tight ${dark ? "text-zinc-100" : "text-slate-900"}`}>
            Your Favorites
          </h1>
          <p className={`text-xs font-medium mt-0.5 ${dark ? "text-zinc-400" : "text-slate-500"}`}>
            Saved movies and shows from your personal wishlist.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${dark ? "border border-zinc-700/60 bg-[#18181b] text-zinc-300" : "bg-slate-100 text-slate-700"
              }`}
          >
            {loading ? "Loading..." : `${wishlist.length} saved ${wishlist.length === 1 ? "movie" : "movies"}`}
          </span>
          <button
            type="button"
            onClick={() => void fetchWishlist()}
            disabled={loading}
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition cursor-pointer ${dark
              ? "border-zinc-700/70 bg-[#18181b] text-zinc-200 hover:bg-zinc-800 hover:text-white"
              : "border-slate-200 bg-white text-slate-800 hover:bg-slate-50 shadow-sm"
              }`}
          >
            <RefreshCcw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {error ? (
        <section
          className={`rounded-2xl border px-4 py-4 text-sm ${dark
            ? "border-red-700 bg-red-500/10 text-red-200"
            : "border-red-200 bg-red-50 text-red-700"
            }`}
        >
          {error}
        </section>
      ) : null}

      <section
        className={`rounded-2xl border p-4 sm:p-5 shadow-xs ${dark ? "border-zinc-800 bg-[#18181b]" : "border-slate-200 bg-white"
          }`}
      >
        {loading ? (
          <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <div
                  className={`h-44 sm:h-48 md:h-52 animate-pulse rounded-2xl ${dark ? "bg-zinc-800" : "bg-slate-200"
                    }`}
                />
                <div
                  className={`h-3.5 w-3/4 animate-pulse rounded-full ${dark ? "bg-zinc-800" : "bg-slate-200"
                    }`}
                />
                <div
                  className={`h-3 w-1/2 animate-pulse rounded-full ${dark ? "bg-zinc-800" : "bg-slate-200"
                    }`}
                />
              </div>
            ))}
          </div>
        ) : wishlist.length > 0 ? (
          <>
            <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between border-b pb-3 border-slate-100 dark:border-zinc-800/80">
              <div>
                <p className={`text-[10px] font-bold uppercase tracking-wider ${dark ? "text-zinc-400" : "text-slate-500"}`}>
                  Saved Titles
                </p>
                <h2 className={`mt-0.5 text-base font-bold ${dark ? "text-zinc-100" : "text-slate-900"}`}>
                  Bookmarked Movies
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {wishlist.map((movie) => (
                <Link key={movie._id} href={`/movies/${movie._id}`} className="group block">
                  <MovieCard
                    title={movie.name}
                    imageUrl={movie.imageUrl}
                    releaseDate={movie.releaseDate}
                    showTitle={false}
                    showReleaseDate
                    heightClass="h-44 sm:h-48 md:h-52"
                  />

                  <div className="mt-2 space-y-1">
                    <p
                      className={`line-clamp-1 text-xs font-bold transition ${dark
                        ? "text-zinc-100 group-hover:text-white"
                        : "text-slate-900 group-hover:text-slate-700"
                        }`}
                    >
                      {movie.name}
                    </p>

                    <div
                      className={`flex flex-wrap items-center gap-1.5 text-[11px] font-semibold ${dark ? "text-zinc-400" : "text-slate-500"
                        }`}
                    >
                      {movie.runtimeMinutes ? (
                        <span className="inline-flex items-center gap-1">
                          <Clock3 className="h-3 w-3" />
                          {movie.runtimeMinutes}m
                        </span>
                      ) : null}

                      {movie.language ? (
                        <span
                          className={`rounded-md px-1.5 py-0.5 text-[10px] ${dark ? "bg-zinc-800 text-zinc-300" : "bg-slate-100 text-slate-600"
                            }`}
                        >
                          {movie.language}
                        </span>
                      ) : null}

                      {typeof movie.rating === "number" ? (
                        <span className="inline-flex items-center gap-0.5 font-bold text-amber-500">
                          <Star className="h-3 w-3 fill-current" />
                          {movie.rating}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        ) : (
          <div className="py-8 text-center">
            <div
              className={`mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl ${dark ? "bg-rose-500/10 text-rose-300" : "bg-rose-100 text-rose-700"
                }`}
            >
              <Heart className="h-6 w-6" />
            </div>
            <h2 className={`mt-4 text-xl font-semibold ${dark ? "text-zinc-100" : "text-slate-900"}`}>
              No favorites yet
            </h2>
            <p className={`mt-2 text-sm ${dark ? "text-zinc-400" : "text-slate-600"}`}>
              Add movies to your wishlist and they will appear here inside your profile.
            </p>
          </div>
        )}

        <Link
          href="/movies"
          className={`mt-6 inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition ${dark
            ? "border border-zinc-700/70 bg-[#18181b] text-zinc-100 hover:bg-zinc-800"
            : "bg-gray-900 text-white hover:bg-black"
            }`}
        >
          Explore Movies
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  );
}
