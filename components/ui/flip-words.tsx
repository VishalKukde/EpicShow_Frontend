"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

type FlipWordsProps = {
  words: string[];
  duration?: number;
  className?: string;
};

export function FlipWords({ words, duration = 2400, className }: FlipWordsProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (words.length <= 1) {
      return;
    }
    const interval = window.setInterval(() => {
      setIndex((current) => (current + 1) % words.length);
    }, duration);

    return () => window.clearInterval(interval);
  }, [duration, words.length]);

  if (words.length === 0) {
    return null;
  }

  const word = words[index % words.length];

  return (
    <span className="relative inline-flex">
      <AnimatePresence mode="wait">
        <motion.span
          key={word}
          initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -12, filter: "blur(6px)" }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className={`inline-block ${className ?? ""}`}
        >
          {word}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
