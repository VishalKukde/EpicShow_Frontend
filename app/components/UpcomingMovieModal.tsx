"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { Calendar, Clock, Heart, Lock, Star, X } from "lucide-react";
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
  genres?: { id?: number; name?: string }[];
  posterUrl?: string | null;
};

type UpcomingMovieModalProps = {
  open: boolean;
  movie: MovieRowItem | null;
  isWishlisted?: boolean;
  onToggleWishlist?: (movieId: string) => void;
  onClose: () => void;
};

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
};

function calculateTimeLeft(targetDateStr?: string | null): TimeLeft {
  if (!targetDateStr) return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: false };
  const target = new Date(targetDateStr).getTime();
  if (Number.isNaN(target)) return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: false };
  const diff = target - Date.now();

  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    isPast: false,
  };
}

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

function extractTwoPosterColors(imageUrl: string): Promise<{ dark: string; light: string } | null> {
  return new Promise((resolve) => {
    if (!imageUrl) return resolve(null);
    const img = new window.Image();
    img.crossOrigin = "Anonymous";
    img.src = imageUrl;
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(null);
        ctx.drawImage(img, 0, 0, 32, 32);

        // Color 1: Top half
        const topData = ctx.getImageData(0, 0, 32, 16).data;
        let r1 = 0, g1 = 0, b1 = 0, c1 = 0;
        for (let i = 0; i < topData.length; i += 16) {
          r1 += topData[i];
          g1 += topData[i + 1];
          b1 += topData[i + 2];
          c1++;
        }
        r1 = Math.round(r1 / c1);
        g1 = Math.round(g1 / c1);
        b1 = Math.round(b1 / c1);

        // Color 2: Bottom half
        const bottomData = ctx.getImageData(0, 16, 32, 16).data;
        let r2 = 0, g2 = 0, b2 = 0, c2 = 0;
        for (let i = 0; i < bottomData.length; i += 16) {
          r2 += bottomData[i];
          g2 += bottomData[i + 1];
          b2 += bottomData[i + 2];
          c2++;
        }
        r2 = Math.round(r2 / c2);
        g2 = Math.round(g2 / c2);
        b2 = Math.round(b2 / c2);

        // Dark mode: rich darkened 2-color gradient
        const dark1 = `rgba(${Math.round(r1 * 0.45)}, ${Math.round(g1 * 0.45)}, ${Math.round(b1 * 0.45)}, 0.96)`;
        const dark2 = `rgba(${Math.round(r2 * 0.3)}, ${Math.round(g2 * 0.3)}, ${Math.round(b2 * 0.3)}, 0.98)`;
        const darkGradient = `linear-gradient(135deg, ${dark1} 0%, ${dark2} 100%)`;

        // Light mode: rich, clearly visible lightened 2-color poster gradient
        const lr1 = Math.round(255 - (255 - r1) * 0.45);
        const lg1 = Math.round(255 - (255 - g1) * 0.45);
        const lb1 = Math.round(255 - (255 - b1) * 0.45);

        const lr2 = Math.round(255 - (255 - r2) * 0.45);
        const lg2 = Math.round(255 - (255 - g2) * 0.45);
        const lb2 = Math.round(255 - (255 - b2) * 0.45);

        const lightGradient = `linear-gradient(135deg, rgb(${lr1}, ${lg1}, ${lb1}) 0%, rgb(${lr2}, ${lg2}, ${lb2}) 100%)`;

        resolve({ dark: darkGradient, light: lightGradient });
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
  });
}

