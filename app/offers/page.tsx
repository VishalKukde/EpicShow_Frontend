"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, BadgePercent, Sparkles } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import { formatOfferDate } from "@/lib/offers";
import type { OfferCategory, OffersResponse } from "@/types/Offer";

export default function OffersPage() {
  const { user } = useAuth();
  const mode = useThemeStore((s) => s.mode);
  const dark = mode === "dark";
  const [categories, setCategories] = useState<OfferCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadOffers = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = (await apiFetch("/offers", {
          notifyOnError: false,
        })) as OffersResponse;

        if (cancelled) return;
        setCategories(response.categories || []);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load offers");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadOffers();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div
      className={`min-h-screen px-4 pb-16 pt-28 sm:px-6 lg:px-8 ${dark ? "bg-zinc-950" : "bg-[linear-gradient(180deg,#fff8ef_0%,#ffffff_35%,#f8fafc_100%)] select-none"
        }`}
    >

      <div className="mx-auto max-w-6xl space-y-8">
      <Link
        href={user ? "/profile/my-coupons" : "/login"}
        className={`hidden md:flex w-23  items-center justify-between rounded-2xl border px-4 py-2 text-sm font-medium transition ${dark ? "border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10" : "border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
        }`}
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Link>
        <section
          className={`overflow-hidden rounded-[2rem] border px-6 py-7 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:px-8 sm:py-9 ${dark
              ? "border-zinc-800 bg-[radial-gradient(circle_at_top_right,rgba(251,146,60,0.22),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.18),transparent_32%),linear-gradient(135deg,#0f172a,#09090b)]"
              : "border-orange-300/50 bg-[radial-gradient(circle_at_top_right,rgba(251,146,60,0.22),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.18),transparent_32%),linear-gradient(135deg,#fff7ed,#ffffff)]"
            }`}
        >
          <p
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${dark ? "bg-white/5 text-orange-200" : "bg-white text-orange-700 shadow-sm"
              }`}
          >
            <Sparkles className="h-4 w-4" />
            Offers & Deals
          </p>

          <div className="mt-5 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <h1
                className={`max-w-3xl text-3xl font-semibold leading-tight sm:text-5xl ${dark ? "text-zinc-50" : "text-slate-900"
                  }`}
              >
                Browse every live coupon before you book, then collect the ones you want to use later.
              </h1>
              <p
                className={`mt-4 max-w-2xl text-sm leading-6 sm:text-base ${dark ? "text-zinc-300" : "text-slate-600"
                  }`}
              >
                Festival drops, weekend steals, event campaigns, and special-day deals now live in one place.
                Collect manually, then apply only your collected coupons during checkout.
              </p>
            </div>

            <div
              className={`rounded-[1.75rem] border p-5 ${dark ? "border-white/10 bg-black/20" : "border-white bg-white/80"
                }`}
            >
              <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${dark ? "text-sky-200" : "text-sky-700"}`}>
                Quick Access
              </p>
              <div className="mt-4 space-y-3">
                <Link
                  href={user ? "/profile/my-coupons" : "/login"}
                  className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-medium transition ${dark ? "border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10" : "border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
                    }`}
                >
                  <span>{user ? "Open My Coupons" : "Login To Collect"}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <div
                  className={`rounded-2xl border px-4 py-3 text-sm ${dark ? "border-white/10 bg-white/5 text-zinc-300" : "border-slate-200 bg-white/90 text-slate-600"
                    }`}
                >
                  <p className="font-medium">How it works</p>
                  <p className="mt-1 text-xs leading-5">
                    Browse offers, collect the coupons you want, then use only collected coupons during checkout.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {loading ? (
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className={`h-72 animate-pulse rounded-[1.75rem] border ${dark ? "border-zinc-800 bg-zinc-900" : "border-slate-200 bg-white"
                  }`}
              />
            ))}
          </section>
        ) : error ? (
          <section
            className={`rounded-3xl border px-4 py-4 text-sm ${dark ? "border-red-700 bg-red-500/10 text-red-300" : "border-red-200 bg-red-50 text-red-700"
              }`}
          >
            {error}
          </section>
        ) : (
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-2">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/offers/${category.id}`}
                className={`group overflow-hidden rounded-[1.75rem] border p-5 shadow-[0_18px_40px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 ${dark ? "border-zinc-800 bg-zinc-900" : "border-slate-200 bg-white"
                  }`}
                style={{
                  backgroundImage: dark
                    ? `radial-gradient(circle at top right, ${category.accentFrom}33, transparent 35%), linear-gradient(180deg, rgba(24,24,27,0.98), rgba(9,9,11,0.98))`
                    : `radial-gradient(circle at top right, ${category.accentFrom}22, transparent 32%), linear-gradient(180deg, #ffffff, #f8fafc)`,
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div
                    className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${dark ? "bg-white/5 text-zinc-100" : "bg-slate-100 text-slate-700"
                      }`}
                  >
                    <BadgePercent className="h-5 w-5" />
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${dark ? "bg-black/20 text-zinc-200" : "bg-slate-100 text-slate-600"
                      }`}
                  >
                    {category.eyebrow}
                  </span>
                </div>

                <h2 className={`mt-5 text-xl font-semibold ${dark ? "text-zinc-50" : "text-slate-900"}`}>
                  {category.title}
                </h2>
                <p className={`mt-2 text-sm leading-6 ${dark ? "text-zinc-400" : "text-slate-600"}`}>
                  {category.description}
                </p>

                <div className={`mt-5 rounded-2xl border p-4 ${dark ? "border-white/10 bg-black/20" : "border-slate-200 bg-slate-50"}`}>
                  <div className="flex items-center justify-between">
                    <p className={`text-sm font-semibold ${dark ? "text-zinc-100" : "text-slate-900"}`}>
                      Live coupons
                    </p>
                    <p className={`text-sm ${dark ? "text-zinc-300" : "text-slate-600"}`}>
                      {category.couponCount}
                    </p>
                  </div>
                  <div className="mt-3 space-y-2">
                    {category.featuredCoupons.map((coupon) => (
                      <div
                        key={coupon._id}
                        className={`rounded-2xl px-3 py-2 ${dark ? "bg-white/5 text-zinc-200" : "bg-white text-slate-700"
                          }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-medium">{coupon.title}</p>
                          <span className="text-xs font-semibold">{coupon.discountLabel}</span>
                        </div>
                        <p className={`mt-1 text-xs ${dark ? "text-zinc-400" : "text-slate-500"}`}>
                          Valid till {formatOfferDate(coupon.validTill)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={`mt-5 inline-flex items-center gap-2 text-sm font-medium ${dark ? "text-orange-200" : "text-orange-700"}`}>
                  Explore category
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}
