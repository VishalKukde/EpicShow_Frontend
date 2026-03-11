import type { BillingCycle } from "../types";
import { useThemeStore } from "@/store/themeStore";

type BillingCycleSelectorProps = {
  cycle: BillingCycle;
  onChange: (cycle: BillingCycle) => void;
  quarterlySavings: number;
  yearlySavings: number;
};

export default function BillingCycleSelector({
  cycle,
  onChange,
  quarterlySavings,
  yearlySavings,
}: BillingCycleSelectorProps) {
  const mode = useThemeStore((state) => state.mode);
  const dark = mode === "dark";
  const cycles: BillingCycle[] = ["monthly", "quarterly", "yearly"];
  const activeIndex = cycles.indexOf(cycle);

  return (
    <section
      className={`select-none rounded-2xl border p-4 shadow-sm sm:p-5 ${
        dark
          ? "border-zinc-800/70 bg-zinc-950 shadow-[0_12px_30px_rgba(0,0,0,0.3)]"
          : "border-gray-200 bg-white"
      }`}
    >
      <p className={`text-sm font-medium ${dark ? "text-zinc-200" : "text-gray-700"}`}>
        Billing Cycle
      </p>
      <div
        className={`relative mt-3 grid w-full max-w-xl grid-cols-3 rounded-xl border p-1 ${
          dark ? "border-zinc-800 bg-zinc-900/90" : "border-gray-200 bg-gray-100"
        }`}
      >
        <span
          aria-hidden
          className={`pointer-events-none absolute bottom-1 left-1 top-1 rounded-lg shadow-sm transition-transform duration-300 ease-out ${
            dark ? "bg-zinc-950 ring-1 ring-zinc-700/70" : "bg-gray-900"
          }`}
          style={{
            width: "calc((100% - 0.5rem) / 3)",
            transform: `translateX(${activeIndex * 100}%)`,
          }}
        />

        {cycles.map((item) => (
          <button
            key={item}
            onClick={() => onChange(item)}
            aria-pressed={cycle === item}
            className={`relative z-10 cursor-pointer rounded-lg px-3 py-2 text-sm font-medium capitalize transition-colors ${
              cycle === item
                ? dark
                  ? "text-zinc-100"
                  : "text-white"
                : dark
                  ? "text-zinc-300 hover:bg-zinc-700/80 hover:text-zinc-100"
                  : "text-gray-600 hover:bg-white"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <div className={`mt-4 flex flex-wrap gap-2 text-xs ${dark ? "text-zinc-300" : "text-gray-600"}`}>
        <span
          className={`rounded-full px-3 py-1 ${
            dark ? "bg-emerald-900/45 text-emerald-300 ring-1 ring-emerald-700/40" : "bg-emerald-50 text-emerald-700"
          }`}
        >
          Quarterly saves ₹{quarterlySavings}/month
        </span>
        <span
          className={`rounded-full px-3 py-1 ${
            dark ? "bg-indigo-900/45 text-indigo-200 ring-1 ring-indigo-700/40" : "bg-indigo-50 text-gray-700"
          }`}
        >
          Yearly saves ₹{yearlySavings}/month
        </span>
      </div>
    </section>
  );
}
