"use client";

import { useEffect, useState } from "react";
import { BadgeCheck, Calendar, Check, Clock3, Copy, Hash, IndianRupee, MapPin, Ticket } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { toast } from "@/lib/toast";
import type { Booking } from "@/types/Booking";
import type { Payment } from "@/types/Payment";
import TicketFooter from "@/app/profile/bookings/[type]/@modal/(.)ticket/[id]/components/TicketFooter";
import { TicketHeader } from "@/app/profile/bookings/[type]/@modal/(.)ticket/[id]/components/TicketHeader";
import TicketModalSkeleton from "@/app/profile/bookings/[type]/@modal/(.)ticket/[id]/components/skeleton/TicketModalSkeleton";
import { PaymentCard } from "@/app/profile/bookings/[type]/@modal/(.)ticket/[id]/components/PaymentDetails";
import RefundDetails from "@/app/profile/bookings/[type]/@modal/(.)ticket/[id]/components/RefundDetails";

type TrainTicketModalContentProps = {
  id: string;
  closeHref: string;
};

type TrainShow = {
  name: string;
  imageUrl?: string;
};

export default function TrainTicketModalContent({
  id,
  closeHref,
}: TrainTicketModalContentProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{ booking: Booking; payment: Payment | null } | null>(null);
  const [show, setShow] = useState<TrainShow | null>(null);

  useEffect(() => {
    let active = true;

    const loadTicketData = async () => {
      try {
        setLoading(true);
        setError(null);

        const bookingData = (await apiFetch(`/trains/booking/${id}`)) as {
          booking: Booking;
          payment: Payment | null;
        };

        if (!active) return;

        let trainShow: TrainShow = {
          name: resolveTrainName(bookingData.booking),
        };

        if (bookingData.booking.itemId) {
          const showData = (await apiFetch(`/trains/${bookingData.booking.itemId}`)) as {
            trainName?: string;
            trainNumber?: string;
            imageUrl?: string;
          };

          if (!active) return;

          trainShow = {
            name: showData?.trainName
              ? `${showData.trainName}${showData.trainNumber ? ` #${showData.trainNumber}` : ""}`
              : trainShow.name,
            imageUrl: showData?.imageUrl,
          };
        }

        setData(bookingData);
        setShow(trainShow);
      } catch (err: unknown) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Failed to load train ticket");
      } finally {
        if (active) setLoading(false);
      }
    };

    loadTicketData();

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return <TicketModalSkeleton />;
  }

  if (error || !data || !show) {
    return (
      <div className="mx-auto flex w-full items-center justify-center p-4 sm:max-w-3xl">
        <div className="w-full rounded-2xl border border-gray-200 bg-white p-4 shadow-lg sm:p-5">
          <h3 className="text-base font-semibold text-gray-900">Unable to load train ticket</h3>
          <p className="mt-1.5 text-sm text-gray-600">{error || "Something went wrong."}</p>
        </div>
      </div>
    );
  }

  const booking = data.booking;
  const displayStatus = getTrainDisplayStatus(booking);

  return (
    <div className="relative mx-auto flex h-auto w-full max-h-[94dvh] select-none flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl sm:rounded-3xl">
      <TicketHeader id={id} name={show.name} closeHref={closeHref} status={displayStatus} />

      <div className="flex-1 overflow-y-auto bg-gray-50/70 p-2.5 sm:p-3 md:p-4">
        <div className="grid h-full grid-cols-1 gap-3 xl:grid-cols-[1.35fr_0.9fr_0.9fr]">
          <TrainBookingDetails booking={booking} />

          <section className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm sm:p-4">
            <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">
              Payment Details
            </h3>
            <PaymentCard payment={data.payment} />
          </section>

          <RefundDetails
            status={data.payment?.status ?? null}
            amount={data.payment?.amount ?? null}
            date={data.payment?.createdAt ?? null}
          />
        </div>
      </div>

      <div className="border-t border-gray-200 bg-white p-2.5 sm:p-3 md:p-4">
        <TicketFooter
          showName={show.name}
          bookingId={id}
          bookingStatus={displayStatus}
          cancelEndpoint={`/trains/cancel/${id}`}
          cancelMethod="PUT"
          movieId={booking.itemId}
          cinemaId={booking.cinemaId}
          date={booking.date}
          slot={booking.slot}
          seatIds={booking.seatIds}
          amount={booking.amount}
          posterUrl={show.imageUrl}
        />
      </div>
    </div>
  );
}

