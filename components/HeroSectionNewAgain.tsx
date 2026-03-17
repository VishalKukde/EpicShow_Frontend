"use client";

import HeroHeader from "@/components/hero/HeroHeader";

export default function HeroSectionNewAgain() {
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
          background: "var(--hero-section-bg)",
        }}
      >
        {/* bg grid + orbs */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" }}>
          <div style={{
            position: "absolute", inset: 0, opacity: 0.35,
            backgroundImage:
              "linear-gradient(var(--hero-grid-line) 1px,transparent 1px),linear-gradient(90deg,var(--hero-grid-line) 1px,transparent 1px)",
            backgroundSize: "36px 36px",
          }} />
          <div style={{
            position: "absolute", top: "-64px", left: "40px",
            width: "160px", height: "160px", borderRadius: "50%",
            filter: "blur(60px)",
            background: "var(--hero-orb-1)",
          }} />
          <div style={{
            position: "absolute", bottom: "20vh", right: "40px",
            width: "176px", height: "176px", borderRadius: "50%",
            filter: "blur(60px)",
            background: "var(--hero-orb-2)",
          }} />
        </div>

        <HeroHeader className="hg-hero-content" />

      </section>
    </>
  );
}
