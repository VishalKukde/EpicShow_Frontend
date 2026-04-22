"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import type { ReactNode } from "react";
import FeatureShowcaseModal from "@/components/FeatureShowcaseModal";

const FEATURE_SHOWCASE_STORAGE_KEY = "epicshow-feature-showcase-seen-v1";

type FeatureShowcaseContextValue = {
  isOpen: boolean;
  openShowcase: () => void;
  closeShowcase: () => void;
};

const FeatureShowcaseContext = createContext<FeatureShowcaseContextValue | null>(null);

export function FeatureShowcaseProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasSeen, setHasSeen] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const storedValue = window.localStorage.getItem(FEATURE_SHOWCASE_STORAGE_KEY);
        const alreadySeen = storedValue === "1";
        setHasSeen(alreadySeen);
        if (!alreadySeen) {
          setIsOpen(true);
        }
      } catch {
        setHasSeen(false);
        setIsOpen(true);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const openShowcase = () => {
    setIsOpen(true);
  };

  const closeShowcase = () => {
    setIsOpen(false);

    if (hasSeen) return;

    setHasSeen(true);
    try {
      window.localStorage.setItem(FEATURE_SHOWCASE_STORAGE_KEY, "1");
    } catch {}
  };

  return (
    <FeatureShowcaseContext.Provider
      value={{
        isOpen,
        openShowcase,
        closeShowcase,
      }}
    >
      {children}
      <FeatureShowcaseModal isOpen={isOpen} onClose={closeShowcase} />
    </FeatureShowcaseContext.Provider>
  );
}

export function useFeatureShowcase() {
  const context = useContext(FeatureShowcaseContext);

  if (!context) {
    throw new Error("useFeatureShowcase must be used within FeatureShowcaseProvider");
  }

  return context;
}
