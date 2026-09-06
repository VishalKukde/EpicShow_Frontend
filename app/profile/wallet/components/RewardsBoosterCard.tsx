type RewardsBoosterCardProps = {
  mode: "light" | "dark";
  onCheckOffers: () => void;
};

export default function RewardsBoosterCard({
  mode,
  onCheckOffers,
}: RewardsBoosterCardProps) {
  const isDark = mode === "dark";

  return (
    <div
      className={`rounded-2xl border p-5 transition sm:p-6 ${
        isDark
          ? "border-zinc-800 bg-[#18181b]"
          : "border-slate-200 bg-white shadow-[0_10px_40px_rgba(15,23,42,0.08)]"
      }`}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="max-w-3xl">
          <p
            className={`text-xs font-semibold uppercase tracking-[0.16em] ${
              isDark ? "text-indigo-300" : "text-indigo-600"
            }`}
          >
            Ad
          </p>
          <h3
            className={`mt-1 text-lg font-semibold ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Rewards Booster
          </h3>

          <p
            className={`mt-2 text-sm ${
              isDark ? "text-zinc-400" : "text-slate-600"
            }`}
          >
            Add ₹1,000+ in a single top-up and unlock 5% bonus points on your
            wallet credit.
          </p>
        </div>

        <button
          onClick={onCheckOffers}
          className={`w-full cursor-pointer rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all duration-200 sm:w-auto md:min-w-[160px] ${
            isDark
              ? "border-zinc-700/70 bg-[#18181b] text-zinc-100 hover:bg-zinc-800"
              : "border-indigo-600 bg-indigo-600 text-white shadow-md hover:bg-indigo-500"
          }`}
        >
          Check Offers
        </button>
      </div>
    </div>
  );
}
