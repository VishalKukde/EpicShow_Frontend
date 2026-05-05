"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, MessageSquareHeart, Star } from "lucide-react";
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

export default function TestimonialPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  const mode = useThemeStore((s) => s.mode);
  const dark = mode === "dark";
  useEffect(() => {
    let active = true;

    const loadTestimonials = async () => {
      try {
        const data = await apiFetch("/feedback/testimonials?limit=100", {
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

  return (
    <main
      className="min-h-screen px-4 pb-20 pt-24 sm:px-6 lg:px-8"
      style={{ backgroundColor: "var(--hero-page-bg)" }}
    >
      <section className="mx-auto max-w-7xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 border border-slate-300 px-3 py-1 rounded-full hover:bg-slate-100 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <div className="mt-8 max-w-3xl">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-300">
            <MessageSquareHeart className="h-4 w-4" />
            Testimonial
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-5xl">
            Stories from EpicShow users
          </h1>
          <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300 sm:text-base">
            Real feedback from customers who chose to share their booking experience.
          </p>
        </div>

        {loading ? (
          <div className="mt-10 columns-1 gap-4 md:columns-2 xl:columns-3">
            {Array.from({ length: 9 }).map((_, index) => (
              <div
                key={index}
                className="mb-4 h-44 break-inside-avoid animate-pulse rounded-lg border border-slate-200 bg-white/70 dark:border-white/10 dark:bg-white/5"
              />
            ))}
          </div>
        ) : testimonials.length === 0 ? (
          <div className="mt-10 rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              No public testimonials are available yet.
            </p>
          </div>
        ) : (
          <div className="mt-10 columns-1 gap-4 md:columns-2 xl:columns-3">
            {testimonials.map((item) => (
              <article
                key={item.id}
                className="mb-4 break-inside-avoid rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04]"
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
                  <div className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-white ${dark ? 'bg-gray-100' : 'bg-gray-900'}`}>
                    {item.userName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {item.userName}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      verified user
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
