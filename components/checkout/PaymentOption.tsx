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
    className={`group relative w-full flex items-center justify-between overflow-hidden rounded-2xl border p-4 sm:p-5 text-left transition-all duration-200 cursor-pointer ${disabled
        ? mode === "dark"
          ? "cursor-not-allowed border-zinc-800 bg-zinc-900/50 opacity-50"
          : "cursor-not-allowed border-slate-200 bg-slate-100/70 opacity-50"
        : active
          ? mode === "dark"
            ? "border-indigo-500/80 bg-linear-to-r from-indigo-950/40 via-zinc-900 to-zinc-900 shadow-[0_6px_20px_rgba(79,70,229,0.2)] ring-1 ring-indigo-500/40"
            : "border-indigo-500 bg-linear-to-r from-indigo-50/90 via-white to-indigo-50/30 shadow-[0_6px_20px_rgba(79,70,229,0.12)] ring-1 ring-indigo-500/30"
          : mode === "dark"
            ? "border-zinc-800/80 bg-zinc-900/60 hover:border-zinc-700 hover:bg-zinc-800/70"
            : "border-slate-200/80 bg-white hover:border-indigo-300 hover:bg-slate-50/80"
      }`}
  >
    <div className="relative z-10 min-w-0 flex-1 pr-3">
      <div className="flex items-center gap-2">
        <p className={`font-bold tracking-tight text-sm sm:text-base ${mode === "dark" ? "text-zinc-100" : "text-slate-900"}`}>{title}</p>
        {badge && (
          <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-bold ${mode === "dark"
              ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-400"
              : "border-emerald-400/40 bg-emerald-50 text-emerald-700"
            }`}>
            {badge}
          </span>
        )}
      </div>
      <p className={`mt-1 text-xs font-medium ${mode === "dark" ? "text-zinc-400" : "text-slate-500"}`}>{desc}</p>
    </div>

    <div
      className={`relative z-10 h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 shrink-0 ${active
          ? mode === "dark" ? "border-indigo-400 bg-indigo-500/20 shadow-[0_0_8px_rgba(129,140,248,0.4)]" : "border-indigo-600 bg-indigo-500/10 shadow-[0_0_8px_rgba(79,70,229,0.25)]"
          : mode === "dark" ? "border-zinc-700 group-hover:border-zinc-500" : "border-slate-300 group-hover:border-indigo-400"
        }`}
    >
      {active && (
        <div className={`h-2.5 w-2.5 rounded-full ${mode === "dark" ? "bg-indigo-400" : "bg-indigo-600"}`} />
      )}
    </div>
  </button>
);

export default PaymentOption;
