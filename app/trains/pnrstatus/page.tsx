"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  Calendar,
  Clock3,
  CreditCard,
  Hash,
  IndianRupee,
  MapPin,
  Search,
  Ticket,
  TrainFront,
  User,
  Users,
} from "lucide-react";
import PageTransition from "@/app/components/PageTransition";
import { apiFetch } from "@/lib/api";
import { toast } from "@/lib/toast";
import TrainLoader from "../components/TrainLoader";

type PassengerDetail = {
  name?: string;
  age?: number;
  gender?: string;
  seatNumber?: string;
};

type TrainInfo = {
  _id?: string;
  trainName?: string;
  trainNumber?: string;
  fromStation?: string;
  toStation?: string;
  departureTime?: string;
  arrivalTime?: string;
};

type TrainPnrBooking = {
  _id?: string;
  pnr?: string;
  trainId?: TrainInfo | string;
  userId?: string;
  seats?: string[];
  passengerDetails?: PassengerDetail[];
  totalPrice?: number;
  baseAmount?: number;
  taxAmount?: number;
  bookingDate?: string;
  journeyDate?: string;
  status?: string;
  seatStatus?: string;
  confirmedSeatCount?: number;
  waitlistNumbers?: number[];
  razorpayOrderId?: string | null;
  payment?: {
    transactionId?: string | null;
    amount?: number;
    method?: string;
    status?: string;
    orderId?: string;
    currency?: string;
  };
  cancellationDetails?: {
    cancelledAt?: string;
    refundAmount?: number;
    refundStatus?: string;
  };
  createdAt?: string;
  updatedAt?: string;
};

