import { cinemas } from "@/app/movies/[id]/components/Cinemas";
import { BOOKING_STATUS, BookingStatus, SHOW_TYPE } from "@/constants/Constants";
import { useThemeStore } from "@/store/themeStore";
import { Booking } from "@/types/Booking";
import { Calendar, CheckCircle2, Clock3, Eye, MapPin, PenSquare, Ticket } from "lucide-react";
import Link from "next/link";
import { useState, type ComponentType } from "react";
import ReviewModal from "./ReviewModal";

interface BookingCardProps {
  type: string;
  booking: Booking;
  title: string;
  posterUrl?: string;
}

type VisualBookingStatus = BookingStatus | "upcoming";

const statusStyles: Record<VisualBookingStatus, string> = {
  upcoming:
    "border-emerald-400 bg-emerald-600 text-white dark:border-emerald-300 dark:bg-emerald-500 dark:text-white",
  pending:
    "border-yellow-300 bg-yellow-400 text-yellow-950 dark:border-yellow-200 dark:bg-yellow-300 dark:text-yellow-950",
  paid:
    "border-emerald-400 bg-emerald-600 text-white dark:border-emerald-300 dark:bg-emerald-500 dark:text-white",
  failed:
    "border-red-400 bg-red-600 text-white dark:border-red-300 dark:bg-red-500 dark:text-white",
  cancelled:
    "border-red-400 bg-red-600 text-white dark:border-red-300 dark:bg-red-500 dark:text-white",
  refunded:
    "border-yellow-300 bg-yellow-400 text-yellow-950 dark:border-yellow-200 dark:bg-yellow-300 dark:text-yellow-950",
  expired:
    "border-slate-400 bg-slate-700 text-white dark:border-slate-300 dark:bg-slate-600 dark:text-white",
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
  type,
  booking,
  title,
}: BookingCardProps) {
  const mode = useThemeStore((state) => state.mode);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [hasSubmittedReview, setHasSubmittedReview] = useState(Boolean(booking.reviewSubmitted));
  const dark = mode === "dark";
  const seatCount = booking.seatIds.length;
  const visualStatus: VisualBookingStatus = getVisualStatus(booking);
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

  const cardSurface = dark
    ? "border-white/10 bg-[#101014] shadow-[0_14px_28px_rgba(0,0,0,0.16)]"
    : "border-slate-200/80 bg-white shadow-[0_14px_28px_rgba(15,23,42,0.06)]";
  const subtleText = dark ? "text-zinc-400" : "text-slate-500";
  const primaryText = dark ? "text-zinc-50" : "text-slate-900";
  const isMovieBooking = booking.showType === SHOW_TYPE.MOVIE;
  const canWriteReview = isMovieBooking && Boolean(booking.canReview) && !hasSubmittedReview;
  const showReviewedState = isMovieBooking && hasSubmittedReview;

  return (
    <>
      <article
        className={`group relative isolate h-full overflow-hidden rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(15,23,42,0.08)] select-none ${cardSurface}`}
      >
        <div className="relative flex h-full flex-col gap-4 p-4 rounded-2xl border border-gray-200">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className={`line-clamp-2 text-base font-semibold tracking-tight ${primaryText}`}>
                {title}
              </h3>
              <div className={`mt-1.5 flex items-center gap-1.5 text-xs ${subtleText}`}>
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <p className="line-clamp-1">{cinemaName}</p>
              </div>
            </div>

            <span
              className={`shrink-0 rounded-full border px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wide ${statusStyles[visualStatus]}`}
            >
              {statusLabel}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <MetaPill dark={dark} label="Seats" value={seatSummary} icon={Ticket} />
            <MetaPill dark={dark} label="Date" value={booking.showTime ? formatCreatedAt(booking.showTime) : "Recently"} icon={Calendar} />
            <MetaPill dark={dark} label="Time" value={booking.slot} icon={Clock3} />
          </div>

          <div className={`flex items-center justify-between gap-3 border-t pt-3 ${dark ? "border-white/10" : "border-slate-200"}`}>
            <div className="flex items-center gap-2 text-md">
              {/* <span className={`text-[10px] font-semibold uppercase tracking-[0.14em] ${subtleText}`}>
                Total
              </span> */}
              <span className={`text-md font-semibold ${primaryText}`}>
                {amountLabel}
              </span>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap justify-end">
              {canWriteReview ? (
                <button
                  type="button"
                  onClick={() => setReviewModalOpen(true)}
                  className={`inline-flex cursor-pointer items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-semibold transition ${
                    dark
                      ? "border-amber-300/30 bg-amber-400/15 text-amber-200 hover:bg-amber-400/20"
                      : "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
                  }`}
                >
                  <PenSquare className="h-3 w-3" />
                  Review
                </button>
              ) : null}

              {showReviewedState ? (
                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-semibold ${
                    dark
                      ? "border-emerald-400/30 bg-emerald-500/15 text-emerald-200"
                      : "border-emerald-200 bg-emerald-50 text-emerald-700"
                  }`}
                >
                  <CheckCircle2 className="h-3 w-3" />
                  Done
                </span>
              ) : null}

              <Link
                href={`/profile/bookings/${type}/ticket/${booking._id}`}
                className={`inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-lg px-3 text-xs font-semibold transition ${
                  dark
                    ? "bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
                    : "bg-slate-950 text-white hover:bg-black"
                }`}
              >
                <Eye className="h-3.5 w-3.5" />
                View
              </Link>
            </div>
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

function getVisualStatus(booking: Booking): VisualBookingStatus {
  if (booking.showType === SHOW_TYPE.TRAIN && booking.status === BOOKING_STATUS.PAID) {
    return isTrainDeparturePast(booking.date, booking.slot) ? BOOKING_STATUS.EXPIRED : "upcoming";
  }

  return booking.status === BOOKING_STATUS.UPCOMING ? "upcoming" : booking.status;
}

function isTrainDeparturePast(dateValue?: string, timeValue?: string) {
  const departure = parseTrainDateTime(dateValue, timeValue);
  return departure ? departure.getTime() < Date.now() : false;
}

function parseTrainDateTime(dateValue?: string, timeValue?: string) {
  if (!dateValue || !timeValue || timeValue === "-") return null;

  const dateMatch = String(dateValue).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!dateMatch) return null;

  const time = String(timeValue).trim();
  const timeMatch = time.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?$/i);
  if (!timeMatch) return null;

  let hours = Number(timeMatch[1]);
  const minutes = Number(timeMatch[2] || 0);
  const meridiem = timeMatch[3]?.toUpperCase();

  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return null;
  if (meridiem === "PM" && hours < 12) hours += 12;
  if (meridiem === "AM" && hours === 12) hours = 0;

  return new Date(
    Number(dateMatch[1]),
    Number(dateMatch[2]) - 1,
    Number(dateMatch[3]),
    hours,
    minutes
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
      className={`rounded-lg px-2.5 py-2 ${
        dark ? "bg-white/[0.02]" : "bg-slate-50/80"
      }`}
    >
      <div
        className={`inline-flex items-center gap-1 text-[9px] font-semibold uppercase tracking-[0.12em] ${
          dark ? "text-zinc-400" : "text-slate-500"
        }`}
      >
        <Icon className="h-3 w-3" />
        {label}
      </div>
      <p className={`mt-1 line-clamp-1 text-xs font-semibold ${dark ? "text-zinc-100" : "text-slate-900"}`}>
        {value}
      </p>
    </div>
  );
}
