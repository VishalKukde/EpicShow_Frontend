"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { apiFetch } from "@/lib/api";
import type { Movie } from "@/types/Movie";

type SearchOrigin = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type MovieSearchModalProps = {
  open: boolean;
  onClose: () => void;
  origin?: SearchOrigin | null;
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

const MAX_PANEL_WIDTH = 580;
const MAX_PANEL_HEIGHT = 520;

function getPanelBounds(origin?: SearchOrigin | null) {
  const panelWidth = Math.min(window.innerWidth - 32, MAX_PANEL_WIDTH);
  const panelHeight = Math.min(window.innerHeight - 48, MAX_PANEL_HEIGHT);
  const startX = origin?.x ?? window.innerWidth / 2 - 60;
  const startY = origin?.y ?? window.innerHeight / 2 - 24;
  const startW = origin?.width ?? 120;
  const startH = origin?.height ?? 42;
  const finalX = (window.innerWidth - panelWidth) / 2;
  const finalY = (window.innerHeight - panelHeight) / 2;

  return { panelWidth, panelHeight, startX, startY, startW, startH, finalX, finalY };
}

export default function MovieSearchModal({ open, onClose, origin }: MovieSearchModalProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
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
          const payload = await apiFetch("/movies", { method: "GET", notifyOnError: false, publicRequest: true });
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

    const panel = panelRef.current;
    if (!panel) {
      requestAnimationFrame(() => inputRef.current?.focus());
      return;
    }

    const { panelWidth, panelHeight, startX, startY, startW, startH, finalX, finalY } =
      getPanelBounds(origin);

    gsap.set(panel, {
      left: startX,
      top: startY,
      width: startW,
      height: startH,
      borderRadius: 16,
      opacity: 0,
      x: 0,
      y: 0,
      scale: 0.98,
      transformOrigin: "center center",
      willChange: "transform, left, top, width, height, opacity",
    });

    gsap.to(panel, {
      left: finalX,
      top: finalY,
      width: panelWidth,
      height: panelHeight,
      borderRadius: 24,
      opacity: 1,
      scale: 1,
      duration: 0.28,
      ease: "power2.out",
      onStart: () => {
        requestAnimationFrame(() => inputRef.current?.focus());
      },
    });
  }, [open, origin]);

  const closePanel = () => {
    const panel = panelRef.current;
    if (!panel) {
      onClose();
      return;
    }

    const { panelWidth, panelHeight, startX, startY, startW, startH, finalX, finalY } =
      getPanelBounds(origin);

    gsap.to(panel, {
      left: startX,
      top: startY,
      width: startW,
      height: startH,
      borderRadius: 16,
      opacity: 0,
      scale: 0.98,
      duration: 0.22,
      ease: "power2.in",
      onComplete: onClose,
      onReverseComplete: () => {
        gsap.set(panel, { left: finalX, top: finalY, width: panelWidth, height: panelHeight, scale: 1 });
      },
    });
  };

  const handleSelect = (movieId: string) => {
    closePanel();
    setTimeout(() => router.push(`/movies/${movieId}`), 80);
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
            onClick={closePanel}
          />

          <div
            ref={panelRef}
            onClick={(event) => event.stopPropagation()}
            className="pointer-events-auto relative z-10 flex flex-col overflow-hidden border border-slate-200 bg-white shadow-[0_32px_90px_rgba(15,23,42,0.35)] sm:rounded-3xl sm:border-slate-200/70"
            style={{
              position: "fixed",
              left: origin?.x ?? 0,
              top: origin?.y ?? 0,
              width: origin?.width ?? 120,
              height: origin?.height ?? 42,
              borderRadius: 18,
            }}
          >
            <div className="flex items-center justify-between border-b border-slate-200/70 px-4 py-3 sm:px-5">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Search
                </p>
                <h2 className="text-base font-semibold text-slate-900 sm:text-lg">Find your movie</h2>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <button
                  type="button"
                  aria-label="Close (Esc)"
                  onClick={closePanel}
                  className="cursor-pointer inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:text-slate-700"
                >
                  <X className="h-4 w-4" />
                </button>
                <span
                  onClick={closePanel}
                  className="cursor-pointer text-[10px] font-semibold tracking-wider text-slate-400 hover:text-slate-600 transition select-none"
                >
                  ESC
                </span>
              </div>
            </div>

            <div className="border-b border-slate-200/70 px-4 py-3 sm:px-5">
              <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5">
                <Search className="h-4 w-4 text-slate-400" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search movies by name, genre, or language"
                  className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-5 pt-3 sm:px-5">
              {loading ? (
                <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-500" />
                  Searching movies...
                </div>
              ) : null}

              {error ? (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
                  {error}
                </div>
              ) : null}

              {!loading && !error && !debouncedQuery ? (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
                  Start typing to search movies.
                </div>
              ) : null}

              {showEmptyState ? (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
                  No movies match your search.
                </div>
              ) : null}

              <div className="mt-3 grid gap-2.5">
                {results.map((movie) => (
                  <button
                    key={movie._id}
                    type="button"
                    onClick={() => handleSelect(movie._id)}
                    className="cursor-pointer group flex w-full items-center gap-3.5 rounded-xl border border-slate-200 bg-white p-2.5 sm:p-3 text-left transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_16px_32px_-20px_rgba(15,23,42,0.35)]"
                  >
                    <div className="relative h-14 w-11 shrink-0 overflow-hidden rounded-lg bg-slate-100 sm:h-16 sm:w-12 sm:rounded-xl">
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
                      <p className="mt-0.5 truncate text-xs text-slate-500">
                        {Array.isArray(movie.genre) && movie.genre.length > 0
                          ? movie.genre.slice(0, 2).join(" / ")
                          : "Genre"}
                        {" · "}
                        {movie.language || "Language"}
                      </p>
                    </div>
                    <div className="text-right text-xs text-slate-500 shrink-0">
                      <p className="font-semibold text-slate-700">⭐ {movie.rating ?? "N/A"}</p>
                      <p>{movie.runtimeMinutes ? `${movie.runtimeMinutes} mins` : "Runtime"}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
