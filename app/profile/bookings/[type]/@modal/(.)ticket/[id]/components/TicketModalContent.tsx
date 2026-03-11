"use client";

import { useEffect, useState } from "react";
import TicketFooter from "./TicketFooter";
import { apiFetch } from "@/lib/api";
import { TicketHeader } from "./TicketHeader";
import { BookingDetails } from "./BookingDetails";
import TicketModalSkeleton from "./skeleton/TicketModalSkeleton";
import { PaymentCard } from "./PaymentDetails";
import RefundDetails from "./RefundDetails";
import type { Booking } from "@/types/Booking";
import type { Payment } from "@/types/Payment";

type ITicketModalContentProps = {
  id: string;
  type: string;
  closeHref: string;
};

export default function TicketModalContent({
  id,
  type,
  closeHref,
}: ITicketModalContentProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{ booking: Booking; payment: Payment | null } | null>(null);
  const [show, setShow] = useState<{ name: string; imageUrl?: string } | null>(null);

  useEffect(() => {
    let active = true;

    const loadTicketData = async () => {
      try {
        setLoading(true);
        setError(null);

        const bookingData = (await apiFetch(`/booking/${id}`)) as {
          booking: Booking;
          payment: Payment | null;
        };

        if (!active) return;

        const showData = (await apiFetch(`/${type}/${bookingData.booking.itemId}`)) as {
          name: string;
          imageUrl?: string;
        };

        if (!active) return;

        setData(bookingData);
        setShow(showData);
      } catch (err: unknown) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Failed to load ticket");
      } finally {
        if (active) setLoading(false);
      }
    };

    loadTicketData();

    return () => {
      active = false;
    };
  }, [id, type]);

  if (loading) {
    return <TicketModalSkeleton />;
  }

  if (error || !data || !show) {
    return (
      <div className="mx-auto flex w-full items-center justify-center p-4 sm:max-w-3xl">
        <div className="w-full rounded-2xl border border-gray-200 bg-white p-4 shadow-lg sm:p-5">
          <h3 className="text-base font-semibold text-gray-900">Unable to load ticket</h3>
          <p className="mt-1.5 text-sm text-gray-600">{error || "Something went wrong."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative mx-auto flex h-auto w-full max-h-[94dvh] select-none flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl sm:rounded-3xl">
      <TicketHeader id={id} name={show.name} closeHref={closeHref} status={data.booking.status} />

      <div className="flex-1 overflow-y-auto bg-gray-50/70 p-2.5 sm:p-3 md:p-4">
        <div className="grid h-full grid-cols-1 gap-2.5 sm:gap-3 xl:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm sm:p-4">
            <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">
              Booking Details
            </h3>
            <BookingDetails booking={data.booking} />
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm sm:p-4">
            <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">
              Payment Details
            </h3>
            <PaymentCard payment={data.payment} />
          </div>

          <RefundDetails />
        </div>
      </div>

      <div className="border-t border-gray-200 bg-white p-2.5 sm:p-3 md:p-4">
        <TicketFooter
          showName={show.name}
          bookingId={id}
          bookingStatus={data.booking.status}
          movieId={data.booking.itemId}
          cinemaId={data.booking.cinemaId}
          date={data.booking.date}
          slot={data.booking.slot}
          seatIds={data.booking.seatIds}
          amount={data.booking.amount}
          posterUrl={show.imageUrl}
        />
      </div>
    </div>
  );
}
