import { cinemas } from "@/app/movies/[id]/components/Cinemas";
import { Calendar, Clock3, MapPin, Ticket } from "lucide-react";
import type { ComponentType } from "react";
import type { Booking } from "@/types/Booking";

type IBookingDetailsProps ={
  booking: Booking
}
export function BookingDetails({booking }:IBookingDetailsProps) {
  const cinemaName =
    booking.showType === "movie"
      ? cinemas.find((c) => c.id === booking.cinemaId)?.name || "Unknown cinema"
      : booking.cinemaId || "Venue";
  const seatCount = booking.seatIds.length;

  return (
    <div className="grid grid-cols-1 gap-2.5">
      <Detail label="Date" value={booking.date} icon={Calendar} />
      <Detail label="Time" value={booking.slot} icon={Clock3} />
      <Detail label="Cinema" value={cinemaName} icon={MapPin} />
      <Detail
        label="Seats"
        value={`${seatCount} (${booking.seatIds?.join(", ")})`}
        icon={Ticket}
      />
    </div>
  );
}

function Detail({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value?: string;
  icon: ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-2.5 sm:p-3">
      <p className="mb-1 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-gray-500 sm:text-[11px]">
        <Icon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
        {label}
      </p>
      <div className="min-w-0">
        <p className="break-words text-xs font-semibold text-gray-900 sm:text-sm">{value || "—"}</p>
      </div>
    </div>
  );
}
