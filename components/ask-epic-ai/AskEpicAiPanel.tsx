"use client";

import type { FormEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Bot,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  Film,
  Gamepad2,
  Github,
  Globe,
  Linkedin,
  Mail,
  MapPin,
  RotateCcw,
  SendHorizontal,
  Sparkles,
  Star,
  Ticket,
  Train,
  Trophy,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useAskEpicAiStore } from "@/store/askEpicAiStore";
import { useThemeStore } from "@/store/themeStore";
import { getApiBaseUrl } from "@/lib/api";
import { getToken } from "@/lib/tokenStore";

export type AskMessage = {
  id: string;
  role: "assistant" | "user";
  text: string;
  time: string;
  quickReplies?: Array<{ label: string; action?: string; href?: string }>;
};

type AskEpicAiPanelProps = {
  className?: string;
  closeHref?: string;
  mobileBackHref?: string;
  showDesktopClose?: boolean;
  showMobileBack?: boolean;
  onDesktopClose?: () => void;
  onMobileBack?: () => void;
};

const formatTime = () =>
  new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(new Date());

const createId = () => `${Date.now()}_${Math.random().toString(16).slice(2)}`;

const INITIAL_SUGGESTIONS = [
  { label: "What is EpicShow?" },
  { label: "Who is the developer of EpicShow?" }
];

const CATEGORY_SUGGESTIONS = [
  { label: "🎬 Movies", query: "movie" },
  { label: "⚽ Sports", query: "sports" },
  { label: "🎮 Gaming", query: "gaming" },
  { label: "🚆 Trains", query: "train" },
];

interface MovieCardData {
  title: string;
  genre?: string;
  language?: string;
  runtime?: string;
  rating?: string;
  releaseDate?: string;
  description?: string;
}

interface BookingCardData {
  category?: string;
  title: string;
  status?: string;
  date?: string;
  slot?: string;
  seats?: string;
  amount?: string;
  bookingId?: string;
  pnr?: string;
  route?: string;
  venue?: string;
}

interface SportCardData {
  league?: string;
  matchNo?: string;
  teams: string;
  venue?: string;
  city?: string;
  date?: string;
  time?: string;
  price?: string;
  priceRange?: string;
  rating?: string;
  description?: string;
}

interface TrainCardData {
  trainNumber?: string;
  trainName: string;
  route?: string;
  fromStation?: string;
  toStation?: string;
  departure?: string;
  departureTime?: string;
  arrival?: string;
  arrivalTime?: string;
  duration?: string;
  price?: string;
  seats?: string;
  availableSeats?: string;
  type?: string;
  trainType?: string;
  rating?: string;
}

interface GamingCardData {
  title: string;
  venue?: string;
  city?: string;
  date?: string;
  time?: string;
  price?: string;
  seats?: string;
  availableSeats?: string;
  totalSeats?: string;
  organizer?: string;
  description?: string;
}

/**
 * Parses key-value block content into an object
 */
function parseCardBlock(block: string): Record<string, string> {
  const result: Record<string, string> = {};
  const lines = block.split("\n");

  for (const line of lines) {
    const colonIndex = line.indexOf(":");
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim();
      const val = line.slice(colonIndex + 1).trim();
      if (key && val) {
        result[key] = val;
      }
    }
  }

  return result;
}

/**
 * Beautiful UI Card for a Movie Listing
 */
function MovieCard({
  movie,
  onExplore,
}: {
  movie: MovieCardData;
  onExplore: () => void;
}) {
  return (
    <div className="my-3 overflow-hidden rounded-2xl border border-indigo-200/80 bg-white/95 p-3.5 shadow-sm transition-all duration-200 hover:shadow-md dark:border-zinc-700/80 dark:bg-zinc-800/95 sm:p-4">
      {/* Header: Title & Rating Badge */}
      <div className="flex items-start justify-between gap-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
            <Film className="h-4 w-4" />
          </div>
          <h4 className="truncate text-sm font-bold tracking-tight text-slate-900 dark:text-white sm:text-[15px]">
            {movie.title}
          </h4>
        </div>

        {movie.rating ? (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-bold text-amber-600 dark:text-amber-400">
            <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
            {movie.rating}
          </span>
        ) : null}
      </div>

      {/* Subheader Badges: Genre, Language, Runtime */}
      <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
        {movie.genre ? (
          <span className="rounded-md border border-indigo-200/70 bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-700 dark:border-indigo-800/60 dark:bg-indigo-950/50 dark:text-indigo-300">
            {movie.genre}
          </span>
        ) : null}

        {movie.language ? (
          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:bg-zinc-700 dark:text-zinc-300">
            {movie.language}
          </span>
        ) : null}

        {movie.runtime ? (
          <span className="flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
            <Clock className="h-3 w-3" />
            {movie.runtime}
          </span>
        ) : null}
      </div>

      {/* Release Date Info */}
      {movie.releaseDate ? (
        <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
          <Calendar className="h-3.5 w-3.5" />
          <span>Release: {movie.releaseDate}</span>
        </div>
      ) : null}

      {/* Synopsis Description */}
      {movie.description ? (
        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          {movie.description}
        </p>
      ) : null}

      {/* Action button */}
      <div className="mt-3 flex justify-end">
        <button
          type="button"
          onClick={onExplore}
          className="cursor-pointer rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-indigo-500 active:scale-95"
        >
          View Showtimes
        </button>
      </div>
    </div>
  );
}

