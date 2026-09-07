import { ArrowUpRight } from "lucide-react";
import type { PaymentTransaction } from "../types";
import { useThemeStore } from "@/store/themeStore";

type RecentTransactionsCardProps = {
  payments: PaymentTransaction[];
  onViewAll: () => void;
  loading: boolean;
};

export default function RecentTransactionsCard({
  payments,
  onViewAll,
  loading,
}: RecentTransactionsCardProps) {

  const mode = useThemeStore((state) => state.mode)
  const dark = mode === "dark";

  return (
    <div
      className={`rounded-2xl border p-5 shadow-sm xl:col-span-2 ${dark ? "border-zinc-800 bg-[#18181b]" : "border-gray-200 bg-white"
        } dark:bg-[#18181b] dark:border-zinc-800`}
    >
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className={`text-lg font-bold ${dark ? "text-white" : "text-gray-900"} dark:text-white`}>
            Recent Transactions
          </h2>
          <p className={`text-sm ${dark ? "text-zinc-400" : "text-gray-500"} dark:text-zinc-400`}>
            Your latest payment activity
          </p>
        </div>
        <button
          onClick={onViewAll}
          className={`inline-flex cursor-pointer items-center gap-1 rounded-lg px-2 py-1 text-sm font-semibold text-indigo-600 dark:text-indigo-400 ${dark ? "hover:bg-zinc-800" : "hover:bg-indigo-50"
            }`}
        >
          View all
          <ArrowUpRight className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-3">
        {loading &&
          Array.from({ length: 4 }).map((_, idx) => (
            <article
              key={`payment-skeleton-${idx}`}
              className={`animate-pulse rounded-xl border p-4 ${dark ? "border-zinc-800 bg-zinc-800/60" : "border-gray-200 bg-gray-50/70"
                } dark:bg-zinc-800/60 dark:border-zinc-800`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-2">
                  <div className="h-3 w-44 rounded bg-gray-200 dark:bg-zinc-700" />
                  <div className="h-2.5 w-28 rounded bg-gray-200 dark:bg-zinc-700" />
                </div>
                <div className="h-4 w-16 rounded bg-gray-200 dark:bg-zinc-700" />
              </div>
              <div className="mt-3 flex gap-2">
                <div className="h-5 w-14 rounded-full bg-gray-200 dark:bg-zinc-700" />
                <div className="h-5 w-20 rounded-full bg-gray-200 dark:bg-zinc-700" />
              </div>
            </article>
          ))}

        {!loading && payments.length === 0 && (
          <div
            className={`rounded-xl border border-dashed p-4 text-sm ${dark
              ? "border-zinc-800 bg-zinc-900/40 text-zinc-400"
              : "border-gray-300 bg-gray-50 text-gray-500"
              } dark:bg-zinc-900/40 dark:border-zinc-800 dark:text-zinc-400`}
          >
            No payment transactions yet.
          </div>
        )}
        {!loading &&
          payments.map((payment) => (
            <article
              key={payment.id}
              className={`rounded-xl border p-4 ${dark
                ? "border-zinc-800 bg-zinc-900/60"
                : "border-gray-200 bg-gray-50/70"
                } dark:bg-zinc-900/60 dark:border-zinc-800`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className={`font-semibold ${dark ? "text-white" : "text-gray-900"} dark:text-white`}>
                    {payment.title}
                  </p>
                  {payment.details && (
                    <p className={`mt-1 text-xs ${dark ? "text-zinc-400" : "text-gray-500"} dark:text-zinc-400`}>
                      {payment.details}
                    </p>
                  )}
                  <p className={`${payment.details ? "mt-0.5" : "mt-1"} text-xs ${dark ? "text-zinc-400" : "text-gray-500"} dark:text-zinc-400`}>
                    {payment.id} • {payment.date}
                  </p>
                </div>
                <p className={`text-base font-bold ${dark ? "text-white" : "text-gray-900"} dark:text-white`}>
                  ₹{payment.amount}
                </p>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className={`rounded-full px-2.5 py-1 text-xs uppercase ${dark ? "text-zinc-300 border border-zinc-700/60 bg-zinc-800/60" : "text-gray-600 ring-1 ring-gray-200"
                  }`}>
                  {payment.showType}
                </span>
                <span className={`rounded-full px-2.5 py-1 text-xs uppercase ${dark ? "text-zinc-300 border border-zinc-700/60 bg-zinc-800/60" : "text-gray-600 ring-1 ring-gray-200"
                  }`}>
                  {payment.method}
                </span>
                <span
                  className={`rounded-full border px-2.5 py-1 text-xs font-medium ${payment.status === "Success"
                    ? dark ? "border-emerald-800/40 bg-emerald-950/60 text-emerald-300" : "border-emerald-500 text-emerald-900 bg-emerald-200"
                    : payment.status === "Refunded"
                      ? dark ? "border-amber-800/40 bg-amber-950/60 text-amber-300" : "border-amber-300 bg-amber-300 text-amber-800"
                      : dark ? "border-rose-800/40 bg-rose-950/60 text-rose-300" : "border-red-300 bg-red-100 text-red-800"
                    }`}
                >
                  {payment.status}
                </span>
              </div>
            </article>
          ))}
      </div>
    </div>
  );
}
