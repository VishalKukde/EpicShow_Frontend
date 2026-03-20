import { cinemas } from "@/app/movies/[id]/components/Cinemas";
import { BOOKING_STATUS, BookingStatus, SHOW_TYPE } from "@/constants/Constants";
import { useThemeStore } from "@/store/themeStore";
import { Booking } from "@/types/Booking";
import { Calendar, Ticket, MapPin, Eye, Clock3 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { ComponentType } from "react";

interface BookingCardProps {
  booking: Booking;
  title: string;
  posterUrl?: string;
}

const statusStyles: Record<BookingStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  paid: "bg-emerald-100 text-emerald-800 border-emerald-200",
  failed: "bg-rose-100 text-rose-800 border-rose-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
  refunded: "bg-blue-100 text-blue-800 border-blue-200",
  expired: "bg-gray-100 text-gray-700 border-gray-200",
};

const TEAM_THEMES: Array<{ aliases: string[]; color: string }> = [
  { aliases: ["csk", "chennai super kings"], color: "#F9D423" },
  { aliases: ["mi", "mumbai indians"], color: "#004BA0" },
  { aliases: ["rcb", "royal challengers bengaluru", "royal challengers bangalore"], color: "#D71920" },
  { aliases: ["kkr", "kolkata knight riders"], color: "#3A225D" },
  { aliases: ["srh", "sunrisers hyderabad"], color: "#F15A29" },
  { aliases: ["rr", "rajasthan royals"], color: "#E91E63" },
  { aliases: ["pbks", "punjab kings", "kings xi punjab", "kxip"], color: "#C8102E" },
  { aliases: ["dc", "delhi capitals", "delhi daredevils"], color: "#17479E" },
  { aliases: ["gt", "gujarat titans"], color: "#0B1C3D" },
  { aliases: ["lsg", "lucknow super giants"], color: "#00A3A3" },
];

const FALLBACK_COLORS = ["#1E293B", "#0F172A", "#334155", "#111827"];

const normalizeTeamName = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

const matchesAlias = (normalized: string, alias: string) => {
  if (alias.length <= 3) {
    return normalized.split(" ").includes(alias);
  }
  return normalized.includes(alias);
};

const hashString = (value: string) => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) % 2147483647;
  }
  return hash;
};

const getTeamColor = (teamName: string) => {
  const normalized = normalizeTeamName(teamName);
  const found = TEAM_THEMES.find((theme) =>
    theme.aliases.some((alias) => matchesAlias(normalized, alias))
  );
  if (found) return found.color;
  const fallback = FALLBACK_COLORS[hashString(normalized) % FALLBACK_COLORS.length];
  return fallback;
};

const parseTeams = (name: string) => {
  const parts = name
    .split(/\s+vs\.?\s+|\s+v\/s\.?\s+|\s+v\s+/i)
    .map((part) => part.trim())
    .filter(Boolean);
  if (parts.length >= 2) {
    return { teamA: parts[0], teamB: parts.slice(1).join(" ") };
  }
  return { teamA: name, teamB: "" };
};

export default function BookingCard({
  booking,
  title,
  posterUrl,
}: BookingCardProps) {
  const params = useParams();
  const mode = useThemeStore((s) => s.mode);
  const type = params.type as string;
  const seatCount = booking.seatIds.length;
  const dark = mode === "dark";
  const isSport = booking.showType === SHOW_TYPE.SPORT;
  const { teamA, teamB } = parseTeams(title);
  const teamAColor = getTeamColor(teamA);
  const teamBColor = getTeamColor(teamB || teamA);
  const showSportGradient = isSport;
  const gradientStyle = {
    background: `linear-gradient(180deg, ${teamAColor} 0%, ${teamBColor} 100%)`,
  };

  const cinemaName =
    booking.showType === "movie"
      ? cinemas.find((c) => c.id === booking.cinemaId)?.name || "Unknown cinema"
      : booking.cinemaId || "Venue";

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-[rgb(255,255,255)] shadow-sm transition-shadow duration-300 hover:shadow-xl select-none dark:border-zinc-700 dark:bg-[#18181b] sm:rounded-3xl">
      <div className={`relative h-40 w-full shrink-0 ${showSportGradient ? "overflow-hidden" : "bg-gray-100"} sm:h-48`}>
        {showSportGradient ? (
          <>
            <div className="absolute inset-0" style={gradientStyle} />
            <div className="absolute inset-0 bg-black/25" />
            <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
              <p className="line-clamp-1 text-sm font-semibold text-white sm:text-base">{teamA}</p>
              {teamB ? (
                <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.35em] text-white/80">
                  VS
                </span>
              ) : null}
              {teamB ? (
                <p className="mt-1 line-clamp-1 text-sm font-semibold text-white sm:text-base">{teamB}</p>
              ) : null}
            </div>
            <div className="absolute right-4 top-4">
              <span
                className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-wide shadow-sm ${statusStyles[booking.status]}`}
              >
                {booking.status === BOOKING_STATUS.UPCOMING
                  ? "UPCOMING"
                  : booking.status.toUpperCase()}
              </span>
            </div>
          </>
        ) : (
          <>
            {posterUrl && (
              <Image
                src={posterUrl}
                alt={title}
                fill
                className="object-cover"
              />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent" />

            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3">
              <p className="line-clamp-1 text-sm font-semibold text-white">{title}</p>
              <span
                className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-wide shadow-sm ${statusStyles[booking.status]}`}
              >
                {booking.status === BOOKING_STATUS.UPCOMING
                  ? "UPCOMING"
                  : booking.status.toUpperCase()}
              </span>
            </div>
          </>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
          <InfoBlock label="Date" value={booking.date} icon={Calendar} />
          <InfoBlock label="Time" value={booking.slot} icon={Clock3} />
          <InfoBlock
            label="Seats"
            value={`${seatCount} (${booking.seatIds.join(", ")})`}
            icon={Ticket}
          />
          <InfoBlock label="Cinema" value={cinemaName} icon={MapPin} />
        </div>

        <div className="mt-3 rounded-xl border border-gray-200 bg-gray-50/80 p-3 dark:border-zinc-700 dark:bg-zinc-900 sm:mt-4 sm:rounded-2xl sm:p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">
            Total Paid
          </p>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
            <p className="w-full text-xl font-semibold text-gray-900 dark:text-zinc-100 sm:text-2xl">
              ₹{booking.amount}
            </p>
            <Link
              href={`/profile/bookings/${type}/ticket/${booking._id}`}
              className={`inline-flex h-9 w-full items-center justify-center gap-2 rounded-lg ${dark ? "bg-gray-800" : "bg-gray-900"} px-3 text-[11px] font-semibold text-white transition hover:bg-black dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 sm:h-10 sm:w-auto sm:rounded-xl sm:px-4 sm:text-xs`}
            >
              <Eye size={16} />
              View
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

function InfoBlock({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50/80 p-2.5 dark:border-zinc-700 dark:bg-zinc-900 sm:p-3">
      <div className="mb-1 inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-zinc-400">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <p className="line-clamp-2 text-sm font-semibold text-gray-900 dark:text-zinc-100">{value}</p>
    </div>
  );
}
