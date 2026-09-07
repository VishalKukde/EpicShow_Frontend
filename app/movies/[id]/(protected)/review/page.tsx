"use client";

import CheckoutNavbar from "@/components/checkout/CheckoutNavbar";
import CoupenCard from "@/components/CoupenCard";
import CouponModal from "@/components/CouponModal";
import TicketCard from "@/components/TicketCard";

import { useAuth } from "@/context/AuthContext";
// import { useSeatSession } from "@/hooks/useSeatSession";
import { apiFetch } from "@/lib/api";
import { useBookingStore } from "@/store/bookingStore";
import { usePaymentStore } from "@/store/paymentStore";
import { useThemeStore } from "@/store/themeStore";
import { AnimatePresence } from "framer-motion";
import { CreditCard, ShieldCheck, Sparkles, Ticket } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const MIN_REWARD_POINTS_TO_ELIGIBLE = 150;
const REWARD_REDEEM_POINTS = 100;
const REWARD_REDEEM_DISCOUNT = 100;

const TicketReview = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [showCoupon, setShowCoupon] = useState(false);
  // const [loading, setLoading] = useState(false);

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
    applyCoupon,
    removeCoupon,
    setRedeemReward,
  } = useBookingStore();

  const discount = appliedCoupon?.off || 0;
  const rewardDiscount = redeemReward ? REWARD_REDEEM_DISCOUNT : 0;
  const total = Math.max(totalPrice - discount - rewardDiscount, 0);
  const userRewardPoints = Number(user?.rewardPoints ?? 0);
  const canRedeemReward = userRewardPoints >= MIN_REWARD_POINTS_TO_ELIGIBLE;

  const setPaymentData = usePaymentStore(state => state.setPaymentData);
  const setLoading = usePaymentStore(state => state.setLoading);
  const loading = usePaymentStore(state => state.loading);
  const error = usePaymentStore(state => state.error);
  const setError = usePaymentStore(state => state.setError);
  const mode = useThemeStore((s) => s.mode);
  // const sessionId = useSeatSession();


  const handleProceedToPay = async () => {
    try {
      setLoading(true);
      if (!user?.id) {
        throw new Error("Session expired. Please login again.");
      }

      const selectedSeatIds = seats.map(s => s.id);

      const data = await apiFetch("/payment/prepare", {
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
          userId: user?.id
        })
      });

      // ✅ Store backend verified result
      setPaymentData(data.finalAmount, data.verifiedSeats);

      // 👉 go to payment page
      router.push(`/movies/${item?._id}/payment`)

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
    <div className={`relative min-h-screen px-4 pb-0 pt-22 transition-colors duration-300 ${mode === "dark"
      ? "bg-zinc-950 text-zinc-100 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-indigo-950/30 via-zinc-950 to-zinc-950"
      : "bg-slate-50 text-slate-900 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-indigo-50/60 via-slate-50 to-amber-50/40"
      } select-none`}>
      {/* Background Decorative Glows */}
      <div className="pointer-events-none absolute top-0 left-1/4 h-80 w-80 rounded-full bg-indigo-600/10 blur-[120px]" />
      <div className="pointer-events-none absolute top-1/3 right-1/4 h-80 w-80 rounded-full bg-amber-500/10 blur-[140px]" />

      <CheckoutNavbar
        backUrl={`/movies/${item?._id}/seat-layout`}
        title="Review Booking"
        badgeText="Secure Booking Summary"
      />

      <main className="relative mx-auto max-w-5xl">
        {/* 2-Column Aligned Card Grid */}
        <div className="grid w-full gap-5 lg:grid-cols-[1.2fr_0.8fr] items-start">
          {/* Main Content Column */}
          <section className="space-y-4 sm:space-y-3">
            {/* Review Banner Card */}
            <div className={`relative overflow-hidden rounded-2xl border p-4.5 sm:p-5 backdrop-blur-xl shadow-md transition-all ${mode === "dark"
              ? "border-zinc-800/80 bg-zinc-900/90"
              : "border-white/80 bg-white/90 shadow-[0_10px_25px_rgba(15,23,42,0.04)]"
              }`}>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className={`text-xs font-bold uppercase tracking-wider ${mode === "dark" ? "text-indigo-400" : "text-indigo-600"}`}>
                    Booking Highlights
                  </h2>
                  <p className={`mt-1 text-xs font-medium ${mode === "dark" ? "text-zinc-400" : "text-slate-500"}`}>
                    Verify ticket quantity & show details before payment.
                  </p>
                </div>
                <div className={`rounded-xl border px-3 py-1.5 text-right shrink-0 ${mode === "dark" ? "border-indigo-500/30 bg-indigo-950/40" : "border-indigo-100 bg-indigo-50/80"}`}>
                  <p className={`text-[10px] font-bold uppercase tracking-wider ${mode === "dark" ? "text-indigo-400" : "text-indigo-600"}`}>
                    Payable
                  </p>
                  <p className={`text-lg font-black ${mode === "dark" ? "text-white" : "text-slate-900"}`}>
                    ₹{total}
                  </p>
                </div>
              </div>
            </div>

            <TicketCard item={item} date={date} seats={seats} slot={slot} venue={venue} />

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

            {/* Reward Points Card */}
            <div className={`rounded-2xl border p-4.5 sm:p-5 backdrop-blur-xl shadow-md transition-all ${mode === "dark"
              ? "border-zinc-800/80 bg-zinc-900/90"
              : "border-white/80 bg-white/90 shadow-[0_10px_25px_rgba(15,23,42,0.04)]"
              }`}>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className={`text-xs font-bold ${mode === "dark" ? "text-zinc-100" : "text-slate-900"}`}>
                    👑 Epic Reward Points
                  </p>
                  <p className={`mt-1 text-xs ${mode === "dark" ? "text-zinc-400" : "text-slate-500"}`}>
                    Available: <span className="font-semibold text-amber-500">{userRewardPoints.toFixed(2)} pts</span>. Redeem {REWARD_REDEEM_POINTS} pts for ₹{REWARD_REDEEM_DISCOUNT} off.
                  </p>
                </div>
                <button
                  onClick={handleToggleRewardRedemption}
                  className={`shrink-0 cursor-pointer rounded-xl border px-3.5 py-1.5 text-xs font-bold transition-all duration-200 ${redeemReward
                    ? "border-emerald-500 bg-emerald-500/20 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                    : mode === "dark"
                      ? "border-zinc-700 bg-zinc-800/80 text-zinc-200 hover:bg-zinc-700"
                      : "border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                >
                  {redeemReward ? "✓ Applied" : "Use Points"}
                </button>
              </div>

              {!canRedeemReward && (
                <p className={`mt-2 text-xs font-medium ${mode === "dark" ? "text-amber-400" : "text-amber-700"}`}>
                  💡 Need at least {MIN_REWARD_POINTS_TO_ELIGIBLE} points to redeem.
                </p>
              )}

              {redeemReward && (
                <p className={`mt-2 inline-flex items-center gap-1 text-xs font-bold ${mode === "dark" ? "text-emerald-400" : "text-emerald-700"}`}>
                  <Sparkles className="h-3.5 w-3.5" />
                  ₹{REWARD_REDEEM_DISCOUNT} discount applied via reward points!
                </p>
              )}
            </div>

            {error && (
              <div className={`rounded-2xl border p-4 text-xs font-medium ${mode === "dark" ? "border-red-500/40 bg-red-500/15 text-red-300" : "border-red-200 bg-red-50 text-red-700"}`}>
                <div className="flex items-center gap-2">
                  <span className="text-base">⚠️</span>
                  <span>{error}</span>
                </div>
              </div>
            )}
          </section>

          {/* Right Summary Sidebar Card - Perfectly Aligned */}
          <aside className={`rounded-2xl border p-5 sm:p-6 backdrop-blur-xl shadow-lg transition-all lg:sticky lg:top-24 ${mode === "dark"
            ? "border-zinc-800/80 bg-zinc-900/90 shadow-[0_15px_35px_rgba(0,0,0,0.35)]"
            : "border-white/80 bg-white/90 shadow-[0_15px_35px_rgba(15,23,42,0.05)]"
            }`}>
            <h3 className={`text-xs font-bold uppercase tracking-wider ${mode === "dark" ? "text-zinc-200" : "text-slate-800"}`}>
              Booking Summary
            </h3>

            {/* Movie Header Info */}
            <div className="mt-4 flex items-center gap-3 rounded-xl border border-zinc-500/10 bg-zinc-500/5 p-3">
              {item?.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item?.name || "Movie"}
                  className="h-12 w-9 rounded-lg object-cover shadow-sm shrink-0"
                />
              ) : (
                <div className="flex h-12 w-9 items-center justify-center rounded-lg bg-indigo-600/20 text-lg font-bold text-indigo-400 shrink-0">
                  🎬
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h4 className={`truncate text-sm font-bold ${mode === "dark" ? "text-white" : "text-slate-900"}`}>
                  {item?.name || "Movie Ticket"}
                </h4>
                {item?.language && (
                  <p className={`mt-0.5 text-xs ${mode === "dark" ? "text-zinc-400" : "text-slate-500"}`}>
                    {item.language} {item?.genre ? `• ${Array.isArray(item.genre) ? item.genre.join(", ") : item.genre}` : ""}
                  </p>
                )}
              </div>
            </div>

            {/* Detail Rows */}
            <div className="mt-4 space-y-2.5 text-xs sm:text-sm">
              <div className={`flex items-center justify-between ${mode === "dark" ? "text-zinc-400" : "text-slate-600"}`}>
                <span>Date</span>
                <span className={`font-semibold ${mode === "dark" ? "text-zinc-100" : "text-slate-900"}`}>{date || "-"}</span>
              </div>
              <div className={`flex items-center justify-between ${mode === "dark" ? "text-zinc-400" : "text-slate-600"}`}>
                <span>Show Time</span>
                <span className={`font-semibold ${mode === "dark" ? "text-zinc-100" : "text-slate-900"}`}>{slot || "-"}</span>
              </div>
              <div className={`flex items-center justify-between ${mode === "dark" ? "text-zinc-400" : "text-slate-600"}`}>
                <span>Seats Selected</span>
                <span className={`font-bold ${mode === "dark" ? "text-indigo-400" : "text-indigo-600"}`}>
                  {seats.length} Ticket{seats.length > 1 ? "s" : ""}
                </span>
              </div>
            </div>

            <div className={`my-4 h-px ${mode === "dark" ? "bg-zinc-800" : "bg-slate-200"}`} />

            {/* Price Calculations */}
            <div className="space-y-2 text-xs sm:text-sm">
              <div className={`flex items-center justify-between ${mode === "dark" ? "text-zinc-400" : "text-slate-600"}`}>
                <span>Ticket Price</span>
                <span className="font-medium">₹{totalPrice}</span>
              </div>
              {discount > 0 && (
                <div className={`flex items-center justify-between font-medium ${mode === "dark" ? "text-emerald-400" : "text-emerald-700"}`}>
                  <span>Coupon Discount</span>
                  <span>-₹{discount}</span>
                </div>
              )}
              {redeemReward && (
                <div className={`flex items-center justify-between font-medium ${mode === "dark" ? "text-emerald-400" : "text-emerald-700"}`}>
                  <span>Reward Discount</span>
                  <span>-₹{REWARD_REDEEM_DISCOUNT}</span>
                </div>
              )}
              <div className={`flex items-center justify-between text-base font-bold pt-1 ${mode === "dark" ? "text-white" : "text-slate-900"}`}>
                <span>Total Payable</span>
                <span className="text-xl font-extrabold text-amber-500">₹{total}</span>
              </div>
            </div>

            {/* Security Guarantee Box */}
            <div className={`mt-4 rounded-xl border p-3 text-xs ${mode === "dark" ? "border-zinc-800 bg-zinc-950/80 text-zinc-400" : "border-slate-200 bg-slate-50 text-slate-600"}`}>
              <div className={`flex items-center gap-1.5 font-bold ${mode === "dark" ? "text-emerald-400" : "text-emerald-700"}`}>
                <ShieldCheck className="h-4 w-4" />
                Guaranteed Safe Checkout
              </div>
              <p className="mt-1 leading-relaxed text-[11px]">
                Your booking details are verified directly before proceeding to payment.
              </p>
            </div>

            <button
              className={`mt-5 w-full cursor-pointer rounded-xl py-3.5 px-5 text-center text-sm font-bold text-white shadow-md transition-all duration-200 hover:scale-[1.005] hover:shadow-[0_10px_25px_rgba(79,70,229,0.35)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 ${mode === "dark"
                ? "bg-linear-to-r from-indigo-600 via-indigo-500 to-indigo-600"
                : "bg-linear-to-r from-indigo-600 via-indigo-700 to-slate-900"
                }`}
              onClick={handleProceedToPay}
              disabled={loading}
            >
              <span className="inline-flex items-center justify-center gap-2">
                <CreditCard className="h-4 w-4" />
                {loading ? "Preparing Payment..." : `Proceed to Pay ₹${total}`}
              </span>
            </button>
          </aside>
        </div>

        {/* 🎟 Coupon Modal */}
        <AnimatePresence>
          {showCoupon && (
            <CouponModal
              appliedCoupon={appliedCoupon}
              onClose={() => setShowCoupon(false)}
              bookingType="movie"
              amount={totalPrice}
              onApply={(coupon) => {
                if (redeemReward) {
                  setError("Coupon and reward redemption cannot be used together.");
                  return;
                }
                applyCoupon(coupon);
                setShowCoupon(false);
              }}
              onRemove={() => {
                removeCoupon();
              }}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
export default TicketReview;
