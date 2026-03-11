"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useThemeStore } from "@/store/themeStore"; // adjust path if needed
import { HERO_PAGE_BG } from "@/components/heroTheme";
import { Sparkles } from "lucide-react";
import { useAskEpicAiStore } from "@/store/askEpicAiStore";

const posters = ["/dummy.webp", "/dummy.webp", "/dummy.webp", "/dummy.webp"];
const TAGS = ["Trending now", "Top rated", "Coming soon", "IMAX"];
const STATS = [
  { label: "Movies", target: 2400, suffix: "+" },
  { label: "Cinemas", target: 320, suffix: "+" },
  { label: "Cities", target: 80, suffix: "+" },
] as const;

const posterPositions = [
  "top-28 left-6 xl:left-16 -rotate-6",
  "bottom-16 left-10 xl:left-24 rotate-3",
  "top-28 right-6 xl:right-16 rotate-6",
  "bottom-16 right-10 xl:right-24 rotate-[10deg]",
];

export default function CinematicHeroSpotlightNew() {
  const [query, setQuery] = useState("");
  const [statCounts, setStatCounts] = useState<number[]>(() => STATS.map(() => 1));
  const mode = useThemeStore((s) => s.mode);
  const openAskEpicAi = useAskEpicAiStore((state) => state.open);
  const dark = mode === "dark";

  useEffect(() => {
    let frameId = 0;
    const startAt = performance.now();
    const durationMs = 1800;

    const animate = (now: number) => {
      const progress = Math.min((now - startAt) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setStatCounts(
        STATS.map(({ target }) => Math.round(1 + (target - 1) * eased)),
      );

      if (progress < 1) {
        frameId = window.requestAnimationFrame(animate);
      }
    };

    frameId = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frameId);
  }, []);

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 sm:px-6 pt-16 sm:pt-28 pb-20 transition-colors duration-300"
      style={{
        background: dark
          ? HERO_PAGE_BG.dark
          : `linear-gradient(180deg, ${HERO_PAGE_BG.light} 0%, #FFFFFF 100%)`,
      }}
    >
      {/* ── Ambient glows ── */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {dark ? (
          <>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-[#152952] opacity-20 blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-[#0D1F44] opacity-25 blur-[80px]" />
            <div className="absolute top-1/4 right-0 w-[260px] h-[260px] rounded-full bg-[#122040] opacity-20 blur-[70px]" />
          </>
        ) : (
          <>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-[#BFCFFF] opacity-40 blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-[#C7D7FF] opacity-35 blur-[80px]" />
            <div className="absolute top-1/4 right-0 w-[260px] h-[260px] rounded-full bg-[#D4E2FF] opacity-30 blur-[70px]" />
          </>
        )}
      </div>

      {/* ── Grid overlay ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(#3B82F6 1px,transparent 1px),linear-gradient(90deg,#3B82F6 1px,transparent 1px)",
          backgroundSize: "52px 52px",
          opacity: dark ? 0.04 : 0.06,
        }}
      />

      {/* ── Floating Posters ── */}
      <div aria-hidden className="pointer-events-none absolute inset-0 hidden sm:block">
        {posters.map((src, i) => (
          <div
            key={i}
            className={`absolute ${posterPositions[i]} w-[110px] h-[160px] sm:w-[130px] sm:h-[185px] xl:w-[148px] xl:h-[215px] rounded-2xl overflow-hidden hero-poster`}
            style={{ animationDelay: `${i * 1.4}s`, animationDuration: `${6 + i}s` }}
          >
            <Image src={src} alt={`poster ${i + 1}`} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-transparent" />
            <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-black/75 to-transparent" />
            <div className="absolute bottom-2 left-2.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] animate-pulse" />
              <span className="text-[9px] text-white/60 font-medium tracking-wide">NOW SHOWING</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Main content ── */}
      <div className="relative z-10 text-center w-full max-w-2xl xl:max-w-3xl mx-auto animate-fadeUp">

        {/* Eyebrow badge */}
        <div
          className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full text-xs font-medium tracking-widest uppercase border transition-colors duration-300"
          style={
            dark
              ? { background: "#0D1525", borderColor: "rgba(30,58,110,0.6)", color: "#60A5FA" }
              : { background: "rgba(255,255,255,0.7)", borderColor: "#BFCFFF", color: "#2563EB" }
          }
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] animate-pulse" />
          The Premier Ticket Experience
        </div>

        {/* Headline */}
        <h1
          className="text-[2.5rem] leading-[1.1] font-bold tracking-[-0.03em] sm:text-6xl xl:text-7xl mb-5 transition-colors duration-300"
          style={{
            fontFamily: "'Sora', 'DM Sans', sans-serif",
            color: dark ? "#FFFFFF" : "#0F172A",
          }}
        >
          Book your next
          <br />
          <span
            style={{
              background: "linear-gradient(135deg,#60A5FA 0%,#3B82F6 50%,#93C5FD 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              // textTransform: "uppercase",
            }}
          >
            cinematic experience
          </span>
        </h1>

        {/* Subtext */}
        <p
          className="text-sm sm:text-base leading-relaxed mb-10 max-w-md mx-auto transition-colors duration-300"
          style={{ color: dark ? "#64748B" : "#475569" }}
        >
          Discover trending films, explore showtimes nearby, and reserve the
          perfect seat — all through one beautifully crafted experience.
        </p>

        {/* ── Search bar ── */}
        <div
          className="flex items-center gap-2 w-full max-w-xl mx-auto mb-6 px-3 py-2.5 sm:px-4 sm:py-3 rounded-2xl border backdrop-blur-sm transition-all duration-300"
          style={
            dark
              ? {
                background: "rgba(13,21,37,0.9)",
                borderColor: "rgba(30,58,110,0.5)",
                boxShadow: "0 0 0 1px rgba(59,130,246,0.06), 0 16px 40px rgba(0,0,0,0.5)",
              }
              : {
                background: "rgba(255,255,255,0.8)",
                borderColor: "#BFCFFF",
                boxShadow: "0 0 0 1px rgba(59,130,246,0.1), 0 8px 30px rgba(59,130,246,0.1)",
              }
          }
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#3B82F6] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search movies, cinemas, events…"
            className="hero-search-input flex-1 bg-transparent outline-none text-sm sm:text-[15px] min-w-0 transition-colors duration-300 rounded-lg px-2 py-1"
            style={{
              color: dark ? "#FFFFFF" : "#0F172A",
              backgroundColor: "transparent",
            }}
          />

          <div
            className="hidden sm:block w-px h-5 flex-shrink-0"
            style={{ backgroundColor: dark ? "#1E3A6E" : "#BFCFFF" }}
          />
          <button
            className="flex-shrink-0 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl text-white text-xs sm:text-sm font-semibold hover:opacity-90 active:scale-95 transition-all duration-150 cursor-pointer"
            style={{
              background: "linear-gradient(135deg,#1D4ED8,#2563EB)",
              boxShadow: "0 4px 16px rgba(37,99,235,0.35)",
            }}
          >
            Search
          </button>
        </div>

        {/* ── Tags ── */}
        <div className="flex flex-wrap gap-2 justify-center">
          {TAGS.map((tag) => (
            <button
              key={tag}
              className="px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium border transition-all duration-150 cursor-pointer"
              style={
                dark
                  ? { background: "#0D1525", borderColor: "rgba(30,58,110,0.5)", color: "#93C5FD" }
                  : { background: "rgba(255,255,255,0.7)", borderColor: "#BFCFFF", color: "#2563EB" }
              }
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <svg width="0" height="0" aria-hidden="true" className="absolute pointer-events-none">
            <defs>
              <linearGradient id="ask-epic-sparkle-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#60A5FA">
                  <animate
                    attributeName="stop-color"
                    values="#60A5FA;#22D3EE;#A78BFA;#60A5FA"
                    dur="3.6s"
                    repeatCount="indefinite"
                  />
                </stop>
                <stop offset="50%" stopColor="#A78BFA">
                  <animate
                    attributeName="stop-color"
                    values="#A78BFA;#60A5FA;#22D3EE;#A78BFA"
                    dur="3.6s"
                    repeatCount="indefinite"
                  />
                </stop>
                <stop offset="100%" stopColor="#22D3EE">
                  <animate
                    attributeName="stop-color"
                    values="#22D3EE;#A78BFA;#60A5FA;#22D3EE"
                    dur="3.6s"
                    repeatCount="indefinite"
                  />
                </stop>
              </linearGradient>
            </defs>
          </svg>

          <button
            type="button"
            onClick={openAskEpicAi}
            className="group inline-flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
            style={
              dark
                ? {
                  background: "rgba(13,21,37,0.86)",
                  borderColor: "rgba(59,130,246,0.45)",
                  color: "#BFDBFE",
                  boxShadow: "0 12px 28px rgba(2,6,23,0.5)",
                }
                : {
                  background: "rgba(255,255,255,0.84)",
                  borderColor: "rgba(59,130,246,0.35)",
                  color: "#1E40AF",
                  boxShadow: "0 10px 22px rgba(30,64,175,0.13)",
                }
            }
          >
            <Sparkles
              className="h-4 w-4 transition-transform duration-200 group-hover:rotate-6"
              style={{
                stroke: "url(#ask-epic-sparkle-gradient)",
                filter: "drop-shadow(0 0 6px rgba(96,165,250,0.45))",
              }}
            />
            Ask Epic AI
          </button>
        </div>

        {/* ── Stats ── */}
        <div
          className="flex items-center justify-center gap-6 sm:gap-10 mt-10 pt-6 transition-colors duration-300"
          style={{ borderColor: dark ? "rgba(30,58,110,0.3)" : "rgba(191,207,255,0.7)" }}
        >
          {STATS.map(({ label, suffix }, index) => (
            <div key={label} className="text-center">
              <div
                className="text-2xl sm:text-3xl font-bold tracking-tight transition-colors duration-300"
                style={{ fontFamily: "'Sora', sans-serif", color: dark ? "#FFFFFF" : "#0F172A" }}
              >
                {`${statCounts[index].toLocaleString("en-IN")}${suffix}`}
              </div>
              <div
                className="text-[11px] sm:text-xs mt-0.5 uppercase tracking-widest transition-colors duration-300"
                style={{ color: dark ? "#334155" : "#94A3B8" }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom vignette ── */}
      <div
        className="pointer-events-none absolute bottom-0 inset-x-0 h-28"
        style={{
          background: dark
            ? `linear-gradient(to top, ${HERO_PAGE_BG.dark}, transparent)`
            : "linear-gradient(to top, #FFFFFF, transparent)",
        }}
      />

      <style>{`
        @keyframes floatY {
          0%, 100% { transform: translateY(0px);   }
          50%       { transform: translateY(-14px); }
        }
        .hero-poster {
          animation: floatY ease-in-out infinite;
          will-change: transform;
          box-shadow: 0 0 0 1px rgba(46,95,191,0.2),
                      0 20px 50px rgba(0,0,0,0.65),
                      0 0 24px rgba(30,64,128,0.2);
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        .animate-fadeUp {
          animation: fadeUp 0.55s ease-out both;
        }
        @keyframes scrollNudge {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(3px); }
        }
        .hero-scroll-icon {
          animation: scrollNudge 1.2s ease-in-out infinite;
        }
        html.theme-light input.hero-search-input {
          background-color: transparent !important;
        }
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
