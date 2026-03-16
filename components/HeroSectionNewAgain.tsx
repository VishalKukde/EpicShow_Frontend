"use client";

import { useThemeStore } from "@/store/themeStore";
import { HERO_PAGE_BG } from "@/components/heroTheme";
import HeroHeader from "@/components/hero/HeroHeader";

export default function HeroSectionNewAgain() {
  const mode = useThemeStore((s) => s.mode);
  const dark = mode === "dark";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');

        .hg-hero-content {
          position: relative;
          z-index: 10;
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 80px 24px 24px;
          height: 60vh;
          box-sizing: border-box;
        }

        @media (max-width: 640px) {
          .hg-hero-content {
            height: 60vh;
            padding: 90px 18px 20px;
            justify-content: center;
            gap: 14px;
            box-sizing: border-box;
          }
        }

        /* ── responsive headline ── */
        .hg-h1 {
          font-family: 'Sora', sans-serif;
          font-weight: 800;
          line-height: 1.06;
          letter-spacing: -0.045em;
          white-space: nowrap;
          font-size: clamp(1.7rem, 5.2vw, 4.2rem);
        }
        @media (max-width: 520px) {
          .hg-h1 {
            white-space: normal;
            font-size: clamp(2rem, 8.5vw, 2.8rem);
            line-height: 1.10;
            text-align: center;
          }
        }
      `}</style>

      {/* ══════════════════════════════════
          SECTION
      ══════════════════════════════════ */}
      <section
        style={{
          position: "relative",
          height: "60vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          background: dark
            ? `radial-gradient(900px 420px at 10% -10%, rgba(30,41,59,0.55), transparent 60%),
               radial-gradient(700px 360px at 85% 0%, rgba(15,23,42,0.7), transparent 55%),
               ${HERO_PAGE_BG.dark}`
            : `radial-gradient(900px 420px at 10% -10%, rgba(226,232,240,0.9), transparent 60%),
               radial-gradient(700px 360px at 85% 0%, rgba(219,234,254,0.7), transparent 55%),
               #FFFFFF`,
        }}
      >
        {/* bg grid + orbs */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" }}>
          <div style={{
            position: "absolute", inset: 0, opacity: 0.35,
            backgroundImage: dark
              ? "linear-gradient(rgba(148,163,184,0.08) 1px,transparent 1px),linear-gradient(90deg,rgba(148,163,184,0.08) 1px,transparent 1px)"
              : "linear-gradient(rgba(148,163,184,0.18) 1px,transparent 1px),linear-gradient(90deg,rgba(148,163,184,0.18) 1px,transparent 1px)",
            backgroundSize: "36px 36px",
          }} />
          <div style={{
            position: "absolute", top: "-64px", left: "40px",
            width: "160px", height: "160px", borderRadius: "50%",
            filter: "blur(60px)",
            background: dark ? "rgba(99,102,241,0.10)" : "rgba(165,180,252,0.40)",
          }} />
          <div style={{
            position: "absolute", bottom: "20vh", right: "40px",
            width: "176px", height: "176px", borderRadius: "50%",
            filter: "blur(60px)",
            background: dark ? "rgba(16,185,129,0.10)" : "rgba(110,231,183,0.40)",
          }} />
        </div>

        <HeroHeader className="hg-hero-content" />

      </section>
    </>
  );
}
