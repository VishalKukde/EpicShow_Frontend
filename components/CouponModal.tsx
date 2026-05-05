"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, BadgePercent, Sparkles } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import { formatOfferDate, toAppliedCoupon } from "@/lib/offers";
import { toast } from "@/lib/toast";
import type { AppliedCoupon, OfferBookingType, UserCoupon } from "@/types/Offer";

type CouponModalProps = {
  onClose: () => void;
  onApply: (coupon: AppliedCoupon) => void;
  onRemove: () => void;
  appliedCoupon: AppliedCoupon | null;
  bookingType: OfferBookingType;
  amount: number;
};

const CouponModal = ({
  onClose,
  onApply,
  onRemove,
  appliedCoupon,
  bookingType,
  amount,
}: CouponModalProps) => {
  const router = useRouter();
  const { user } = useAuth();
  const mode = useThemeStore((s) => s.mode);
  const dark = mode === "dark";
  const [coupons, setCoupons] = useState<UserCoupon[]>([]);
  const [loading, setLoading] = useState(Boolean(user));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadCoupons = async () => {
      if (!user) {
        setCoupons([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await apiFetch(
          `/my-coupons/eligible?bookingType=${encodeURIComponent(
            bookingType
          )}&amount=${encodeURIComponent(amount.toFixed(2))}`
        );

        if (cancelled) return;
        setCoupons(response?.coupons || []);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load coupons");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadCoupons();

    return () => {
      cancelled = true;
    };
  }, [user, bookingType, amount]);

  const handleApply = (coupon: UserCoupon) => {
    onApply(toAppliedCoupon(coupon));
    toast.success(`${coupon.code} applied successfully`);
    onClose();
  };

  const goToOffers = () => {
    onClose();
    router.push(user ? "/offers" : "/login");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4 ${
        dark ? "bg-black/75" : "bg-slate-950/40"
      }`}
    >
      <motion.div
        initial={{ y: 60 }}
        animate={{ y: 0 }}
        exit={{ y: 60 }}
        transition={{ duration: 0.25 }}
        className={`w-full overflow-hidden rounded-t-3xl border shadow-2xl sm:max-w-2xl sm:rounded-3xl ${
          dark ? "border-zinc-700 bg-zinc-950" : "border-slate-200 bg-white"
        }`}
      >
        <div
          className={`border-b px-6 py-5 ${
            dark
              ? "border-zinc-700 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.18),transparent_55%),linear-gradient(180deg,#09090b,#111827)]"
              : "border-slate-200 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.16),transparent_58%),linear-gradient(180deg,#f8fafc,#ffffff)]"
          }`}
        >
          <p
            className={`text-xs font-semibold uppercase tracking-[0.18em] ${
              dark ? "text-sky-300" : "text-sky-700"
            }`}
          >
            Collected Coupons
          </p>
          <div className="mt-3 flex items-start justify-between gap-3">
            <div>
              <h3
                className={`text-xl font-semibold ${
                  dark ? "text-zinc-100" : "text-slate-900"
                }`}
              >
                Apply a coupon
              </h3>
              <p
                className={`mt-1 text-sm ${
                  dark ? "text-zinc-400" : "text-slate-600"
                }`}
              >
                Only coupons you have already collected can be used here.
              </p>
            </div>
            <div
              className={`rounded-2xl border px-3 py-2 text-right ${
                dark ? "border-zinc-700 bg-zinc-900 text-zinc-200" : "border-slate-200 bg-white text-slate-700"
              }`}
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em]">
                Cart Total
              </p>
              <p className="mt-1 text-lg font-bold">₹{amount.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="max-h-[65vh] overflow-y-auto px-6 py-5">
          {!user ? (
            <div
              className={`rounded-3xl border px-5 py-8 text-center ${
                dark ? "border-zinc-700 bg-zinc-900" : "border-slate-200 bg-slate-50"
              }`}
            >
              <div
                className={`mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl ${
                  dark ? "bg-zinc-800 text-zinc-100" : "bg-slate-100 text-slate-700"
                }`}
              >
                <BadgePercent className="h-5 w-5" />
              </div>
              <p
                className={`mt-4 text-lg font-semibold ${
                  dark ? "text-zinc-100" : "text-slate-900"
                }`}
              >
                Sign in to use collected coupons
              </p>
              <p
                className={`mt-2 text-sm ${
                  dark ? "text-zinc-400" : "text-slate-600"
                }`}
              >
                Browse offers, collect what you like, and apply them here during checkout.
              </p>
              <button
                onClick={goToOffers}
                className={`mt-5 inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium ${
                  dark ? "bg-zinc-100 text-zinc-900 hover:bg-white" : "bg-slate-900 text-white hover:bg-black"
                }`}
              >
                Go to Login
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ) : loading ? (
            <div className="space-y-3">
              {[0, 1, 2].map((index) => (
                <div
                  key={index}
                  className={`h-28 animate-pulse rounded-3xl border ${
                    dark ? "border-zinc-700 bg-zinc-900" : "border-slate-200 bg-slate-50"
                  }`}
                />
              ))}
            </div>
          ) : error ? (
            <div
              className={`rounded-3xl border px-4 py-4 text-sm ${
                dark ? "border-red-700 bg-red-500/10 text-red-300" : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {error}
            </div>
          ) : coupons.length === 0 ? (
            <div
              className={`rounded-3xl border px-5 py-8 text-center ${
                dark ? "border-zinc-700 bg-zinc-900" : "border-slate-200 bg-slate-50"
              }`}
            >
              <div
                className={`mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl ${
                  dark ? "bg-zinc-800 text-zinc-100" : "bg-slate-100 text-slate-700"
                }`}
              >
                <Sparkles className="h-5 w-5" />
              </div>
              <p
                className={`mt-4 text-lg font-semibold ${
                  dark ? "text-zinc-100" : "text-slate-900"
                }`}
              >
                No eligible coupons yet
              </p>
              <p
                className={`mt-2 text-sm ${
                  dark ? "text-zinc-400" : "text-slate-600"
                }`}
              >
                Collect coupons from the offers page and they will appear here when your booking meets the rules.
              </p>
              <div
                // onClick={goToOffers}
                className={`mt-5 inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium border  ${
                  dark ? "bg-zinc-100 text-zinc-900 hover:bg-white border-zinc-500" : "bg-slate-900 text-white hover:bg-black border-gray-700"
                }`}
              >
                You can collect coupon from Offers section under profile section
                {/* <ArrowRight className="h-4 w-4" /> */}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {coupons.map((coupon) => {
                const isApplied = appliedCoupon?._id === coupon._id;

                return (
                  <div
                    key={coupon._id}
                    className={`rounded-3xl border p-4 ${
                      isApplied
                        ? dark
                          ? "border-emerald-500/40 bg-emerald-500/10"
                          : "border-emerald-200 bg-emerald-50"
                        : dark
                          ? "border-zinc-700 bg-zinc-900"
                          : "border-slate-200 bg-white"
                    }`}
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p
                            className={`text-base font-semibold ${
                              dark ? "text-zinc-100" : "text-slate-900"
                            }`}
                          >
                            {coupon.title}
                          </p>
                          <span
                            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                              dark ? "bg-sky-500/15 text-sky-300" : "bg-sky-100 text-sky-700"
                            }`}
                          >
                            {coupon.discountLabel}
                          </span>
                        </div>
                        <p
                          className={`mt-1 text-sm ${
                            dark ? "text-zinc-400" : "text-slate-600"
                          }`}
                        >
                          {coupon.description}
                        </p>
                        <div
                          className={`mt-3 flex flex-wrap items-center gap-3 text-xs ${
                            dark ? "text-zinc-400" : "text-slate-500"
                          }`}
                        >
                          <span>Code: {coupon.code}</span>
                          <span>Valid till {formatOfferDate(coupon.validTill)}</span>
                          <span>Save ₹{coupon.estimatedDiscount.toFixed(2)}</span>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {coupon.conditions.map((condition) => (
                            <span
                              key={condition}
                              className={`rounded-full px-2.5 py-1 text-[11px] ${
                                dark ? "bg-zinc-800 text-zinc-300" : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {condition}
                            </span>
                          ))}
                        </div>
                      </div>

                      {isApplied ? (
                        <button
                          onClick={onRemove}
                          className={`shrink-0 rounded-2xl px-4 py-2 text-sm font-medium ${
                            dark ? "bg-zinc-800 text-zinc-100 hover:bg-zinc-700" : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          Remove
                        </button>
                      ) : (
                        <button
                          onClick={() => handleApply(coupon)}
                          className={`shrink-0 rounded-2xl px-4 py-2 text-sm font-medium ${
                            dark ? "bg-sky-400 text-slate-950 hover:bg-sky-300" : "bg-slate-900 text-white hover:bg-black"
                          }`}
                        >
                          Apply
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div
          className={`border-t px-6 py-4 ${
            dark ? "border-zinc-700 bg-zinc-950" : "border-slate-200 bg-white"
          }`}
        >
          <button
            onClick={onClose}
            className={`w-full rounded-2xl py-3 text-sm font-medium cursor-pointer ${
              dark ? "bg-zinc-800 text-zinc-100 hover:bg-zinc-700" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CouponModal;
