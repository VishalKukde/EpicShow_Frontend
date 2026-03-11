"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useThemeStore } from "@/store/themeStore";

interface CategoryCardProps {
  title: string;
  subtitle: string;
  href: string;
  accent?: string;
  accentTo?: string;
  glowColor?: string;
  index?: number;
}

export default function CategoryCard({
  title,
  subtitle,
  href,
  accent = "#93C5FD",
  accentTo = "#A78BFA",
  glowColor = "rgba(147,197,253,0.22)",
  index = 0,
}: CategoryCardProps) {
  const mode = useThemeStore((s) => s.mode);
  const dark = mode === "dark";

  const wrapRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const { scrollYProgress } = useScroll({
    target: wrapRef as React.RefObject<HTMLElement>,
    offset: ["start end", "end start"],
  });

  const parallaxRaw = useTransform(scrollYProgress, [0, 1], [10 + index * 2, -10 - index * 2]);
  const parallaxY = useSpring(parallaxRaw, { stiffness: 125, damping: 26, mass: 0.35 });

  return (
    <div ref={wrapRef}>
      <motion.a
        href={href}
        style={{ y: parallaxY }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="group block rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
      >
        <div
          className={`relative overflow-hidden rounded-2xl border px-3 py-3 transition-all duration-200 sm:px-4 sm:py-4 ${
            dark
              ? "border-slate-700/80 bg-[linear-gradient(155deg,rgba(15,23,42,0.94)_0%,rgba(17,24,39,0.92)_58%,rgba(11,18,32,0.95)_100%)]"
              : "border-slate-200 bg-[linear-gradient(155deg,#ffffff_0%,#f8fafc_58%,#f1f5f9_100%)]"
          }`}
          style={{
            transform: hovered ? "translateY(-2px)" : "translateY(0)",
            boxShadow: hovered
              ? dark
                ? `0 12px 24px rgba(2,6,23,0.4), 0 0 18px ${glowColor}`
                : `0 10px 20px rgba(15,23,42,0.14), 0 0 14px ${glowColor}`
              : dark
                ? "0 6px 16px rgba(2,6,23,0.28)"
                : "0 5px 14px rgba(15,23,42,0.08)",
          }}
        >
          <div
            aria-hidden
            className={`pointer-events-none absolute inset-0 ${dark ? "opacity-80" : "opacity-95"}`}
            style={{
              background: dark
                ? `radial-gradient(circle at top right, ${accent}2b, transparent 45%), radial-gradient(circle at bottom left, ${accentTo}20, transparent 48%)`
                : `radial-gradient(circle at top right, ${accent}22, transparent 45%), radial-gradient(circle at bottom left, ${accentTo}1a, transparent 48%)`,
            }}
          />
          <div
            aria-hidden
            className={`pointer-events-none absolute inset-0 ${dark ? "opacity-[0.12]" : "opacity-[0.1]"}`}
            style={{
              backgroundImage:
                "repeating-linear-gradient(135deg, rgba(148,163,184,0.5) 0px, rgba(148,163,184,0.5) 1px, transparent 1px, transparent 14px)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute left-3 right-3 top-0 h-px"
            style={{
              background: `linear-gradient(90deg, transparent, ${accent}, ${accentTo}, transparent)`,
              opacity: dark ? 0.45 : 0.55,
            }}
          />

          <div className="relative z-10">
            <h3
              className={`text-[0.98rem] font-semibold leading-tight tracking-tight sm:text-[1.08rem] ${
                dark ? "text-slate-100" : "text-slate-900"
              }`}
            >
              {title}
            </h3>
            <p
              className={`mt-1 text-[11px] leading-relaxed sm:text-xs ${
                dark ? "text-slate-300" : "text-slate-600"
              }`}
            >
              {subtitle}
            </p>

            <span
              className={`mt-3 inline-flex w-fit items-center rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] ${
                dark ? "text-slate-100" : "text-slate-700"
              }`}
              style={{
                background: dark ? `${accent}2b` : `${accent}20`,
                border: dark ? `1px solid ${accent}4a` : `1px solid ${accent}3a`,
              }}
            >
              Explore
            </span>
          </div>
        </div>
      </motion.a>
    </div>
  );
}
