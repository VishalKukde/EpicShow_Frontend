"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { ExternalLink, Heart } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";

const footerHighlights = [
  "Seat locking with expiry protection",
  "Wallet + rewards booking flow",
  "Secure Razorpay checkout",
  "Profile hub + support tools",
];

const footerStack = [
  "Next.js 16",
  "React 19",
  "TypeScript",
  "Tailwind v4",
  "Node + Express",
  "MongoDB",
];

const footerProjects = [
  { label: "GetEpicShow", href: "https://getepicshow.vercel.app/login" },
  { label: "Dining & Delivery", href: "https://dininganddelivery.vercel.app" },
  { label: "SilkStreet Shop", href: "https://silkstreetshop.vercel.app/" },
];

export default function TrendingFooter() {
  const mode = useThemeStore((s) => s.mode);
  const dark = mode === "dark";
  const footerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const target = footerRef.current;
    if (!target) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = target.getBoundingClientRect();
      const viewport = window.innerHeight || 1;
      const progress = (viewport - rect.top) / (viewport + rect.height);
      const clamped = Math.min(Math.max(progress, 0), 1);
      const offset = (clamped - 0.5) * 120;

      target.style.setProperty("--parallax-1", `${offset}px`);
      target.style.setProperty("--parallax-2", `${offset * -0.6}px`);
    };

    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <footer
      ref={footerRef}
      className={`relative overflow-hidden border-t ${
        dark ? "border-slate-800 text-slate-300" : "border-slate-200 text-slate-600"
      }`}
    >
      <div className="pointer-events-none absolute inset-0">
        <div
          className={`absolute -top-10 right-10 h-40 w-40 rounded-full blur-3xl ${
            dark ? "bg-indigo-500/10" : "bg-indigo-300/40"
          }`}
          style={{ transform: "translateY(var(--parallax-1, 0px))" }}
        />
        <div
          className={`absolute bottom-0 left-6 h-52 w-52 rounded-full blur-3xl ${
            dark ? "bg-emerald-400/10" : "bg-emerald-300/40"
          }`}
          style={{ transform: "translateY(var(--parallax-2, 0px))" }}
        />
        <div
          className={`absolute inset-x-0 top-0 h-px ${
            dark
              ? "bg-gradient-to-r from-transparent via-slate-700 to-transparent"
              : "bg-gradient-to-r from-transparent via-slate-200 to-transparent"
          }`}
        />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr_1fr]">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className={`h-2.5 w-2.5 rounded-full ${dark ? "bg-indigo-400" : "bg-indigo-600"}`} />
              <p className={`text-sm font-semibold ${dark ? "text-white" : "text-slate-900"}`}>
                EpicShow
              </p>
            </div>
            <p className="max-w-sm text-sm">
              A minimalist, premium cinema booking experience with secure checkout,
              live seat locking, and wallet rewards.
            </p>
            <div className="flex flex-wrap gap-2 text-xs">
              {footerHighlights.map((item) => (
                <span
                  key={item}
                  className={`rounded-full border px-3 py-1 ${
                    dark
                      ? "border-slate-800 bg-slate-950 text-slate-300"
                      : "border-slate-200 bg-white text-slate-600"
                  }`}
                >
                  {item}
                </span>
              ))}
            </div>
            <div>
              <span
                
                className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition ${
                  dark
                    ? "border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-600"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                }`}
              >
                Developer: Vishal Kukde
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <p
              className={`text-xs font-semibold uppercase tracking-[0.22em] ${
                dark ? "text-indigo-300" : "text-indigo-600"
              }`}
            >
              Highlights
            </p>
            <div className="space-y-2 text-sm">
              <p>Premium hero with cinematic spotlight.</p>
              <p>Secure auth + wallet based checkout.</p>
              <p>Profile tools for bookings & rewards.</p>
              <p>Responsive experience for every screen.</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <p
                className={`text-xs font-semibold uppercase tracking-[0.22em] ${
                  dark ? "text-indigo-300" : "text-indigo-600"
                }`}
              >
                Stack
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                {footerStack.map((item) => (
                  <span
                    key={item}
                    className={`rounded-full border px-3 py-1 ${
                      dark
                        ? "border-slate-800 bg-slate-950 text-slate-300"
                        : "border-slate-200 bg-white text-slate-600"
                    }`}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p
                className={`text-xs font-semibold uppercase tracking-[0.22em] ${
                  dark ? "text-indigo-300" : "text-indigo-600"
                }`}
              >
                Projects
              </p>
              <div className="mt-3 space-y-2 text-sm">
                {footerProjects.map((project) => (
                  <a
                    key={project.label}
                    href={project.href}
                    target="_blank"
                    rel="noreferrer"
                    className={`flex items-center justify-between rounded-lg border px-3 py-2 transition ${
                      dark
                        ? "border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-600"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <span>{project.label}</span>
                    <ExternalLink className="h-3.5 w-3.5 opacity-70" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div
          className={`mt-10 flex flex-col gap-4 border-t pt-6 text-xs sm:flex-row sm:items-center sm:justify-between ${
            dark ? "border-slate-800" : "border-slate-200"
          }`}
        >
          <p>© 2026 EpicShow. Inspired by great cinema.</p>
          <div className="inline-flex items-center gap-2">
            <span>Built with</span>
            <Heart
              className={`h-4 w-4 ${dark ? "text-rose-400" : "text-rose-500"}`}
              fill="currentColor"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
