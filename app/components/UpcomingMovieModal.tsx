"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { apiFetch } from "@/lib/api";
import type { MovieRowItem } from "./MovieRow";

type MovieDetails = {
  id: number;
  title: string;
  originalTitle?: string;
  tagline?: string;
  overview?: string;
  releaseDate?: string | null;
  status?: string | null;
  runtime?: number | null;
  rating?: number | null;
  voteCount?: number | null;
  genres?: { id?: number; name?: string }[];
  spokenLanguages?: { english_name?: string; name?: string }[];
  productionCompanies?: { id?: number; name?: string }[];
  productionCountries?: { iso_3166_1?: string; name?: string }[];
  budget?: number;
  revenue?: number;
  homepage?: string;
  imdbId?: string;
  popularity?: number;
  posterUrl?: string | null;
  backdropUrl?: string | null;
};

type UpcomingMovieModalProps = {
  open: boolean;
  movie: MovieRowItem | null;
  onClose: () => void;
};

function formatDate(value?: string | null) {
  if (!value) return "TBA";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatMoney(value?: number) {
  if (!value) return "N/A";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function UpcomingMovieModal({ open, movie, onClose }: UpcomingMovieModalProps) {
  const [details, setDetails] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open || !movie?.tmdbId) return;
    let active = true;
    setLoading(true);
    setDetails(null);

    apiFetch(`/tmdb/movie/${movie.tmdbId}`, { method: "GET", notifyOnError: false })
      .then((data) => {
        if (!active) return;
        setDetails(data as MovieDetails);
      })
      .catch(() => {
        if (!active) return;
        setDetails(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [open, movie?.tmdbId]);

  if (!open) return null;

  const data = details || null;
  const poster = data?.posterUrl || movie?.imageUrl || null;
  const backdrop = data?.backdropUrl || null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-2 py-6 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-[100vw] h-[100dvh] sm:h-[70vh] sm:w-[70vw] sm:max-w-5xl overflow-hidden rounded-none sm:rounded-3xl border border-white/10 bg-slate-950 text-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-99 cursor-pointer rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-white/20"
        >
          Close
        </button>

        {backdrop && (
          <div className="absolute inset-0">
            <Image
              src={backdrop}
              alt="Backdrop"
              fill
              className="object-cover opacity-20"
              sizes="(max-width: 640px) 100vw, 70vw"
            />
          </div>
        )}

        <div className="relative z-10 flex h-full flex-col sm:flex-row">
          <div className="relative w-full flex-shrink-0 p-6 sm:w-[260px] sm:p-8">
            <div className="relative h-[32vh] w-full overflow-hidden rounded-2xl border border-white/10 sm:h-full sm:min-h-[320px]">
              {poster ? (
                <Image
                  src={poster}
                  alt={movie?.title || data?.title || "Movie poster"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 80vw, 240px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-white/60">
                  Poster unavailable
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 pb-6 sm:px-8 sm:py-8">
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-200/80">
                  {loading ? "Loading details" : "Upcoming release"}
                </p>
                <h2 className="mt-2 text-3xl font-semibold">
                  {data?.title || movie?.title || "Untitled"}
                </h2>
                {data?.tagline && (
                  <p className="mt-2 text-sm text-white/70">{data.tagline}</p>
                )}
              </div>

              <p className="text-sm leading-relaxed text-white/80">
                {data?.overview || movie?.description || "No overview available."}
              </p>

              <div className="grid gap-3 text-xs text-white/80 sm:grid-cols-2">
                <div>
                  <span className="text-white/50">Release date</span>
                  <div className="font-semibold">{formatDate(data?.releaseDate || movie?.releaseDate)}</div>
                </div>
                <div>
                  <span className="text-white/50">Status</span>
                  <div className="font-semibold">{data?.status || "TBA"}</div>
                </div>
                <div>
                  <span className="text-white/50">Runtime</span>
                  <div className="font-semibold">
                    {data?.runtime ? `${data.runtime} min` : "TBA"}
                  </div>
                </div>
                <div>
                  <span className="text-white/50">Rating</span>
                  <div className="font-semibold">
                    {data?.rating ? data.rating.toFixed(1) : movie?.rating || "N/A"}
                    {data?.voteCount ? ` · ${data.voteCount} votes` : ""}
                  </div>
                </div>
                <div>
                  <span className="text-white/50">Popularity</span>
                  <div className="font-semibold">{data?.popularity?.toFixed(1) || "N/A"}</div>
                </div>
                <div>
                  <span className="text-white/50">IMDB</span>
                  <div className="font-semibold">{data?.imdbId || "N/A"}</div>
                </div>
                <div>
                  <span className="text-white/50">Budget</span>
                  <div className="font-semibold">{formatMoney(data?.budget)}</div>
                </div>
                <div>
                  <span className="text-white/50">Revenue</span>
                  <div className="font-semibold">{formatMoney(data?.revenue)}</div>
                </div>
              </div>

              <div className="grid gap-4 text-xs text-white/80 sm:grid-cols-2">
                <div>
                  <span className="text-white/50">Genres</span>
                  <div className="mt-1 font-semibold">
                    {data?.genres?.length
                      ? data.genres.map((g) => g.name).filter(Boolean).join(", ")
                      : "N/A"}
                  </div>
                </div>
                <div>
                  <span className="text-white/50">Languages</span>
                  <div className="mt-1 font-semibold">
                    {data?.spokenLanguages?.length
                      ? data.spokenLanguages.map((l) => l.english_name || l.name).filter(Boolean).join(", ")
                      : "N/A"}
                  </div>
                </div>
                <div>
                  <span className="text-white/50">Production companies</span>
                  <div className="mt-1 font-semibold">
                    {data?.productionCompanies?.length
                      ? data.productionCompanies.map((c) => c.name).filter(Boolean).join(", ")
                      : "N/A"}
                  </div>
                </div>
                <div>
                  <span className="text-white/50">Production countries</span>
                  <div className="mt-1 font-semibold">
                    {data?.productionCountries?.length
                      ? data.productionCountries.map((c) => c.name).filter(Boolean).join(", ")
                      : "N/A"}
                  </div>
                </div>
              </div>

              {data?.homepage && (
                <div className="text-xs text-white/80">
                  <span className="text-white/50">Homepage</span>
                  <div className="mt-1 font-semibold break-all">{data.homepage}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
