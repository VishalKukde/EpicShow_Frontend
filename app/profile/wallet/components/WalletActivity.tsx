import { ArrowDownLeft, ArrowUpRight, RefreshCw } from "lucide-react";
import type { WalletTransaction } from "../constants";

type WalletActivityProps = {
  mode: "light" | "dark";
  transactions: WalletTransaction[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  onRefresh?: () => void;
};

export default function WalletActivity({
  mode,
  transactions,
  loading,
  loadingMore,
  hasMore,
  onLoadMore,
  onRefresh,
}: WalletActivityProps) {
  const isDark = mode === "dark";

  return (
    <section className={`overflow-hidden rounded-2xl border p-4 shadow-sm sm:p-5 ${isDark ? "dark:border-zinc-800 dark:bg-[#18181b]" : "border-gray-200 bg-white"}`}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className={`text-lg font-semibold ${isDark ? "text-zinc-100" : "text-foreground"}`}>Wallet Activity</h2>
          <p className={`text-sm ${isDark ? "text-zinc-400" : "text-muted-foreground"}`}>
            Latest credit and debit records
          </p>
        </div>
        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            disabled={loading}
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
              isDark
                ? "border-zinc-700/70 bg-[#18181b] text-zinc-200 hover:bg-zinc-800 disabled:opacity-50"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-sm disabled:opacity-50"
            }`}
            title="Refresh transactions"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        )}
      </div>

      <div className="space-y-3">
        {loading && (
          <div className="max-h-[52vh] space-y-3 overflow-y-auto pr-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300 dark:scrollbar-thumb-zinc-700 sm:max-h-[60vh] lg:max-h-[540px]">
            {Array.from({ length: 3 }).map((_, index) => (
              <article
                key={`wallet-txn-skeleton-${index}`}
                className="animate-pulse rounded-xl border border-gray-200 bg-muted/30 p-4 dark:border-zinc-800/80 dark:bg-zinc-900/50"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-lg bg-gray-200 dark:bg-zinc-800" />
                    <div className="space-y-2">
                      <div className="h-3 w-44 rounded bg-gray-200 dark:bg-zinc-800" />
                      <div className="h-2.5 w-32 rounded bg-gray-200 dark:bg-zinc-800" />
                    </div>
                  </div>
                  <div className="h-6 w-20 rounded-full bg-gray-200 dark:bg-zinc-800" />
                </div>
              </article>
            ))}
          </div>
        )}

        {!loading && transactions.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-muted/30 p-6 text-center text-sm text-muted-foreground dark:border-zinc-700/60 dark:bg-zinc-900/40">
            <p className={`font-semibold ${isDark ? "text-zinc-200" : "text-foreground"}`}>No wallet transactions yet.</p>
            <p className={`mt-1 text-xs ${isDark ? "text-zinc-400" : "text-muted-foreground"}`}>
              If your recent transaction hasn't appeared yet, click below to reload.
            </p>
            {onRefresh && (
              <button
                type="button"
                onClick={onRefresh}
                className={`mt-3.5 inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                  isDark
                    ? "border-zinc-700/70 bg-[#18181b] text-zinc-200 hover:bg-zinc-800"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-sm"
                }`}
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Reload Transactions</span>
              </button>
            )}
          </div>
        )}

        {!loading && transactions.length > 0 && (
          <>
            <div className="max-h-[52vh] space-y-3 overflow-y-auto pr-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300 dark:scrollbar-thumb-zinc-700 sm:max-h-[60vh] lg:max-h-[540px]">
              {transactions.map((txn) => {
                const isCredit = txn.type === "credit";

                return (
                  <article
                    key={txn.id}
                    className="rounded-xl border border-gray-200 bg-muted/40 p-4 dark:border-zinc-800/80 dark:bg-zinc-900/60"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div
                          className={`rounded-lg p-2 ${
                            isCredit
                              ? isDark ? "bg-emerald-500/15" : "bg-emerald-100"
                              : isDark ? "bg-amber-500/15" : "bg-amber-100"
                          }`}
                        >
                          {isCredit ? (
                            <ArrowDownLeft
                              className={`h-4 w-4 ${
                                isDark ? "text-emerald-400" : "text-emerald-700"
                              }`}
                            />
                          ) : (
                            <ArrowUpRight
                              className={`h-4 w-4 ${
                                isDark ? "text-amber-400" : "text-amber-700"
                              }`}
                            />
                          )}
                        </div>
                        <div>
                          <p className={`font-medium ${isDark ? "text-zinc-100" : "text-foreground"}`}>{txn.title}</p>
                          <p className={`text-xs ${isDark ? "text-zinc-400" : "text-muted-foreground"}`}>
                            {txn.id} • {txn.date}
                          </p>
                        </div>
                      </div>
                      <p
                        className={`inline-flex min-w-[92px] items-center justify-center rounded-full border px-2.5 py-1 text-center text-xs font-semibold leading-none tabular-nums ${
                          isCredit
                            ? isDark
                              ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-300"
                              : "border-emerald-300 bg-emerald-100 text-emerald-800"
                            : isDark
                              ? "border-amber-500/40 bg-amber-500/15 text-amber-300"
                              : "border-amber-300 bg-amber-100 text-amber-800"
                        }`}
                      >
                        {isCredit ? "+" : "-"}₹{txn.amount.toFixed(2)}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>

            {(hasMore || loadingMore) && (
              <div className="flex flex-col items-center justify-center gap-2 pt-2">
                {hasMore && !loadingMore ? (
                  <button
                    type="button"
                    onClick={onLoadMore}
                    className="inline-flex min-h-10 items-center justify-center rounded-xl border border-gray-300 bg-white px-6 py-2 text-sm font-semibold text-gray-900 shadow-sm transition hover:border-gray-400 hover:bg-gray-50 dark:border-zinc-700/70 dark:bg-[#18181b] dark:text-zinc-100 dark:hover:border-zinc-600 dark:hover:bg-zinc-800"
                  >
                    Load More
                  </button>
                ) : null}

                {loadingMore ? (
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm dark:bg-[#18181b] dark:text-zinc-200 dark:border dark:border-zinc-800">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-700 dark:border-zinc-600 dark:border-t-zinc-200" />
                    Loading more activity...
                  </div>
                ) : null}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
