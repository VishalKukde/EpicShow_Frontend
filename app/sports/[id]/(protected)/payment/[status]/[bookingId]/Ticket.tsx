"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { Home, Ticket as TicketIcon } from "lucide-react";
import CopyButton from "@/app/movies/[id]/(protected)/payment/components/CopyButton";
import DownloadTicketButton from "@/app/movies/[id]/(protected)/payment/components/DownloadTicketButton";
import { useBookingStore } from "@/store/bookingStore";
import { usePaymentStore } from "@/store/paymentStore";

interface Props {
  id: string;
  status: string;
  bookingId: string;
}

export default function Ticket({ id, status, bookingId }: Props) {
  void id;
  const storedTicket = usePaymentStore((state) => state.mockTicket);
  const ticket =
    storedTicket && storedTicket.bookingId === bookingId ? storedTicket : null;
  useEffect(() => {
    useBookingStore.getState().resetBooking();
  }, []);

  const themeMap = {
    success: {
      bg: "bg-emerald-100",
      text: "text-emerald-600",
      title: "Booking Confirmed",
      message: "Your ticket has been successfully booked",
    },
    failed: {
      bg: "bg-rose-100",
      text: "text-rose-600",
      title: "Payment Failed",
      message: "Your payment was not successful",
    },
  } as const;

  const resolvedStatus = (ticket?.status || status) as keyof typeof themeMap;
  const theme = themeMap[resolvedStatus];

  if (!theme) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Invalid payment status
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm">
          <TicketIcon className="mx-auto h-10 w-10 text-gray-400" />
          <h2 className="mt-3 text-lg font-semibold text-gray-900">Ticket not available</h2>
          <p className="mt-2 text-sm text-gray-600">
            This mock ticket is no longer available. Please start a new booking.
          </p>
          <Link
            href="/sports"
            className="mt-4 inline-flex items-center justify-center rounded-xl border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-100"
          >
            Back to Sports
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background flex items-center justify-center px-4 overflow-hidden select-none">
      <div className="w-full max-w-4xl relative">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg relative overflow-hidden">
          <div className="absolute top-1/2 -left-4 transform -translate-y-1/2 w-8 h-8 bg-background rounded-full" />
          <div className="absolute top-1/2 -right-4 transform -translate-y-1/2 w-8 h-8 bg-background rounded-full" />

          <div className="p-6 border-b border-dashed">
            <div className="flex items-center gap-4">
              <AnimatedCheck status={resolvedStatus} />
              <div>
                <h1 className="text-xl font-bold">{theme.title}</h1>
                <p className="text-gray-500 text-sm">{theme.message}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 p-6 text-sm md:grid-cols-2">
            <div className="space-y-2">
              <SectionTitle title="Booking" />
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Booking ID</span>
                <div className="flex items-center font-medium text-gray-900">
                  {bookingId}
                  <CopyButton value={bookingId} />
                </div>
              </div>
              <Row label="Match" value={ticket.matchTitle} />
              <Row label="Stadium" value={ticket.venue} />
              <Row label="Date" value={ticket.date} />
              <Row label="Time" value={ticket.slot} />
              <Row label="Seats" value={ticket.seatIds.join(", ")} />
              <div className="pt-2 border-t flex justify-between font-semibold">
                <span>Total</span>
                <span>₹{ticket.amount}</span>
              </div>
            </div>

            <div className="space-y-2">
              <SectionTitle title="Payment" />
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Payment ID</span>
                <div className="flex items-center font-medium text-gray-900">
                  {ticket.paymentId || "—"}
                  {ticket.paymentId ? <CopyButton value={ticket.paymentId} /> : null}
                </div>
              </div>
              <Row label="Method" value={formatMethod(ticket.method)} />
              <Row
                label="Status"
                value={
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${resolvedStatus === "success"
                      ? "bg-emerald-50 text-emerald-600 ring-emerald-200"
                      : "bg-rose-50 text-rose-600 ring-rose-200"
                    }`}
                  >
                    {capitalize(resolvedStatus)}
                  </span>
                }
              />
              <Row
                label="Transaction"
                value={new Date(ticket.createdAt).toLocaleString()}
              />
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-end gap-3 sm:gap-4">
          <DownloadTicketButton
            booking={{ _id: bookingId }}
            payment={{ paymentId: ticket.paymentId }}
          />
          <Link
            href="/sports"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border border-gray-300 text-gray-900 text-sm font-semibold hover:bg-gray-100 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
          >
            <Home size={16} strokeWidth={2} />
            Back to Sports
          </Link>
        </div>
      </div>
    </div>
  );
}

const Row = ({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) => (
  <div className="flex justify-between text-gray-700">
    <span>{label}</span>
    <span className="font-medium text-gray-900 text-right">{value}</span>
  </div>
);

const SectionTitle = ({ title }: { title: string }) => (
  <div className="text-xs uppercase tracking-wide text-gray-400 pb-2">
    {title}
  </div>
);

const formatMethod = (method?: string) => {
  if (!method) return "—";

  const map: Record<string, string> = {
    upi: "UPI",
    card: "Card",
    netbanking: "Net Banking",
    wallet: "Wallet",
  };

  return map[method] || method;
};

const capitalize = (value?: string) =>
  value ? value.charAt(0).toUpperCase() + value.slice(1) : "—";

const AnimatedCheck = ({ status }: { status: "success" | "failed" }) => {
  const color = status === "success" ? "text-emerald-500" : "text-rose-500";

  return (
    <svg className={`w-14 h-14 ${color}`} viewBox="0 0 52 52">
      <circle
        className="animated-circle"
        cx="26"
        cy="26"
        r="25"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />

      {status === "success" && (
        <path
          className="animated-path"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          d="M14 27l7 7 16-16"
        />
      )}

      {status === "failed" && (
        <path
          className="animated-path"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          d="M16 16 36 36 M36 16 16 36"
        />
      )}
    </svg>
  );
};
