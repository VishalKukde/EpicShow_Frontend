"use client";

import { Sparkles, Ticket } from "lucide-react";
import { useAskEpicAiStore } from "@/store/askEpicAiStore";

type HeroHeaderProps = {
  className?: string;
};

export default function HeroHeader({ className }: HeroHeaderProps) {
  const openAskEpicAi = useAskEpicAiStore((s) => s.open);

  const tk = {
    text1: "var(--hero-header-text)",
    text2: "var(--hero-header-muted)",
    border: "var(--hero-header-border)",
    pillBg: "var(--hero-header-pill-bg)",
    aiBorder: "var(--hero-header-btn-border)",
    aiTxt: "var(--hero-header-btn-text)",
    aiBg: "var(--hero-header-btn-bg)",
    aiShadow: "var(--hero-header-btn-shadow)",
    aiShadowHover: "var(--hero-header-btn-shadow-hover)",
    aiHoverBorder: "var(--hero-header-btn-hover-border)",
  };

  return (
    <div className={className}>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "7px",
          borderRadius: "100px",
          border: `1px solid ${tk.border}`,
          background: tk.pillBg,
          backdropFilter: "blur(12px)",
          padding: "5px 14px 5px 8px",
          marginBottom: "24px",
        }}
      >
        <span
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "22px",
            height: "22px",
            borderRadius: "50%",
            background: "linear-gradient(135deg,#6366f1,#38bdf8)",
            flexShrink: 0,
          }}
        >
          <Ticket size={11} color="#fff" />
        </span>
        <span
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "10.5px",
            fontWeight: 500,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: tk.text2,
          }}
        >
          Your all-in-one booking platform
        </span>
      </div>

      <h1 className="hg-h1" style={{ color: tk.text1, margin: "0 0 20px" }}>
        Book anything.{" "}
        <span style={{ color: tk.text1 }}>Go anywhere.</span>
      </h1>

      <p
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "clamp(0.875rem, 1.5vw, 1rem)",
          fontWeight: 300,
          lineHeight: 1.75,
          color: tk.text2,
          maxWidth: "420px",
          margin: "0 0 32px",
        }}
      >
        From movie seats to flight seats — book any experience in seconds.
      </p>

      <button
        type="button"
        onClick={openAskEpicAi}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          borderRadius: "14px",
          border: `1px solid ${tk.aiBorder}`,
          padding: "13px 28px",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "0.9rem",
          fontWeight: 500,
          cursor: "pointer",
          background: tk.aiBg,
          color: tk.aiTxt,
          backdropFilter: "blur(14px)",
          boxShadow: tk.aiShadow,
          transition: "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s",
        }}
        onMouseOver={(event) => {
          const target = event.currentTarget;
          target.style.transform = "translateY(-2px)";
          target.style.borderColor = tk.aiHoverBorder;
          target.style.boxShadow = tk.aiShadowHover;
        }}
        onMouseOut={(event) => {
          const target = event.currentTarget;
          target.style.transform = "translateY(0)";
          target.style.borderColor = tk.aiBorder;
          target.style.boxShadow = tk.aiShadow;
        }}
      >
        <svg width="0" height="0" aria-hidden="true" style={{ position: "absolute" }}>
          <defs>
            <linearGradient id="ai-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
          </defs>
        </svg>
        <Sparkles size={16} style={{ stroke: "url(#ai-grad)", flexShrink: 0 }} />
        Ask Epic AI
      </button>
    </div>
  );
}
