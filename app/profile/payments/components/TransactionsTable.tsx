import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useThemeStore } from "@/store/themeStore";
import type { PaymentStatus, PaymentTransaction } from "../types";
import { X } from "lucide-react";

type TransactionsTableProps = {
  payments: PaymentTransaction[];
  onBackToRecent: () => void;
  onLoadMore: () => void;
  hasMore: boolean;
  loadingMore: boolean;
};

export default function TransactionsTable({
  payments,
  onBackToRecent,
  onLoadMore,
  hasMore,
  loadingMore,
}: TransactionsTableProps) {
  const mode = useThemeStore((state) => state.mode);
  const dark = mode === "dark";
  const [openFilterModal, setOpenFilterModal] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState<PaymentStatus[]>([]);
  const [selectedShowTypes, setSelectedShowTypes] = useState<string[]>([]);

  const statusOptions: PaymentStatus[] = ["Success", "Failed", "Refunded"];
  const showTypeOptions = useMemo(() => {
    const values = new Set(
      payments.map((payment) => {
        const value = String(payment.showType || "").trim();
        return value || "N/A";
      })
    );
    return Array.from(values);
  }, [payments]);

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const currentShowType = String(payment.showType || "").trim() || "N/A";
      const statusMatch =
        selectedStatuses.length === 0 || selectedStatuses.includes(payment.status);
      const showTypeMatch =
        selectedShowTypes.length === 0 || selectedShowTypes.includes(currentShowType);
      return statusMatch && showTypeMatch;
    });
  }, [payments, selectedShowTypes, selectedStatuses]);

  const toggleStatus = (status: PaymentStatus) => {
    setSelectedStatuses((prev) =>
      prev.includes(status) ? prev.filter((item) => item !== status) : [...prev, status]
    );
  };

  const toggleShowType = (showType: string) => {
    setSelectedShowTypes((prev) =>
      prev.includes(showType)
        ? prev.filter((item) => item !== showType)
        : [...prev, showType]
    );
  };

  const clearFilters = () => {
    setSelectedStatuses([]);
    setSelectedShowTypes([]);
  };

  const activeFilterCount = selectedStatuses.length + selectedShowTypes.length;

  return (
    <section
      className={`rounded-2xl border p-5 shadow-sm select-none ${dark ? "border-zinc-800 bg-[#18181b]" : "border-gray-200 bg-white"
        } dark:bg-[#18181b] dark:border-zinc-800`}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className={`text-lg font-bold ${dark ? "text-white" : "text-gray-900"} dark:text-white`}>
            All Transactions
          </h2>
        </div>
        <div className="space-x-2">


          <button
            type="button"
            onClick={() => setOpenFilterModal(true)}
            className={`cursor-pointer rounded-md border px-2 py-1 text-[10px] font-semibold normal-case tracking-normal ${activeFilterCount > 0
              ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800"
              : dark
                ? "border-zinc-700 bg-zinc-800 text-zinc-200"
                : "border-gray-300 bg-white text-gray-700"
              }`}
          >
            Filter{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
          </button>
          <button
            onClick={onBackToRecent}
            className={`cursor-pointer rounded-lg border px-3 py-1.5 text-sm font-semibold transition ${dark
                ? "border-zinc-700 bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
                : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              }`}
          >
            Back to recent
          </button>
        </div>

      </div>

      <div className={`max-h-[460px] overflow-auto rounded-xl border ${dark ? "border-zinc-800" : "border-gray-200"} dark:border-zinc-800`}>
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className={`sticky top-0 z-10 shadow-sm ${dark ? "bg-[#18181b] text-zinc-300" : "bg-white text-gray-700"}`}>
            <tr className={`border-b text-xs uppercase tracking-[0.08em] ${dark ? "border-zinc-800 text-zinc-400" : "border-gray-200 text-gray-700"}`}>
              <th className="px-4 py-3 font-bold">Transaction ID</th>
              <th className="px-4 py-3 font-bold">Title</th>
              <th className="px-4 py-3 font-bold"> Type</th>
              <th className="px-4 py-3 font-bold">Date</th>
              <th className="px-4 py-3 font-bold">Method</th>
              <th className="px-4 py-3 font-bold">Status</th>
              <th className="px-4 py-3 text-right font-bold">Amount</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.length === 0 && (
              <tr>
                <td colSpan={7} className={`px-4 py-10 text-center text-sm ${dark ? "text-zinc-400" : "text-gray-500"} dark:text-zinc-400`}>
                  No transactions found.
                </td>
              </tr>
            )}
            {filteredPayments.map((payment) => (
              <tr
                key={payment.id}
                className={`border-b transition ${dark
                    ? "border-zinc-800/60 bg-[#18181b] hover:bg-zinc-800/40"
                    : "border-gray-100 bg-white hover:bg-gray-50"
                  }`}
              >
                <td className={`px-4 py-3 text-xs font-medium ${dark ? "text-zinc-300" : "text-gray-700"} dark:text-zinc-300`}>
                  {payment.id}
                </td>
                <td className={`px-4 py-3 ${dark ? "text-white" : "text-gray-900"} dark:text-white`}>
                  <div className="flex flex-col">
                    <span className="font-medium">{payment.title}</span>
                  </div>
                </td>
                <td className={`px-4 py-3 ${dark ? "text-zinc-400" : "text-gray-600"} dark:text-zinc-400`}>
                  <span className={`rounded-full px-2.5 py-1 text-xs uppercase ${dark ? "bg-zinc-800 text-zinc-300 border border-zinc-700/60" : "bg-gray-100 text-gray-700 ring-1 ring-gray-200"
                    }`}>
                    {payment.showType || "N/A"}
                  </span>
                </td>
                <td className={`px-4 py-3 ${dark ? "text-zinc-400" : "text-gray-600"} dark:text-zinc-400`}>{payment.date}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs uppercase ${dark ? "bg-zinc-800 text-zinc-300 border border-zinc-700/60" : "bg-gray-100 text-gray-700 ring-1 ring-gray-200"
                    }`}>
                    {payment.method}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full border px-2.5 py-1 text-xs font-medium ${payment.status === "Success"
                      ? dark ? "border-emerald-800/40 bg-emerald-950/60 text-emerald-300" : "border-emerald-500 text-emerald-900 bg-emerald-100"
                      : payment.status === "Refunded"
                        ? dark ? "border-amber-800/40 bg-amber-950/60 text-amber-300" : "border-amber-300 bg-amber-300 text-amber-900"
                        : dark ? "border-rose-800/40 bg-rose-950/60 text-rose-300" : "border-red-300 bg-red-100 text-red-800"
                      }`}
                  >
                    {payment.status}
                  </span>
                </td>
                <td className={`px-4 py-3 text-right font-semibold ${dark ? "text-white" : "text-gray-900"} dark:text-white`}>
                  ₹{payment.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {openFilterModal &&
        typeof window !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4"
            onClick={() => setOpenFilterModal(false)}
          >
            <div
              className={`w-full max-w-lg rounded-2xl border shadow-xl ${dark ? "border-zinc-700 bg-zinc-900 text-white" : "border-gray-200 bg-white text-gray-900"
                }`}
              onClick={(event) => event.stopPropagation()}
            >
              <div
                className={`flex items-start justify-between border-b px-5 py-4 ${dark ? "border-zinc-700" : "border-gray-200"
                  }`}
              >
                {/* Left Content */}
                <div>
                  <h3 className="text-base font-semibold">Filter Transactions</h3>
                  <p
                    className={`mt-1 text-xs ${dark ? "text-zinc-400" : "text-gray-500"
                      }`}
                  >
                    Filter by show type and payment status.
                  </p>
                </div>

                {/* Right Close Button */}
                <button
                  type="button"
                  onClick={() => setOpenFilterModal(false)}
                  className={`group cursor-pointer rounded-lg p-2 transition-all duration-200 hover:shadow-md ${dark
                    ? "bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  <X size={18} className="transition-transform duration-200 group-hover:rotate-90" />
                </button>
              </div>

              <div className="space-y-5 px-5 py-4">
                <div>
                  <p className={`text-sm font-semibold ${dark ? "text-zinc-200" : "text-gray-900"}`}>
                    Show Type
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {showTypeOptions.map((showType) => {
                      const selected = selectedShowTypes.includes(showType);
                      return (
                        <button
                          key={showType}
                          type="button"
                          onClick={() => toggleShowType(showType)}
                          className={`cursor-pointer rounded-full border px-3 py-1 text-xs font-medium ${selected
                            ? "border-indigo-500 bg-indigo-600 text-white"
                            : dark
                              ? "border-zinc-600 bg-zinc-800 text-zinc-200"
                              : "border-gray-300 bg-gray-100 text-gray-700"
                            }`}
                        >
                          {showType}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <p className={`text-sm font-semibold ${dark ? "text-zinc-200" : "text-gray-900"}`}>
                    Status
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {statusOptions.map((status) => {
                      const selected = selectedStatuses.includes(status);
                      return (
                        <button
                          key={status}
                          type="button"
                          onClick={() => toggleStatus(status)}
                          className={`cursor-pointer rounded-full border px-3 py-1 text-xs font-medium ${selected
                            ? "border-indigo-500 bg-indigo-600 text-white"
                            : dark
                              ? "border-zinc-600 bg-zinc-800 text-zinc-200"
                              : "border-gray-300 bg-gray-100 text-gray-700"
                            }`}
                        >
                          {status}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div
                className={`flex items-center justify-end gap-2 border-t px-5 py-4 ${dark ? "border-zinc-700" : "border-gray-200"
                  }`}
              >
                <button
                  type="button"
                  onClick={clearFilters}
                  className={`cursor-pointer rounded-lg px-3 py-1.5 text-sm font-medium ${dark ? "bg-zinc-800 text-zinc-100 hover:bg-zinc-700" : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    }`}
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={() => setOpenFilterModal(false)}
                  className="cursor-pointer rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-500"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {hasMore && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={onLoadMore}
            disabled={loadingMore}
            className="cursor-pointer rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loadingMore ? "Loading..." : "Load more"}
          </button>
        </div>
      )}
    </section>
  );
}
