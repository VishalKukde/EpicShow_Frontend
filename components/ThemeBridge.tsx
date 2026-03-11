"use client";

import { useEffect, useLayoutEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useThemeStore } from "@/store/themeStore";

export default function ThemeBridge() {
  const { user } = useAuth();
  const mode = useThemeStore((s) => s.mode);
  const initializeForUser = useThemeStore((s) => s.initializeForUser);

  useEffect(() => {
    initializeForUser(user?.id || null);
  }, [user?.id, initializeForUser]);

  useLayoutEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    html.classList.remove("theme-light", "theme-dark", "light", "dark");
    html.classList.add(mode === "dark" ? "theme-dark" : "theme-light");
    html.classList.add(mode === "dark" ? "dark" : "light");
    body.classList.remove("theme-light", "theme-dark", "light", "dark");
    body.classList.add(mode === "dark" ? "theme-dark" : "theme-light");
    body.classList.add(mode === "dark" ? "dark" : "light");

    html.style.colorScheme = mode;
  }, [mode]);

  return null;
}
