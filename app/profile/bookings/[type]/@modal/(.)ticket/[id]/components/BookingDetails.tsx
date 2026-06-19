import { cinemas } from "@/app/movies/[id]/components/Cinemas";
import { BadgeCheck, Calendar, Clock3, Hash, IndianRupee, MapPin, Ticket, TrainFront } from "lucide-react";
import type { ComponentType } from "react";
import type { Booking } from "@/types/Booking";
import { SHOW_TYPE } from "@/constants/Constants";

type IBookingDetailsProps ={
  booking: Booking
}
export function BookingDetails({booking }:IBookingDetailsProps) {
  const isTrain = booking.showType === SHOW_TYPE.TRAIN;
  const cinemaName =
    booking.showType === "movie"
      ? cinemas.find((c) => c.id === booking.cinemaId)?.name || "Unknown cinema"
      : booking.cinemaId || "Venue";
  const seatCount = booking.seatIds.length;

  if (isTrain) {
    const trainTitle = booking.trainName
      ? `${booking.trainName}${booking.trainNumber ? ` #${booking.trainNumber}` : ""}`
      : booking.trainNumber
        ? `Train #${booking.trainNumber}`
        : "Train booking";

    return (
      <div className="grid grid-cols-1 gap-2.5">
        <div className="rounded-2xl border border-cyan-100 bg-gradient-to-br from-cyan-50 to-blue-50 p-3.5">
          <p className="mb-1 inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-cyan-700 sm:text-[11px]">
            <BadgeCheck className="h-3.5 w-3.5" />
            PNR Number
          </p>
          <p className="break-words font-mono text-lg font-black tracking-wide text-slate-950 sm:text-xl">
            {booking.pnr || "N/A"}
          </p>
        </div>

        <Detail label="Train" value={trainTitle} icon={TrainFront} />
        <Detail label="Route" value={booking.cinemaId} icon={MapPin} />

        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          <Detail label="Journey Date" value={booking.date} icon={Calendar} />
          <Detail label="Departure" value={booking.slot} icon={Clock3} />
          <Detail label="Arrival" value={booking.arrivalTime || "N/A"} icon={Clock3} />
          <Detail label="Train Number" value={booking.trainNumber || "N/A"} icon={Hash} />
        </div>

        <Detail
          label="Seats"
          value={`${seatCount} (${booking.seatIds?.join(", ")})`}
          icon={Ticket}
        />
        <Detail
          label="Fare"
          value={`Rs.${Number(booking.amount || 0).toFixed(2)}`}
          icon={IndianRupee}
        />
      </div>
    );
  }

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