export default function PnrStatusPage() {
  const router = useRouter();
  const [pnr, setPnr] = useState("");
  const [booking, setBooking] = useState<TrainPnrBooking | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const train = useMemo(() => {
    return typeof booking?.trainId === "object" && booking.trainId ? booking.trainId : null;
  }, [booking]);

  const handleSearch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextPnr = pnr.trim().toUpperCase();

    if (!nextPnr) {
      toast.warning("Please enter a PNR number.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setBooking(null);
      const result = (await apiFetch(`/trains/booking/pnr/${encodeURIComponent(nextPnr)}`, {
        publicRequest: true,
        notifyOnError: false,
      })) as TrainPnrBooking;
      setBooking(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to find this PNR.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <main className="min-h-screen select-none bg-background px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 mt-14 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={() => router.push("/trains")}
              className="inline-flex w-fit cursor-pointer items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Trains
            </button>
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-cyan-100 bg-cyan-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-cyan-700 dark:border-cyan-900 dark:bg-cyan-950/40 dark:text-cyan-300">
              <BadgeCheck className="h-3.5 w-3.5" />
              PNR Status
            </div>
          </div>

          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_70px_-44px_rgba(15,23,42,0.7)] dark:border-slate-800 dark:bg-slate-950">
            <div className="border-b border-slate-200 bg-slate-950 p-5 text-white dark:border-slate-800 dark:bg-white dark:text-slate-950 sm:p-6">
              <h1 className="text-2xl font-black sm:text-3xl">Check Train PNR Status</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300 dark:text-slate-600">
                Enter your train booking PNR to view journey, passenger, payment, and refund details.
              </p>
            </div>

            <div className="p-4 sm:p-6">
              <form onSubmit={handleSearch} className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    value={pnr}
                    onChange={(event) => setPnr(event.target.value.toUpperCase())}
                    placeholder="Enter PNR number"
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 font-mono text-sm font-bold uppercase tracking-wide text-slate-950 outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-50 dark:focus:border-cyan-700 dark:focus:ring-cyan-950"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-2xl bg-cyan-600 px-6 text-sm font-bold text-white shadow-[0_14px_30px_rgba(8,145,178,0.28)] transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Search className="h-4 w-4" />
                  {loading ? "Searching..." : "Search PNR"}
                </button>
              </form>

              {loading ? (
                <div className="relative min-h-80">
                  <TrainLoader fullScreen={false} label="Fetching PNR details..." />
                </div>
              ) : null}

              {!loading && error ? (
                <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-700">
                  {error}
                </div>
              ) : null}

              {!loading && booking ? (
                <div className="mt-6 grid gap-4 xl:grid-cols-[1.15fr_0.9fr]">
                  <section className="space-y-4">
                    <Panel title="Journey Details" icon={TrainFront}>
                      <div className="rounded-2xl border border-cyan-100 bg-gradient-to-br from-cyan-50 to-blue-50 p-4">
                        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-700">
                          PNR Number
                        </p>
                        <p className="mt-1 break-all font-mono text-2xl font-black tracking-wide text-slate-950">
                          {booking.pnr || "-"}
                        </p>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <Detail label="Booking ID" value={booking._id} icon={Hash} />
                        <Detail label="Status" value={formatStatus(booking.status)} icon={BadgeCheck} />
                        <Detail label="Seat Status" value={formatSeatStatus(booking)} icon={Ticket} />
                        <Detail label="Train" value={formatTrainName(train)} icon={TrainFront} />
                        <Detail label="Train Number" value={train?.trainNumber} icon={Hash} />
                        <Detail label="From" value={train?.fromStation} icon={MapPin} />
                        <Detail label="To" value={train?.toStation} icon={MapPin} />
                        <Detail label="Journey Date" value={formatDate(booking.journeyDate)} icon={Calendar} />
                        <Detail label="Booking Date" value={formatDateTime(booking.bookingDate)} icon={Calendar} />
                        <Detail label="Departure" value={train?.departureTime} icon={Clock3} />
                        <Detail label="Arrival" value={train?.arrivalTime} icon={Clock3} />
                      </div>
                    </Panel>

                    <Panel title="Passenger Details" icon={Users}>
                      <div className="grid gap-3 md:grid-cols-2">
                        {(booking.passengerDetails || []).map((passenger, index) => (
                          <div
                            key={`${passenger.seatNumber || "seat"}-${index}`}
                            className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900"
                          >
                            <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-slate-500">
                              <User className="h-3.5 w-3.5" />
                              Passenger {index + 1}
                            </p>
                            <p className="mt-2 text-base font-black text-slate-950 dark:text-slate-50">
                              {passenger.name || "-"}
                            </p>
                            <div className="mt-3 grid grid-cols-3 gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                              <span>Age: {passenger.age || "-"}</span>
                              <span>Gender: {passenger.gender || "-"}</span>
                              <span>Seat: {passenger.seatNumber || "-"}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <Detail
                        label="Seats"
                        value={(booking.seats || []).join(", ") || "-"}
                        icon={Ticket}
                      />
                    </Panel>
                  </section>

                  <section className="space-y-4">
                    <Panel title="Fare & Payment" icon={CreditCard}>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <Detail label="Base Fare" value={formatMoney(booking.baseAmount)} icon={IndianRupee} />
                        <Detail label="Tax" value={formatMoney(booking.taxAmount)} icon={IndianRupee} />
                        <Detail label="Total Price" value={formatMoney(booking.totalPrice)} icon={IndianRupee} />
                        <Detail label="Payment Amount" value={formatMoney(booking.payment?.amount)} icon={IndianRupee} />
                        <Detail label="Method" value={booking.payment?.method?.toUpperCase()} icon={CreditCard} />
                        <Detail label="Payment Status" value={formatStatus(booking.payment?.status)} icon={BadgeCheck} />
                        <Detail label="Transaction ID" value={booking.payment?.transactionId || "-"} icon={Hash} />
                        <Detail label="Order ID" value={booking.payment?.orderId || booking.razorpayOrderId || "-"} icon={Hash} />
                        <Detail label="Currency" value={booking.payment?.currency || "INR"} icon={IndianRupee} />
                      </div>
                    </Panel>

                    <Panel title="Refund & Audit" icon={BadgeCheck}>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <Detail label="Refund Status" value={booking.cancellationDetails?.refundStatus || "-"} icon={BadgeCheck} />
                        <Detail label="Refund Amount" value={formatMoney(booking.cancellationDetails?.refundAmount)} icon={IndianRupee} />
                        <Detail label="Cancelled At" value={formatDateTime(booking.cancellationDetails?.cancelledAt)} icon={Calendar} />
                        <Detail label="Created At" value={formatDateTime(booking.createdAt)} icon={Calendar} />
                        <Detail label="Updated At" value={formatDateTime(booking.updatedAt)} icon={Calendar} />
                        <Detail label="User ID" value={booking.userId || "-"} icon={Hash} />
                      </div>
                    </Panel>
                  </section>
                </div>
              ) : null}
            </div>
          </section>
        </div>
      </main>
    </PageTransition>
  );
}

function Panel({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: typeof TrainFront;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <h2 className="mb-4 inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.16em] text-slate-700 dark:text-slate-200">
        <Icon className="h-4 w-4 text-cyan-600" />
        {title}
      </h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Detail({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value?: string | number | null;
  icon: typeof TrainFront;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-900">
      <p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </p>
      <p className="mt-1 break-words text-sm font-bold text-slate-950 dark:text-slate-50">
        {value || "-"}
      </p>
    </div>
  );
}

function formatTrainName(train: TrainInfo | null) {
  if (!train) return "-";
  return train.trainName
    ? `${train.trainName}${train.trainNumber ? ` #${train.trainNumber}` : ""}`
    : train.trainNumber || "-";
}

function formatStatus(value?: string | null) {
  if (!value) return "-";
  return value.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatSeatStatus(booking: TrainPnrBooking) {
  if (!booking.seatStatus) return "-";
  const label = formatStatus(booking.seatStatus);
  if (!booking.waitlistNumbers?.length) return label;
  return `${label} (${booking.waitlistNumbers.map((number) => `WL${number}`).join(", ")})`;
}

function formatDate(value?: string | null) {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatDateTime(value?: string | null) {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatMoney(value?: number | null) {
  if (typeof value !== "number") return "-";
  return `Rs.${value.toFixed(2)}`;
}
