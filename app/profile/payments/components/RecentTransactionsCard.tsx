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
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm xl:col-span-2">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
          <p className="text-sm text-gray-500">Your latest payment activity</p>
        </div>
        <button
          onClick={onViewAll}
          className={`inline-flex cursor-pointer items-center gap-1 rounded-lg px-2 py-1 text-sm font-medium text-indigo-700 ${dark ? "hover:bg-indigo-800" : "hover:bg-indigo-50"}`}
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
              className="animate-pulse rounded-xl border border-gray-200 bg-gray-50/70 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-2">
                  <div className="h-3 w-44 rounded bg-gray-200" />
                  <div className="h-2.5 w-28 rounded bg-gray-200" />
                </div>
                <div className="h-4 w-16 rounded bg-gray-200" />
              </div>
              <div className="mt-3 flex gap-2">
                <div className="h-5 w-14 rounded-full bg-gray-200" />
                <div className="h-5 w-20 rounded-full bg-gray-200" />
              </div>
            </article>
          ))}

        {!loading && payments.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4 text-sm text-gray-500">
            No payment transactions yet.
          </div>
        )}
        {!loading &&
          payments.map((payment) => (
          <article
            key={payment.id}
            className="rounded-xl border border-gray-200 bg-gray-50/70 p-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-medium text-gray-900">{payment.title}</p>
                {payment.details && (
                  <p className="mt-1 text-xs text-gray-500">{payment.details}</p>
                )}
                <p className={`${payment.details ? "mt-0.5" : "mt-1"} text-xs text-gray-500`}>
                  {payment.id} • {payment.date}
                </p>
              </div>
              <p className="text-base font-semibold text-gray-900">₹{payment.amount}</p>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
               <span className="rounded-full px-2.5 py-1 text-xs text-gray-600 ring-1 ring-gray-200 uppercase">
                {payment.showType}
              </span>
              <span className="rounded-full px-2.5 py-1 text-xs text-gray-600 ring-1 ring-gray-200 uppercase">
                {payment.method}
              </span>
              <span
                className={`rounded-full border px-2.5 py-1 text-xs font-medium ${
                  payment.status === "Success"
                    ?  dark ? "border-emerald-300 text-emerald-300" : "border-emerald-500 text-emerald-900 bg-emerald-200"
                    : payment.status === "Refunded"
                      ? "border-amber-300 bg-amber-300 text-amber-800"
                      : "border-red-300 bg-red-100 text-red-800"
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
