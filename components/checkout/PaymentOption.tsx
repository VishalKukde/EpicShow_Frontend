"use client";
type PaymentOptionProps = {
  mode: "light" | "dark";
  active: boolean;
  onClick: () => void;
  title: string;
  desc: string;
  badge?: string;
  disabled?: boolean;
};

const PaymentOption = ({
  mode,
  active,
  onClick,
  title,
  desc,
  badge,
  disabled = false,
}: PaymentOptionProps) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`w-full flex items-center justify-between rounded-2xl border px-4 py-4 text-left transition-all duration-200 sm:px-5 cursor-pointer ${
      disabled
        ? mode === "dark"
          ? "cursor-not-allowed border-zinc-700 bg-zinc-800 opacity-60"
          : "cursor-not-allowed border-slate-200 bg-slate-100/80 opacity-60"
        : active
          ? mode === "dark"
            ? "border-indigo-400 bg-zinc-800 shadow-[0_10px_24px_rgba(79,70,229,0.22)]"
            : "border-indigo-500 bg-indigo-50/80 shadow-[0_10px_24px_rgba(79,70,229,0.18)]"
          : mode === "dark"
            ? "border-zinc-700 bg-zinc-900 hover:border-zinc-500 hover:bg-zinc-800/80"
            : "border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50"
    }`}
  >
    <div>
      <p className={`font-semibold ${mode === "dark" ? "text-zinc-100" : "text-slate-900"}`}>{title}</p>
      <p className={`mt-1 text-sm ${mode === "dark" ? "text-zinc-400" : "text-slate-500"}`}>{desc}</p>
      {badge && (
        <span className={`mt-2 inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${
          mode === "dark"
            ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-300"
            : "border-emerald-300 bg-emerald-50 text-emerald-700"
        }`}>
          {badge}
        </span>
      )}
    </div>

    <div
      className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
        active
          ? mode === "dark" ? "border-indigo-400" : "border-indigo-600"
          : mode === "dark" ? "border-zinc-600" : "border-slate-300"
      }`}
    >
      {active && (
        <div className={`h-2.5 w-2.5 rounded-full ${mode === "dark" ? "bg-indigo-400" : "bg-indigo-600"}`} />
      )}
    </div>
  </button>
);

export default PaymentOption;
