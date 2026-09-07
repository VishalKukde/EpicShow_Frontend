import { CalendarClock } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";

export default function NextAutoDebitCard() {
  const mode = useThemeStore((state) => state.mode);
  const dark = mode === "dark";

  return (
    <div
      className={`rounded-2xl border p-5 shadow-sm ${dark ? "border-zinc-800 bg-[#18181b]" : "border-gray-200 bg-white"
        } dark:bg-[#18181b] dark:border-zinc-800`}
    >
      <h3 className={`font-bold ${dark ? "text-white" : "text-gray-900"} dark:text-white`}>Next Auto Debit</h3>
      <p className={`mt-1 text-sm ${dark ? "text-zinc-400" : "text-gray-500"} dark:text-zinc-400`}>No upcoming recurring payments.</p>
      <div className={`mt-4 inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm border ${dark ? "bg-zinc-800/80 text-zinc-300 border-zinc-700/60" : "bg-gray-100 text-gray-700 border-gray-300"
        }`}>
        <CalendarClock className="h-4 w-4" />
        Recurring plans disabled
      </div>
    </div>
  );
}