/**
 * Beautiful UI Card for a User Booking Ticket
 */
function BookingTicketCard({ booking }: { booking: BookingCardData }) {
  const isTrain = booking.category?.toLowerCase().includes("train");
  const isSports = booking.category?.toLowerCase().includes("sport");

  return (
    <div className="my-3 overflow-hidden rounded-2xl border border-indigo-200/90 bg-gradient-to-br from-indigo-50/70 via-white to-white p-3.5 shadow-sm transition hover:shadow-md dark:border-indigo-500/30 dark:from-indigo-950/20 dark:via-zinc-800 dark:to-zinc-800 sm:p-4">
      {/* Category & Status Row */}
      <div className="flex items-center justify-between gap-2 border-b border-indigo-100 pb-2 dark:border-zinc-700/60">
        <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400">
          {isTrain ? (
            <Train className="h-3.5 w-3.5" />
          ) : isSports ? (
            <Trophy className="h-3.5 w-3.5" />
          ) : (
            <Ticket className="h-3.5 w-3.5" />
          )}
          <span>{booking.category || "Booking Ticket"}</span>
        </div>

        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="h-3 w-3" />
          {booking.status || "Confirmed"}
        </span>
      </div>

      {/* Booking Title / Movie Name */}
      <h4 className="mt-2 text-sm font-bold text-slate-900 dark:text-white sm:text-base">
        {booking.title}
      </h4>

      {/* Details Grid */}
      <div className="mt-2.5 grid grid-cols-2 gap-2 text-xs">
        {booking.date ? (
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-semibold text-slate-400 dark:text-zinc-400">
              Date
            </span>
            <span className="font-semibold text-slate-800 dark:text-zinc-200">
              {booking.date}
            </span>
          </div>
        ) : null}

        {booking.slot ? (
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-semibold text-slate-400 dark:text-zinc-400">
              Showtime / Slot
            </span>
            <span className="font-semibold text-slate-800 dark:text-zinc-200">
              {booking.slot}
            </span>
          </div>
        ) : null}

        {booking.seats ? (
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-semibold text-slate-400 dark:text-zinc-400">
              Seats / Berth
            </span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400">
              {booking.seats}
            </span>
          </div>
        ) : null}

        {booking.amount ? (
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-semibold text-slate-400 dark:text-zinc-400">
              Amount Paid
            </span>
            <span className="font-bold text-slate-900 dark:text-white">
              {booking.amount}
            </span>
          </div>
        ) : null}

        {booking.pnr ? (
          <div className="col-span-2 flex items-center justify-between rounded-lg bg-slate-50 px-2.5 py-1.5 dark:bg-zinc-700/50">
            <span className="text-[11px] font-medium text-slate-500 dark:text-zinc-400">
              PNR Number
            </span>
            <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
              {booking.pnr}
            </span>
          </div>
        ) : null}

        {booking.bookingId ? (
          <div className="col-span-2 flex items-center justify-between text-[11px] text-slate-400 dark:text-zinc-400">
            <span>Booking Ref:</span>
            <span className="font-mono text-[10px] font-medium">
              #{booking.bookingId.slice(-8)}
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
}

/**
 * Beautiful UI Card for a Sports Match Listing
 */
function SportCard({
  match,
  onExplore,
}: {
  match: SportCardData;
  onExplore: () => void;
}) {
  return (
    <div className="my-3 overflow-hidden rounded-2xl border border-emerald-200/80 bg-white/95 p-3.5 shadow-sm transition-all duration-200 hover:shadow-md dark:border-emerald-800/60 dark:bg-zinc-800/95 sm:p-4">
      {/* Header: League & Rating */}
      <div className="flex items-start justify-between gap-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
            <Trophy className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <span className="inline-block rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
              {match.league || "Sports League"}
            </span>
          </div>
        </div>

        {match.rating ? (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-bold text-amber-600 dark:text-amber-400">
            <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
            {match.rating}
          </span>
        ) : null}
      </div>

      {/* Match Title / Teams */}
      <h4 className="mt-2.5 text-sm font-bold tracking-tight text-slate-900 dark:text-white sm:text-[15px]">
        {match.teams}
      </h4>

      {/* Venue & Timing */}
      <div className="mt-2 flex flex-col gap-1.5 text-xs text-slate-600 dark:text-zinc-300">
        {match.venue ? (
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span className="truncate">{match.venue}</span>
          </div>
        ) : null}

        <div className="flex flex-wrap items-center gap-3">
          {match.date ? (
            <div className="flex items-center gap-1.5 font-medium">
              <Calendar className="h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>{match.date}</span>
            </div>
          ) : null}

          {match.time ? (
            <div className="flex items-center gap-1.5 font-medium">
              <Clock className="h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>{match.time}</span>
            </div>
          ) : null}
        </div>
      </div>

      {/* Footer: Price & Action */}
      <div className="mt-3 flex items-center justify-between border-t border-emerald-100 pt-2.5 dark:border-zinc-700/60">
        <span className="text-xs font-bold text-slate-900 dark:text-white">
          {match.priceRange || match.price || "₹300 onwards"}
        </span>
        <button
          type="button"
          onClick={onExplore}
          className="cursor-pointer rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-emerald-500 active:scale-95"
        >
          View Match
        </button>
      </div>
    </div>
  );
}

/**
 * Beautiful UI Card for a Train Schedule / Route
 */
function TrainCard({
  train,
  onExplore,
}: {
  train: TrainCardData;
  onExplore: () => void;
}) {
  const departure = train.departure || train.departureTime;
  const arrival = train.arrival || train.arrivalTime;
  const seats = train.seats || train.availableSeats;

  return (
    <div className="my-3 overflow-hidden rounded-2xl border border-sky-200/80 bg-white/95 p-3.5 shadow-sm transition-all duration-200 hover:shadow-md dark:border-sky-800/60 dark:bg-zinc-800/95 sm:p-4">
      {/* Header: Train Name & Number Badge */}
      <div className="flex items-start justify-between gap-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400">
            <Train className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <h4 className="truncate text-sm font-bold tracking-tight text-slate-900 dark:text-white sm:text-[15px]">
              {train.trainName}
            </h4>
            <span className="text-[11px] font-mono text-slate-500 dark:text-zinc-400">
              #{train.trainNumber}
            </span>
          </div>
        </div>

        {train.price ? (
          <span className="rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-bold text-sky-700 dark:bg-sky-950/50 dark:text-sky-300">
            {train.price}
          </span>
        ) : null}
      </div>

      {/* Route */}
      {train.route ? (
        <div className="mt-2.5 rounded-lg bg-sky-50/70 px-2.5 py-1.5 text-xs font-semibold text-sky-900 dark:bg-sky-950/40 dark:text-sky-200">
          {train.route}
        </div>
      ) : null}

      {/* Timings & Duration */}
      <div className="mt-2.5 grid grid-cols-3 gap-2 text-center text-xs">
        {departure ? (
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-semibold text-slate-400 dark:text-zinc-400">
              Departure
            </span>
            <span className="font-bold text-slate-800 dark:text-zinc-200">
              {departure}
            </span>
          </div>
        ) : null}

        {train.duration ? (
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-semibold text-slate-400 dark:text-zinc-400">
              Duration
            </span>
            <span className="font-medium text-slate-500 dark:text-zinc-400">
              {train.duration}
            </span>
          </div>
        ) : null}

        {arrival ? (
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-semibold text-slate-400 dark:text-zinc-400">
              Arrival
            </span>
            <span className="font-bold text-slate-800 dark:text-zinc-200">
              {arrival}
            </span>
          </div>
        ) : null}
      </div>

      {/* Footer: Seats & Action */}
      <div className="mt-3 flex items-center justify-between border-t border-sky-100 pt-2.5 dark:border-zinc-700/60">
        <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
          {seats ? `${seats} Seats Available` : "Seats Available"}
        </span>
        <button
          type="button"
          onClick={onExplore}
          className="cursor-pointer rounded-xl bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-sky-500 active:scale-95"
        >
          Book Train
        </button>
      </div>
    </div>
  );
}

/**
 * Beautiful UI Card for a Gaming Event / Zone
 */
function GamingCard({
  game,
  onExplore,
}: {
  game: GamingCardData;
  onExplore: () => void;
}) {
  const seats = game.seats || game.availableSeats;

  return (
    <div className="my-3 overflow-hidden rounded-2xl border border-purple-200/80 bg-white/95 p-3.5 shadow-sm transition-all duration-200 hover:shadow-md dark:border-purple-800/60 dark:bg-zinc-800/95 sm:p-4">
      {/* Header: Title & Price */}
      <div className="flex items-start justify-between gap-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400">
            <Gamepad2 className="h-4 w-4" />
          </div>
          <h4 className="truncate text-sm font-bold tracking-tight text-slate-900 dark:text-white sm:text-[15px]">
            {game.title}
          </h4>
        </div>

        {game.price ? (
          <span className="shrink-0 rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-bold text-purple-700 dark:bg-purple-950/50 dark:text-purple-300">
            {game.price}
          </span>
        ) : null}
      </div>

      {/* Venue & Details */}
      <div className="mt-2.5 flex flex-col gap-1.5 text-xs text-slate-600 dark:text-zinc-300">
        {game.venue ? (
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-purple-600 dark:text-purple-400" />
            <span className="truncate">{game.venue}</span>
          </div>
        ) : null}

        <div className="flex flex-wrap items-center gap-3">
          {game.date ? (
            <div className="flex items-center gap-1.5 font-medium">
              <Calendar className="h-3.5 w-3.5 shrink-0 text-purple-600 dark:text-purple-400" />
              <span>{game.date}</span>
            </div>
          ) : null}

          {game.time ? (
            <div className="flex items-center gap-1.5 font-medium">
              <Clock className="h-3.5 w-3.5 shrink-0 text-purple-600 dark:text-purple-400" />
              <span>{game.time}</span>
            </div>
          ) : null}
        </div>

        {game.organizer ? (
          <span className="text-[11px] text-slate-400 dark:text-zinc-400">
            Organizer: {game.organizer}
          </span>
        ) : null}
      </div>

      {/* Footer: Seats & Action */}
      <div className="mt-3 flex items-center justify-between border-t border-purple-100 pt-2.5 dark:border-zinc-700/60">
        <span className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400">
          {seats ? `${seats} slots open` : "Pass Available"}
        </span>
        <button
          type="button"
          onClick={onExplore}
          className="cursor-pointer rounded-xl bg-purple-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-purple-500 active:scale-95"
        >
          Explore Gaming
        </button>
      </div>
    </div>
  );
}

/**
 * Elegant dual concentric circles rotating inside each other
 */
function DualCircleSpinner({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <span className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
      {/* Outer circle rotating clockwise */}
      <span
        className="absolute inset-0 rounded-full border-[1.5px] border-indigo-500/25 border-t-indigo-600 dark:border-indigo-400/25 dark:border-t-indigo-400"
        style={{ animation: "spin 1s linear infinite" }}
      />
      {/* Inner circle rotating counter-clockwise inside */}
      <span
        className="h-2 w-2 rounded-full border-[1.5px] border-indigo-500/30 border-b-indigo-500 dark:border-indigo-400/30 dark:border-b-indigo-300"
        style={{ animation: "spin 1.2s linear infinite reverse" }}
      />
    </span>
  );
}

/**
 * Detects appropriate icon and properties for a URL or email link
 */
function getLinkDetails(url: string, rawLabel: string) {
  const cleanUrl = url.trim();
  const lowerUrl = cleanUrl.toLowerCase();
  const isMail = lowerUrl.startsWith("mailto:") || lowerUrl.includes("@");
  const href = isMail && !lowerUrl.startsWith("mailto:") ? `mailto:${cleanUrl}` : cleanUrl;

  let Icon = ExternalLink;
  let customStyle = "text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300";

  if (lowerUrl.includes("github.com")) {
    Icon = Github;
    customStyle = "text-slate-800 dark:text-zinc-200 hover:text-indigo-600 dark:hover:text-indigo-400";
  } else if (lowerUrl.includes("linkedin.com")) {
    Icon = Linkedin;
    customStyle = "text-[#0a66c2] hover:text-[#004182] dark:text-[#388bfd]";
  } else if (isMail) {
    Icon = Mail;
    customStyle = "text-rose-600 dark:text-rose-400 hover:text-rose-700";
  } else if (lowerUrl.includes("vercel.app") || lowerUrl.includes("portfolio")) {
    Icon = Globe;
    customStyle = "text-emerald-600 dark:text-emerald-400 hover:text-emerald-700";
  }

  // Label formatting
  let displayLabel = rawLabel.trim();
  if (displayLabel === cleanUrl) {
    if (lowerUrl.includes("linkedin.com")) displayLabel = "LinkedIn Profile";
    else if (lowerUrl.includes("github.com")) displayLabel = "GitHub Profile";
    else if (lowerUrl.includes("vercel.app")) displayLabel = "Portfolio Website";
    else if (isMail) displayLabel = cleanUrl.replace(/^mailto:/i, "");
  }

  return { href, displayLabel, isMail, Icon, customStyle };
}

/**
 * Tokenizes and formats markdown text lines with bold (**bold**) and clickable links ([text](url), raw URLs, emails)
 */
function renderInlineContent(content: string, keyPrefix: string): React.ReactNode[] {
  const tokenRegex = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^\s)]+\)|https?:\/\/[^\s)<>]+|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
  const tokens = content.split(tokenRegex);

  return tokens.map((token, tokenIdx) => {
    if (!token) return null;
    const tokenKey = `${keyPrefix}_${tokenIdx}`;

    // 1. Bold text: **text**
    if (token.startsWith("**") && token.endsWith("**") && token.length > 4) {
      return (
        <strong key={tokenKey} className="font-semibold text-inherit">
          {token.slice(2, -2)}
        </strong>
      );
    }

    // 2. Markdown link: [label](url)
    if (token.startsWith("[") && token.includes("](") && token.endsWith(")")) {
      const closeBracket = token.indexOf("](");
      const rawLabel = token.slice(1, closeBracket);
      const rawUrl = token.slice(closeBracket + 2, -1);
      const { href, displayLabel, isMail, Icon, customStyle } = getLinkDetails(rawUrl, rawLabel);

      return (
        <a
          key={tokenKey}
          href={href}
          target={isMail ? undefined : "_blank"}
          rel={isMail ? undefined : "noopener noreferrer"}
          className={`inline-flex items-center gap-1 font-semibold underline underline-offset-2 break-all transition cursor-pointer px-1 py-0.5 rounded hover:bg-indigo-500/10 ${customStyle}`}
        >
          <Icon className="h-3.5 w-3.5 shrink-0 inline" />
          <span>{displayLabel}</span>
        </a>
      );
    }

    // 3. Raw URL: https://...
    if (token.startsWith("http://") || token.startsWith("https://")) {
      const { href, displayLabel, isMail, Icon, customStyle } = getLinkDetails(token, token);

      return (
        <a
          key={tokenKey}
          href={href}
          target={isMail ? undefined : "_blank"}
          rel={isMail ? undefined : "noopener noreferrer"}
          className={`inline-flex items-center gap-1 font-semibold underline underline-offset-2 break-all transition cursor-pointer px-1 py-0.5 rounded hover:bg-indigo-500/10 ${customStyle}`}
        >
          <Icon className="h-3.5 w-3.5 shrink-0 inline" />
          <span>{displayLabel}</span>
        </a>
      );
    }

    // 4. Raw email address
    if (token.includes("@") && /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(token)) {
      const { href, displayLabel, isMail, Icon, customStyle } = getLinkDetails(token, token);

      return (
        <a
          key={tokenKey}
          href={href}
          className={`inline-flex items-center gap-1 font-semibold underline underline-offset-2 break-all transition cursor-pointer px-1 py-0.5 rounded hover:bg-indigo-500/10 ${customStyle}`}
        >
          <Icon className="h-3.5 w-3.5 shrink-0 inline" />
          <span>{displayLabel}</span>
        </a>
      );
    }

    // 5. Plain text
    return <span key={tokenKey}>{token}</span>;
  });
}

