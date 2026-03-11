import { useMemo, useState } from "react";
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
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm select-none">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">All Transactions</h2>
        </div>
        <div className="space-x-2">


          <button
            type="button"
            onClick={() => setOpenFilterModal(true)}
            className={`cursor-pointer rounded-md border px-2 py-1 text-[10px] font-semibold normal-case tracking-normal ${activeFilterCount > 0
              ? "border-indigo-500 bg-indigo-50 text-indigo-700"
              : "border-gray-300 bg-white text-gray-700"
              }`}
          >
            Filter{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
          </button>
          <button
            onClick={onBackToRecent}
            className="cursor-pointer rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Back to recent
          </button>
        </div>

      </div>

      <div className="max-h-[460px] overflow-auto rounded-xl border border-gray-200">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="sticky top-0 z-10 bg-white shadow-sm">
            <tr className="border-b border-gray-200 text-xs uppercase tracking-[0.08em] text-gray-700">
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
                <td colSpan={7} className="px-4 py-10 text-center text-sm text-gray-500">
                  No transactions found.
                </td>
              </tr>
            )}
            {filteredPayments.map((payment) => (
              <tr
                key={payment.id}
                className="border-b border-gray-100 bg-white transition hover:bg-gray-50"
              >
                <td className="px-4 py-3 text-xs font-medium text-gray-700">
                  {payment.id}
                </td>
                <td className="px-4 py-3 font-medium text-gray-900">{payment.title}</td>
                <td className="px-4 py-3 text-gray-600">
                  <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-700 ring-1 ring-gray-200 uppercase">
                    {payment.showType || "N/A"}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600">{payment.date}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-700 ring-1 ring-gray-200 uppercase">
                    {payment.method}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full border px-2.5 py-1 text-xs font-medium ${payment.status === "Success"
                      ? dark ? "border-emerald-300 text-emerald-300" : "border-emerald-500 text-emerald-900 bg-emerald-100"
                      : payment.status === "Refunded"
                        ? "border-amber-300 bg-amber-100 text-amber-800"
                        : "border-red-300 bg-red-100 text-red-800"
                      }`}
                  >
                    {payment.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-semibold text-gray-900">
                  ₹{payment.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {openFilterModal && (
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
        </div>
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
