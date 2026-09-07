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
      className={`w-full rounded-2xl border p-3.5 sm:p-4 text-left transition-all duration-200 shadow-md hover:scale-[1.005] cursor-pointer ${appliedCoupon
          ? dark
            ? "border-emerald-500/40 bg-emerald-500/10 shadow-[0_4px_20px_rgba(16,185,129,0.15)]"
            : "border-emerald-300 bg-emerald-50/80 shadow-[0_4px_20px_rgba(16,185,129,0.08)]"
          : dark
            ? "border-zinc-800 bg-zinc-900/90 hover:border-zinc-700 hover:bg-zinc-800/80 backdrop-blur-xl"
            : "border-white/80 bg-white/90 hover:border-indigo-200 hover:bg-slate-50/80 backdrop-blur-xl"
        }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`inline-flex h-9 w-9 items-center justify-center rounded-xl ${appliedCoupon
                ? dark
                  ? "bg-emerald-500/20 text-emerald-400"
                  : "bg-emerald-100 text-emerald-700"
                : dark
                  ? "bg-indigo-500/10 text-indigo-400"
                  : "bg-indigo-50 text-indigo-600"
              }`}
          >
            <BadgePercent className="h-4 w-4" />
          </div>

          <div>
            <p
              className={`text-xs font-bold ${dark ? "text-zinc-100" : "text-slate-900"
                }`}
            >
              {appliedCoupon ? "Coupon Applied" : "Apply Coupon"}
            </p>
            <p
              className={`mt-0.5 text-[11px] ${dark ? "text-zinc-400" : "text-slate-500"
                }`}
            >
              {appliedCoupon
                ? `${appliedCoupon.code} saved you ₹${appliedCoupon.off.toFixed(2)}`
                : eligibleCount > 0
                  ? `${eligibleCount} collected coupon${eligibleCount > 1 ? "s" : ""} available`
                  : "Choose from your collected coupons for extra savings"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {appliedCoupon ? (
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${dark
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "bg-emerald-100 text-emerald-700 border border-emerald-300"
                }`}
            >
              <Sparkles className="h-2.5 w-2.5" />
              Applied
            </span>
          ) : (
            <span className={`text-xs font-semibold ${dark ? "text-indigo-400" : "text-indigo-600"}`}>
              Select ›
            </span>
          )}
        </div>
      </div>
    </button>
  );
};

export default CoupenCard;
