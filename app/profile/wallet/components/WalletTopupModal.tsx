import { WalletCards, X } from "lucide-react";

type WalletTopupModalProps = {
  mode: "light" | "dark";
  isOpen: boolean;
  maxTopup: number;
  amountInput: string;
  selectedAmount: number;
  dynamicPresetAmounts: number[];
  submitting: boolean;
  amountInvalid: boolean;
  error: string;
  onClose: () => void;
  onPresetSelect: (value: number) => void;
  onInputChange: (value: string) => void;
  onInputBlur: () => void;
  onSubmit: () => void;
};

export default function  WalletTopupModal({
  mode,
  isOpen,
  maxTopup,
  amountInput,
  selectedAmount,
  dynamicPresetAmounts,
  submitting,
  amountInvalid,
  error,
  onClose,
  onPresetSelect,
  onInputChange,
  onInputBlur,
  onSubmit,
}: WalletTopupModalProps) {
  if (!isOpen) return null;

  const amountValue = Number(amountInput);

  return (
    <div
      onClick={onClose}
      className={`fixed inset-0 z-50 flex items-center justify-center px-4 py-6 backdrop-blur-md transition-all duration-300 ${
        mode === "dark" ? "bg-black/70" : "bg-slate-900/30"
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-md rounded-3xl border transition-all duration-300 sm:max-w-lg md:max-w-xl ${
          mode === "dark"
            ? "border-zinc-700 bg-zinc-900/95 shadow-[0_25px_80px_rgba(0,0,0,0.6)]"
            : "border-slate-200 bg-white/95 shadow-[0_25px_80px_rgba(15,23,42,0.15)]"
        }`}
      >
        <div className="relative p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <div
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                  mode === "dark"
                    ? "border border-indigo-400/30 bg-indigo-500/15 text-indigo-200"
                    : "border border-indigo-300 bg-indigo-50 text-indigo-700"
                }`}
              >
                <WalletCards className="h-4 w-4" />
                Secure Wallet Top-up
              </div>

              <h3
                className={`text-2xl font-bold tracking-tight ${
                  mode === "dark" ? "text-white" : "text-slate-900"
                }`}
              >
                Add Wallet Balance
              </h3>

              <p
                className={`text-sm ${
                  mode === "dark" ? "text-slate-400" : "text-slate-600"
                }`}
              >
                Choose a quick amount or enter manually.
              </p>
            </div>

            <button
              onClick={onClose}
              className={`cursor-pointer rounded-xl p-2 transition ${
                mode === "dark"
                  ? "border border-zinc-700 bg-zinc-800 text-zinc-400 hover:text-white"
                  : "bg-slate-200 text-slate-500 shadow-2xl hover:text-slate-900"
              }`}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {dynamicPresetAmounts.map((value) => (
              <button
                key={value}
                onClick={() => onPresetSelect(value)}
                className={`cursor-pointer rounded-2xl border py-2 text-sm font-semibold transition-all duration-200 ${
                  selectedAmount === value
                    ? "scale-[1.02] border-indigo-400 bg-indigo-600 text-white shadow-lg"
                    : mode === "dark"
                      ? "border-zinc-700 bg-zinc-800 text-zinc-200 hover:border-zinc-600 hover:bg-zinc-700"
                      : "border-slate-200 bg-white text-slate-800 hover:bg-slate-50"
                }`}
              >
                ₹{value.toFixed(2)}
              </button>
            ))}
          </div>

          <div className="mt-8">
            <label
              className={`mb-2 block text-sm font-medium ${
                mode === "dark" ? "text-slate-300" : "text-slate-700"
              }`}
            >
              Enter custom amount
            </label>

            <div
              className={`group flex items-center rounded-2xl border px-4 py-4 transition-all duration-200 ${
                mode === "dark"
                  ? "border-zinc-700 bg-zinc-800 focus-within:ring-2 focus-within:ring-indigo-500/40"
                  : "border-slate-300 bg-white focus-within:ring-2 focus-within:ring-indigo-500/30"
              }`}
            >
              <span className="text-lg font-semibold text-indigo-500">₹</span>

              <input
                value={amountInput}
                onChange={(e) => onInputChange(e.target.value)}
                onBlur={onInputBlur}
                inputMode="decimal"
                placeholder="0.00"
                className={`ml-3 w-full text-lg outline-none ${
                  mode === "dark"
                    ? "text-white bg-zinc-800 placeholder:text-slate-500"
                    : "text-slate-900 placeholder:text-slate-400"
                }`}
              />
            </div>

            <p
              className={`mt-2 text-xs ${
                mode === "dark" ? "text-zinc-400" : "text-slate-700"
              }`}
            >
              Maximum wallet balance allowed is ₹{maxTopup.toFixed(2)}
            </p>
          </div>

          {error && (
            <div className="mt-5 rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-500">
              {error}
            </div>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              disabled
              className={`w-full cursor-pointer rounded-2xl px-5 py-4 text-sm font-semibold transition ${
                mode === "dark"
                  ? "border border-zinc-700 bg-zinc-800 text-zinc-500"
                  : "border border-slate-200 bg-slate-100 text-slate-400"
              }`}
            >
              Auto Top-Up (Coming Soon)
            </button>

            <button
              onClick={onSubmit}
              disabled={submitting || amountInvalid}
              className={`w-full cursor-pointer rounded-2xl border px-5 py-4 text-sm font-semibold text-white shadow-xl transition disabled:opacity-60 ${
                mode === "dark"
                  ? "border-indigo-400/40 bg-indigo-600 hover:bg-indigo-500"
                  : "border-indigo-700/40 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:opacity-90"
              }`}
            >
              {submitting
                ? "Processing..."
                : `Add ₹${Number.isFinite(amountValue) ? amountValue.toFixed(2) : "0.00"}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
