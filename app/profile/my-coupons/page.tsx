"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BadgePercent, Clock3, Sparkles } from "lucide-react";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import ProfileLayout from "@/app/profile/layout";
import { useThemeStore } from "@/store/themeStore";
import { apiFetch } from "@/lib/api";
import { formatOfferDate, getBookingTypeLabel } from "@/lib/offers";
import type { MyCouponsResponse, UserCoupon } from "@/types/Offer";

type CouponFilter = "ACTIVE" | "USED" | "EXPIRED";

function MyCouponsContent() {
  const mode = useThemeStore((s) => s.mode);
  const dark = mode === "dark";
  const [filter, setFilter] = useState<CouponFilter>("ACTIVE");
  const [data, setData] = useState<MyCouponsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadCoupons = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = (await apiFetch("/my-coupons")) as MyCouponsResponse;

        if (cancelled) return;
        setData(response);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load coupons");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadCoupons();

    return () => {
      cancelled = true;
    };
  }, []);

  const coupons = data?.grouped?.[filter] || [];

  return (
    <div className="space-y-6 px-3 py-3 pb-6 select-none sm:px-4 lg:px-0">
      <section
        className={`rounded-[2rem] border px-6 py-7 shadow-[0_20px_50px_rgba(15,23,42,0.08)] sm:px-8 ${
          dark
            ? "border-zinc-800 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.16),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.14),transparent_28%),linear-gradient(135deg,#09090b,#111827)]"
            : "border-slate-200 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.16),transparent_36%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.14),transparent_28%),linear-gradient(135deg,#ffffff,#f8fafc)]"
        }`}
      >
        <p className={`inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] ${dark ? "text-sky-300" : "text-sky-700"}`}>
          <Sparkles className="h-4 w-4" />
          My Coupons
        </p>
        <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className={`text-3xl font-semibold ${dark ? "text-zinc-50" : "text-slate-900"}`}>
              Keep every collected coupon in one place.
            </h1>
            <p className={`mt-3 max-w-2xl text-sm leading-6 ${dark ? "text-zinc-300" : "text-slate-600"}`}>
              Active coupons are ready for checkout, used coupons stay here for history, and expired ones remain visible so you know what has already passed.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 sm:min-w-[360px]">
            <StatCard label="Active" value={data?.counts.active ?? 0} dark={dark} />
            <StatCard label="Used" value={data?.counts.used ?? 0} dark={dark} />
            <StatCard label="Expired" value={data?.counts.expired ?? 0} dark={dark} />
          </div>
        </div>
      </section>

      <section className="flex flex-wrap gap-3">
        {(["ACTIVE", "USED", "EXPIRED"] as CouponFilter[]).map((status) => {
          const count =
            status === "ACTIVE"
              ? data?.counts.active ?? 0
              : status === "USED"
                ? data?.counts.used ?? 0
                : data?.counts.expired ?? 0;

          return (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition cursor-pointer ${
                filter === status
                  ? dark
                    ? "border-sky-400 bg-sky-400 text-slate-950"
                    : "border-slate-900 bg-slate-900 text-white"
                  : dark
                    ? "border-zinc-700 bg-zinc-900 text-zinc-200 hover:bg-zinc-800"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              {status === "ACTIVE" ? "Active" : status === "USED" ? "Used" : "Expired"} ({count})
            </button>
          );
        })}
      </section>

      {loading ? (
        <section className="grid gap-4 xl:grid-cols-2">
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              className={`h-60 animate-pulse rounded-[1.75rem] border ${
                dark ? "border-zinc-800 bg-zinc-900" : "border-slate-200 bg-white"
              }`}
            />
          ))}
        </section>
      ) : error ? (
        <section
          className={`rounded-3xl border px-4 py-4 text-sm ${
            dark ? "border-red-700 bg-red-500/10 text-red-300" : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {error}
        </section>
      ) : coupons.length === 0 ? (
        <section
          className={`rounded-[1.75rem] border px-6 py-10 text-center ${
            dark ? "border-zinc-800 bg-zinc-900" : "border-slate-200 bg-white"
          }`}
        >
          <div
            className={`mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl ${
              dark ? "bg-zinc-800 text-zinc-100" : "bg-slate-100 text-slate-700"
            }`}
          >
            <BadgePercent className="h-6 w-6" />
          </div>
          <p className={`mt-4 text-xl font-semibold ${dark ? "text-zinc-50" : "text-slate-900"}`}>
            No {filter.toLowerCase()} coupons right now
          </p>
          <p className={`mt-2 text-sm ${dark ? "text-zinc-400" : "text-slate-600"}`}>
            Browse the public offers page, collect the deals you like, and they will show up here automatically.
          </p>
          <Link
            href="/offers"
            className={`mt-5 inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium ${
              dark ? "bg-zinc-100 text-zinc-900 hover:bg-white" : "bg-slate-900 text-white hover:bg-black"
            }`}
          >
            Browse Offers
          </Link>
        </section>
      ) : (
        <section className="grid gap-4 xl:grid-cols-2">
          {coupons.map((coupon) => (
            <CouponCard key={coupon._id} coupon={coupon} dark={dark} />
          ))}
        </section>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  dark,
}: {
  label: string;
  value: number;
  dark: boolean;
}) {
  return (
    <div className={`rounded-2xl border px-4 py-3 ${dark ? "border-white/10 bg-white/5" : "border-white bg-white shadow-sm"}`}>
      <p className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${dark ? "text-zinc-400" : "text-slate-500"}`}>
        {label}
      </p>
      <p className={`mt-2 text-2xl font-semibold ${dark ? "text-zinc-50" : "text-slate-900"}`}>
        {value}
      </p>
    </div>
  );
}

