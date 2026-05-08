import { cinemas } from "@/app/movies/[id]/components/Cinemas";
import { BOOKING_STATUS, BookingStatus, SHOW_TYPE } from "@/constants/Constants";
import { useThemeStore } from "@/store/themeStore";
import { Booking } from "@/types/Booking";
import { Calendar, CheckCircle2, Clock3, Eye, MapPin, PenSquare, Ticket } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, type ComponentType } from "react";
import ReviewModal from "./ReviewModal";

interface BookingCardProps {
  booking: Booking;
  title: string;
  posterUrl?: string;
}

type VisualBookingStatus = BookingStatus | "upcoming";

const statusStyles: Record<VisualBookingStatus, string> = {
  upcoming:
    "border-emerald-400 bg-emerald-600 text-white shadow-[0_14px_30px_rgba(5,150,105,0.32)] dark:border-emerald-300 dark:bg-emerald-500 dark:text-white dark:shadow-[0_14px_30px_rgba(16,185,129,0.26)]",
  pending:
    "border-yellow-300 bg-yellow-400 text-yellow-950 shadow-[0_14px_30px_rgba(250,204,21,0.32)] dark:border-yellow-200 dark:bg-yellow-300 dark:text-yellow-950 dark:shadow-[0_14px_30px_rgba(253,224,71,0.26)]",
  paid:
    "border-emerald-400 bg-emerald-600 text-white shadow-[0_14px_30px_rgba(5,150,105,0.32)] dark:border-emerald-300 dark:bg-emerald-500 dark:text-white dark:shadow-[0_14px_30px_rgba(16,185,129,0.26)]",
  failed:
    "border-red-400 bg-red-600 text-white shadow-[0_14px_30px_rgba(220,38,38,0.32)] dark:border-red-300 dark:bg-red-500 dark:text-white dark:shadow-[0_14px_30px_rgba(248,113,113,0.26)]",
  cancelled:
    "border-red-400 bg-red-600 text-white shadow-[0_14px_30px_rgba(220,38,38,0.32)] dark:border-red-300 dark:bg-red-500 dark:text-white dark:shadow-[0_14px_30px_rgba(248,113,113,0.26)]",
  refunded:
    "border-yellow-300 bg-yellow-400 text-yellow-950 shadow-[0_14px_30px_rgba(250,204,21,0.32)] dark:border-yellow-200 dark:bg-yellow-300 dark:text-yellow-950 dark:shadow-[0_14px_30px_rgba(253,224,71,0.26)]",
  expired:
    "border-slate-400 bg-slate-700 text-white shadow-[0_14px_30px_rgba(51,65,85,0.32)] dark:border-slate-300 dark:bg-slate-600 dark:text-white dark:shadow-[0_14px_30px_rgba(148,163,184,0.24)]",
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
  return FALLBACK_COLORS[hashString(normalized) % FALLBACK_COLORS.length];
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

const formatCreatedAt = (value: string) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "Recently";

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
};

