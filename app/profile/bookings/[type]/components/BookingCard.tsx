import { cinemas } from "@/app/movies/[id]/components/Cinemas";
import { BOOKING_STATUS, BookingStatus } from "@/constants/Constants";
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

  const cinemaName =
    cinemas.find((c) => c.id === booking.cinemaId)?.name || "Unknown cinema";

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-[rgb(255,255,255)] shadow-sm transition-shadow duration-300 hover:shadow-xl select-none dark:border-zinc-700 dark:bg-[#18181b] sm:rounded-3xl">
      <div className="relative h-40 w-full shrink-0 bg-gray-100 sm:h-48">
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
