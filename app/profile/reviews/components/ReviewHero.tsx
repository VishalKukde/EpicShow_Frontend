import { useThemeStore } from '@/store/themeStore';
import React from 'react'

const ReviewHero = ({ totalReviews = 0 }: { totalReviews?: number }) => {
      const mode = useThemeStore((s) => s.mode);
      const dark = mode === "dark";
  return (
    <section
        className={`rounded-3xl border p-6 text-white  shadow-sm sm:p-8 ${
          dark
          ? "border-zinc-700 bg-zinc-900"
          : "border-gray-200 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900"
     }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-indigo-200">
              Reviews
            </p>
            <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">
              Your recent reviews
            </h1>
            <p className={`mt-2 max-w-xl text-sm ${dark ? "text-zinc-400" : "text-gray-400"}`}>
              {totalReviews > 0
                ? `You have shared ${totalReviews} review${totalReviews === 1 ? "" : "s"} so far.`
                : "Your feedback helps us improve our service. We appreciate your time and insights."}
            </p>
          </div>
  
        </div>
      </section>
  )
}

export default ReviewHero
