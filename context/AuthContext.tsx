"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { User, AuthResponse } from "@/types/Auth";
import { getToken, setToken } from "@/lib/tokenStore";
import { useBookingStore } from "@/store/bookingStore";
import { useEventBookingStore } from "@/store/eventBookingStore";
import { useGamingBookingStore } from "@/store/gamingBookingStore";
import { usePaymentStore } from "@/store/paymentStore";
import { useSportBookingStore } from "@/store/sportBookingStore";
import { useThemeStore } from "@/store/themeStore";

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  register: (name: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const clearSession = () => {
      if (cancelled) return;
      setUser(null);
      setAccessToken(null);
      setToken(null);
    };

    const setSession = (nextUser: User, token: string) => {
      if (cancelled) return;
      setUser(nextUser);
      setAccessToken(token);
      setToken(token);

      const themeStore = useThemeStore.getState();
      themeStore.initializeForUser(nextUser.id);
      let storedMode: "light" | "dark" | null = themeStore.userThemes?.[nextUser.id] ?? null;

      if (typeof window !== "undefined") {
        try {
          const raw = localStorage.getItem("user-theme-preferences-v1");
          if (raw) {
            const parsed = JSON.parse(raw) as {
              state?: { userThemes?: Record<string, "light" | "dark"> };
            };
            const stored = parsed?.state?.userThemes?.[nextUser.id];
            if (stored === "light" || stored === "dark") {
              storedMode = stored;
            }
          }
        } catch {
          // ignore localStorage parsing errors
        }
      }

      const preferredMode = nextUser?.preferences?.darkMode ? "dark" : "light";
      themeStore.setTheme(storedMode || preferredMode);
    };

    const bootstrapAuth = async () => {
      try {
        const data: AuthResponse = await apiFetch("/auth/refresh", { method: "POST",  credentials: "include" });
        setSession(data.user, data.accessToken);
      } catch {
        const token = getToken();
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;

        if (!token || !baseUrl) {
          clearSession();
          return;
        }

        try {
          const res = await fetch(`${baseUrl}/profile/me`, {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          if (!res.ok) {
            throw new Error("Failed to fetch current user");
          }

          const data: { user: User } = await res.json();
          setSession(data.user, token);
        } catch {
          clearSession();
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    bootstrapAuth();

    return () => {
      cancelled = true;
    };
  }, []);

  async function register(name: string, email: string, password: string) {
    await apiFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
  }

  async function login(email: string, password: string, rememberMe = false) {
    const data: AuthResponse = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password, rememberMe }),
    });

    setUser(data.user);
    setToken(data.accessToken);
    setAccessToken(data.accessToken);
  }

  async function logout() {
    try {
      await apiFetch("/auth/logout", { method: "POST" });
    } catch {
      // If network/API fails, still clear local session to avoid stale state bugs.
    } finally {
      const currentMode = useThemeStore.getState().mode;
      setUser(null);
      setAccessToken(null);
      setToken(null);

      useBookingStore.getState().resetBooking();
      useEventBookingStore.getState().resetBooking();
      useGamingBookingStore.getState().resetBooking();
      useSportBookingStore.getState().resetBooking();
      usePaymentStore.getState().resetPayment();
      useThemeStore.getState().initializeForUser(null);
      useThemeStore.getState().setTheme(currentMode);
    }
  }

  const updateUser = (data: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...data } : prev));
  };

  return (
    <AuthContext.Provider
      value={{ user, updateUser, accessToken, loading, register, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
