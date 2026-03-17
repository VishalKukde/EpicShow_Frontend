"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import type { Movie } from "@/types/Movie";

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

export default function ExplorePage() {
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
    const timer = window.setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 350);
    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => {
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
  }, [debouncedQuery]);

  useEffect(() => {
    requestAnimationFrame(() => inputRef.current?.focus());
  }, []);

  const handleSelect = (movieId: string) => {
    router.push(`/movies/${movieId}`);
  };

  return (
    <div
      className="relative min-h-[100dvh] overflow-hidden px-4 pb-28 pt-12 sm:px-6 sm:pb-14 sm:pt-14"
      style={{ background: "var(--hero-page-bg)" }}
    >
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full opacity-60 blur-[90px]"
          style={{ background: "var(--hero-orb-1)" }}
        />
        <div
          className="absolute bottom-16 right-6 h-64 w-64 rounded-full opacity-60 blur-[90px]"
          style={{ background: "var(--hero-orb-2)" }}
        />
      </div>

      <div className="relative mx-auto flex w-full max-w-5xl flex-col gap-6 sm:gap-8">
        <div className="flex flex-col gap-3 text-left sm:items-center sm:text-center">
          <span
            className="inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em]"
            style={{
              borderColor: "var(--hero-header-border)",
              background: "var(--hero-header-pill-bg)",
              color: "var(--hero-header-muted)",
            }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-indigo-400 to-sky-400" />
            Explore
          </span>
          <h1
            className="text-3xl font-semibold sm:text-4xl"
            style={{ color: "var(--text-primary)" }}
          >
            Find your next movie
          </h1>
          <p className="text-sm sm:text-base" style={{ color: "var(--text-secondary)" }}>
            Search by name, genre, or language. We’ll surface the best matches instantly.
          </p>
        </div>

        <div className="flex flex-col gap-5">
          <div
            className="flex items-center gap-3 rounded-2xl border px-4 py-3"
            style={{
              borderColor: "var(--border)",
              background: "var(--explore-input-bg)",
            }}
          >
            <Search className="h-4 w-4" style={{ color: "var(--text-muted)" }} />
            <input
              ref={inputRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search movies by name, genre, or language"
              className="explore-search-input w-full text-sm outline-none placeholder:opacity-70"
              style={{ color: "var(--text-primary)", background: "var(--explore-input-bg)" }}
            />
          </div>

          <div>
            {loading ? (
              <div
                className="flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm"
                style={{
                  borderColor: "var(--border)",
                  background: "var(--explore-input-bg)",
                  color: "var(--text-secondary)",
                }}
              >
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent opacity-60" />
                Searching movies...
              </div>
            ) : null}

            {error ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
                {error}
              </div>
            ) : null}

            {!loading && !error && !debouncedQuery ? (
              <div
                className="rounded-2xl border border-dashed px-4 py-6 text-center text-sm"
                style={{
                  borderColor: "var(--border)",
                  background: "var(--explore-input-bg)",
                  color: "var(--text-muted)",
                }}
              >
                Start typing to search movies.
              </div>
            ) : null}

            {showEmptyState ? (
              <div
                className="rounded-2xl border border-dashed px-4 py-6 text-center text-sm"
                style={{
                  borderColor: "var(--border)",
                  background: "var(--explore-input-bg)",
                  color: "var(--text-muted)",
                }}
              >
                No movies match your search.
              </div>
            ) : null}

            <div className="mt-4 grid gap-3">
              {results.map((movie) => (
                <button
                  key={movie._id}
                  type="button"
                  onClick={() => handleSelect(movie._id)}
                  className="group flex w-full items-center gap-4 rounded-2xl border p-3 text-left transition hover:-translate-y-0.5 hover:border-[color:var(--hero-header-btn-hover-border)]"
                  style={{
                    borderColor: "var(--border)",
                    background: "var(--explore-card-bg)",
                    boxShadow: "var(--explore-shadow)",
                  }}
                  onMouseOver={(event) => {
                    event.currentTarget.style.background = "var(--explore-card-hover)";
                  }}
                  onMouseOut={(event) => {
                    event.currentTarget.style.background = "var(--explore-card-bg)";
                  }}
                >
                  <div
                    className="relative h-16 w-12 overflow-hidden rounded-xl"
                    style={{ background: "var(--explore-input-bg)" }}
                  >
                    <Image
                      src={movie.imageUrl || "/dummy.webp"}
                      alt={movie.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                      {movie.name}
                    </p>
                    <p className="mt-1 truncate text-xs" style={{ color: "var(--text-secondary)" }}>
                      {Array.isArray(movie.genre) && movie.genre.length > 0
                        ? movie.genre.slice(0, 2).join(" / ")
                        : "Genre"}
                      {" · "}
                      {movie.language || "Language"}
                    </p>
                  </div>
                  <div className="text-right text-xs" style={{ color: "var(--text-muted)" }}>
                    <p className="font-semibold" style={{ color: "var(--text-secondary)" }}>
                      ⭐ {movie.rating ?? "N/A"}
                    </p>
                    <p>{movie.runtimeMinutes ? `${movie.runtimeMinutes} mins` : "Runtime"}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
