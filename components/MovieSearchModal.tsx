"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import type { Movie } from "@/types/Movie";

type MovieSearchModalProps = {
  open: boolean;
  onClose: () => void;
};

function normalizeText(value: string) {
  return value.trim().toLowerCase();
}

function filterMovies(movies: Movie[], query: string) {
  const term = normalizeText(query);
  if (!term) return [];
  return movies.filter((movie) => {
    const name = normalizeText(movie?.name || "");
    const language = normalizeText(movie?.language || "");
    const genres = Array.isArray(movie?.genre)
      ? movie.genre.map((item) => normalizeText(item || ""))
      : [];
    return (
      name.includes(term) ||
      language.includes(term) ||
      genres.some((genre) => genre.includes(term))
    );
  });
}

export default function MovieSearchModal({ open, onClose }: MovieSearchModalProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const allMoviesRef = useRef<Movie[]>([]);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const showEmptyState = useMemo(
    () => !loading && !error && debouncedQuery && results.length === 0,
    [debouncedQuery, error, loading, results.length]
  );

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 350);
    return () => window.clearTimeout(timer);
  }, [open, query]);

  useEffect(() => {
    if (!open) return;
    if (!debouncedQuery) {
      setResults([]);
      setError("");
      setLoading(false);
      return;
    }

    let isActive = true;
    const fetchMovies = async () => {
      setLoading(true);
      setError("");
      try {
        let movies = allMoviesRef.current;
        if (!movies.length) {
          const payload = await apiFetch("/movies", { method: "GET", notifyOnError: false });
          movies = Array.isArray(payload) ? payload : payload?.movies ?? [];
          allMoviesRef.current = movies;
        }
        if (!isActive) return;
        setResults(filterMovies(movies, debouncedQuery));
      } catch (err) {
        if (!isActive) return;
        setResults([]);
        setError(err instanceof Error ? err.message : "Failed to fetch movies");
      } finally {
        if (isActive) setLoading(false);
      }
    };

    fetchMovies();

    return () => {
      isActive = false;
    };
  }, [debouncedQuery, open]);

  useEffect(() => {
    if (!open) return;
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setDebouncedQuery("");
      setResults([]);
      setError("");
      setLoading(false);
      return;
    }
    requestAnimationFrame(() => inputRef.current?.focus());
  }, [open]);

  const handleSelect = (movieId: string) => {
    onClose();
    router.push(`/movies/${movieId}`);
  };

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6">
          <motion.button
            type="button"
            aria-label="Close movie search"
            className="absolute inset-0 cursor-pointer bg-black/45 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={(event) => event.stopPropagation()}
            className="relative z-10 flex h-[min(92dvh,760px)] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_32px_90px_rgba(15,23,42,0.35)] sm:rounded-3xl sm:border-slate-200/70"
          >
            <div className="flex items-center justify-between border-b border-slate-200/70 px-4 py-3 sm:px-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Search
                </p>
                <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">Find your movie</h2>
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={onClose}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="border-b border-slate-200/70 px-4 py-3 sm:px-6">
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <Search className="h-4 w-4 text-slate-400" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search movies by name, genre, or language"
                  className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                />
              </div>
              <p className="mt-2 text-xs text-slate-400">Press Esc to close</p>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-6 pt-4 sm:px-6">
              {loading ? (
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-500" />
                  Searching movies...
                </div>
              ) : null}

              {error ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
                  {error}
                </div>
              ) : null}

              {!loading && !error && !debouncedQuery ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
                  Start typing to search movies.
                </div>
              ) : null}

              {showEmptyState ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
                  No movies match your search.
                </div>
              ) : null}

              <div className="mt-4 grid gap-3">
                {results.map((movie) => (
                  <button
                    key={movie._id}
                    type="button"
                    onClick={() => handleSelect(movie._id)}
                    className="group flex w-full items-center gap-4 rounded-2xl border border-slate-200 bg-white p-3 text-left transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_20px_40px_-24px_rgba(15,23,42,0.35)]"
                  >
                    <div className="relative h-16 w-12 overflow-hidden rounded-xl bg-slate-100">
                      <Image
                        src={movie.imageUrl || "/dummy.webp"}
                        alt={movie.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-900">{movie.name}</p>
                      <p className="mt-1 truncate text-xs text-slate-500">
                        {Array.isArray(movie.genre) && movie.genre.length > 0
                          ? movie.genre.slice(0, 2).join(" / ")
                          : "Genre"}
                        {" · "}
                        {movie.language || "Language"}
                      </p>
                    </div>
                    <div className="text-right text-xs text-slate-500">
                      <p className="font-semibold text-slate-700">⭐ {movie.rating ?? "N/A"}</p>
                      <p>{movie.runtimeMinutes ? `${movie.runtimeMinutes} mins` : "Runtime"}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
