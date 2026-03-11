import type { SecurityTip } from "../data";

type SecurityTipsGridProps = {
  tips: SecurityTip[];
};

export default function SecurityTipsGrid({ tips }: SecurityTipsGridProps) {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {tips.map((tip) => (
        <article
          key={tip.title}
          className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
        >
          <tip.icon className="h-5 w-5 text-indigo-600" />
          <p className="mt-2 font-medium text-gray-900">{tip.title}</p>
          <p className="mt-1 text-xs text-gray-500">{tip.note}</p>
        </article>
      ))}
    </section>
  );
}
