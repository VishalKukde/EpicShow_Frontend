type RewardsBoosterCardProps = {
  mode: "light" | "dark";
  onCheckOffers: () => void;
};

export default function RewardsBoosterCard({
  mode,
  onCheckOffers,
}: RewardsBoosterCardProps) {
  return (
    <div
      className={`rounded-2xl border p-5 transition sm:p-6 ${
        mode === "dark"
          ? "border-zinc-700 bg-zinc-900 shadow-[0_10px_40px_rgba(0,0,0,0.6)]"
          : "border-slate-200 bg-white shadow-[0_10px_40px_rgba(15,23,42,0.08)]"
      }`}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="max-w-3xl">
          <p
            className={`text-xs font-semibold uppercase tracking-[0.16em] ${
              mode === "dark" ? "text-indigo-300" : "text-indigo-600"
            }`}
          >
            Ad
          </p>
          <h3
            className={`mt-1 text-lg font-semibold ${
              mode === "dark" ? "text-white" : "text-slate-900"
            }`}
          >
            Rewards Booster
          </h3>

          <p
            className={`mt-2 text-sm ${
              mode === "dark" ? "text-slate-400" : "text-slate-600"
            }`}
          >
            Add ₹1,000+ in a single top-up and unlock 5% bonus points on your
            wallet credit.
          </p>
        </div>

        <button
          onClick={onCheckOffers}
          className={`w-full cursor-pointer rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all duration-200 sm:w-auto md:min-w-[160px] ${
            mode === "dark"
              ? "border-indigo-400/50 bg-indigo-600 text-white shadow-lg hover:border-indigo-300 hover:bg-indigo-500"
              : "border-indigo-600 bg-indigo-600 text-white shadow-md hover:bg-indigo-500"
          }`}
        >
          Check Offers
        </button>
      </div>
    </div>
  );
}
