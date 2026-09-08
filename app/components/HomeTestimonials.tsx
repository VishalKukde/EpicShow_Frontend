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
    <section className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6">
      {/* Minimal Luxury Header */}
      <div className="mb-8 sm:mb-10 text-center space-y-1.5">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-indigo-500">
          Testimonials
        </p>
        <h2
          className={`text-xl sm:text-2xl font-bold tracking-tight ${dark ? "text-white" : "text-slate-900"
            }`}
        >
          Loved by People Who Book Better
        </h2>
      </div>

      {loading ? (
        <div className="grid items-stretch gap-5 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className={`h-56 animate-pulse rounded-[24px] border border-slate-200 bg-white/70 shadow-sm dark:border-white/10 dark:bg-white/5 ${item > 2 ? "hidden lg:block" : ""
                }`}
            />
          ))}
        </div>
      ) : (
        <div className="grid items-stretch gap-5 md:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((item) => (
            <article
              key={item.id}
              className="group relative flex h-full min-h-[280px] flex-col justify-between overflow-hidden rounded-[24px] border border-slate-200/80 bg-white/80 p-5 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-slate-950/70 dark:shadow-[0_16px_40px_rgba(0,0,0,0.3)] max-md:[&:nth-of-type(n+3)]:hidden"
            >
              <div className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />

              <div>
                {/* Top Badge Row */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="inline-flex items-center rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-400">
                    {item.category}
                  </span>

                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-bold text-amber-500">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    {item.rating}
                  </span>
                </div>

                {/* Message */}
                <p className="text-xs sm:text-sm leading-relaxed font-medium text-slate-700 dark:text-slate-300">
                  “{item.displayMessage || item.message}”
                </p>
              </div>

              {/* User Footer */}
              <div className="mt-5 pt-4 border-t border-slate-200/80 dark:border-white/10 flex items-center gap-3">
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white shadow-md"
                >
                  {item.userName.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold truncate text-slate-900 dark:text-white">
                    {item.userName}
                  </p>
                  <p className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">
                    Verified User
                  </p>
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
            className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs sm:text-sm font-bold tracking-wide transition-all duration-200 hover:scale-105 ${dark
              ? "bg-white text-slate-900 hover:bg-slate-100 shadow-md"
              : "bg-slate-900 text-white hover:bg-slate-800 shadow-md"
              }`}
          >
            View More Testimonials
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </section>
  );
}
