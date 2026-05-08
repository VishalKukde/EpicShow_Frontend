"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ComponentType } from "react";
import {
  BadgeIndianRupee,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  Loader2,
  RotateCcw,
  Ticket,
  Wallet,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import { useThemeStore } from "@/store/themeStore";
import RefundHero from "./components/RefundHero";

type RefundItem = {
  id: string;
  bookingId: string;
  orderId: string;
  paymentId: string;
  refundId: string;
  status: "refunded" | "refund_initiated";
  refundAmount: number;
  paymentAmount: number;
  currency: string;
  paymentMethod: string;
  bookingStatus: string;
  bookingType: string;
  bookingTitle: string;
  bookingVenue: string;
  bookingDate?: string;
  bookingSlot?: string;
  seatIds: string[];
  ticketCount: number;
  coupon?: string;
  couponDiscount: number;
  rewardPointsRedeemed: number;
  rewardDiscount: number;
  walletBalanceAfter?: number;
  note?: string;
  bookedAt?: string;
  refundedAt: string;
};

type RefundsResponse = {
  refunds?: RefundItem[];
  stats?: {
    totalRefunds: number;
    totalAmount: number;
    completed: number;
    pending: number;
    byType: { type: string; count: number; amount: number }[];
  };
  pagination?: {
    page: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
};

const PAGE_SIZE = 6;

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

function formatCurrency(value: number) {
  return currency.format(Number(value || 0));
}

function formatDate(value?: string) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function labelize(value?: string) {
  if (!value) return "-";
  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function RefundPage() {
  const { user } = useAuth();
  const dark = useThemeStore((s) => s.mode === "dark");
  const [refunds, setRefunds] = useState<RefundItem[]>([]);
  const [stats, setStats] = useState<RefundsResponse["stats"] | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");

  const fetchRefunds = useCallback(async (nextPage: number, append: boolean) => {
    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
      setRefunds([]);
    }
    setError("");

    try {
      const query = new URLSearchParams({
        page: String(nextPage),
        limit: String(PAGE_SIZE),
      });
      const payload = (await apiFetch(`/refunds?${query.toString()}`, {
        notifyOnError: false,
      })) as RefundsResponse;

      const nextRefunds = payload.refunds || [];
      setRefunds((prev) => (append ? [...prev, ...nextRefunds] : nextRefunds));
      setStats(payload.stats || null);
      setHasMore(Boolean(payload.pagination?.hasMore));
      setPage(nextPage);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load refund history");
      if (!append) setRefunds([]);
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    void fetchRefunds(1, false);
  }, [fetchRefunds, user?.id]);

  const byType = useMemo(() => stats?.byType || [], [stats?.byType]);

  return (
    <div className="space-y-6 px-3 py-3 pb-6 select-none sm:px-4 lg:px-0">
      <RefundHero />

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          dark={dark}
          icon={BadgeIndianRupee}
          label="Total Refunded"
          value={formatCurrency(stats?.totalAmount || 0)}
        />
        <StatCard
          dark={dark}
          icon={RotateCcw}
          label="Refund Records"
          value={String(stats?.totalRefunds || 0)}
        />
        <StatCard
          dark={dark}
          icon={CheckCircle2}
          label="Completed"
          value={String(stats?.completed || 0)}
        />
        <StatCard
          dark={dark}
          icon={Clock3}
          label="Processing"
          value={String(stats?.pending || 0)}
        />
      </section>

      {byType.length > 0 ? (
        <section
          className={`rounded-2xl border p-4 ${
            dark ? "border-zinc-700 bg-zinc-900" : "border-gray-200 bg-white"
          }`}
        >
          <div className="flex flex-wrap gap-2">
            {byType.map((item) => (
              <span
                key={item.type}
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${
                  dark
                    ? "border-zinc-700 bg-zinc-800 text-zinc-200"
                    : "border-indigo-100 bg-indigo-50 text-indigo-800"
                }`}
              >
                {labelize(item.type)}
                <span className={dark ? "text-zinc-400" : "text-indigo-500"}>
                  {item.count} • {formatCurrency(item.amount)}
                </span>
              </span>
            ))}
          </div>
        </section>
      ) : null}

      <section
        className={`overflow-hidden rounded-2xl border shadow-sm ${
          dark ? "border-zinc-700 bg-zinc-900" : "border-gray-200 bg-white"
        }`}
      >
        <div
          className={`flex flex-wrap items-center justify-between gap-3 border-b p-4 ${
            dark ? "border-zinc-700" : "border-gray-200"
          }`}
        >
          <div>
            <h2 className={`text-lg font-semibold ${dark ? "text-zinc-50" : "text-gray-950"}`}>
              Refund History
            </h2>
            <p className={`text-sm ${dark ? "text-zinc-400" : "text-gray-500"}`}>
              Admin processed refunds across movies, sports, events, and gaming.
            </p>
          </div>
        </div>

        {error ? (
          <div className="border-b border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
          </div>
        ) : null}

        <div className="space-y-3 p-4">
          {loading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div
                key={`refund-skeleton-${index}`}
                className={`h-36 animate-pulse rounded-xl ${
                  dark ? "bg-zinc-800" : "bg-gray-100"
                }`}
              />
            ))
          ) : refunds.length === 0 ? (
            <div
              className={`rounded-xl border border-dashed p-8 text-center text-sm ${
                dark
                  ? "border-zinc-700 text-zinc-400"
                  : "border-gray-300 text-gray-500"
              }`}
            >
              No refunds found for your account yet.
            </div>
          ) : (
            refunds.map((refund) => (
              <RefundCard key={refund.id} dark={dark} refund={refund} />
            ))
          )}

          {(hasMore || loadingMore) && !loading ? (
            <div className="flex justify-center pt-2">
              <button
                type="button"
                disabled={loadingMore}
                onClick={() => void fetchRefunds(page + 1, true)}
                className={`inline-flex min-h-10 items-center gap-2 rounded-xl border px-5 text-sm font-semibold transition ${
                  dark
                    ? "border-zinc-700 bg-zinc-800 text-zinc-100 hover:bg-zinc-700"
                    : "border-gray-300 bg-white text-gray-900 hover:bg-gray-50"
                } disabled:cursor-not-allowed disabled:opacity-60`}
              >
                {loadingMore ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {loadingMore ? "Loading..." : "Load More"}
              </button>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}

function RefundCard({ refund, dark }: { refund: RefundItem; dark: boolean }) {
  const completed = refund.status === "refunded";
  const savings = Number((refund.couponDiscount || 0) + (refund.rewardDiscount || 0));

  return (
    <article
      className={`rounded-xl border p-4 ${
        dark ? "border-zinc-700 bg-zinc-950/40" : "border-gray-200 bg-gray-50"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase ${
                completed
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {completed ? "Refunded" : "Processing"}
            </span>
            <span className={`text-xs font-semibold ${dark ? "text-zinc-400" : "text-gray-500"}`}>
              {labelize(refund.bookingType)}
            </span>
          </div>
          <h3 className={`mt-2 text-base font-semibold ${dark ? "text-zinc-50" : "text-gray-950"}`}>
            {refund.bookingTitle}
          </h3>
          <p className={`mt-1 text-sm ${dark ? "text-zinc-400" : "text-gray-500"}`}>
            {refund.bookingVenue}
          </p>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
            Credited to wallet
          </p>
          <p className={`mt-1 text-xl font-bold ${dark ? "text-zinc-50" : "text-gray-950"}`}>
            {formatCurrency(refund.refundAmount)}
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Detail dark={dark} icon={CalendarDays} label="Booked For" value={[refund.bookingDate, refund.bookingSlot].filter(Boolean).join(" at ") || "-"} />
        <Detail dark={dark} icon={Ticket} label="Seats" value={refund.seatIds?.length ? refund.seatIds.join(", ") : `${refund.ticketCount || 0} ticket(s)`} />
        <Detail dark={dark} icon={CreditCard} label="Payment" value={`${labelize(refund.paymentMethod)} • ${formatCurrency(refund.paymentAmount)}`} />
        <Detail dark={dark} icon={Wallet} label="Refunded On" value={formatDate(refund.refundedAt)} />
      </div>

      <div
        className={`mt-4 grid gap-2 rounded-xl border p-3 text-xs ${
          dark ? "border-zinc-700 bg-zinc-900 text-zinc-300" : "border-gray-200 bg-white text-gray-600"
        } sm:grid-cols-2 lg:grid-cols-3`}
      >
        <Meta label="Booking ID" value={refund.bookingId} />
        <Meta label="Payment ID" value={refund.paymentId || "-"} />
        <Meta label="Refund ID" value={refund.refundId || "-"} />
        <Meta label="Order ID" value={refund.orderId || "-"} />
        <Meta label="Booking Status" value={labelize(refund.bookingStatus)} />
        <Meta label="Savings Applied" value={savings ? formatCurrency(savings) : "-"} />
      </div>
    </article>
  );
}

function StatCard({
  dark,
  icon: Icon,
  label,
  value,
}: {
  dark: boolean;
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div
      className={`rounded-2xl border p-4 ${
        dark ? "border-zinc-700 bg-zinc-900" : "border-gray-200 bg-white"
      }`}
    >
      <div className="flex items-center gap-3">
        <span className={`grid h-10 w-10 place-items-center rounded-xl border ${
                  dark
                    ? "border-zinc-700 bg-zinc-800 text-zinc-200"
                    : "border-indigo-200 bg-indigo-50 text-indigo-800"
                }`}>
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className={`text-xs font-semibold uppercase tracking-wide ${dark ? "text-zinc-400" : "text-gray-500"}`}>
            {label}
          </p>
          <p className={`mt-1 truncate text-lg font-bold ${dark ? "text-zinc-50" : "text-gray-950"}`}>
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

function Detail({
  dark,
  icon: Icon,
  label,
  value,
}: {
  dark: boolean;
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 items-start gap-2">
      <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${dark ? "text-zinc-500" : "text-gray-400"}`} />
      <div className="min-w-0">
        <p className={`text-[11px] font-semibold uppercase tracking-wide ${dark ? "text-zinc-500" : "text-gray-400"}`}>
          {label}
        </p>
        <p className={`mt-0.5 break-words text-sm font-medium ${dark ? "text-zinc-200" : "text-gray-800"}`}>
          {value}
        </p>
      </div>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="font-semibold uppercase tracking-wide opacity-60">{label}</p>
      <p className="mt-0.5 break-words font-bold">{value || "-"}</p>
    </div>
  );
}
