"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  BadgePercent,
  Clock3,
  Sparkles,
  MoreVertical,
  Copy,
  Check,
  Calendar,
  TicketPercent,
  Tag,
  X,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  ExternalLink,
  Layers,
  Scissors,
} from "lucide-react";
import { useThemeStore } from "@/store/themeStore";
import { apiFetch } from "@/lib/api";
import { toast } from "@/lib/toast";
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
  const [selectedCoupon, setSelectedCoupon] = useState<UserCoupon | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

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

  const handleCopyCode = (code: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(code);
      toast.success(`Coupon code ${code} copied to clipboard!`);
      setCopiedCode(code);
      setTimeout(() => {
        setCopiedCode((prev) => (prev === code ? null : prev));
      }, 2000);
    }
  };

  const coupons = data?.grouped?.[filter] || [];

  return (
    <div className="space-y-5 px-3 py-2 pb-8 select-none sm:px-4 lg:px-0">
      {/* Top Admin-Style Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-b pb-4 border-slate-200 dark:border-zinc-800">
        <div>
          <h1 className={`text-xl sm:text-2xl font-black tracking-tight ${dark ? "text-zinc-50" : "text-slate-900"}`}>
            My Coupons
          </h1>
          <p className={`text-xs font-medium mt-0.5 ${dark ? "text-zinc-400" : "text-slate-500"}`}>
            Active vouchers allocated to your wallet. Directly applicable at checkout.
          </p>
        </div>

        {/* Action Controls: Tabs & Explore Offers */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Filter Tabs */}
          <section className="flex flex-wrap items-center gap-2">
            {(["ACTIVE", "USED", "EXPIRED"] as CouponFilter[]).map((status) => {
              const count =
                status === "ACTIVE"
                  ? data?.counts.active ?? 0
                  : status === "USED"
                    ? data?.counts.used ?? 0
                    : data?.counts.expired ?? 0;

              const isSelected = filter === status;

              return (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                    isSelected
                      ? dark
                        ? "border-zinc-700/70 bg-[#18181b] text-zinc-100 shadow-sm"
                        : "border-slate-900 bg-slate-900 text-white shadow-md shadow-slate-900/20"
                      : dark
                        ? "border-zinc-800 bg-[#18181b]/50 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-800 hover:text-zinc-200"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <span>
                    {status === "ACTIVE" ? "Active" : status === "USED" ? "Redeemed" : "Expired"}
                  </span>
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] font-extrabold ${
                      isSelected
                        ? dark
                          ? "bg-zinc-800 text-zinc-200"
                          : "bg-white/20 text-white"
                        : dark
                          ? "bg-zinc-800/80 text-zinc-400"
                          : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </section>

          <Link
            href="/offers"
            className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition cursor-pointer shadow-sm ${
              dark
                ? "border border-zinc-700/70 bg-[#18181b] text-zinc-100 hover:bg-zinc-800"
                : "bg-slate-900 text-white hover:bg-slate-800"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>Explore Offers</span>
          </Link>
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading ? (
        <section className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => (
            <div
              key={index}
              className={`h-36 animate-pulse rounded-xl border ${
                dark ? "border-zinc-800 bg-[#18181b]" : "border-slate-200 bg-white"
              }`}
            />
          ))}
        </section>
      ) : error ? (
        <section
          className={`rounded-3xl border px-5 py-4 text-sm font-semibold ${
            dark ? "border-red-700 bg-red-500/10 text-red-300" : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {error}
        </section>
      ) : coupons.length === 0 ? (
        <section
          className={`rounded-[1.75rem] border px-6 py-14 text-center ${
            dark ? "border-zinc-800 bg-[#18181b]" : "border-slate-200 bg-white"
          }`}
        >
          <div
            className={`mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl ${
              dark ? "bg-zinc-800 text-zinc-300" : "bg-slate-100 text-slate-600"
            }`}
          >
            <TicketPercent className="h-7 w-7" />
          </div>
          <p className={`mt-4 text-lg font-bold ${dark ? "text-zinc-50" : "text-slate-900"}`}>
            No {filter.toLowerCase()} coupons in your wallet
          </p>
          <p className={`mt-1.5 text-xs font-medium max-w-sm mx-auto ${dark ? "text-zinc-400" : "text-slate-600"}`}>
            {filter === "ACTIVE"
              ? "When new coupons are allocated to your account, they will automatically appear here."
              : filter === "USED"
                ? "You haven't redeemed any coupons yet. Active coupons used during checkout will show up here."
                : "No expired coupons found in your history."}
          </p>
        </section>
      ) : (
        /* Coupons Grid */
        <section className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {coupons.map((coupon) => (
            <CouponCard
              key={coupon._id}
              coupon={coupon}
              dark={dark}
              isCopied={copiedCode === coupon.code}
              onCopy={(e) => handleCopyCode(coupon.code, e)}
              onOpenDetails={() => setSelectedCoupon(coupon)}
            />
          ))}
        </section>
      )}

      {/* Coupon Details Modal */}
      {selectedCoupon && (
        <CouponDetailsModal
          coupon={selectedCoupon}
          dark={dark}
          onClose={() => setSelectedCoupon(null)}
          onCopy={() => handleCopyCode(selectedCoupon.code)}
          isCopied={copiedCode === selectedCoupon.code}
        />
      )}
    </div>
  );
}

function CouponCard({
  coupon,
  dark,
  isCopied,
  onCopy,
  onOpenDetails,
}: {
  coupon: UserCoupon;
  dark: boolean;
  isCopied: boolean;
  onCopy: (e: React.MouseEvent) => void;
  onOpenDetails: () => void;
}) {
  const isExpired = coupon.status === "EXPIRED";
  const isUsed = coupon.status === "USED";
  const isActive = coupon.status === "ACTIVE";

  const statusTone = isActive
    ? dark
      ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
      : "bg-emerald-50 text-emerald-700 border-emerald-200"
    : isUsed
      ? dark
        ? "bg-sky-500/15 text-sky-300 border-sky-500/30"
        : "bg-sky-50 text-sky-700 border-sky-200"
      : dark
        ? "bg-zinc-800 text-zinc-400 border-zinc-700"
        : "bg-slate-100 text-slate-600 border-slate-200";

  return (
    <article
      className={`group relative flex flex-col justify-between overflow-hidden rounded-xl border p-2.5 sm:p-3 transition duration-200 shadow-sm hover:shadow-md ${
        dark
          ? "border-zinc-800 bg-[#18181b] hover:border-zinc-700/80"
          : "border-slate-200 bg-white hover:border-slate-300"
      } ${isExpired ? "opacity-75" : ""}`}
    >
      <div>
        {/* Top Ribbon: Category, Status & Three-Dots */}
        <div className="flex items-center justify-between gap-1.5">
          <div className="flex items-center gap-1 min-w-0">
            {/* Category Pill */}
            <span
              className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[8.5px] font-extrabold uppercase tracking-wider truncate ${
                dark ? "bg-zinc-800 text-zinc-300" : "bg-slate-100 text-slate-700"
              }`}
            >
              <Tag size={8.5} className="shrink-0" />
              <span className="truncate">{coupon.categoryTitle || "General"}</span>
            </span>

            {/* Status Badge */}
            <span
              className={`inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[8.5px] font-extrabold uppercase tracking-wider shrink-0 ${statusTone}`}
            >
              {isActive && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />}
              {coupon.status === "ACTIVE" ? "Active" : coupon.status === "USED" ? "Used" : "Expired"}
            </span>
          </div>

          {/* Three-Dots Menu Button */}
          <button
            type="button"
            onClick={onOpenDetails}
            className={`grid h-6 w-6 shrink-0 place-items-center rounded-md border transition cursor-pointer ${
              dark
                ? "border-zinc-700/60 bg-[#18181b] hover:bg-zinc-800 text-zinc-300 hover:text-white"
                : "border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900"
            }`}
            title="View Coupon Details"
            aria-label="View Coupon Details"
          >
            <MoreVertical size={13} />
          </button>
        </div>

        {/* Main Discount & Title */}
        <div className="mt-2">
          <span
            className={`font-black text-lg sm:text-xl tracking-tight leading-none ${
              dark
                ? "bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent"
                : "bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent"
            }`}
          >
            {coupon.discountLabel || (coupon.discountType === "PERCENT" ? `${coupon.value}% OFF` : `₹${coupon.value} OFF`)}
          </span>
          <h3
            className={`mt-0.5 text-xs font-bold tracking-tight truncate ${
              dark ? "text-zinc-100" : "text-slate-900"
            }`}
            title={coupon.title}
          >
            {coupon.title}
          </h3>
          {coupon.description && (
            <p
              className={`mt-0.5 text-[10px] font-medium line-clamp-1 leading-normal ${
                dark ? "text-zinc-400" : "text-slate-500"
              }`}
              title={coupon.description}
            >
              {coupon.description}
            </p>
          )}
        </div>

        {/* Voucher Code Box with 1-Click Copy */}
        <div
          className={`mt-2 flex items-center justify-between gap-1.5 rounded-lg border border-dashed px-2 py-1 ${
            dark ? "border-zinc-700/70 bg-[#18181b]" : "border-slate-300 bg-slate-50"
          }`}
        >
          <div className="flex items-center gap-1.5 min-w-0">
            <Scissors size={11} className={`shrink-0 ${dark ? "text-zinc-400" : "text-slate-400"}`} />
            <span className="font-mono text-[10.5px] font-black tracking-wider uppercase truncate select-all">
              {coupon.code}
            </span>
          </div>

          <button
            type="button"
            onClick={onCopy}
            className={`inline-flex shrink-0 items-center gap-1 rounded-md px-1.5 py-0.5 text-[9.5px] font-bold transition cursor-pointer ${
              isCopied
                ? "bg-emerald-600 text-white"
                : dark
                  ? "border border-zinc-700/60 bg-[#18181b] text-zinc-200 hover:bg-zinc-800"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
            }`}
            title="Copy Coupon Code"
          >
            {isCopied ? (
              <>
                <Check size={10} strokeWidth={3} />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy size={10} />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Footer Info Row */}
      <div className="mt-2 pt-1.5 border-t border-dashed flex items-center justify-between gap-2 text-[9.5px] font-semibold border-slate-200 dark:border-zinc-800">
        <span className={dark ? "text-zinc-400" : "text-slate-500"}>
          {coupon.minAmount > 0 ? `Min: ₹${coupon.minAmount}` : "No min"}
          {coupon.maxDiscount ? ` • Cap: ₹${coupon.maxDiscount}` : ""}
        </span>

        <span className={`inline-flex items-center gap-1 shrink-0 ${dark ? "text-zinc-400" : "text-slate-500"}`}>
          <Calendar size={9.5} />
          {formatOfferDate(coupon.validTill)}
        </span>
      </div>

      {/* Used Timestamp footer (if used) */}
      {coupon.usedAt && (
        <div
          className={`mt-1.5 flex items-center gap-1.5 rounded-md px-1.5 py-0.5 text-[9px] font-semibold ${
            dark ? "bg-sky-500/10 text-sky-400" : "bg-sky-50 text-sky-700"
          }`}
        >
          <Clock3 size={10} />
          <span>Used on {formatOfferDate(coupon.usedAt)}</span>
        </div>
      )}
    </article>
  );
}

function CouponDetailsModal({
  coupon,
  dark,
  onClose,
  onCopy,
  isCopied,
}: {
  coupon: UserCoupon;
  dark: boolean;
  onClose: () => void;
  onCopy: () => void;
  isCopied: boolean;
}) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const isActive = coupon.status === "ACTIVE";
  const isUsed = coupon.status === "USED";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className={`relative w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh] ${
          dark ? "border-zinc-800 bg-[#18181b] text-zinc-100" : "border-slate-200 bg-white text-slate-900"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          className={`relative px-6 py-5 border-b ${
            dark
              ? "border-zinc-800 bg-[#18181b]"
              : "border-slate-200 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.14),transparent_55%),linear-gradient(180deg,#f8fafc,#ffffff)]"
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-indigo-600 text-white font-black shadow-md shadow-indigo-600/30">
                <TicketPercent size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black tracking-tight m-0">Coupon Details</h3>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase ${
                      isActive
                        ? "bg-emerald-500/15 text-emerald-400"
                        : isUsed
                          ? "bg-sky-500/15 text-sky-400"
                          : "bg-zinc-800 text-zinc-400"
                    }`}
                  >
                    {coupon.status}
                  </span>
                </div>
                <p className={`text-xs font-medium mt-0.5 m-0 ${dark ? "text-zinc-400" : "text-slate-500"}`}>
                  Category: {coupon.categoryTitle || "General"}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className={`rounded-xl p-1.5 transition cursor-pointer ${
                dark ? "text-zinc-400 hover:bg-zinc-800 hover:text-white" : "text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              }`}
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto px-6 py-5 space-y-5">
          {/* Main Discount Code Voucher Banner */}
          <div
            className={`rounded-2xl border border-dashed p-4 text-center ${
              dark
                ? "border-sky-500/40 bg-sky-500/10"
                : "border-sky-300 bg-sky-50"
            }`}
          >
            <span
              className={`inline-block text-2xl sm:text-3xl font-black ${
                dark ? "text-sky-400" : "text-sky-600"
              }`}
            >
              {coupon.discountLabel || (coupon.discountType === "PERCENT" ? `${coupon.value}% OFF` : `₹${coupon.value} OFF`)}
            </span>
            <h4 className="mt-1 text-sm font-extrabold tracking-tight">
              {coupon.title}
            </h4>
            {coupon.description && (
              <p className={`mt-1 text-xs font-medium ${dark ? "text-zinc-400" : "text-slate-600"}`}>
                {coupon.description}
              </p>
            )}

            {/* Code Box with Copy Button */}
            <div className="mt-4 flex items-center justify-center gap-2">
              <div
                className={`flex items-center gap-2 rounded-xl px-4 py-2 border font-mono text-sm font-black tracking-widest uppercase select-all ${
                  dark ? "border-zinc-700 bg-[#18181b] text-zinc-100" : "border-slate-300 bg-white text-slate-900 shadow-sm"
                }`}
              >
                <span>{coupon.code}</span>
              </div>

              <button
                type="button"
                onClick={onCopy}
                className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-black shadow-sm transition cursor-pointer ${
                  isCopied
                    ? "bg-emerald-600 text-white"
                    : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-600/30"
                }`}
              >
                {isCopied ? (
                  <>
                    <Check size={14} strokeWidth={3} />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Full Breakdown Grid */}
          <div>
            <h5 className={`text-[11px] font-black uppercase tracking-wider mb-2.5 ${dark ? "text-zinc-400" : "text-slate-500"}`}>
              Terms & Value Breakdown
            </h5>
            <div
              className={`grid grid-cols-2 gap-2.5 rounded-2xl border p-3.5 text-xs ${
                dark ? "border-zinc-800 bg-[#18181b]" : "border-slate-200 bg-slate-50"
              }`}
            >
              <div>
                <span className={`block text-[10.5px] font-semibold ${dark ? "text-zinc-400" : "text-slate-500"}`}>
                  Discount Type
                </span>
                <span className="font-bold">
                  {coupon.discountType === "PERCENT" ? "Percentage (% OFF)" : "Flat Amount (₹ OFF)"}
                </span>
              </div>

              <div>
                <span className={`block text-[10.5px] font-semibold ${dark ? "text-zinc-400" : "text-slate-500"}`}>
                  Discount Value
                </span>
                <span className="font-bold">
                  {coupon.discountType === "PERCENT" ? `${coupon.value}%` : `₹${coupon.value}`}
                </span>
              </div>

              <div>
                <span className={`block text-[10.5px] font-semibold ${dark ? "text-zinc-400" : "text-slate-500"}`}>
                  Minimum Order
                </span>
                <span className="font-bold">
                  {coupon.minAmount > 0 ? `₹${coupon.minAmount}` : "No Minimum"}
                </span>
              </div>

              <div>
                <span className={`block text-[10.5px] font-semibold ${dark ? "text-zinc-400" : "text-slate-500"}`}>
                  Maximum Savings
                </span>
                <span className="font-bold">
                  {coupon.maxDiscount ? `₹${coupon.maxDiscount}` : "Unlimited"}
                </span>
              </div>

              <div>
                <span className={`block text-[10.5px] font-semibold ${dark ? "text-zinc-400" : "text-slate-500"}`}>
                  Collected Date
                </span>
                <span className="font-bold">
                  {formatOfferDate(coupon.collectedAt)}
                </span>
              </div>

              <div>
                <span className={`block text-[10.5px] font-semibold ${dark ? "text-zinc-400" : "text-slate-500"}`}>
                  Valid Till
                </span>
                <span className="font-bold">
                  {formatOfferDate(coupon.validTill)}
                </span>
              </div>

              {coupon.usedAt && (
                <>
                  <div>
                    <span className={`block text-[10.5px] font-semibold ${dark ? "text-zinc-400" : "text-slate-500"}`}>
                      Redeemed On
                    </span>
                    <span className="font-bold text-sky-400">
                      {formatOfferDate(coupon.usedAt)}
                    </span>
                  </div>

                  <div>
                    <span className={`block text-[10.5px] font-semibold ${dark ? "text-zinc-400" : "text-slate-500"}`}>
                      Booking Reference
                    </span>
                    <span className="font-mono font-bold text-sky-400 truncate">
                      {coupon.usedBookingId || "Redeemed"}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Applicable Booking Types */}
          {Array.isArray(coupon.applicableBookingTypes) && coupon.applicableBookingTypes.length > 0 && (
            <div>
              <h5 className={`text-[11px] font-black uppercase tracking-wider mb-2 ${dark ? "text-zinc-400" : "text-slate-500"}`}>
                Applicable Entertainment Categories
              </h5>
              <div className="flex flex-wrap gap-2">
                {coupon.applicableBookingTypes.map((type) => (
                  <span
                    key={type}
                    className={`inline-flex items-center gap-1 rounded-xl border px-3 py-1 text-xs font-bold ${
                      dark
                        ? "border-zinc-800 bg-[#18181b] text-zinc-200"
                        : "border-slate-200 bg-slate-100 text-slate-700"
                    }`}
                  >
                    <Layers size={13} className="text-indigo-500" />
                    {getBookingTypeLabel(type)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Conditions / Rules */}
          {Array.isArray(coupon.conditions) && coupon.conditions.length > 0 && (
            <div>
              <h5 className={`text-[11px] font-black uppercase tracking-wider mb-2 ${dark ? "text-zinc-400" : "text-slate-500"}`}>
                Rules & Eligibility
              </h5>
              <ul className="space-y-1.5 pl-0 list-none m-0">
                {coupon.conditions.map((condition, idx) => (
                  <li
                    key={idx}
                    className={`flex items-start gap-2 text-xs font-medium leading-relaxed ${
                      dark ? "text-zinc-300" : "text-slate-600"
                    }`}
                  >
                    <ShieldCheck size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                    <span>{condition}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div
          className={`px-6 py-4 border-t flex items-center justify-between gap-3 ${
            dark ? "border-zinc-800 bg-[#18181b]" : "border-slate-200 bg-slate-50"
          }`}
        >
          <button
            type="button"
            onClick={onClose}
            className={`rounded-xl border px-4 py-2 text-xs font-bold transition cursor-pointer ${
              dark
                ? "border-zinc-700/60 bg-[#18181b] text-zinc-300 hover:bg-zinc-800 hover:text-white"
                : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
            }`}
          >
            Close
          </button>

          {isActive ? (
            <Link
              href="/"
              onClick={onClose}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-5 py-2 text-xs font-black text-white shadow-md shadow-indigo-600/30 transition cursor-pointer"
            >
              <span>Book & Redeem</span>
              <ArrowRight size={13} />
            </Link>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-slate-700 px-4 py-2 text-xs font-bold text-white cursor-pointer"
            >
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MyCouponsPage() {
  return <MyCouponsContent />;
}
