"use client";

import { Ticket } from "lucide-react";

type HeroHeaderProps = {
  className?: string;
};

export default function HeroHeader({ className }: HeroHeaderProps) {
  const tk = {
    text1: "var(--hero-header-text)",
    text2: "var(--hero-header-muted)",
    border: "var(--hero-header-border)",
    pillBg: "var(--hero-header-pill-bg)",
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
          margin: "0 auto",
        }}
      >
        From movie seats to flight seats — book any experience in seconds.
      </p>
    </div>
  );
}
