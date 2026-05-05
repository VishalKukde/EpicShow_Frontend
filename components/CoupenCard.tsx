"use client";

import type { AppliedCoupon } from "@/types/Offer";
import { BadgePercent, Sparkles } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";

type ICoupenCardProps = {
  setShowCoupon: (value: boolean) => void;
  appliedCoupon: AppliedCoupon | null;
  eligibleCount?: number;
};

const CoupenCard = ({
  setShowCoupon,
  appliedCoupon,
  eligibleCount = 0,
}: ICoupenCardProps) => {
  const mode = useThemeStore((s) => s.mode);
  const dark = mode === "dark";

  return (
    <button
      onClick={() => setShowCoupon(true)}
      className={`w-full rounded-3xl border px-5 py-4 text-left transition shadow-sm hover:shadow-md cursor-pointer ${
        appliedCoupon
          ? dark
            ? "border-emerald-500/40 bg-emerald-500/10"
            : "border-emerald-200 bg-emerald-50"
          : dark
            ? "border-zinc-700 bg-zinc-900"
            : "border-slate-200 bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div
            className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl ${
              appliedCoupon
                ? dark
                  ? "bg-emerald-500/15 text-emerald-300"
                  : "bg-emerald-100 text-emerald-700"
                : dark
                  ? "bg-zinc-800 text-zinc-200"
                  : "bg-slate-100 text-slate-700"
            }`}
          >
            <BadgePercent className="h-5 w-5" />
          </div>

          <div>
            <p
              className={`text-sm font-semibold ${
                dark ? "text-zinc-100" : "text-slate-900"
              }`}
            >
              {appliedCoupon ? "Coupon Applied" : "Apply Coupon"}
            </p>
            <p
              className={`mt-1 text-xs ${
                dark ? "text-zinc-400" : "text-slate-600"
              }`}
            >
              {appliedCoupon
                ? `${appliedCoupon.code} saved you ₹${appliedCoupon.off.toFixed(2)}`
                : eligibleCount > 0
                  ? `${eligibleCount} collected coupon${eligibleCount > 1 ? "s" : ""} available`
                  : "Choose from your collected coupons during checkout"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {appliedCoupon ? (
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                dark
                  ? "bg-emerald-500/15 text-emerald-300"
                  : "bg-emerald-100 text-emerald-700"
              }`}
            >
              <Sparkles className="h-3 w-3" />
              Applied
            </span>
          ) : null}
          <span className={`text-lg ${dark ? "text-zinc-500" : "text-slate-400"}`}>›</span>
        </div>
      </div>
    </button>
  );
};

export default CoupenCard;
