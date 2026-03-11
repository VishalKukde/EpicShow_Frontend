"use client";

import { motion } from "framer-motion";
import { useThemeStore } from "@/store/themeStore";
import CategoryCard from "./CategoryCard";

const CATEGORIES = [
  {
    href: "/movies",
    title: "Movies",
    subtitle: "Blockbusters and new releases",
    tag: "500+ films",
    accent: "#93C5FD",
    accentTo: "#A78BFA",
    glowColor: "rgba(147,197,253,0.24)",
  },
  {
    href: "/sports",
    title: "Sports",
    subtitle: "Live matches and tournaments",
    tag: "Live now",
    accent: "#6EE7F9",
    accentTo: "#60A5FA",
    glowColor: "rgba(110,231,249,0.24)",
  },
  {
    href: "/events",
    title: "Events",
    subtitle: "Concerts, shows and meetups",
    tag: "This weekend",
    accent: "#F9A8D4",
    accentTo: "#C4B5FD",
    glowColor: "rgba(249,168,212,0.24)",
  },
  {
    href: "/gaming",
    title: "Gaming",
    subtitle: "Esports and gaming zones",
    tag: "Tournaments",
    accent: "#FDE68A",
    accentTo: "#FCA5A5",
    glowColor: "rgba(253,230,138,0.22)",
  },
];

export default function CategoryGateway() {
  const mode = useThemeStore((s) => s.mode);
  const dark = mode === "dark";

  return (
    <section className="relative mx-auto w-full max-w-7xl py-10 sm:py-14">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mb-8 text-center sm:mb-12"
      >
        <p
          className="mb-3 text-[14px] font-semibold uppercase tracking-[0.3em] sm:text-lg"
          style={{ color: dark ? "#93C5FD" : "#2563EB" }}
        >
          Browse by category
        </p>
      </motion.div>

      <div className="relative z-10 grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4">
        {CATEGORIES.map((cat, index) => (
          <motion.div
            key={cat.href}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{
              duration: 0.48,
              delay: index * 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <CategoryCard {...cat} index={index} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
