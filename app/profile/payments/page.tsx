"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { apiDownload, apiFetch } from "@/lib/api";
import ExportStatementModal, {
  type StatementType,
} from "./components/ExportStatementModal";
import NextAutoDebitCard from "./components/NextAutoDebitCard";
import PaymentMethodsCard from "./components/PaymentMethodsCard";
import PaymentsHero from "./components/PaymentsHero";
import PaymentsStats from "./components/PaymentsStats";
import RecentTransactionsCard from "./components/RecentTransactionsCard";
import SecurePaymentCard from "./components/SecurePaymentCard";
import TransactionsTable from "./components/TransactionsTable";
import { buildPaymentStats, savedMethods } from "./data";
import type { PaymentStat, PaymentStatus, PaymentTransaction } from "./types";

type PaymentTransactionApiItem = {
  id: string;
  title: string;
  date: string;
  method: string;
  amount: number;
  status: string;
  showType:string
};

type PaymentStatsApi = {
  totalSpent?: number;
  successfulBookings?: number;
};

function formatPaymentMethod(method: string) {
  const value = (method || "").toLowerCase();
  if (value === "upi") return "UPI";
  if (value === "card") return "Card";
  if (value === "wallet") return "Wallet";
  return method || "Unknown";
}

function formatPaymentStatus(status: string): PaymentStatus {
  const value = (status || "").toLowerCase();
  if (value === "success") return "Success";
  if (value === "refunded") return "Refunded";
  return "Failed";
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

export default function PaymentsPage() {
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [statementType, setStatementType] = useState<StatementType>("wallet");
  const [downloadingStatement, setDownloadingStatement] = useState(false);
  const [exportError, setExportError] = useState("");
  const [stats, setStats] = useState<PaymentStat[]>(
    buildPaymentStats({ totalSpent: 0, successfulBookings: 0, savedMethodsCount: savedMethods.length })
  );

  const fetchTransactions = useCallback(
    async ({
      nextPage,
      append,
    }: {
      nextPage: number;
      append: boolean;
    }) => {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoadingTransactions(true);
      }

      try {
        const result = await apiFetch(`/payment/transactions?limit=10&page=${nextPage}`);

        const mapped = ((result?.transactions ?? []) as PaymentTransactionApiItem[]).map(
          (txn) => ({
            id: txn.id,
            title: txn.title,
            date: formatDate(txn.date),
            showType: txn.showType,
            method: formatPaymentMethod(txn.method),
            amount: Number(txn.amount ?? 0),
            status: formatPaymentStatus(txn.status),
          })
        );

        setTransactions((prev) => (append ? [...prev, ...mapped] : mapped));
        setHasMore(Boolean(result?.hasMore));
        if (!append) {
          const apiStats = (result?.stats ?? {}) as PaymentStatsApi;
          setStats(
            buildPaymentStats({
              totalSpent: Number(apiStats.totalSpent ?? 0),
              successfulBookings: Number(apiStats.successfulBookings ?? 0),
              savedMethodsCount: savedMethods.length,
            })
          );
        }
        setPage(nextPage);
      } catch {
        if (!append) {
          setTransactions([]);
          setStats(
            buildPaymentStats({
              totalSpent: 0,
              successfulBookings: 0,
              savedMethodsCount: savedMethods.length,
            })
          );
        }
        setHasMore(false);
      } finally {
        setLoadingTransactions(false);
        setLoadingMore(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchTransactions({ nextPage: 1, append: false });
  }, [fetchTransactions]);

  const handleDownloadStatement = async () => {
    setDownloadingStatement(true);
    setExportError("");
    try {
      const { blob, fileName } = await apiDownload("/payment/export-statement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: statementType }),
      });

      const blobUrl = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = blobUrl;
      anchor.download = fileName || "statement.xlsx";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.URL.revokeObjectURL(blobUrl);
      setShowExportModal(false);
    } catch (error) {
      setExportError(
        error instanceof Error ? error.message : "Failed to download statement"
      );
    } finally {
      setDownloadingStatement(false);
    }
  };

  const recentTransactions = useMemo(() => transactions.slice(0, 4), [transactions]);

  return (
    <div className="space-y-6 px-3 py-3 pb-6 select-none sm:px-4 lg:px-0">
      <PaymentsHero onExportClick={() => setShowExportModal(true)} />
      <PaymentsStats stats={stats} />

      {!showAllTransactions ? (
        <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <RecentTransactionsCard
            payments={recentTransactions}
            onViewAll={() => setShowAllTransactions(true)}
            loading={loadingTransactions}
          />
          <div className="space-y-4">
            <PaymentMethodsCard methods={savedMethods} />
            <SecurePaymentCard />
            <NextAutoDebitCard />
          </div>
        </section>
      ) : (
        <section className="space-y-4">
          <TransactionsTable
            payments={transactions}
            onBackToRecent={() => setShowAllTransactions(false)}
            onLoadMore={() => fetchTransactions({ nextPage: page + 1, append: true })}
            hasMore={hasMore}
            loadingMore={loadingMore}
          />
        </section>
      )}

      <ExportStatementModal
        open={showExportModal}
        selectedType={statementType}
        downloading={downloadingStatement}
        error={exportError}
        onClose={() => {
          if (!downloadingStatement) {
            setShowExportModal(false);
          }
        }}
        onSelectType={setStatementType}
        onConfirm={handleDownloadStatement}
      />
    </div>
  );
}
