import { Gift } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";

export default function WalletUsageHint() {
  const mode = useThemeStore((s) => s.mode);
  const isDark = mode === "dark";
  return (
    <section className={`rounded-2xl border p-4 shadow-sm sm:p-5 ${isDark ? "dark:border-zinc-800 dark:bg-[#18181b]" : "border-gray-200 bg-white"}`}>
      <div className="inline-flex w-full items-start gap-2 rounded-xl border border-amber-700 bg-amber-100 px-3 py-2 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
        <Gift className="mt-0.5 h-4 w-4 shrink-0" />
        <p className="leading-5">
          Use wallet balance during checkout to reduce payment steps and complete
          bookings faster.
        </p>
      </div>
    </section>
  );
}
