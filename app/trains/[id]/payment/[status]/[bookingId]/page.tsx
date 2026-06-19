"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  Check,
  CheckCircle2,
  Copy,
  CreditCard,
  Home,
  RotateCcw,
  Ticket,
  TrainFront,
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import { toast } from "@/lib/toast";
import type { Booking } from "@/types/Booking";
import type { Payment } from "@/types/Payment";
import TrainLoader from "../../../../components/TrainLoader";

type TicketData = {
  booking: Booking & {
    pnr?: string;
    trainName?: string;
    trainNumber?: string;
    arrivalTime?: string;
    seatStatus?: string;
    waitlistNumbers?: number[];
  };
  payment: Payment | null;
};

export default function TrainPaymentStatusPage() {
  const params = useParams<{ id: string; status: string; bookingId: string }>();
  const { id, status, bookingId } = params;
  const [data, setData] = useState<TicketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadBooking = async () => {
      try {
        setLoading(true);
        setError("");
        const result = await apiFetch(`/trains/booking/${bookingId}`);
        if (active) setData(result);
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "Failed to load train payment status");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadBooking();

    return () => {
      active = false;
    };
  }, [bookingId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 pt-24">
        <TrainLoader label="Loading payment status..." />
      </div>
    );
  }

  const booking = data?.booking;
  const payment = data?.payment;
  const resolvedStatus =
    payment?.status || (booking?.status === "paid" ? "success" : booking?.status === "failed" ? "failed" : status);
  const success = resolvedStatus === "success";
  const failed = resolvedStatus === "failed";
  const tone = success
    ? {
        border: "border-emerald-100",
        panel: "from-emerald-600 to-teal-700",
        accent: "text-emerald-600",
        softText: "text-emerald-50",
        button: "bg-emerald-600 hover:bg-emerald-700",
        title: "Booking Confirmed",
        message: "Your train ticket is confirmed. Keep the PNR handy for your journey.",
        icon: CheckCircle2,
      }
    : {
        border: "border-rose-100",
        panel: "from-rose-600 to-red-700",
        accent: "text-rose-600",
        softText: "text-rose-50",
        button: "bg-rose-600 hover:bg-rose-700",
        title: failed ? "Payment Failed" : "Payment Status",
        message: "Your train booking payment could not be verified. The booking has been marked as failed.",
        icon: AlertCircle,
      };
  const StatusIcon = tone.icon;
  const trainLabel = booking?.trainName
    ? `${booking.trainName}${booking.trainNumber ? ` #${booking.trainNumber}` : ""}`
    : booking?.trainNumber
      ? `Train #${booking.trainNumber}`
      : "-";

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center">
        <section className={`w-full overflow-hidden rounded-2xl border ${tone.border} bg-white shadow-lg`}>
          <div className="flex flex-col md:flex-row">
            <div className={`flex min-h-56 flex-col justify-between bg-gradient-to-br ${tone.panel} p-6 text-white md:w-[34%] lg:p-8`}>
              <div>
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/25">
                  <StatusIcon className="h-8 w-8" />
                </div>
                <h1 className="mt-5 text-2xl font-bold sm:text-3xl">{tone.title}</h1>
                <p className={`mt-2 text-sm leading-6 ${tone.softText}`}>{tone.message}</p>
              </div>

              {success && booking?.pnr ? (
                <div className="mt-6 rounded-xl bg-white/10 p-3 text-sm ring-1 ring-white/20">
                  PNR Number
                  <div className="mt-1 flex items-center justify-between gap-2">
                    <p className="break-all font-semibold">{booking.pnr}</p>
                    <PnrCopyButton value={booking.pnr} />
                  </div>
                </div>
              ) : (
                <div className="mt-6 rounded-xl bg-white/10 p-3 text-sm ring-1 ring-white/20">
                  Booking ID
                  <p className="mt-1 break-all font-semibold">{bookingId}</p>
                </div>
              )}
            </div>

            <div className="flex-1 p-5 sm:p-6 lg:p-8">
              {error ? (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                  {error}
                </div>
              ) : (
                <div className="grid gap-4 lg:grid-cols-2">
                  <InfoPanel title="Train Booking" icon={TrainFront}>
                    <Detail label="Train" value={trainLabel} />
                    <Detail label="Route" value={booking?.cinemaId || "-"} />
                    <Detail label="Journey Date" value={booking?.date || "-"} />
                    <Detail label="Departure" value={booking?.slot || "-"} />
                    <Detail label="Arrival" value={booking?.arrivalTime || "-"} />
                    <Detail
                      label="Seat Status"
                      value={formatSeatStatus(booking?.seatStatus, booking?.waitlistNumbers)}
                    />
                    <Detail label="Seats" value={booking?.seatIds?.join(", ") || "-"} />
                    <Detail
                      label="PNR"
                      value={
                        booking?.pnr ? (
                          <span className="inline-flex items-center justify-end gap-2">
                            <span className="break-all">{booking.pnr}</span>
                            {success ? <InlineCopyButton value={booking.pnr} label="Copy PNR number" /> : null}
                          </span>
                        ) : (
                          "-"
                        )
                      }
                    />
                  </InfoPanel>

                  <InfoPanel title="Payment" icon={CreditCard}>
                    <Detail label="Payment ID" value={payment?.paymentId || "-"} />
                    <Detail label="Method" value={payment?.method?.toUpperCase?.() || "-"} />
                    <Detail
                      label="Status"
                      value={capitalize(payment?.status || resolvedStatus)}
                      danger={failed}
                      success={success}
                    />
                    <Detail label="Amount" value={`Rs.${Number(payment?.amount || booking?.amount || 0).toFixed(2)}`} />
                    <Detail
                      label="Updated"
                      value={
                        payment?.createdAt
                          ? new Date(payment.createdAt).toLocaleString("en-IN")
                          : "-"
                      }
                    />
                  </InfoPanel>
                </div>
              )}

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                <Link
                  href="/profile/bookings/trains"
                  className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition ${tone.button}`}
                >
                  <Ticket className="h-4 w-4" />
                  Go to Bookings
                </Link>
                {failed ? (
                  <Link
                    href={`/trains/${id}`}
                    className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition ${tone.button}`}
                  >
                    <RotateCcw className="h-4 w-4" />
                    Try Again
                  </Link>
                ) : null}
                <Link
                  href="/trains"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {success ? "Book Another Train" : "Back to Trains"}
                </Link>
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
                >
                  <Home className="h-4 w-4" />
                  Home
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function InfoPanel({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: typeof TrainFront;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
      <h2 className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-700">
        <Icon className="h-4 w-4" />
        {title}
      </h2>
      <div className="mt-4 space-y-3">{children}</div>
    </div>
  );
}

function Detail({
  label,
  value,
  danger = false,
  success = false,
}: {
  label: string;
  value: React.ReactNode;
  danger?: boolean;
  success?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-xl bg-white p-3 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      <span
        className={`break-words text-sm font-semibold sm:text-right ${
          danger ? "text-rose-600" : success ? "text-emerald-600" : "text-slate-900"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function PnrCopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success("PNR number copied.");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Unable to copy PNR right now.");
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-white px-2.5 py-1.5 text-xs font-bold text-emerald-700 transition hover:bg-emerald-50"
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function InlineCopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success("PNR number copied.");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Unable to copy PNR right now.");
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={label}
      className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
}

function capitalize(value?: string) {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : "-";
}

function formatSeatStatus(status?: string, waitlistNumbers?: number[]) {
  const label = status
    ? status.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
    : "-";

  if (!waitlistNumbers?.length) return label;
  return `${label} (${waitlistNumbers.map((number) => `WL${number}`).join(", ")})`;
}
