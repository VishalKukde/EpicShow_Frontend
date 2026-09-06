import { Plus, WalletCards } from "lucide-react";

type WalletBalanceCardProps = {
  walletBalance: number;
  onOpenModal: () => void;
  mode?: "light" | "dark";
};

export default function WalletBalanceCard({
  walletBalance,
  onOpenModal,
  mode,
}: WalletBalanceCardProps) {
  const isDark = mode === "dark";

  return (
    <div
      className={`rounded-2xl border p-5 shadow-sm transition sm:p-6 ${
        isDark
          ? "border-zinc-800 bg-[#18181b]"
          : "border-gray-200 bg-white"
      }`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className={`text-xs font-semibold uppercase tracking-wider ${isDark ? "text-zinc-400" : "text-gray-500"}`}>
            Available Balance
          </p>
          <p className={`mt-1.5 text-3xl font-black tracking-tight sm:text-4xl ${isDark ? "text-zinc-100" : "text-gray-900"}`}>
            ₹{walletBalance.toFixed(2)}
          </p>
          <p className={`mt-1 text-xs ${isDark ? "text-zinc-400" : "text-gray-500"}`}>
            Instant checkout for movies, sports, trains & events
          </p>
        </div>

        {/* Action Button Section */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onOpenModal}
            className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition shadow-sm ${
              isDark
                ? "border border-zinc-700/70 bg-[#18181b] text-zinc-100 hover:bg-zinc-800"
                : "bg-slate-900 text-white hover:bg-slate-800"
            }`}
          >
            <Plus className="h-4 w-4" />
            <span>Add Money</span>
          </button>
          <button
            type="button"
            onClick={onOpenModal}
            className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold transition ${
              isDark
                ? "border-zinc-700/60 bg-[#18181b] text-zinc-300 hover:bg-zinc-800/80"
                : "border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50 shadow-sm"
            }`}
          >
            <WalletCards className="h-4 w-4" />
            <span>Manage Balance</span>
          </button>
        </div>
      </div>
    </div>
  );
}
