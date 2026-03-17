"use client";

import { useState } from "react";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import { useThemeStore } from "@/store/themeStore";
import { apiFetch } from "@/lib/api";

const LANGUAGE_OPTIONS = [
  { label: "Hollywood (EN)", value: "en" },
  { label: "Bollywood (HI)", value: "hi" },
  { label: "All Languages", value: "all" },
];

type TmdbMovie = {
  name: string;
  description: string;
  genre: string[];
  imageUrl: string | null;
  language: string;
  runtimeMinutes: number | null;
  rating: number | null;
  tmdbId?: number;
  releaseDate?: string | null;
};

export default function TmdbDashboardPage() {
  const mode = useThemeStore((s) => s.mode);
  const dark = mode === "dark";
  const [language, setLanguage] = useState("en");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [totalResults, setTotalResults] = useState<number | null>(null);
  const [movies, setMovies] = useState<TmdbMovie[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [insertState, setInsertState] = useState<Record<string, "idle" | "saving" | "success" | "error">>({});
  const [insertError, setInsertError] = useState<Record<string, string>>({});

  const loadMovies = async () => {
    setStatus("loading");
    setError(null);
    try {
      const res = await fetch(`/api/tmdb/discover?lang=${language}&page=${page}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || "Failed to fetch TMDB movies");
      }
      setMovies(data.items || []);
      setTotalPages(data.totalPages ?? null);
      setTotalResults(data.totalResults ?? null);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Failed to fetch TMDB movies");
    }
  };

  const handleAddToSite = async (movie: TmdbMovie) => {
    const key = String(movie.tmdbId ?? movie.name);
    setInsertState((prev) => ({ ...prev, [key]: "saving" }));
    setInsertError((prev) => ({ ...prev, [key]: "" }));

    const runtimeValue =
      movie.runtimeMinutes === null || movie.runtimeMinutes === undefined
        ? null
        : Number(movie.runtimeMinutes);

    if (!runtimeValue || Number.isNaN(runtimeValue)) {
      setInsertState((prev) => ({ ...prev, [key]: "error" }));
      setInsertError((prev) => ({
        ...prev,
        [key]: "Runtime missing. Unable to insert this movie.",
      }));
      return;
    }

    try {
      await apiFetch("/movies", {
        method: "POST",
        body: JSON.stringify({
          name: movie.name,
          description: movie.description,
          genre: movie.genre,
          imageUrl: movie.imageUrl,
          language: movie.language,
          runtimeMinutes: runtimeValue,
          rating: movie.rating ?? undefined,
          releaseDate: movie.releaseDate ?? undefined,
        }),
      });
      setInsertState((prev) => ({ ...prev, [key]: "success" }));
    } catch (err) {
      setInsertState((prev) => ({ ...prev, [key]: "error" }));
      setInsertError((prev) => ({
        ...prev,
        [key]: err instanceof Error ? err.message : "Failed to add movie",
      }));
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
          <div
            className={`rounded-3xl border px-6 py-6 shadow-xl sm:px-8 ${
              dark
                ? "border-slate-800 bg-slate-950 text-slate-100"
                : "border-slate-200 bg-white text-slate-900"
            }`}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p
                  className={`text-xs font-semibold uppercase tracking-[0.24em] ${
                    dark ? "text-indigo-300" : "text-indigo-600"
                  }`}
                >
                  TMDB Explorer
                </p>
                <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">
                  Load Trending Movies
                </h1>
                <p className={`mt-2 text-sm ${dark ? "text-slate-400" : "text-slate-600"}`}>
                  Click load to fetch non-adult movies. Filter by Hollywood or Bollywood.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:items-end">
                <div className="flex flex-wrap gap-2">
                  {LANGUAGE_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setLanguage(option.value)}
                      className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                        language === option.value
                          ? dark
                            ? "border-indigo-400/70 bg-indigo-500/10 text-indigo-200"
                            : "border-indigo-500/40 bg-indigo-50 text-indigo-700"
                          : dark
                            ? "border-slate-800 text-slate-300 hover:border-slate-600"
                            : "border-slate-200 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <label className={`${dark ? "text-slate-300" : "text-slate-600"}`}>
                    Page
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={page}
                    onChange={(event) => setPage(Math.max(1, Number(event.target.value || 1)))}
                    className={`w-20 rounded-full border px-3 py-1 text-xs outline-none ${
                      dark
                        ? "border-slate-800 bg-slate-950 text-slate-200"
                        : "border-slate-200 bg-white text-slate-700"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                    className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                      dark
                        ? "border-slate-800 text-slate-300 hover:border-slate-600"
                        : "border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    Prev
                  </button>
                  <button
                    type="button"
                    onClick={() => setPage((prev) => prev + 1)}
                    className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                      dark
                        ? "border-slate-800 text-slate-300 hover:border-slate-600"
                        : "border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    Next
                  </button>
                </div>
                <button
                  type="button"
                  onClick={loadMovies}
                  className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                    dark
                      ? "bg-indigo-500 text-white hover:bg-indigo-400"
                      : "bg-slate-900 text-white hover:bg-slate-800"
                  }`}
                >
                  {status === "loading" ? "Loading..." : "Load Movies"}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div
              className={`rounded-2xl border px-4 py-3 text-sm ${
                dark
                  ? "border-rose-500/40 bg-rose-500/10 text-rose-200"
                  : "border-rose-200 bg-rose-50 text-rose-700"
              }`}
            >
              {error}
            </div>
          )}

          {(totalPages || totalResults) && (
            <div
              className={`rounded-2xl border px-4 py-3 text-xs ${
                dark
                  ? "border-slate-800 bg-slate-950 text-slate-400"
                  : "border-slate-200 bg-white text-slate-600"
              }`}
            >
              {totalResults ? `${totalResults} results` : "Results available"}
              {totalPages ? ` · Page ${page} of ${totalPages}` : ""} · Recent releases only
            </div>
          )}

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {movies.map((movie) => (
              <article
                key={`${movie.tmdbId}-${movie.name}`}
                className={`flex h-full flex-col overflow-hidden rounded-3xl border shadow-xl ${
                  dark
                    ? "border-slate-800 bg-slate-950 text-slate-100"
                    : "border-slate-200 bg-white text-slate-900"
                }`}
              >
                <div className="relative h-52 w-full overflow-hidden">
                  {movie.imageUrl ? (
                    <img
                      src={movie.imageUrl}
                      alt={movie.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div
                      className={`flex h-full w-full items-center justify-center text-sm ${
                        dark ? "bg-slate-900 text-slate-400" : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      No image
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-3 p-5">
                  <div className="flex items-center justify-between">
                    <p className={`text-xs font-semibold uppercase tracking-[0.2em] ${dark ? "text-indigo-300" : "text-indigo-600"}`}>
                      {movie.language}
                    </p>
                    <span className={`text-xs ${dark ? "text-slate-400" : "text-slate-500"}`}>
                      {movie.releaseDate || "TBA"}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold leading-tight">{movie.name}</h3>
                  <p className={`text-sm ${dark ? "text-slate-400" : "text-slate-600"}`}>
                    {movie.description}
                  </p>
                  <div className="mt-1 flex flex-wrap gap-2 text-xs">
                    {movie.genre?.length ? (
                      movie.genre.map((g) => (
                        <span
                          key={g}
                          className={`rounded-full border px-3 py-1 ${
                            dark
                              ? "border-slate-800 bg-slate-950 text-slate-300"
                              : "border-slate-200 bg-slate-50 text-slate-600"
                          }`}
                        >
                          {g}
                        </span>
                      ))
                    ) : (
                      <span className={`text-xs ${dark ? "text-slate-500" : "text-slate-400"}`}>
                        Genres unavailable
                      </span>
                    )}
                  </div>
                  <div className="mt-auto flex items-center justify-between text-xs">
                    <span className={`${dark ? "text-slate-400" : "text-slate-500"}`}>
                      Runtime: {movie.runtimeMinutes ? `${movie.runtimeMinutes} min` : "TBD"}
                    </span>
                    <span className={`${dark ? "text-slate-300" : "text-slate-600"}`}>
                      Rating: {movie.rating ? movie.rating.toFixed(1) : "N/A"}
                    </span>
                  </div>
                  <div className="mt-4 flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => handleAddToSite(movie)}
                      disabled={
                        insertState[String(movie.tmdbId ?? movie.name)] === "saving" ||
                        !movie.runtimeMinutes
                      }
                      className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                        insertState[String(movie.tmdbId ?? movie.name)] === "success"
                          ? dark
                            ? "bg-emerald-500/20 text-emerald-200"
                            : "bg-emerald-100 text-emerald-700"
                          : insertState[String(movie.tmdbId ?? movie.name)] === "saving"
                            ? dark
                              ? "bg-slate-800 text-slate-400"
                              : "bg-slate-200 text-slate-500"
                            : dark
                              ? "bg-indigo-500 text-white hover:bg-indigo-400"
                              : "bg-slate-900 text-white hover:bg-slate-800"
                      }`}
                    >
                      {insertState[String(movie.tmdbId ?? movie.name)] === "success"
                        ? "Added"
                        : insertState[String(movie.tmdbId ?? movie.name)] === "saving"
                          ? "Adding..."
                          : "Add to Website"}
                    </button>
                    {insertError[String(movie.tmdbId ?? movie.name)] && (
                      <p className={`text-xs ${dark ? "text-rose-300" : "text-rose-600"}`}>
                        {insertError[String(movie.tmdbId ?? movie.name)]}
                      </p>
                    )}
                    {!movie.runtimeMinutes && (
                      <p className={`text-xs ${dark ? "text-slate-500" : "text-slate-400"}`}>
                        Runtime unavailable from TMDB.
                      </p>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>

          {status === "success" && movies.length === 0 && (
            <p className={`text-center text-sm ${dark ? "text-slate-400" : "text-slate-500"}`}>
              No movies returned for this filter.
            </p>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
