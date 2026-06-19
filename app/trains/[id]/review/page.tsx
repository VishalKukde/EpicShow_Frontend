"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CreditCard, ShieldCheck, Ticket, TrainFront } from "lucide-react";
import CheckoutNavbar from "@/components/checkout/CheckoutNavbar";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import { toast } from "@/lib/toast";
import { usePaymentStore } from "@/store/paymentStore";
import { useThemeStore } from "@/store/themeStore";
import type { PassengerDetail, Train } from "@/types/Train";
import TrainLoader from "../../components/TrainLoader";

type TrainBookingData = {
  trainId: string;
  seats: string[];
  passengers: PassengerDetail[];
  baseAmount?: number;
  taxAmount?: number;
  totalPrice: number;
  journeyDate: string;
};

export default function TrainReviewPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const router = useRouter();
  const { user } = useAuth();
  const mode = useThemeStore((state) => state.mode);
  const dark = mode === "dark";
  const setPaymentData = usePaymentStore((state) => state.setPaymentData);
  const setLoading = usePaymentStore((state) => state.setLoading);
  const setError = usePaymentStore((state) => state.setError);
  const loading = usePaymentStore((state) => state.loading);
  const error = usePaymentStore((state) => state.error);
  const [bookingData, setBookingData] = useState<TrainBookingData | null>(null);
  const [train, setTrain] = useState<Train | null>(null);

  const total = useMemo(() => Number(bookingData?.totalPrice || 0), [bookingData]);

  useEffect(() => {
    const raw = sessionStorage.getItem("trainBookingData");
    if (!raw) {
      toast.warning("Please complete passenger details first");
      router.replace(`/trains/${id}`);
      return;
    }

    try {
      const parsed = JSON.parse(raw) as TrainBookingData;
      if (!parsed.trainId || !parsed.seats?.length || !parsed.passengers?.length) {
        throw new Error("Invalid train booking data");
      }
      setBookingData(parsed);
    } catch {
      sessionStorage.removeItem("trainBookingData");
      toast.error("Booking session expired. Please try again.");
      router.replace(`/trains/${id}`);
    }
  }, [id, router]);

  useEffect(() => {
    const loadTrain = async () => {
      try {
        const data = await apiFetch(`/trains/${id}?date=${bookingData?.journeyDate || ""}`, { publicRequest: true });
        setTrain(data);
      } catch {
        toast.error("Failed to load train details");
      }
    };

    loadTrain();
  }, [bookingData?.journeyDate, id]);

  const handleProceedToPay = async () => {
    if (!bookingData || !train) return;

    try {
      setLoading(true);
      setError(null);

      if (!user?.id) {
        throw new Error("Session expired. Please login again.");
      }

      const data = await apiFetch("/trains/payment/prepare", {
        method: "POST",
        body: JSON.stringify({
          trainId: bookingData.trainId,
          seats: bookingData.seats,
          journeyDate: bookingData.journeyDate,
        }),
      });

      const verifiedAmount = Number(data.finalAmount || total);
      const verifiedBaseAmount = Number(data.baseAmount || train.price * bookingData.seats.length);
      const verifiedTaxAmount = Number(data.taxAmount || Math.max(verifiedAmount - verifiedBaseAmount, 0));
      setPaymentData(verifiedAmount, data.verifiedSeats || bookingData.seats);
      sessionStorage.setItem(
        "trainBookingData",
        JSON.stringify({
          ...bookingData,
          baseAmount: verifiedBaseAmount,
          taxAmount: verifiedTaxAmount,
          totalPrice: verifiedAmount,
        })
      );

      router.push(`/trains/${id}/payment`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment validation failed");
    } finally {
      setLoading(false);
    }
  };

  if (!bookingData || !train) {
    return (
      <div className={`min-h-screen pt-24 ${dark ? "bg-zinc-950" : "bg-slate-50"}`}>
        <TrainLoader label="Preparing train review..." />
      </div>
    );
  }

  return (
    <div className={`min-h-screen px-4 pb-12 pt-26 ${dark ? "bg-zinc-950" : "bg-gradient-to-b from-slate-50 to-white"} select-none`}>
      <CheckoutNavbar
        backUrl={`/trains/${id}/passenger-details?seats=${bookingData.seats.join(",")}&date=${bookingData.journeyDate}`}
        title="Review Train Booking"
        badgeText="Secure Booking Summary"
      />

      <div className="mx-auto grid w-full max-w-5xl gap-4 lg:grid-cols-[1.25fr_0.75fr] lg:gap-5">
        <section className="space-y-4 lg:space-y-5">
          <div className={`rounded-3xl border p-5 shadow-sm sm:p-6 ${dark ? "border-zinc-700 bg-zinc-900" : "border-slate-200 bg-white"}`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className={`text-2xl font-semibold sm:text-3xl ${dark ? "text-zinc-100" : "text-slate-900"}`}>
                  Review Your Train Booking
                </h1>
                <p className={`mt-1 text-sm ${dark ? "text-zinc-400" : "text-slate-500"}`}>
                  Verify route, passengers, auto-allotted seats, and continue to secure payment.
                </p>
              </div>
              <div className={`rounded-2xl border px-3 py-2 text-right ${dark ? "border-zinc-700 bg-zinc-800" : "border-cyan-200 bg-cyan-50"}`}>
                <p className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${dark ? "text-cyan-300" : "text-cyan-700"}`}>
                  Payable
                </p>
                <p className={`mt-0.5 text-xl text-center font-bold ${dark ? "text-white" : "text-slate-900"}`}>
                  Rs.{total}
                </p>
              </div>
            </div>
          </div>

          <div className={`rounded-3xl border p-5 shadow-sm sm:p-6 ${dark ? "border-zinc-700 bg-zinc-900" : "border-slate-200 bg-white"}`}>
            <div className="flex items-start gap-3">
              <TrainFront className="mt-1 h-5 w-5 text-cyan-600" />
              <div>
                <h2 className={`text-xl font-semibold ${dark ? "text-zinc-100" : "text-slate-900"}`}>
                  {train.trainName}
                </h2>
                <p className={`mt-1 text-sm ${dark ? "text-zinc-400" : "text-slate-500"}`}>
                  #{train.trainNumber} | {train.trainType}
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {[
                ["From", train.fromStation],
                ["To", train.toStation],
                ["Journey", bookingData.journeyDate],
              ].map(([label, value]) => (
                <div key={label} className={`rounded-2xl border px-4 py-3 ${dark ? "border-zinc-700 bg-zinc-800" : "border-slate-200 bg-slate-50"}`}>
                  <p className={`text-xs font-semibold uppercase ${dark ? "text-zinc-400" : "text-slate-500"}`}>{label}</p>
                  <p className={`mt-1 font-semibold ${dark ? "text-zinc-100" : "text-slate-900"}`}>{value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className={`rounded-3xl border p-5 shadow-sm sm:p-6 ${dark ? "border-zinc-700 bg-zinc-900" : "border-slate-200 bg-white"}`}>
            <h3 className={`text-base font-semibold ${dark ? "text-zinc-100" : "text-slate-900"}`}>Passengers</h3>
            <div className="mt-4 divide-y divide-slate-100">
              {bookingData.passengers.map((passenger) => (
                <div key={passenger.seatNumber} className="flex items-center justify-between gap-4 py-3">
                  <div>
                    <p className={`font-medium ${dark ? "text-zinc-100" : "text-slate-900"}`}>{passenger.name}</p>
                    <p className={`text-sm ${dark ? "text-zinc-400" : "text-slate-500"}`}>
                      {passenger.age} years | {passenger.gender}
                    </p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-sm font-semibold ${dark ? "bg-cyan-500/15 text-cyan-300" : "bg-cyan-50 text-cyan-700"}`}>
                    {passenger.seatNumber}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div className={`rounded-2xl border px-4 py-3 text-sm ${dark ? "border-red-700 bg-red-500/15 text-red-300" : "border-red-300 bg-red-100/70 text-red-700"}`}>
              {error}
            </div>
          )}
        </section>

        <aside className={`h-fit rounded-3xl border p-5 shadow-sm lg:sticky lg:top-26 sm:p-6 ${dark ? "border-zinc-700 bg-zinc-900" : "border-slate-200 bg-white"}`}>
          <div className="flex items-center gap-2">
            <Ticket className="h-4 w-4 text-cyan-600" />
            <h3 className={`text-base font-semibold ${dark ? "text-zinc-100" : "text-slate-900"}`}>
              Booking Summary
            </h3>
          </div>

          <div className="mt-4 space-y-3 text-sm">
            <SummaryRow dark={dark} label="Train" value={train.trainName} />
            <SummaryRow dark={dark} label="Passengers" value={String(bookingData.passengers.length)} />
            <SummaryRow dark={dark} label="Seats" value={bookingData.seats.join(", ")} />
            <SummaryRow dark={dark} label="Departure" value={train.departureTime} />
          </div>

          <div className={`my-4 h-px ${dark ? "bg-zinc-700" : "bg-slate-200"}`} />

          <div className="space-y-2 text-sm">
            <SummaryRow dark={dark} label="Base Fare" value={`Rs.${Number(bookingData.baseAmount || train.price * bookingData.passengers.length).toFixed(2)}`} />
            <SummaryRow dark={dark} label="Tax (18%)" value={`Rs.${Number(bookingData.taxAmount || 0).toFixed(2)}`} />
            <div className={`flex items-center justify-between text-base font-semibold ${dark ? "text-zinc-100" : "text-slate-900"}`}>
              <span>Total</span>
              <span>Rs.{total}</span>
            </div>
          </div>

          <div className={`mt-4 rounded-2xl border px-3 py-2.5 text-xs ${dark ? "border-zinc-700 bg-zinc-800 text-zinc-300" : "border-slate-200 bg-slate-50 text-slate-600"}`}>
            <div className={`flex items-center gap-2 font-medium ${dark ? "text-zinc-200" : "text-slate-700"}`}>
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              Secure Checkout
            </div>
            <p className="mt-1">Your booking details are verified before payment.</p>
          </div>

          <button
            className={`mt-5 w-full cursor-pointer rounded-2xl py-4 font-medium text-white shadow-lg transition disabled:cursor-not-allowed disabled:opacity-60 ${dark ? "bg-indigo-600 hover:bg-indigo-500" : "bg-gray-900 hover:bg-gray-800"}`}
            onClick={handleProceedToPay}
            disabled={loading}
          >
            <span className="inline-flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              {loading ? "Preparing Payment..." : `Proceed to Pay Rs.${total}`}
            </span>
          </button>
        </aside>
      </div>
    </div>
  );
}

function SummaryRow({
  dark,
  label,
  value,
}: {
  dark: boolean;
  label: string;
  value: string;
}) {
  return (
    <div className={`flex items-center justify-between gap-4 ${dark ? "text-zinc-300" : "text-slate-600"}`}>
      <span>{label}</span>
      <span className={`max-w-[62%] truncate text-right font-medium ${dark ? "text-zinc-100" : "text-slate-900"}`}>
        {value || "-"}
      </span>
    </div>
  );
}
