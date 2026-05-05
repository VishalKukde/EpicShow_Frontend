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
    <section className="relative z-10 mx-auto w-full max-w-7xl">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-300">
            <MessageSquareHeart className="h-4 w-4" />
            Testimonials
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
            What EpicShow users are saying
          </h2>
        </div>
      </div>

      {loading ? (
        <div className="grid items-start gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className={`h-40 animate-pulse rounded-lg border border-slate-200 bg-white/70 dark:border-white/10 dark:bg-white/5 ${
                item > 2 ? "hidden xl:block" : ""
              }`}
            />
          ))}
        </div>
      ) : (
        <div className="grid items-start gap-4 md:grid-cols-2 xl:grid-cols-4">
          {testimonials.map((item) => (
            <article
              key={item.id}
              className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04] max-md:[&:nth-of-type(n+3)]:hidden"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-400/10 dark:text-indigo-200">
                  {item.category}
                </span>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-amber-600">
                  <Star className="h-4 w-4 fill-current" />
                  {item.rating}
                </span>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-700 dark:text-slate-200">
                {item.displayMessage || item.message}
              </p>
              <div className="mt-5 flex items-center gap-3">
                <div className={ `flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-white ${dark ? 'bg-gray-100' : 'bg-gray-900'}` }>
                  {item.userName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {item.userName}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                   Verified user
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {!loading && testimonials.length > 0 && (
        <div className="mt-6 flex justify-center">
          <Link
            href="/testimonial"
            className={ `inline-flex items-center gap-2 rounded-full ${dark ? 'bg-gray-100  ' : 'bg-gray-900 hover:bg-gray-800'} px-5 py-2 text-sm font-semibold text-white transition ` }
          >
            View more
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </section>
  );
}
