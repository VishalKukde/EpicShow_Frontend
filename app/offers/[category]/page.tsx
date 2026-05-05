"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, LockKeyhole, Sparkles } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import { formatOfferDate, getBookingTypeLabel } from "@/lib/offers";
import { toast } from "@/lib/toast";
import type { MyCouponsResponse, OfferCategory, UserCoupon } from "@/types/Offer";

export default function OfferCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const mode = useThemeStore((s) => s.mode);
  const dark = mode === "dark";
  const categoryId = String(params.category || "");

  const [category, setCategory] = useState<OfferCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [collectingId, setCollectingId] = useState<string | null>(null);
  const [collectedMap, setCollectedMap] = useState<Record<string, UserCoupon>>({});

  useEffect(() => {
    let cancelled = false;

    const loadCategory = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await apiFetch(`/offers/${encodeURIComponent(categoryId)}`, {
          notifyOnError: false,
        });

        if (cancelled) return;
        setCategory(response);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load category");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadCategory();

    return () => {
      cancelled = true;
    };
  }, [categoryId]);

  useEffect(() => {
    let cancelled = false;

    const loadCollectedCoupons = async () => {
      if (!user) {
        setCollectedMap({});
        return;
      }

      try {
        const response = (await apiFetch("/my-coupons", {
          notifyOnError: false,
        })) as MyCouponsResponse;

        if (cancelled) return;

        const nextMap: Record<string, UserCoupon> = {};
        for (const coupon of response.coupons) {
          nextMap[coupon._id] = coupon;
        }
        setCollectedMap(nextMap);
      } catch {
        if (!cancelled) {
          setCollectedMap({});
        }
      }
    };

    loadCollectedCoupons();

    return () => {
      cancelled = true;
    };
  }, [user]);

  const handleCollect = async (couponId: string) => {
    if (!user) {
      router.push("/login");
      return;
    }

    try {
      setCollectingId(couponId);
      const response = await apiFetch(`/offers/coupons/${couponId}/collect`, {
        method: "POST",
      });

      if (response?.coupon) {
        setCollectedMap((current) => ({
          ...current,
          [couponId]: response.coupon,
          [response.coupon._id]: response.coupon,
        }));
      }

      toast.success(
        response?.alreadyCollected
          ? "Coupon already exists in your collection"
          : "Coupon collected successfully"
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unable to collect coupon");
    } finally {
      setCollectingId(null);
    }
  };

  return (
    <div
      className={`min-h-screen px-4 pb-16 pt-28 sm:px-6 lg:px-8 select-none ${
        dark ? "bg-zinc-950" : "bg-[linear-gradient(180deg,#fdf4ff_0%,#ffffff_35%,#fff7ed_100%)]"
      }`}
    >
      <div className="mx-auto max-w-6xl space-y-8">
        <Link
          href="/offers"
          className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium ${
            dark ? "border-zinc-700 bg-zinc-900 text-zinc-100 hover:bg-zinc-800" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
          }`}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to all offers
        </Link>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className={`h-72 animate-pulse rounded-[1.75rem] border ${
                  dark ? "border-zinc-800 bg-zinc-900" : "border-slate-200 bg-white"
                }`}
              />
            ))}
          </div>
        ) : error || !category ? (
          <div
            className={`rounded-3xl border px-4 py-4 text-sm ${
              dark ? "border-red-700 bg-red-500/10 text-red-300" : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {error || "Offer category not found"}
          </div>
        ) : (
          <>
            <section
              className={`overflow-hidden rounded-[2rem] border px-6 py-7 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:px-8 sm:py-9 ${
                dark ? "border-zinc-800 bg-zinc-900" : "border-slate-200 bg-white"
              }`}
              style={{
                backgroundImage: dark
                  ? `radial-gradient(circle at top right, ${category.accentFrom}33, transparent 34%), radial-gradient(circle at bottom left, ${category.accentTo}22, transparent 30%), linear-gradient(135deg,#09090b,#111827)`
                  : `radial-gradient(circle at top right, ${category.accentFrom}24, transparent 32%), radial-gradient(circle at bottom left, ${category.accentTo}18, transparent 28%), linear-gradient(135deg,#ffffff,#f8fafc)`,
              }}
            >
              <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${dark ? "text-zinc-300" : "text-slate-600"}`}>
                {category.eyebrow}
              </p>
              <h1 className={`mt-3 text-3xl font-semibold sm:text-4xl ${dark ? "text-zinc-50" : "text-slate-900"}`}>
                {category.title}
              </h1>
              <p className={`mt-3 max-w-2xl text-sm leading-6 sm:text-base ${dark ? "text-zinc-300" : "text-slate-600"}`}>
                {category.description}
              </p>
              <div className="mt-5 flex flex-wrap gap-3 text-sm">
                <span className={`rounded-full px-3 py-1.5 ${dark ? "bg-white/5 text-zinc-200" : "bg-white text-slate-700 shadow-sm"}`}>
                  {category.couponCount} live coupons
                </span>
                <span className={`rounded-full px-3 py-1.5 ${dark ? "bg-white/5 text-zinc-200" : "bg-white text-slate-700 shadow-sm"}`}>
                  {user ? "Collect directly from this page" : "Login to collect"}
                </span>
              </div>
            </section>

            <section className="grid gap-4 md:grid-cols-2">
              {category.coupons?.map((coupon) => {
                const collectedCoupon = collectedMap[coupon._id];
                const isCollected = Boolean(collectedCoupon);
                const actionLabel = !user
                  ? "Login to Collect"
                  : isCollected
                    ? collectedCoupon.status === "USED"
                      ? "Already Used"
                      : collectedCoupon.status === "EXPIRED"
                        ? "Expired"
                        : "Collected"
                    : "Collect Now";

                return (
                  <article
                    key={coupon._id}
                    className={`rounded-[1.75rem] border p-5 shadow-[0_16px_34px_rgba(15,23,42,0.08)] ${
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
                      <span
                        className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
                          dark ? "bg-sky-500/15 text-sky-300" : "bg-sky-100 text-sky-700"
                        }`}
                      >
                        {coupon.discountLabel}
                      </span>
                    </div>

                    <p className={`mt-3 text-sm leading-6 ${dark ? "text-zinc-400" : "text-slate-600"}`}>
                      {coupon.description}
                    </p>

                    <div className={`mt-4 rounded-2xl border p-4 ${dark ? "border-white/10 bg-black/20" : "border-slate-200 bg-slate-50"}`}>
                      <div className={`flex items-center justify-between text-sm ${dark ? "text-zinc-300" : "text-slate-600"}`}>
                        <span>Validity</span>
                        <span className={`font-medium ${dark ? "text-zinc-100" : "text-slate-900"}`}>
                          {formatOfferDate(coupon.validTill)}
                        </span>
                      </div>
                      <div className={`mt-3 flex flex-wrap gap-2 text-[11px] ${dark ? "text-zinc-300" : "text-slate-600"}`}>
                        {coupon.applicableBookingTypes.map((type) => (
                          <span
                            key={type}
                            className={`rounded-full px-2.5 py-1 ${dark ? "bg-zinc-800" : "bg-white"}`}
                          >
                            {getBookingTypeLabel(type)}
                          </span>
                        ))}
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {coupon.conditions.map((condition) => (
                          <span
                            key={condition}
                            className={`rounded-full px-2.5 py-1 text-[11px] ${
                              dark ? "bg-zinc-800 text-zinc-300" : "bg-white text-slate-600"
                            }`}
                          >
                            {condition}
                          </span>
                        ))}
                      </div>
                    </div>

                    {isCollected ? (
                      <div
                        className={`mt-4 flex items-center justify-between rounded-2xl border px-4 py-3 text-sm ${
                          dark ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300" : "border-emerald-200 bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        <span className="inline-flex items-center gap-2 font-medium">
                          <CheckCircle2 className="h-4 w-4" />
                          {actionLabel}
                        </span>
                        <span className="text-xs">Code: {collectedCoupon.code}</span>
                      </div>
                    ) : null}

                    <button
                      onClick={() => handleCollect(coupon._id)}
                      disabled={collectingId === coupon._id || isCollected}
                      className={`mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer ${
                        user
                          ? dark
                            ? "bg-zinc-100 text-zinc-900 hover:bg-white"
                            : "bg-slate-900 text-white hover:bg-black"
                          : dark
                            ? "bg-zinc-800 text-zinc-100 hover:bg-zinc-700"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {user ? <Sparkles className="h-4 w-4" /> : <LockKeyhole className="h-4 w-4" />}
                      {collectingId === coupon._id ? "Collecting..." : actionLabel}
                    </button>
                  </article>
                );
              })}
            </section>
          </>
        )}
      </div>
    </div>
  );
}