function CouponCard({
  coupon,
  dark,
}: {
  coupon: UserCoupon;
  dark: boolean;
}) {
  const statusTone =
    coupon.status === "ACTIVE"
      ? dark
        ? "bg-emerald-500/15 text-emerald-300"
        : "bg-emerald-100 text-emerald-700"
      : coupon.status === "USED"
        ? dark
          ? "bg-sky-500/15 text-sky-300"
          : "bg-sky-100 text-sky-700"
        : dark
          ? "bg-amber-500/15 text-amber-300"
          : "bg-amber-100 text-amber-700";

  return (
    <article
      className={`rounded-[1.75rem] border p-5 shadow-[0_16px_36px_rgba(15,23,42,0.08)] ${
        dark ? "border-zinc-800 bg-zinc-900" : "border-slate-200 bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${dark ? "text-zinc-400" : "text-slate-500"}`}>
            {coupon.categoryTitle}
          </p>
          <h2 className={`mt-2 text-xl font-semibold ${dark ? "text-zinc-50" : "text-slate-900"}`}>
            {coupon.title}
          </h2>
        </div>
        <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${statusTone}`}>
          {coupon.status}
        </span>
      </div>

      <p className={`mt-3 text-sm leading-6 ${dark ? "text-zinc-400" : "text-slate-600"}`}>
        {coupon.description}
      </p>

      <div className={`mt-4 grid gap-3 rounded-2xl border p-4 md:grid-cols-2 ${dark ? "border-white/10 bg-black/20" : "border-slate-200 bg-slate-50"}`}>
        <MetaRow label="Coupon Code" value={coupon.code} dark={dark} />
        <MetaRow label="Discount" value={coupon.discountLabel} dark={dark} />
        <MetaRow label="Collected" value={formatOfferDate(coupon.collectedAt)} dark={dark} />
        <MetaRow label="Valid Till" value={formatOfferDate(coupon.validTill)} dark={dark} />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {coupon.applicableBookingTypes.map((type) => (
          <span
            key={type}
            className={`rounded-full px-2.5 py-1 text-[11px] ${
              dark ? "bg-zinc-800 text-zinc-300" : "bg-slate-100 text-slate-600"
            }`}
          >
            {getBookingTypeLabel(type)}
          </span>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {coupon.conditions.map((condition) => (
          <span
            key={condition}
            className={`rounded-full px-2.5 py-1 text-[11px] ${
              dark ? "bg-zinc-800 text-zinc-300" : "bg-slate-100 text-slate-600"
            }`}
          >
            {condition}
          </span>
        ))}
      </div>

      {coupon.usedAt ? (
        <div className={`mt-4 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs ${dark ? "bg-zinc-800 text-zinc-300" : "bg-slate-100 text-slate-600"}`}>
          <Clock3 className="h-3.5 w-3.5" />
          Used on {formatOfferDate(coupon.usedAt)}
        </div>
      ) : null}
    </article>
  );
}

function MetaRow({
  label,
  value,
  dark,
}: {
  label: string;
  value: string;
  dark: boolean;
}) {
  return (
    <div>
      <p className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${dark ? "text-zinc-500" : "text-slate-500"}`}>
        {label}
      </p>
      <p className={`mt-1 text-sm font-medium ${dark ? "text-zinc-100" : "text-slate-900"}`}>
        {value}
      </p>
    </div>
  );
}

export default function MyCouponsPage() {
  return (
        <MyCouponsContent />
  );
}
