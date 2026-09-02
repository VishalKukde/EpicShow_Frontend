"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, MessageSquareHeart, Star } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { useThemeStore } from "@/store/themeStore";

type Testimonial = {
  id: string;
  userName: string;
  category: string;
  rating: number;
  displayMessage?: string;
  message: string;
};

export default function HomeTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const mode = useThemeStore((s) => s.mode);
  const dark = mode === "dark";

  useEffect(() => {
    let active = true;

    const loadTestimonials = async () => {
      try {
        const data = await apiFetch("/feedback/testimonials?limit=4", {
          method: "GET",
          notifyOnError: false,
        });

        if (active) {
          setTestimonials(
            Array.isArray(data?.testimonials) ? data.testimonials : []
          );
        }
      } catch {
        if (active) setTestimonials([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadTestimonials();
    return () => {
      active = false;
    };
  }, []);

  if (!loading && testimonials.length === 0) {
    return null;
  }

  return (
    <section className="relative z-10 mx-auto w-full max-w-7xl px-3 sm:px-5 lg:px-7">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-indigo-600 dark:text-indigo-300">
            <MessageSquareHeart className="h-4 w-4" />
            Testimonials
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-[-0.06em] text-slate-900 dark:text-white sm:text-4xl">
            Loved by the people who book better.
          </h2>
        </div>

      </div>

      {loading ? (
        <div className="grid items-stretch gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className={`h-60 animate-pulse rounded-[28px] border border-slate-200 bg-white/70 shadow-[0_12px_30px_rgba(15,23,42,0.04)] dark:border-white/10 dark:bg-white/5 ${
                item > 2 ? "hidden xl:block" : ""
              }`}
            />
          ))}
        </div>
      ) : (
        <div className="grid items-stretch gap-4 md:grid-cols-2 xl:grid-cols-4">
          {testimonials.map((item) => (
            <article
              key={item.id}
              className="group relative flex h-full min-h-[330px] flex-col overflow-hidden rounded-[28px] border border-slate-200/80 bg-white/80 p-5 shadow-[0_14px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl transition duration-500 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.12)] dark:border-white/10 dark:bg-slate-950/60 dark:shadow-[0_18px_48px_rgba(2,6,23,0.35)] max-md:[&:nth-of-type(n+3)]:hidden"
            >
              <div className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-slate-300/80 to-transparent dark:via-slate-600/80" />
              <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-to-br from-indigo-400/20 via-purple-400/10 to-transparent blur-2xl dark:from-indigo-300/20" />

              <div className="relative flex items-center justify-between gap-3">
                <span className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-indigo-700 dark:border-indigo-400/20 dark:bg-indigo-500/10 dark:text-indigo-200">
                  {item.category}
                </span>

                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-sm font-semibold text-amber-600 dark:bg-amber-500/10 dark:text-amber-300">
                  <Star className="h-4 w-4 fill-current" />
                  {item.rating}
                </span>
              </div>

              <div className="relative mt-5 flex-1 text-[14px] leading-7 text-slate-700 dark:text-slate-200">
                <span className="mb-2 block text-3xl leading-none text-slate-300 dark:text-slate-600">“</span>
                <p>{item.displayMessage || item.message}</p>
              </div>

              <div className="relative mt-6 flex items-center justify-between gap-3 border-t border-slate-200/80 pt-4 dark:border-white/10">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-slate-900 via-slate-700 to-indigo-500 text-sm font-bold text-white shadow-[0_12px_24px_rgba(15,23,42,0.22)] dark:from-slate-100 dark:via-slate-200 dark:to-indigo-400 dark:text-slate-900"
                  >
                    {item.userName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {item.userName}
                    </p>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                      Verified user
                    </p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {!loading && testimonials.length > 0 && (
        <div className="mt-8 flex justify-center">
          <Link
            href="/testimonial"
            className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(79,70,229,0.28)] transition hover:-translate-y-0.5 ${
              dark ? "bg-white text-slate-900 hover:bg-slate-100" : "bg-slate-900 hover:bg-slate-800"
            }`}
          >
            View more
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </section>
  );
}
