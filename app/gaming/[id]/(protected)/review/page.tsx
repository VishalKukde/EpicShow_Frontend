"use client";

import CheckoutNavbar from "@/components/checkout/CheckoutNavbar";
import CoupenCard from "@/components/CoupenCard";
import CouponModal from "@/components/CouponModal";
import TicketCard from "@/components/TicketCard";

import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import { useGamingBookingStore } from "@/store/gamingBookingStore";
import { usePaymentStore } from "@/store/paymentStore";
import { useThemeStore } from "@/store/themeStore";
import { AnimatePresence } from "framer-motion";
import { CreditCard, ShieldCheck, Sparkles, Ticket } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const MIN_REWARD_POINTS_TO_ELIGIBLE = 150;
const REWARD_REDEEM_POINTS = 100;
const REWARD_REDEEM_DISCOUNT = 100;

const GamingReview = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [showCoupon, setShowCoupon] = useState(false);

  const bookingState = useGamingBookingStore();
  const {
    item,
    seats,
    totalPrice,
    venueId,
    venue,
    date,
    slot,
    appliedCoupon,
    redeemReward,
    removeCoupon,
    setRedeemReward,
  } = bookingState;

  const discount = appliedCoupon?.off || 0;
  const rewardDiscount = redeemReward ? REWARD_REDEEM_DISCOUNT : 0;
  const total = Math.max(totalPrice - discount - rewardDiscount, 0);
  const userRewardPoints = Number(user?.rewardPoints ?? 0);
  const canRedeemReward = userRewardPoints >= MIN_REWARD_POINTS_TO_ELIGIBLE;

  const setPaymentData = usePaymentStore((state) => state.setPaymentData);
  const setLoading = usePaymentStore((state) => state.setLoading);
  const loading = usePaymentStore((state) => state.loading);
  const error = usePaymentStore((state) => state.error);
  const setError = usePaymentStore((state) => state.setError);
  const mode = useThemeStore((s) => s.mode);

  const handleProceedToPay = async () => {
    try {
      setLoading(true);
      if (!user?.id) {
        throw new Error("Session expired. Please login again.");
      }

      const selectedSeatIds = seats.map((s) => s.id);

      const data = await apiFetch("/gaming/payment/prepare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          movieId: item?._id,
          cinemaId: venueId,
          showDate: date,
          showSlot: slot,
          seatIds: selectedSeatIds,
          coupon: appliedCoupon || null,
          redeemReward,
          showType: "gaming",
          userId: user?.id,
        }),
      });

      setPaymentData(data.finalAmount, data.verifiedSeats);
      router.push(`/gaming/${item?._id}/payment`);
    } catch (err: unknown) {
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

  return (
    <div className={`min-h-screen px-4 pb-12 pt-26 ${mode === "dark" ? "bg-zinc-950" : "bg-gradient-to-b from-slate-50 to-white"}`}>
      <CheckoutNavbar
        backUrl={`/gaming/${item?._id}`}
        title="Review Booking"
        badgeText="Secure Booking Summary"
      />
      <div className="mx-auto grid w-full max-w-5xl gap-4 lg:grid-cols-[1.25fr_0.75fr] lg:gap-5">
        <section className="space-y-4 lg:space-y-5">
          <div className={`rounded-3xl border p-5 shadow-sm sm:p-6 ${mode === "dark" ? "border-zinc-700 bg-zinc-900" : "border-slate-200 bg-white"}`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className={`text-2xl font-semibold sm:text-3xl ${mode === "dark" ? "text-zinc-100" : "text-slate-900"}`}>
                  Review Your Booking
                </h1>
                <p className={`mt-1 text-sm ${mode === "dark" ? "text-zinc-400" : "text-slate-500"}`}>
                  Verify details, apply coupon, and continue to secure payment.
                </p>
              </div>
              <div className={`rounded-2xl border px-3 py-2 text-right ${mode === "dark" ? "border-zinc-700 bg-zinc-800" : "border-indigo-200 bg-indigo-50"}`}>
                <p className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${mode === "dark" ? "text-indigo-300" : "text-indigo-700"}`}>
                  Payable
                </p>
                <p className={`mt-0.5 text-xl text-center font-bold ${mode === "dark" ? "text-white" : "text-slate-900"}`}>
                  ₹{total}
                </p>
              </div>
            </div>
          </div>

          <TicketCard
            item={item}
            date={date}
            seats={seats}
            slot={slot}
            venue={venue}
            bookingState={bookingState}
            bookingStore={useGamingBookingStore}
          />

          <CoupenCard
            setShowCoupon={(value) => {
              if (redeemReward) {
                setError("Remove reward redemption before applying a coupon.");
                return;
              }
              setError(null);
              setShowCoupon(value);
            }}
            appliedCoupon={appliedCoupon?.code || null}
          />

          <div className={`rounded-2xl border px-4 py-4 ${mode === "dark" ? "border-zinc-700 bg-zinc-900" : "border-slate-200 bg-white"}`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className={`text-sm font-semibold ${mode === "dark" ? "text-zinc-100" : "text-slate-900"}`}>
                  Reward Points
                </p>
                <p className={`mt-1 text-xs ${mode === "dark" ? "text-zinc-400" : "text-slate-600"}`}>
                  Available: {userRewardPoints.toFixed(2)} points. Redeem {REWARD_REDEEM_POINTS} points for ₹{REWARD_REDEEM_DISCOUNT} off.
                </p>
              </div>
              <button
                onClick={handleToggleRewardRedemption}
                className={`cursor-pointer rounded-full border px-3 py-1.5 text-xs font-semibold transition ${redeemReward
                    ? "border-emerald-500 bg-emerald-600 text-white hover:bg-emerald-500"
                    : mode === "dark"
                      ? "border-zinc-600 bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
                      : "border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
              >
                {redeemReward ? "Applied" : "Use Points"}
              </button>
            </div>

            {!canRedeemReward && (
              <p className={`mt-2 text-xs ${mode === "dark" ? "text-amber-300" : "text-amber-700"}`}>
                Need at least {MIN_REWARD_POINTS_TO_ELIGIBLE} points to redeem.
              </p>
            )}

            {redeemReward && (
              <p className={`mt-2 inline-flex items-center gap-1 text-xs font-medium ${mode === "dark" ? "text-emerald-300" : "text-emerald-700"}`}>
                <Sparkles className="h-3.5 w-3.5" />
                ₹{REWARD_REDEEM_DISCOUNT} discount applied via reward points.
              </p>
            )}
          </div>

          {error && (
            <div className={`rounded-2xl border px-4 py-3 text-sm ${mode === "dark" ? "border-red-700 bg-red-500/15 text-red-300" : "border-red-300 bg-red-100/70 text-red-700"}`}>
              {error}
            </div>
          )}
        </section>

        <aside className={`h-fit rounded-3xl border p-5 shadow-sm lg:sticky lg:top-26 sm:p-6 ${mode === "dark" ? "border-zinc-700 bg-zinc-900" : "border-slate-200 bg-white"}`}>
          <div className="flex items-center gap-2">
            <Ticket className="h-4 w-4 text-indigo-600" />
            <h3 className={`text-base font-semibold ${mode === "dark" ? "text-zinc-100" : "text-slate-900"}`}>
              Booking Summary
            </h3>
          </div>

          <div className="mt-4 space-y-3 text-sm">
            <div className={`flex items-center justify-between ${mode === "dark" ? "text-zinc-300" : "text-slate-600"}`}>
              <span>Tickets</span>
              <span className={`font-medium ${mode === "dark" ? "text-zinc-100" : "text-slate-900"}`}>
                ₹{totalPrice}
              </span>
            </div>
            <div className={`flex items-center justify-between ${mode === "dark" ? "text-zinc-300" : "text-slate-600"}`}>
              <span>Coupon</span>
              <span className={`font-medium ${mode === "dark" ? "text-zinc-100" : "text-slate-900"}`}>
                - ₹{discount}
              </span>
            </div>
            <div className={`flex items-center justify-between ${mode === "dark" ? "text-zinc-300" : "text-slate-600"}`}>
              <span>Reward discount</span>
              <span className={`font-medium ${mode === "dark" ? "text-zinc-100" : "text-slate-900"}`}>
                - ₹{rewardDiscount}
              </span>
            </div>
            <div className={`flex items-center justify-between text-base font-semibold ${mode === "dark" ? "text-zinc-100" : "text-slate-900"}`}>
              <span>Total</span>
              <span>₹{total}</span>
            </div>
          </div>

          <div className={`mt-4 rounded-2xl border px-3 py-2.5 text-xs ${mode === "dark" ? "border-zinc-700 bg-zinc-800 text-zinc-300" : "border-slate-200 bg-slate-50 text-slate-600"}`}>
            <div className={`flex items-center gap-2 font-medium ${mode === "dark" ? "text-zinc-200" : "text-slate-700"}`}>
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              Secure checkout
            </div>
            <p className="mt-1">Payment is encrypted and processed securely.</p>
          </div>

          <button
            className={`mt-5 w-full cursor-pointer rounded-2xl py-4 font-medium text-white shadow-lg transition disabled:cursor-not-allowed disabled:opacity-60 ${mode === "dark" ? "bg-indigo-600 hover:bg-indigo-500" : "bg-gray-900 hover:bg-gray-800"}`}
            onClick={handleProceedToPay}
            disabled={loading}
          >
            <span className="inline-flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              {loading ? "Preparing payment..." : "Proceed to Payment"}
            </span>
          </button>
        </aside>
      </div>

      <AnimatePresence>
        {showCoupon && (
          <CouponModal
            onClose={() => setShowCoupon(false)}
            onApply={(code, off) => {
              setError(null);
              removeCoupon();
              useGamingBookingStore.getState().applyCoupon({ code, off });
            }}
            onRemove={() => {
              setError(null);
              removeCoupon();
            }}
            appliedCoupon={appliedCoupon?.code || null}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default GamingReview;