function TrainBookingDetails({ booking }: { booking: Booking }) {
  const seatCount = booking.seatIds.length;
  const [copied, setCopied] = useState(false);
  const fullPnr = booking.pnr || "";

  const handleCopyPnr = async () => {
    if (!fullPnr) {
      toast.error("PNR is not available.");
      return;
    }

    try {
      await navigator.clipboard.writeText(fullPnr);
      setCopied(true);
      toast.success("PNR copied.");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Unable to copy PNR right now.");
    }
  };

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm sm:p-4">
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">
          Booking Details
        </h3>
      </div>
      <div className="mt-2.5 flex items-center justify-between gap-3 rounded-2xl border border-cyan-100 bg-gradient-to-br from-cyan-50 to-blue-50 p-2.5">
        <span className="inline-flex min-w-0 items-center gap-1.5 rounded-full border border-cyan-100 bg-cyan-50 px-2.5 py-1 text-[10px] font-bold text-cyan-700">
          <BadgeCheck className="h-3.5 w-3.5 shrink-0" />
          <span className="shrink-0">PNR</span>
          <span className="font-mono text-xs tracking-wide text-slate-900">{fullPnr}</span>
        </span>
        <button
          type="button"
          onClick={handleCopyPnr}
          className="inline-flex h-8 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-cyan-200 bg-white px-2.5 text-xs font-semibold text-cyan-700 transition hover:bg-cyan-50"
          aria-label="Copy full PNR"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>


      <div className="mt-2.5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        <TrainDetail label="Journey Date" value={booking.date} icon={Calendar} />
        <TrainDetail label="Departure" value={booking.slot} icon={Clock3} />
        <TrainDetail label="Arrival" value={booking.arrivalTime || "N/A"} icon={Clock3} />
        <TrainDetail label="Train Number" value={booking.trainNumber || "N/A"} icon={Hash} />
        <TrainDetail label="Route" value={booking.cinemaId} icon={MapPin} />
        <TrainDetail label="Seat Status" value={formatSeatStatus(booking)} icon={Ticket} />
        <TrainDetail
          label="Fare"
          value={`Rs.${Number(booking.amount || 0).toFixed(2)}`}
          icon={IndianRupee}
        />
      </div>

      <div className="mt-2.5 rounded-xl border border-gray-200 bg-gray-50/70 p-2.5 sm:p-3">
        <p className="mb-1 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-gray-500 sm:text-[11px]">
          <Ticket className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          Seats
        </p>
        <p className="break-words text-xs font-semibold text-gray-900 sm:text-sm">
          {seatCount} ({booking.seatIds?.join(", ") || "N/A"})
        </p>
      </div>
    </section>
  );
}

function TrainDetail({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value?: string;
  icon: typeof Calendar;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-2.5 sm:p-3">
      <p className="mb-1 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-gray-500 sm:text-[11px]">
        <Icon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
        {label}
      </p>
      <p className="break-words text-xs font-semibold text-gray-900 sm:text-sm">{value || "N/A"}</p>
    </div>
  );
}

function resolveTrainName(booking: Booking) {
  if (booking.trainName) {
    return `${booking.trainName}${booking.trainNumber ? ` #${booking.trainNumber}` : ""}`;
  }

  if (booking.trainNumber) {
    return `Train #${booking.trainNumber}`;
  }

  return "Train booking";
}

function getTrainDisplayStatus(booking: Booking) {
  if (booking.status !== "paid") return booking.status;
  return isTrainDeparturePast(booking.date, booking.slot) ? "expired" : booking.status;
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

function formatSeatStatus(booking: Booking) {
  const status = booking.seatStatus
    ? booking.seatStatus.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
    : "Confirmed";

  if (!booking.waitlistNumbers?.length) return status;
  return `${status} (${booking.waitlistNumbers.map((number) => `WL${number}`).join(", ")})`;
}
