"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Calendar, Clock, MapPin, Ticket } from "lucide-react";
import ReviewLayout from "@/components/checkout/ReviewLayout";
import { useSportBookingStore } from "@/store/sportBookingStore";
import { useThemeStore } from "@/store/themeStore";
import { usePaymentStore } from "@/store/paymentStore";
import { toSportBookingItem, type SportMatch } from "@/app/sports/data";
import { fetchSportById } from "@/lib/sportsApi";
import { toast } from "@/lib/toast";

export default function SportsReviewPage() {
  const { id } = useParams();
  const router = useRouter();
  const mode = useThemeStore((s) => s.mode);
  const dark = mode === "dark";

  const {
    item,
    seats,
    totalPrice,
    venue,
    venueId,
    date,
    slot,
    setItem,
    setShow,
  } = useSportBookingStore();

  const setPaymentData = usePaymentStore((s) => s.setPaymentData);

  const [match, setMatch] = useState<SportMatch | null>(null);
  const [matchError, setMatchError] = useState<string | null>(null);
  const [matchLoading, setMatchLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setMatchLoading(true);
    fetchSportById(String(id))
      .then((data) => {
        if (!active) return;
        setMatch(data);
        setMatchError(null);
      })
      .catch((err) => {
        if (!active) return;
        setMatch(null);
        setMatchError(err instanceof Error ? err.message : "Failed to load match");
      })
      .finally(() => {
        if (!active) return;
        setMatchLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id]);

  useEffect(() => {
    if (!match) return;
    if (!item || item._id !== match._id) {
      setItem("sport", toSportBookingItem(match));
    }
    if (!venueId || !date || !slot) {
      setShow(match.venueId, match.venue, match.date, match.time);
    }
  }, [match, item, venueId, date, slot, setItem, setShow]);

  const seatIds = seats.map((seat) => seat.id);
  const payableAmount = totalPrice;

  const handleProceed = () => {
    if (seatIds.length === 0) {
      toast.warning("Select seats before proceeding to payment.");
      router.replace(`/sports/${id}/seat-layout`);
      return;
    }

    setPaymentData(payableAmount, seatIds);
    router.push(`/sports/${id}/payment`);
  };

  if (!match) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">
          {matchLoading ? "Loading match..." : matchError || "Match not found"}
        </p>
      </div>
    );
  }

  const leftContent = (
    <div className="space-y-4">
      <div
        className={`rounded-3xl border p-6 sm:p-6 ${dark ? "border-zinc-800 bg-zinc-900" : "border-slate-200 bg-white"}`}
      >
        <div className="flex items-center gap-2">
          <Ticket className="h-4 w-4 text-indigo-500" />
          <h3 className={`text-base font-semibold ${dark ? "text-zinc-100" : "text-slate-900"}`}>
            Match Details
          </h3>
        </div>
        <p className={`mt-3 text-lg font-semibold ${dark ? "text-zinc-100" : "text-slate-900"}`}>
          {item?.name || "Sport match"}
        </p>
        <div className={`mt-3 space-y-2 text-sm ${dark ? "text-zinc-300" : "text-slate-600"}`}>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{date || "-"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{slot || "-"}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{venue || "Stadium"}</span>
          </div>
        </div>
      </div>

      <div
        className={`rounded-3xl border p-6 sm:p-6 ${dark ? "border-zinc-800 bg-zinc-900" : "border-slate-200 bg-white"}`}
      >
        <div className="flex items-center justify-between">
          <h3 className={`text-base font-semibold ${dark ? "text-zinc-100" : "text-slate-900"}`}>
            Selected Seats
          </h3>
          <span className={`text-sm ${dark ? "text-zinc-400" : "text-slate-500"}`}>
            {seatIds.length} seat(s)
          </span>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {seatIds.length === 0 ? (
            <span className={`text-sm ${dark ? "text-zinc-400" : "text-slate-500"}`}>
              No seats selected yet.
            </span>
          ) : (
            seatIds.map((seatId) => (
              <span
                key={seatId}
                className={`rounded-full px-3 py-1 text-xs font-medium ${dark ? "bg-zinc-800 text-zinc-200" : "bg-slate-100 text-slate-700"}`}
              >
                {seatId}
              </span>
            ))
          )}
        </div>
      </div>
    </div>
  );

  return (
    <ReviewLayout
      backUrl={`/sports/${id}/seat-layout`}
      navTitle="Review Booking"
      title="Review Your Booking"
      subtitle="Confirm your match details and proceed to payment."
      badgeText="Secure Booking Summary"
      payableAmount={payableAmount}
      summaryItems={[
        { label: "Match", value: item?.name || "Sport match" },
        { label: "Venue", value: venue || "Stadium" },
        { label: "Date", value: date || "-" },
        { label: "Time", value: slot || "-" },
        { label: "Seats", value: seatIds.join(", ") || "-" },
      ]}
      pricingItems={[
        {
          label: `Tickets (${seatIds.length})`,
          value: `₹${totalPrice}`,
        },
      ]}
      totalLabel="Total Payable"
      totalValue={`₹${payableAmount}`}
      secureNoteTitle="Secure checkout"
      secureNoteText="Payment is encrypted and processed securely."
      actionLabel="Proceed to Payment"
      actionDisabled={seatIds.length === 0}
      onAction={handleProceed}
      leftContent={leftContent}
    />
  );
}
