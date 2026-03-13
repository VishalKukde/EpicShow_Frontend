"use client";

import { useState } from "react";
import { useThemeStore } from "@/store/themeStore";
import { HERO_PAGE_BG } from "@/components/heroTheme";
import { Sparkles } from "lucide-react";
import { useAskEpicAiStore } from "@/store/askEpicAiStore";

const FEATURE_CARDS = [
  { title: "Midnight Premieres" },
  { title: "Member-Only Drops" },
  { title: "City Spotlight" },
  { title: "Luxury Lounges" },
];
const CARD_IMAGE = "/dummy.webp";
const TAGS = ["Trending now", "Top rated", "Coming soon", "IMAX"];

export default function HeroSectionNewAgain() {
  const [query, setQuery] = useState("");
  const mode = useThemeStore((s) => s.mode);
  const openAskEpicAi = useAskEpicAiStore((state) => state.open);
  const dark = mode === "dark";

  return (
    <section
      className="relative min-h-screen overflow-visible px-4 pb-[55vh] pt-24 sm:px-6 sm:pb-[52vh] sm:pt-28 lg:px-8 lg:pb-[48vh] lg:pt-32"
      style={{
        background: dark
          ? `radial-gradient(900px 420px at 10% -10%, rgba(30,41,59,0.55), transparent 60%), radial-gradient(700px 360px at 85% 0%, rgba(15,23,42,0.7), transparent 55%), ${HERO_PAGE_BG.dark}`
          : "radial-gradient(900px 420px at 10% -10%, rgba(226,232,240,0.9), transparent 60%), radial-gradient(700px 360px at 85% 0%, rgba(219,234,254,0.7), transparent 55%), #FFFFFF",
      }}
    >
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div
          className={`absolute inset-x-0 top-0 h-px ${
            dark
              ? "bg-gradient-to-r from-transparent via-slate-700 to-transparent"
              : "bg-gradient-to-r from-transparent via-slate-200 to-transparent"
          }`}
        />
        <div
          className={`absolute -top-16 left-10 h-40 w-40 rounded-full blur-3xl ${
            dark ? "bg-indigo-500/10" : "bg-indigo-300/40"
          }`}
        />
        <div
          className={`absolute -bottom-20 right-10 h-44 w-44 rounded-full blur-3xl ${
            dark ? "bg-emerald-500/10" : "bg-emerald-300/40"
          }`}
        />
      </div>

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center">
        <span
          className={`inline-flex items-center rounded-full border px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] ${
            dark
              ? "border-slate-800 bg-slate-950/70 text-slate-300"
              : "border-slate-200 bg-white/80 text-slate-600"
          }`}
        >
          Trending · Premium
        </span>

        <h1
          className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl"
          style={{
            fontFamily: "'Sora', 'DM Sans', sans-serif",
            color: dark ? "#F8FAFC" : "#0F172A",
          }}
        >
          The premium way to book
          <br />
          your next cinema night.
        </h1>

        <p className={`mt-4 max-w-2xl text-sm sm:text-base ${dark ? "text-slate-400" : "text-slate-600"}`}>
          Discover what’s trending, lock the best seats in seconds, and manage
          everything from one minimalist experience.
        </p>

        <div
          className={`mt-8 flex w-full max-w-2xl flex-col gap-3 rounded-2xl border px-4 py-4 text-left sm:flex-row sm:items-center ${
            dark
              ? "border-slate-800 bg-slate-950/85"
              : "border-slate-200 bg-white/90"
          }`}
        >
          <div className="flex flex-1 items-center gap-2">
            <svg
              className="h-4 w-4 text-slate-400"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search movies, shows, or cinemas"
              className="hero-search-input flex-1 bg-transparent text-sm outline-none"
              style={{ color: dark ? "#E2E8F0" : "#0F172A" }}
            />
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <button
              className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
                dark
                  ? "bg-white text-slate-900 hover:bg-slate-200"
                  : "bg-slate-900 text-white hover:bg-slate-800"
              }`}
            >
              Search
            </button>
            <button
              type="button"
              onClick={openAskEpicAi}
              className={`group inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2 text-xs font-semibold transition ${
                dark
                  ? "border-slate-800 text-slate-200 hover:border-slate-600"
                  : "border-slate-200 text-slate-700 hover:border-slate-300"
              }`}
            >
              <svg width="0" height="0" aria-hidden="true" className="absolute">
                <defs>
                  <linearGradient id="hero-again-ask-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#60A5FA" />
                    <stop offset="100%" stopColor="#22D3EE" />
                  </linearGradient>
                </defs>
              </svg>
              <Sparkles
                className="h-4 w-4 transition-transform duration-200 group-hover:rotate-6"
                style={{ stroke: "url(#hero-again-ask-gradient)" }}
              />
              Ask Epic AI
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {TAGS.map((tag) => (
            <button
              key={tag}
              className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] transition ${
                dark
                  ? "border-slate-800 bg-slate-950/80 text-slate-300 hover:border-slate-600"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="absolute inset-x-0 -bottom-1">
        <div className="mx-auto grid w-full max-w-6xl gap-4 px-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURE_CARDS.map((card) => (
            <div
              key={card.title}
              className={`group relative flex h-[38vh] flex-col overflow-hidden rounded-3xl border shadow-xl transition-transform duration-200 hover:-translate-y-1 ${
                dark
                  ? "border-slate-800 bg-slate-950/90 text-slate-200"
                  : "border-slate-200 bg-white text-slate-700"
              }`}
            >
              <div className="relative h-full w-full overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${CARD_IMAGE})` }}
                />
                <div
                  className={`absolute inset-0 ${
                    dark ? "bg-gradient-to-t from-black/70 via-black/20 to-transparent" : "bg-gradient-to-t from-black/60 via-black/10 to-transparent"
                  }`}
                />
                <div className="absolute inset-x-6 bottom-6">
                  <h3 className="text-base font-semibold text-white drop-shadow">
                    {card.title}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        html.theme-light input.hero-search-input,
        html.theme-dark input.hero-search-input {
          background-color: transparent !important;
        }
        input.hero-search-input:-webkit-autofill,
        input.hero-search-input:-webkit-autofill:hover,
        input.hero-search-input:-webkit-autofill:focus {
          -webkit-text-fill-color: inherit;
          -webkit-box-shadow: 0 0 0 1000px transparent inset;
          box-shadow: 0 0 0 1000px transparent inset;
        }
      `}</style>
    </section>
  );
}
