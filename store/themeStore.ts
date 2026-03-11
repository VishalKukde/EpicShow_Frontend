"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type ThemeMode = "light" | "dark";

type ThemeState = {
  mode: ThemeMode;
  activeUserId: string | null;
  userThemes: Record<string, ThemeMode>;
  initializeForUser: (userId: string | null) => void;
  setTheme: (mode: ThemeMode) => void;
  toggleTheme: () => void;
};

const guestKey = "guest";

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: "light",
      activeUserId: null,
      userThemes: {},

      initializeForUser: (userId) => {
        const key = userId || guestKey;
        const saved = get().userThemes[key] || "light";
        set({ activeUserId: userId, mode: saved });
      },

      setTheme: (mode) => {
        const key = get().activeUserId || guestKey;
        set((state) => ({
          mode,
          userThemes: {
            ...state.userThemes,
            [key]: mode,
          },
        }));
      },

      toggleTheme: () => {
        const next: ThemeMode = get().mode === "dark" ? "light" : "dark";
        get().setTheme(next);
      },
    }),
    {
      name: "user-theme-preferences-v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ userThemes: state.userThemes }),
    }
  )
);