/**
 * Formats regular markdown text lines (bullet points, bold tags, clickable links)
 */
function MarkdownFormattedText({ text }: { text: string }) {
  if (!text || !text.trim()) return null;

  const lines = text.split("\n");

  return (
    <div className="space-y-1 text-sm leading-relaxed">
      {lines.map((line, lineIdx) => {
        const trimmed = line.trim();

        if (!trimmed) {
          return <div key={lineIdx} className="h-1" />;
        }

        const isBullet = trimmed.startsWith("* ") || trimmed.startsWith("- ");
        const content = isBullet ? trimmed.slice(2) : line;

        const renderedContent = renderInlineContent(content, `line_${lineIdx}`);

        if (isBullet) {
          return (
            <div key={lineIdx} className="flex items-start gap-2 pl-1 my-0.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
              <span className="flex-1">{renderedContent}</span>
            </div>
          );
        }

        return <p key={lineIdx}>{renderedContent}</p>;
      })}
    </div>
  );
}

/**
 * Parses full message text, extracting `:::movie-card`, `:::booking-card`, `:::sport-card`, `:::train-card`, and `:::gaming-card` into UI cards
 */
function ParsedMessageContent({
  text,
  onExploreMovies,
  onExploreSports,
  onExploreTrains,
  onExploreGaming,
  onCategorySelect,
}: {
  text: string;
  onExploreMovies: () => void;
  onExploreSports?: () => void;
  onExploreTrains?: () => void;
  onExploreGaming?: () => void;
  onCategorySelect: (category: string) => void;
}) {
  if (!text || !text.trim()) return null;

  // Split by card delimiters
  const cardRegex = /:::(movie-card|booking-card|sport-card|train-card|gaming-card)([\s\S]*?)(:::|$)/g;
  const elements: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = cardRegex.exec(text)) !== null) {
    const preText = text.slice(lastIndex, match.index);
    if (preText.trim()) {
      elements.push(
        <MarkdownFormattedText key={`text_${lastIndex}`} text={preText} />
      );
    }

    const cardType = match[1];
    const cardContent = match[2];
    const parsedData = parseCardBlock(cardContent);

    if (cardType === "movie-card" && parsedData.title) {
      elements.push(
        <MovieCard
          key={`movie_${match.index}`}
          movie={parsedData as unknown as MovieCardData}
          onExplore={onExploreMovies}
        />
      );
    } else if (cardType === "booking-card" && parsedData.title) {
      elements.push(
        <BookingTicketCard
          key={`booking_${match.index}`}
          booking={parsedData as unknown as BookingCardData}
        />
      );
    } else if (cardType === "sport-card" && (parsedData.teams || parsedData.league)) {
      elements.push(
        <SportCard
          key={`sport_${match.index}`}
          match={parsedData as unknown as SportCardData}
          onExplore={onExploreSports || onExploreMovies}
        />
      );
    } else if (cardType === "train-card" && (parsedData.trainName || parsedData.trainNumber)) {
      elements.push(
        <TrainCard
          key={`train_${match.index}`}
          train={parsedData as unknown as TrainCardData}
          onExplore={onExploreTrains || onExploreMovies}
        />
      );
    } else if (cardType === "gaming-card" && parsedData.title) {
      elements.push(
        <GamingCard
          key={`gaming_${match.index}`}
          game={parsedData as unknown as GamingCardData}
          onExplore={onExploreGaming || onExploreMovies}
        />
      );
    }

    lastIndex = match.index + match[0].length;
  }

  const remainingText = text.slice(lastIndex);
  if (remainingText.trim()) {
    elements.push(
      <MarkdownFormattedText key={`text_end_${lastIndex}`} text={remainingText} />
    );
  }

  // Check if message asks to choose a booking category
  const lower = text.toLowerCase();
  const asksCategory =
    lower.includes("which category would you like") ||
    lower.includes("which type of booking") ||
    (lower.includes("movies") && lower.includes("sports") && lower.includes("trains"));

  return (
    <div>
      {elements}

      {/* Interactive Category Chips */}
      {asksCategory ? (
        <div className="mt-3 flex flex-wrap gap-1.5 border-t border-indigo-500/15 pt-2.5">
          <p className="w-full text-xs font-semibold text-slate-500 dark:text-zinc-400">
            Select a category to view:
          </p>
          {CATEGORY_SUGGESTIONS.map((cat) => (
            <button
              key={cat.label}
              type="button"
              onClick={() => onCategorySelect(cat.query)}
              className="cursor-pointer rounded-full border border-indigo-200 bg-white px-3 py-1 text-xs font-semibold text-indigo-700 shadow-xs transition hover:border-indigo-400 hover:bg-indigo-50 active:scale-95 dark:border-zinc-700 dark:bg-zinc-800 dark:text-indigo-300 dark:hover:bg-zinc-700"
            >
              {cat.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default function AskEpicAiPanel({
  className,
  closeHref = "/",
  mobileBackHref = "/",
  showDesktopClose = true,
  showMobileBack = true,
  onDesktopClose,
  onMobileBack,
}: AskEpicAiPanelProps) {
  const router = useRouter();
  const { user } = useAuth();
  const closeAskEpicAi = useAskEpicAiStore((state) => state.close);
  const mode = useThemeStore((s) => s.mode);
  const dark = mode === "dark";

  const listRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [messages, setMessages] = useState<AskMessage[]>([]);

  const panelTone = useMemo(
    () =>
      dark
        ? {
            shell: "bg-zinc-900 border-zinc-700",
            header: "bg-zinc-800 border-zinc-700",
            chatBg: "bg-zinc-900",
            footer: "bg-zinc-900 border-zinc-700",
            input: "bg-zinc-800 text-zinc-100 placeholder-zinc-400 ring-1 ring-zinc-600",
            botBubble: "bg-zinc-800 text-zinc-100 ring-1 ring-zinc-700/60",
            userBubble: "bg-indigo-600 text-white",
            meta: "text-zinc-400",
            quick: "border-zinc-700 bg-zinc-800/80 text-zinc-200 hover:bg-zinc-700 hover:border-zinc-600",
          }
        : {
            shell: "bg-[#eff4ff] border-[#bfcfff]",
            header: "bg-indigo-600 border-indigo-700",
            chatBg:
              "bg-[#f5f8ff] bg-[linear-gradient(rgba(99,102,241,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.06)_1px,transparent_1px)] bg-[size:22px_22px]",
            footer: "bg-[#eff4ff] border-[#bfcfff]",
            input: "bg-white text-[#0f172a] placeholder-[#64748b] ring-1 ring-[#c7d7ff]",
            botBubble: "bg-white text-[#0f172a] ring-1 ring-[#d7e4ff]",
            userBubble: "bg-indigo-600 text-white",
            meta: "text-[#64748b]",
            quick: "border-[#bfdbfe] bg-[#eef4ff] text-indigo-600 hover:bg-[#e0ecff] hover:border-indigo-300",
          },
    [dark]
  );

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    if (!listRef.current) return;
    listRef.current.scrollTo({ top: listRef.current.scrollHeight, behavior });
  };

  const getInitialGreeting = (): AskMessage => ({
    id: "welcome_message",
    role: "assistant",
    text: `Hi${user?.name ? ` ${user.name}` : ""}! I am your EpicShow AI assistant.\nAsk me about movie showtimes, sports, gaming zones, train bookings, cancellation rules, or your personal tickets!`,
    time: formatTime(),
    quickReplies: [],
  });

  const resetConversation = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsStreaming(false);
    setIsTyping(false);
    setInput("");
    setMessages([]);
  };

  const handleExploreMovies = () => {
    closeAskEpicAi();
    router.push("/movies");
  };

  const handleExploreSports = () => {
    closeAskEpicAi();
    router.push("/sports");
  };

  const handleExploreTrains = () => {
    closeAskEpicAi();
    router.push("/trains");
  };

  const handleExploreGaming = () => {
    closeAskEpicAi();
    router.push("/gaming");
  };

  /**
   * Sends user query to the Gemini RAG streaming endpoint
   */
  const sendMessage = async (raw?: string) => {
    const value = (raw ?? input).trim();
    if (!value || isStreaming) return;

    // Handle quick client actions
    const normalized = value.toLowerCase();
    if (normalized === "reset" || normalized === "clear") {
      resetConversation();
      return;
    }

    // Append user message
    const userMsg: AskMessage = {
      id: createId(),
      role: "user",
      text: value,
      time: formatTime(),
    };

    const assistantMsgId = createId();

    // Add ONLY user message initially; typing indicator will show while server generates
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    setIsStreaming(true);

    requestAnimationFrame(() => scrollToBottom("smooth"));

    // Prepare history for backend
    const historyPayload = messages
      .filter((m) => m.id !== "welcome_message" && m.text.trim())
      .slice(-6)
      .map((m) => ({ role: m.role, text: m.text }));

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const token = getToken();
      const baseUrl = getApiBaseUrl();

      const response = await fetch(`${baseUrl}/user-ai/chat/stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
        body: JSON.stringify({
          message: value,
          history: historyPayload,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      if (!response.body) {
        throw new Error("No response body received from stream.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";
      let hasReceivedFirstChunk = false;

      while (true) {
        const { done, value: streamChunk } = await reader.read();
        if (done) break;

        buffer += decoder.decode(streamChunk, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmedLine = line.trim();
          if (!trimmedLine.startsWith("data: ")) continue;

          const dataPayload = trimmedLine.slice(6).trim();
          if (dataPayload === "[DONE]") {
            break;
          }

          try {
            const parsed = JSON.parse(dataPayload);
            if (parsed.chunk) {
              if (!hasReceivedFirstChunk) {
                hasReceivedFirstChunk = true;
                setIsTyping(false);

                // Add assistant message with first real chunk
                setMessages((prev) => [
                  ...prev,
                  {
                    id: assistantMsgId,
                    role: "assistant",
                    text: parsed.chunk,
                    time: formatTime(),
                  },
                ]);
              } else {
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMsgId
                      ? { ...msg, text: msg.text + parsed.chunk }
                      : msg
                  )
                );
              }
              scrollToBottom("auto");
            }
          } catch {
            // Non-JSON or malformed chunk, ignore
          }
        }
      }
    } catch (err: unknown) {
      if ((err as Error)?.name !== "AbortError") {
        console.error("[AskEpicAiPanel] Streaming error:", err);
        setMessages((prev) => {
          const exists = prev.some((msg) => msg.id === assistantMsgId);
          if (exists) {
            return prev.map((msg) =>
              msg.id === assistantMsgId
                ? {
                    ...msg,
                    text:
                      msg.text ||
                      "I am currently having trouble retrieving that information. Please try asking again in a moment.",
                  }
                : msg
            );
          }
          return [
            ...prev,
            {
              id: assistantMsgId,
              role: "assistant",
              text: "I am currently having trouble retrieving that information. Please try asking again in a moment.",
              time: formatTime(),
            },
          ];
        });
      }
    } finally {
      setIsTyping(false);
      setIsStreaming(false);
      abortControllerRef.current = null;
      requestAnimationFrame(() => scrollToBottom("smooth"));
    }
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendMessage();
  };

  // Abort on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return (
    <section
      className={`relative flex h-full min-h-0 w-full flex-col overflow-hidden overscroll-y-none border ${panelTone.shell} ${className ?? ""}`}
    >
      {/* Header */}
      <header
        className={`sticky top-0 z-30 flex shrink-0 items-center gap-2 border-b px-3 pt-[calc(env(safe-area-inset-top)+0.5rem)] pb-2.5 text-white sm:px-4 ${panelTone.header}`}
      >
        {showMobileBack ? (
          onMobileBack ? (
            <button
              type="button"
              onClick={onMobileBack}
              className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white/15 transition hover:bg-white/25 lg:hidden"
              aria-label="Back"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          ) : (
            <Link
              href={mobileBackHref}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/15 transition hover:bg-white/25 lg:hidden"
              aria-label="Back"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
          )
        ) : null}

        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
          <Bot className="h-4 w-4" />
        </span>

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold flex items-center gap-1.5">
            Epic AI <Sparkles className="h-3.5 w-3.5 text-indigo-200" />
          </p>
        </div>

        <div className="ml-auto flex items-center gap-1">
          {/* Reset / Clear chat */}
          <button
            type="button"
            onClick={resetConversation}
            title="Reset Conversation"
            className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white/15 transition hover:bg-white/25"
            aria-label="Reset Conversation"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>

          {showDesktopClose ? (
            onDesktopClose ? (
              <button
                type="button"
                onClick={onDesktopClose}
                className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white/15 transition hover:bg-white/25"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            ) : (
              <Link
                href={closeHref}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/15 transition hover:bg-white/25"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </Link>
            )
          ) : null}
        </div>
      </header>

      {/* Message List */}
      <div
        ref={listRef}
        className={`chat-scroll min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-3 py-3 sm:px-4 sm:py-4 ${panelTone.chatBg}`}
      >
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center px-4 py-8 select-none">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600/15 text-indigo-600 dark:text-indigo-400 mb-3 shadow-inner">
              <Bot className="h-7 w-7" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              Epic AI <Sparkles className="h-4 w-4 text-indigo-500" />
            </h3>
            <p className="mt-1 max-w-xs text-xs text-slate-500 dark:text-zinc-400">
              {user?.name ? `Welcome, ${user.name}! ` : ""}
            </p>
             <p className="mt-1 max-w-xs text-xs text-slate-500 dark:text-zinc-400">
              Explore movies, live sports, gaming zones, train travel, and your bookings.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages
              .filter(
                (message) =>
                  message.text.trim().length > 0 ||
                  (message.quickReplies && message.quickReplies.length > 0)
              )
              .map((message) => {
                const isUser = message.role === "user";
                return (
                  <div key={message.id} className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}>
                    <div className={`flex max-w-[92%] sm:max-w-[88%] flex-col ${isUser ? "items-end" : "items-start"}`}>
                      <article
                        className={`w-fit rounded-2xl px-3.5 py-2.5 text-sm leading-6 shadow-xs ${
                          isUser
                            ? `rounded-br-md ${panelTone.userBubble}`
                            : `rounded-bl-md ${panelTone.botBubble}`
                        }`}
                      >
                        <ParsedMessageContent
                          text={message.text}
                          onExploreMovies={handleExploreMovies}
                          onExploreSports={handleExploreSports}
                          onExploreTrains={handleExploreTrains}
                          onExploreGaming={handleExploreGaming}
                          onCategorySelect={(category) => sendMessage(category)}
                        />

                        {/* Quick Suggestions Chips */}
                        {!isUser && message.quickReplies?.length ? (
                          <div className="mt-3 flex flex-wrap gap-1.5 border-t border-indigo-500/15 pt-2">
                            {message.quickReplies.map((reply) => (
                              <button
                                key={`${message.id}_${reply.label}`}
                                type="button"
                                onClick={() => sendMessage(reply.label)}
                                className={`cursor-pointer rounded-full border px-3 py-1 text-xs font-medium transition ${panelTone.quick}`}
                              >
                                {reply.label}
                              </button>
                            ))}
                          </div>
                        ) : null}
                      </article>
                      <p className={`mt-1 px-1 text-[10px] ${panelTone.meta}`}>{message.time}</p>
                    </div>
                  </div>
                );
              })}

            {/* Typing/Thinking indicator */}
            {isTyping ? (
              <div className="flex justify-start">
                <div className={`inline-flex items-center gap-2 rounded-2xl rounded-bl-md px-3.5 py-2 text-xs ${panelTone.botBubble}`}>
                  <DualCircleSpinner className="h-4 w-4" />
                  <span className="text-zinc-500 dark:text-zinc-400 font-medium">Thinking...</span>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* Input Footer */}
      <footer
        className={`sticky bottom-0 z-20 shrink-0 border-t px-3 pt-2.5 pb-[calc(env(safe-area-inset-bottom)+0.65rem)] sm:px-4 ${panelTone.footer}`}
      >
        <form onSubmit={onSubmit} className={`flex items-center gap-2 rounded-xl px-2 py-1.5 shadow-md ${panelTone.input}`}>
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            disabled={isStreaming}
            placeholder={
              isStreaming ? "Epic AI is replying..." : "Ask anything (e.g. upcoming movies, my tickets)..."
            }
            className="hero-search-input min-w-0 flex-1 rounded-xl bg-transparent px-2 py-1.5 text-sm outline-none disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={!input.trim() || isStreaming}
            className="inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-indigo-600 text-white transition hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
            aria-label="Send message"
          >
            <SendHorizontal className="h-4 w-4" />
          </button>
        </form>
      </footer>
    </section>
  );
}
