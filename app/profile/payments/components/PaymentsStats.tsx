import type { PaymentStat } from "../types";
import { useThemeStore } from "@/store/themeStore";

type PaymentsStatsProps = {
  stats: PaymentStat[];
};

export default function PaymentsStats({ stats }: PaymentsStatsProps) {
  const mode = useThemeStore((state) => state.mode);
  const dark = mode === "dark";

  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {stats.map((stat) => (
        <article
          key={stat.title}
          className={`rounded-2xl border p-5 shadow-sm ${dark ? "border-zinc-800 bg-[#18181b]" : "border-gray-200 bg-white"
            } dark:bg-[#18181b] dark:border-zinc-800`}
        >
          <div className="flex items-start justify-between">
            <p className={`text-sm ${dark ? "text-zinc-400" : "text-gray-500"} dark:text-zinc-400`}>{stat.title}</p>
            <stat.icon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <p className={`mt-3 text-2xl font-bold ${dark ? "text-white" : "text-gray-900"} dark:text-white`}>{stat.value}</p>
          <p className={`mt-1 text-xs ${dark ? "text-zinc-400" : "text-gray-500"} dark:text-zinc-400`}>{stat.note}</p>
        </article>
      ))}
    </section>
  );
}
