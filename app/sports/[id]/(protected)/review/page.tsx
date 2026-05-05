"use client";

import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Calendar, Clock, MapPin, Sparkles, Ticket } from "lucide-react";
import ReviewLayout from "@/components/checkout/ReviewLayout";
import CoupenCard from "@/components/CoupenCard";
import CouponModal from "@/components/CouponModal";
import { useSportBookingStore } from "@/store/sportBookingStore";
import { useThemeStore } from "@/store/themeStore";
import { usePaymentStore } from "@/store/paymentStore";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import { toSportBookingItem, type SportMatch } from "@/app/sports/data";
import { fetchSportById } from "@/lib/sportsApi";
import { toast } from "@/lib/toast";

const MIN_REWARD_POINTS_TO_ELIGIBLE = 150;
const REWARD_REDEEM_POINTS = 100;
const REWARD_REDEEM_DISCOUNT = 100;

export default function SportsReviewPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const mode = useThemeStore((s) => s.mode);
  const dark = mode === "dark";
  const [showCoupon, setShowCoupon] = useState(false);

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
    appliedCoupon,
    redeemReward,
    removeCoupon,
    setRedeemReward,
    applyCoupon,
  } = useSportBookingStore();

  const setPaymentData = usePaymentStore((s) => s.setPaymentData);
  const setLoading = usePaymentStore((s) => s.setLoading);
  const loading = usePaymentStore((s) => s.loading);
  const error = usePaymentStore((s) => s.error);
  const setError = usePaymentStore((s) => s.setError);

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
  const discount = appliedCoupon?.off || 0;
  const rewardDiscount = redeemReward ? REWARD_REDEEM_DISCOUNT : 0;
  const total = Math.max(totalPrice - discount - rewardDiscount, 0);
  const userRewardPoints = Number(user?.rewardPoints ?? 0);
  const canRedeemReward = userRewardPoints >= MIN_REWARD_POINTS_TO_ELIGIBLE;

  const handleProceed = async () => {
    try {
      setLoading(true);

      if (!user?.id) {
        throw new Error("Session expired. Please login again.");
      }

      if (seatIds.length === 0) {
        toast.warning("Select seats before proceeding to payment.");
        router.replace(`/sports/${id}/seat-layout`);
        return;
      }

      const data = await apiFetch("/sports/payment/prepare", {
        method: "POST",
        body: JSON.stringify({
          itemId: item?._id || String(id),
          venueId,
          showDate: date,
          showSlot: slot,
          seatIds,
          amount: totalPrice,
          coupon: appliedCoupon || null,
          redeemReward,
          userId: user.id,
        }),
      });

      setPaymentData(data.finalAmount, data.verifiedSeats);
      router.push(`/sports/${id}/payment`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Payment validation failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRewardRedemption = () => {
    setError(null);

    if (redeemReward) {
      setRedeemReward(false);
      return;
    }

    if (appliedCoupon) {
      setError("Coupon and reward redemption cannot be used together.");
      return;
    }

    if (!canRedeemReward) {
      setError("At least 150 reward points are required to redeem.");
      return;
    }

    setRedeemReward(true);
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
        className={`rounded-3xl border p-6 ${
          dark ? "border-zinc-800 bg-zinc-900" : "border-slate-200 bg-white"
        }`}
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
        className={`rounded-3xl border p-6 ${
          dark ? "border-zinc-800 bg-zinc-900" : "border-slate-200 bg-white"
        }`}
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
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  dark ? "bg-zinc-800 text-zinc-200" : "bg-slate-100 text-slate-700"
                }`}
              >
                {seatId}
              </span>
            ))
          )}
        </div>
      </div>

      <CoupenCard
        setShowCoupon={(value) => {
          if (redeemReward) {
            setError("Remove reward redemption before applying a coupon.");
            return;
          }
          setError(null);
          setShowCoupon(value);
        }}
        appliedCoupon={appliedCoupon}
      />

      <div
        className={`rounded-3xl border px-4 py-4 ${
          dark ? "border-zinc-800 bg-zinc-900" : "border-slate-200 bg-white"
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className={`text-sm font-semibold ${dark ? "text-zinc-100" : "text-slate-900"}`}>
              Reward Points
            </p>
            <p className={`mt-1 text-xs ${dark ? "text-zinc-400" : "text-slate-600"}`}>
              Available: {userRewardPoints.toFixed(2)} points. Redeem {REWARD_REDEEM_POINTS}
              {" "}points for ₹{REWARD_REDEEM_DISCOUNT} off.
            </p>
          </div>
          <button
            onClick={handleToggleRewardRedemption}
            className={`cursor-pointer rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
              redeemReward
                ? "border-emerald-500 bg-emerald-600 text-white hover:bg-emerald-500"
                : dark
                  ? "border-zinc-600 bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
                  : "border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {redeemReward ? "Applied" : "Use Points"}
          </button>
        </div>

        {!canRedeemReward ? (
          <p className={`mt-2 text-xs ${dark ? "text-amber-300" : "text-amber-700"}`}>
            Need at least {MIN_REWARD_POINTS_TO_ELIGIBLE} points to redeem.
          </p>
        ) : null}

        {redeemReward ? (
          <p
            className={`mt-2 inline-flex items-center gap-1 text-xs font-medium ${
              dark ? "text-emerald-300" : "text-emerald-700"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            ₹{REWARD_REDEEM_DISCOUNT} discount applied via reward points.
          </p>
        ) : null}
      </div>
    </div>
  );

  const pricingItems = [
    {
      label: `Tickets (${seatIds.length})`,
      value: `₹${totalPrice}`,
    },
    {
      label: "Coupon",
      value: `-₹${discount}`,
      tone: "success" as const,
    },
    ...(redeemReward
      ? [
          {
            label: "Reward discount",
            value: `-₹${rewardDiscount}`,
            tone: "success" as const,
          },
        ]
      : []),
  ];

  return (
    <>
      <ReviewLayout
        backUrl={`/sports/${id}/seat-layout`}
        navTitle="Review Booking"
        title="Review Your Booking"
        subtitle="Confirm your match details, apply coupons, and proceed to payment."
        badgeText="Secure Booking Summary"
        payableAmount={total}
        summaryItems={[
          { label: "Match", value: item?.name || "Sport match" },
          { label: "Venue", value: venue || "Stadium" },
          { label: "Date", value: date || "-" },
          { label: "Time", value: slot || "-" },
          { label: "Seats", value: seatIds.join(", ") || "-" },
        ]}
        pricingItems={pricingItems}
        totalLabel="Total Payable"
        totalValue={`₹${total}`}
        secureNoteTitle="Secure checkout"
        secureNoteText="Payment is encrypted and processed securely."
        actionLabel="Proceed to Payment"
        actionLoadingLabel="Preparing payment..."
        actionDisabled={seatIds.length === 0}
        actionLoading={loading}
        onAction={handleProceed}
        error={error}
        leftContent={leftContent}
      />

      <AnimatePresence>
        {showCoupon ? (
          <CouponModal
            appliedCoupon={appliedCoupon}
            bookingType="sport"
            amount={totalPrice}
            onClose={() => setShowCoupon(false)}
            onApply={(coupon) => {
              setError(null);
              removeCoupon();
              applyCoupon(coupon);
              setShowCoupon(false);
            }}
            onRemove={() => {
              setError(null);
              removeCoupon();
            }}
          />
        ) : null}
      </AnimatePresence>
    </>
  );
}
