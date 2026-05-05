"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type ThemeMode = "light" | "dark";

type ThemeState = {
  mode: ThemeMode;
  activeUserId: string | null;
  lastUserId: string | null;
  userThemes: Record<string, ThemeMode>;
  initializeForUser: (userId: string | null) => void;
  setTheme: (mode: ThemeMode) => void;
  setThemeForUser: (userId: string | null, mode: ThemeMode) => void;
  toggleTheme: () => void;
};

const guestKey = "guest";

const getInitialThemeMode = (): ThemeMode => {
  if (typeof window === "undefined") return "light";
  try {
    const raw = localStorage.getItem("user-theme-preferences-v1");
    if (!raw) return "light";
    const parsed = JSON.parse(raw) as {
      state?: {
        userThemes?: Record<string, ThemeMode>;
        mode?: ThemeMode;
        lastUserId?: string | null;
      };
    };
    console.log("Loaded theme preferences from localStorage:", parsed);
    const storedMode = parsed?.state?.mode;
    if (storedMode === "dark" || storedMode === "light") {
      return storedMode;
    }
    const userThemes = parsed?.state?.userThemes || {};
    const lastUserId = parsed?.state?.lastUserId;
    if (lastUserId && userThemes[lastUserId]) {
      return userThemes[lastUserId];
    }
    return userThemes[guestKey] || "light";
  } catch {
    return "light";
  }
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: getInitialThemeMode(),
      activeUserId: null,
      lastUserId: null,
      userThemes: {},

      initializeForUser: (userId) => {
        const key = userId || guestKey;
        const saved = get().userThemes[key];
        set({
          activeUserId: userId,
          lastUserId: userId ?? get().lastUserId,
          mode: saved || get().mode,
        });
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
      setThemeForUser: (userId, mode) => {
        const key = userId || guestKey;
        set((state) => ({
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
      partialize: (state) => ({
        userThemes: state.userThemes,
        mode: state.mode,
        lastUserId: state.lastUserId,
      }),
    }
  )
);
