"use client";

import { Sparkles, Ticket } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";
import { useAskEpicAiStore } from "@/store/askEpicAiStore";

type HeroHeaderProps = {
  className?: string;
};

export default function HeroHeader({ className }: HeroHeaderProps) {
  const mode = useThemeStore((s) => s.mode);
  const openAskEpicAi = useAskEpicAiStore((s) => s.open);
  const dark = mode === "dark";

  const tk = {
    text1: dark ? "#f0f2f8" : "#0b0d14",
    text2: dark ? "rgba(160,174,200,0.75)" : "rgba(45,55,80,0.60)",
    border: dark ? "rgba(255,255,255,0.08)" : "rgba(10,15,40,0.09)",
    aiBorder: dark ? "rgba(255,255,255,0.12)" : "rgba(10,15,40,0.12)",
    aiTxt: dark ? "rgba(200,210,235,0.90)" : "rgba(20,28,50,0.75)",
    aiBg: dark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.90)",
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
          background: dark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.85)",
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
          boxShadow: dark
            ? "0 0 0 1px rgba(255,255,255,0.05), 0 4px 24px rgba(0,0,0,0.30)"
            : "0 0 0 1px rgba(10,15,40,0.06), 0 4px 20px rgba(0,0,0,0.07)",
          transition: "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s",
        }}
        onMouseOver={(event) => {
          const target = event.currentTarget;
          target.style.transform = "translateY(-2px)";
          target.style.borderColor = dark ? "rgba(129,140,248,0.45)" : "rgba(99,102,241,0.35)";
          target.style.boxShadow = dark
            ? "0 0 0 1px rgba(129,140,248,0.25), 0 8px 32px rgba(0,0,0,0.40)"
            : "0 0 0 1px rgba(99,102,241,0.20), 0 8px 28px rgba(0,0,0,0.10)";
        }}
        onMouseOut={(event) => {
          const target = event.currentTarget;
          target.style.transform = "translateY(0)";
          target.style.borderColor = tk.aiBorder;
          target.style.boxShadow = dark
            ? "0 0 0 1px rgba(255,255,255,0.05), 0 4px 24px rgba(0,0,0,0.30)"
            : "0 0 0 1px rgba(10,15,40,0.06), 0 4px 20px rgba(0,0,0,0.07)";
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
