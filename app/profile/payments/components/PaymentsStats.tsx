import type { PaymentStat } from "../types";

type PaymentsStatsProps = {
  stats: PaymentStat[];
};

export default function PaymentsStats({ stats }: PaymentsStatsProps) {
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {stats.map((stat) => (
        <article
          key={stat.title}
          className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
        >
          <div className="flex items-start justify-between">
            <p className="text-sm text-gray-500">{stat.title}</p>
            <stat.icon className="h-5 w-5 text-indigo-600" />
          </div>
          <p className="mt-3 text-2xl font-semibold text-gray-900">{stat.value}</p>
          <p className="mt-1 text-xs text-gray-500">{stat.note}</p>
        </article>
      ))}
    </section>
  );
}