export default function UpcomingMovieModal({
  open,
  movie,
  isWishlisted = false,
  onToggleWishlist,
  onClose,
}: UpcomingMovieModalProps) {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [details, setDetails] = useState<MovieDetails | null>(null);
  const [extractedGradients, setExtractedGradients] = useState<{ dark: string; light: string } | null>(null);
  const releaseDateStr = details?.releaseDate || movie?.releaseDate;
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calculateTimeLeft(releaseDateStr));

  useEffect(() => {
    setMounted(true);
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

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
    if (!releaseDateStr) return;
    setTimeLeft(calculateTimeLeft(releaseDateStr));
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft(releaseDateStr));
    }, 1000);
    return () => clearInterval(interval);
  }, [releaseDateStr]);

  useEffect(() => {
    if (!open || !movie) return;
    const posterSrc = details?.posterUrl || movie.imageUrl;
    if (posterSrc) {
      extractTwoPosterColors(posterSrc).then((grads) => {
        setExtractedGradients(grads);
      });
    }
  }, [open, movie, details?.posterUrl]);

  useEffect(() => {
    if (!open || !movie?.tmdbId) return;
    let active = true;
    setDetails(null);

    apiFetch(`/tmdb/movie/${movie.tmdbId}`, { method: "GET", notifyOnError: false })
      .then((data) => {
        if (active) setDetails(data as MovieDetails);
      })
      .catch(() => {
        if (active) setDetails(null);
      });

    return () => {
      active = false;
    };
  }, [open, movie?.tmdbId]);

  if (!open || !movie || !mounted) return null;

  const data = details || null;
  const poster = data?.posterUrl || movie?.imageUrl || null;
  const movieId = movie.id || (movie.tmdbId ? String(movie.tmdbId) : null);

  const activeGradient = extractedGradients
    ? isDark
      ? extractedGradients.dark
      : extractedGradients.light
    : undefined;

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs cursor-pointer transition-opacity"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        style={activeGradient ? { background: activeGradient } : undefined}
        className={`relative w-full max-w-md overflow-hidden rounded-2xl border p-5 cursor-default space-y-4 shadow-2xl transition-all duration-300 ${activeGradient
          ? isDark
            ? "border-slate-700/60 text-white"
            : "border-slate-300 text-slate-900 bg-white/95"
          : "border-indigo-200 bg-gradient-to-br from-indigo-50 via-white to-purple-50 text-slate-900 shadow-xl dark:border-indigo-900/60 dark:from-slate-900 dark:via-zinc-900 dark:to-indigo-950 dark:text-white"
          }`}
        onClick={(event) => event.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute right-3.5 top-3.5 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-slate-200/80 text-slate-700 backdrop-blur-md transition hover:bg-slate-300 cursor-pointer dark:bg-slate-800/80 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header Row: Poster + Details */}
        <div className="flex gap-4 items-start pr-6">
          <div className="relative h-28 w-20 shrink-0 overflow-hidden rounded-xl border border-slate-300 shadow-md dark:border-slate-700">
            {poster ? (
              <Image
                src={poster}
                alt={movie?.title || data?.title || "Movie poster"}
                fill
                className="object-cover"
                sizes="80px"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-slate-100 text-[10px] text-slate-400 dark:bg-indigo-950/50 dark:text-indigo-200">
                No Poster
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-400/40 dark:text-amber-300">
                <Clock className="h-3 w-3 animate-pulse" />
                Upcoming
              </span>

              {movieId && onToggleWishlist && (
                <button
                  type="button"
                  onClick={() => onToggleWishlist(movieId)}
                  className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold transition cursor-pointer ${isWishlisted
                    ? "border-rose-400 bg-rose-500/20 text-rose-600 dark:text-rose-300"
                    : "border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    }`}
                >
                  <Heart className={`h-3 w-3 ${isWishlisted ? "fill-rose-500 text-rose-500 dark:fill-rose-400 dark:text-rose-400" : ""}`} />
                  <span>{isWishlisted ? "Saved" : "Favorite"}</span>
                </button>
              )}
            </div>

            <h3 className="text-lg font-bold text-slate-900 truncate dark:text-white">
              {data?.title || movie?.title || "Untitled"}
            </h3>

            <p className="text-xs text-slate-600 flex items-center gap-1 font-medium dark:text-slate-300">
              <Calendar className="h-3 w-3 text-indigo-600 dark:text-amber-300" />
              <span>Releasing {formatDate(releaseDateStr)}</span>
            </p>

            {movie.genre?.length ? (
              <p className="text-[11px] text-slate-500 truncate dark:text-slate-400">
                {movie.genre.join(" • ")}
              </p>
            ) : null}
          </div>
        </div>

        {/* Countdown Box */}
        <div className="rounded-xl border border-slate-300 bg-slate-100/90 p-3 backdrop-blur-md dark:border-white/15 dark:bg-slate-950/60 shadow-xs">
          <div className="flex items-center justify-between text-[11px] font-bold tracking-wider text-indigo-900 dark:text-amber-300 mb-2">
            <span>COUNTDOWN TO RELEASE</span>
            {movie.rating ? (
              <span className="flex items-center gap-1 text-amber-600 font-bold dark:text-amber-300">
                <Star className="h-3 w-3 fill-amber-500 dark:fill-amber-300" />
                {movie.rating.toFixed(1)}
              </span>
            ) : null}
          </div>

          {timeLeft.isPast ? (
            <p className="text-center text-xs font-bold text-emerald-600 dark:text-emerald-300 py-1">
              🎉 Releasing Today!
            </p>
          ) : (
            <div className="grid grid-cols-4 gap-1.5 text-center">
              <div className="rounded-lg bg-white p-1.5 border border-slate-200 shadow-xs dark:bg-black/40 dark:border-white/15">
                <span className="text-sm font-black text-slate-900 block dark:text-white">
                  {String(timeLeft.days).padStart(2, "0")}
                </span>
                <span className="text-[8px] font-bold text-slate-500 uppercase dark:text-slate-300">DAYS</span>
              </div>
              <div className="rounded-lg bg-white p-1.5 border border-slate-200 shadow-xs dark:bg-black/40 dark:border-white/15">
                <span className="text-sm font-black text-slate-900 block dark:text-white">
                  {String(timeLeft.hours).padStart(2, "0")}
                </span>
                <span className="text-[8px] font-bold text-slate-500 uppercase dark:text-slate-300">HRS</span>
              </div>
              <div className="rounded-lg bg-white p-1.5 border border-slate-200 shadow-xs dark:bg-black/40 dark:border-white/15">
                <span className="text-sm font-black text-slate-900 block dark:text-white">
                  {String(timeLeft.minutes).padStart(2, "0")}
                </span>
                <span className="text-[8px] font-bold text-slate-500 uppercase dark:text-slate-300">MINS</span>
              </div>
              <div className="rounded-lg bg-white p-1.5 border border-slate-200 shadow-xs dark:bg-black/40 dark:border-white/15">
                <span className="text-sm font-black text-indigo-600 block dark:text-amber-300">
                  {String(timeLeft.seconds).padStart(2, "0")}
                </span>
                <span className="text-[8px] font-bold text-slate-500 uppercase dark:text-slate-300">SECS</span>
              </div>
            </div>
          )}
        </div>

        {/* Synopsis */}
        <p className="text-xs text-slate-700 leading-relaxed line-clamp-3 dark:text-slate-300">
          {data?.overview || movie?.description || "An upcoming movie releasing soon."}
        </p>

        {/* Notice */}
        <div className="flex items-center gap-2 rounded-lg border border-amber-400/50 bg-amber-500/10 p-2.5 text-xs text-amber-900 dark:border-amber-400/30 dark:bg-amber-500/15 dark:text-amber-200">
          <Lock className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-300" />
          <span className="text-[11px] font-medium">
            Ticket booking opens closer to release. Save to favorites to get alerts!
          </span>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
