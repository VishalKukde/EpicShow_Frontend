import React from 'react'
import { useThemeStore } from '@/store/themeStore';

type ICoupenCardProps = {
    setShowCoupon: (value: boolean) => void;
    appliedCoupon: string | null
}
const CoupenCard = ({ setShowCoupon, appliedCoupon }: ICoupenCardProps) => {
    const mode = useThemeStore((s) => s.mode);

    return (
        <div>      <button
            onClick={() => setShowCoupon(true)}
            className={`w-full rounded-2xl px-5 py-4 flex justify-between items-center transition shadow-sm hover:shadow-md cursor-pointer
    ${appliedCoupon
                    ? mode === "dark"
                        ? "border border-zinc-600 bg-zinc-800"
                        : "bg-green-50 border border-green-200"
                    : mode === "dark"
                        ? "bg-zinc-800 border border-zinc-700"
                        : "bg-white border border-gray-200"}
  `}
        >
            <div className="flex flex-col text-left">
                <span className={`font-medium text-sm
      ${appliedCoupon
                        ? mode === "dark" ? "text-emerald-300" : "text-green-800"
                        : mode === "dark" ? "text-zinc-200" : "text-gray-700"}
    `}>
                    {appliedCoupon ? "Coupon Applied" : "Apply Coupon"}
                </span>

                {appliedCoupon && (
                    <span className={`text-xs mt-0.5 ${mode === "dark" ? "text-emerald-300" : "text-green-600"}`}>
                        Code: {appliedCoupon}
                    </span>
                )}
            </div>

            <div className="flex items-center gap-2">
                {appliedCoupon && (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${mode === "dark" ? "bg-emerald-500/20 text-emerald-300" : "bg-green-100 text-green-700"}`}>
                        Applied
                    </span>
                )}
                <span className={`text-lg ${mode === "dark" ? "text-zinc-500" : "text-gray-400"}`}>›</span>
            </div>
        </button>
        </div>
    )
}

export default CoupenCard