export default function BookingCard({
  booking,
  title,
  posterUrl,
}: BookingCardProps) {
  const params = useParams();
  const mode = useThemeStore((state) => state.mode);
  const type = params.type as string;
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [hasSubmittedReview, setHasSubmittedReview] = useState(Boolean(booking.reviewSubmitted));
  const dark = mode === "dark";
  const seatCount = booking.seatIds.length;
  const isSport = booking.showType === SHOW_TYPE.SPORT;
  const visualStatus: VisualBookingStatus =
    booking.status === BOOKING_STATUS.UPCOMING ? "upcoming" : booking.status;
  const statusLabel = visualStatus.toUpperCase();
  const amountLabel = `₹${new Intl.NumberFormat("en-IN").format(booking.amount)}`;
  const compactSeatPreview =
    seatCount > 2
      ? `${booking.seatIds.slice(0, 2).join(", ")} +${seatCount - 2}`
      : booking.seatIds.join(", ");
  const seatSummary = compactSeatPreview || "No seats";
  const cinemaName =
    booking.showType === SHOW_TYPE.MOVIE
      ? cinemas.find((cinema) => cinema.id === booking.cinemaId)?.name || "Unknown cinema"
      : booking.cinemaId || "Venue";

  const { teamA, teamB } = parseTeams(title);
  const gradientStyle = {
    background: `linear-gradient(145deg, ${getTeamColor(teamA)} 0%, ${getTeamColor(teamB || teamA)} 100%)`,
  };

  const cardSurface = dark
    ? "border-white/10 bg-[#101014] shadow-[0_20px_60px_rgba(0,0,0,0.34)]"
    : "border-slate-200/80 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.10)]";
  const subtleText = dark ? "text-zinc-400" : "text-slate-500";
  const primaryText = dark ? "text-zinc-50" : "text-slate-900";
  const softSurface = dark
    ? "border-white/10 bg-white/[0.05]"
    : "border-slate-200/70 bg-slate-50/90";
  const compactChip = dark
    ? "border-zinc-600/80 bg-zinc-800/90 text-zinc-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
    : "border-slate-300 bg-white text-slate-700 shadow-[0_6px_18px_rgba(15,23,42,0.06)]";
  const accentGlow = dark
    ? "bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.12),transparent_58%)]"
    : "bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.16),transparent_60%)]";
  const isMovieBooking = booking.showType === SHOW_TYPE.MOVIE;
  const canWriteReview = isMovieBooking && Boolean(booking.canReview) && !hasSubmittedReview;
  const showReviewedState = isMovieBooking && hasSubmittedReview;

  return (
    <>
      <article
        className={`group relative isolate h-full overflow-hidden rounded-[1.7rem] border transition-all duration-300  hover:shadow-[0_26px_70px_rgba(15,23,42,0.14)] select-none ${cardSurface}`}
      >
        <div className={`pointer-events-none absolute inset-0 opacity-90 ${accentGlow}`} />

        <div className="relative h-44 overflow-hidden">
          {isSport ? (
            <>
              <div className="absolute inset-0" style={gradientStyle} />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.20),transparent_46%)]" />
              <div className="absolute inset-0 bg-black/30" />

              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-5 text-center">
                <p className="line-clamp-1 text-lg font-semibold tracking-tight text-white">
                  {teamA}
                </p>
                {teamB ? (
                  <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.36em] text-white/70">
                    VS
                  </p>
                ) : null}
                {teamB ? (
                  <p className="mt-1 line-clamp-1 text-lg font-semibold tracking-tight text-white">
                    {teamB}
                  </p>
                ) : null}
              </div>
            </>
          ) : (
            <>
              {posterUrl ? (
                <Image
                  src={posterUrl}
                  alt={title}
                  fill
                  className="object-cover transition duration-600 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-slate-300 via-slate-200 to-slate-100 dark:from-zinc-800 dark:via-zinc-900 dark:to-black" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
            </>
          )}

          <div className="absolute right-3 top-3">
            <span
              className={`shrink-0 rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-wide ring-1 ring-black/10 ${statusStyles[visualStatus]}`}
            >
              {statusLabel}
            </span>
          </div>
        </div>

        <div className="relative flex flex-1 flex-col p-4">
          <div className="min-w-0">
            <h3 className={`line-clamp-2 text-lg font-semibold tracking-tight ${primaryText}`}>
              {title}
            </h3>
            <div className={`mt-2 flex items-center gap-2 text-sm ${subtleText}`}>
              <MapPin className="h-4 w-4 shrink-0" />
              <p className="line-clamp-1">{cinemaName}</p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2.5">
            <MetaPill
              dark={dark}
              label="Seats"
              value={seatSummary}
              icon={Ticket}
            />
            <MetaPill
              dark={dark}
              label="Booked"
              value={booking.showTime ? formatCreatedAt(booking.showTime) : "Recently"}
              icon={Calendar}
            />
            <MetaPill
              dark={dark}
              label="Slot"
              value={booking.slot}
              icon={Clock3}
            />
            <div className={`rounded-[1.15rem] border px-3 py-2.5 ${softSurface}`}>
              <p className={`text-[10px] font-semibold uppercase tracking-[0.16em] ${subtleText}`}>
                Ticket total
              </p>
              <p className={`mt-1 text-sm font-semibold ${primaryText}`}>
                {amountLabel}
              </p>
            </div>
          </div>

          <div className={`mt-4 flex items-center justify-between gap-3 border-t border-dashed pt-4 ${dark ? "border-white/10" : "border-slate-200/80"}`}>
            <div className="flex flex-wrap gap-2">
              <span className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-medium ${compactChip}`}>
                {seatCount} seat{seatCount === 1 ? "" : "s"}
              </span>

              {canWriteReview ? (
                <button
                  type="button"
                  onClick={() => setReviewModalOpen(true)}
                  className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold transition ${
                    dark
                      ? "border-amber-300/30 bg-amber-400/15 text-amber-200 hover:bg-amber-400/20"
                      : "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
                  }`}
                >
                  <PenSquare className="h-3.5 w-3.5" />
                  Write Review
                </button>
              ) : null}

              {showReviewedState ? (
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold ${
                    dark
                      ? "border-emerald-400/30 bg-emerald-500/15 text-emerald-200"
                      : "border-emerald-200 bg-emerald-50 text-emerald-700"
                  }`}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Review Submitted
                </span>
              ) : null}
            </div>

            <Link
              href={`/profile/bookings/${type}/ticket/${booking._id}`}
              className={`inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition ${
                dark
                  ? "bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
                  : "bg-slate-950 text-white hover:bg-black"
              }`}
            >
              <Eye className="h-4 w-4" />
              View
            </Link>
          </div>
        </div>

      </article>

      <ReviewModal
        open={reviewModalOpen}
        bookingId={booking._id}
        movieId={booking.itemId}
        movieTitle={title}
        onClose={() => setReviewModalOpen(false)}
        onSubmitted={() => {
          setHasSubmittedReview(true);
          setReviewModalOpen(false);
        }}
      />
    </>
  );
}

function MetaPill({
  dark,
  label,
  value,
  icon: Icon,
}: {
  dark: boolean;
  label: string;
  value: string;
  icon: ComponentType<{ className?: string }>;
}) {
  return (
    <div
      className={`rounded-[1.15rem] border px-3 py-2.5 ${
        dark
          ? "border-white/10 bg-white/[0.04]"
          : "border-slate-200/80 bg-slate-50/85"
      }`}
    >
      <div
        className={`inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] ${
          dark ? "text-zinc-400" : "text-slate-500"
        }`}
      >
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <p className={`mt-1.5 line-clamp-1 text-sm font-semibold ${dark ? "text-zinc-100" : "text-slate-900"}`}>
        {value}
      </p>
    </div>
  );
}
