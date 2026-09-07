import type { SecurityTip } from "../data";
import { useThemeStore } from "@/store/themeStore";

type SecurityTipsGridProps = {
  tips: SecurityTip[];
};

export default function SecurityTipsGrid({ tips }: SecurityTipsGridProps) {
  const mode = useThemeStore((state) => state.mode);
  const dark = mode === "dark";

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {tips.map((tip) => (
        <article
          key={tip.title}
          className={`rounded-2xl border p-4 shadow-sm ${dark ? "border-zinc-800 bg-[#18181b]" : "border-gray-200 bg-white"
            } dark:bg-[#18181b] dark:border-zinc-800`}
        >
          <tip.icon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          <p className={`mt-2 font-bold ${dark ? "text-white" : "text-gray-900"} dark:text-white`}>{tip.title}</p>
          <p className={`mt-1 text-xs ${dark ? "text-zinc-400" : "text-gray-500"} dark:text-zinc-400`}>{tip.note}</p>
        </article>
      ))}
    </section>
  );
}
