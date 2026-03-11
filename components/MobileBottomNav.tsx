"use client";

import Link from "next/link";
import { BadgePercent, Compass, Heart, Home, User2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useThemeStore } from "@/store/themeStore";
import { motion } from "framer-motion";
import { HERO_PAGE_BG } from "@/components/heroTheme";

const items = [
  { href: "/", label: "Home", icon: Home },
  { href: "/movies", label: "Explore", icon: Compass },
  { href: "/favorites", label: "Favorites", icon: Heart },
  { href: "/offers", label: "Offers", icon: BadgePercent },
  { href: "/profile/menu", label: "Profile", icon: User2 },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const mode = useThemeStore((s) => s.mode);
  const dark = mode === "dark";
  const showNav = true;
  const isLandingPage = pathname === "/";
  const isProfileRoute = pathname.startsWith("/profile");

  const shouldHide =
    pathname === "/login" ||
    pathname === "/register" ||
    (isProfileRoute && !pathname.startsWith("/profile/menu")) ||
    pathname.includes("/seat-layout") ||
    (!isProfileRoute && (pathname.includes("/payment") || pathname.includes("/review")));

  if (loading || !user || shouldHide) {
    return null;
  }

  const navBackgroundColor = isLandingPage
    ? dark
      ? HERO_PAGE_BG.dark
      : HERO_PAGE_BG.light
    : dark
      ? "rgba(24,24,27,0.92)"
      : "rgba(255,255,255,0.82)";

  return (
    <nav
      className={`pointer-events-none fixed inset-x-0 bottom-2 z-50 transition-all duration-300 ease-out lg:hidden ${
        showNav ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0"
      }`}
    >
      <div className={`${showNav ? "pointer-events-auto" : "pointer-events-none"} mx-auto w-[calc(100%-1rem)] max-w-md`}>
        <div
          className={`relative grid grid-cols-5 rounded-2xl border p-1.5 ${
            dark
              ? "border-[#1b2540]/80 shadow-[0_18px_45px_rgba(0,0,0,0.55)] backdrop-blur-2xl"
              : "border-[#cfdaf6]/95 shadow-[0_18px_40px_rgba(15,23,42,0.14)] backdrop-blur-2xl"
          }`}
          style={{ backgroundColor: navBackgroundColor }}
        >
        {items.map((item) => {
          const active =
            pathname === item.href ||
            pathname.startsWith(item.href + "/") ||
            (item.href === "/profile/menu" && isProfileRoute);

          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex h-12 flex-col items-center justify-center rounded-xl text-[10px] font-medium transition-colors duration-200 ${
                dark
                  ? active
                    ? "text-blue-300"
                    : "text-zinc-400"
                  : active
                    ? "text-blue-700"
                    : "text-gray-600"
              }`}
            >
              <motion.div
                whileTap={{ scale: 0.9 }}
                className="relative z-10 flex h-full w-full flex-col items-center justify-center gap-0.5 px-1 py-1"
              >
                <span className="inline-flex items-center justify-center rounded-full p-1">
                  <Icon
                    className={`h-4 w-4 transition-transform duration-200 ${
                      dark
                        ? active
                          ? "text-blue-400"
                          : "text-zinc-400"
                        : active
                          ? "text-blue-700"
                          : "text-gray-600"
                    }`}
                  />
                </span>
                <span className="tracking-[0.01em]">{item.label}</span>
              </motion.div>

              {active ? (
                <motion.span
                  layoutId="mobile-nav-active-divider"
                  transition={{ type: "spring", stiffness: 520, damping: 36 }}
                  className={`pointer-events-none absolute -bottom-1 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full ${
                    dark ? "bg-blue-300" : "bg-blue-700"
                  }`}
                />
              ) : null}
            </Link>
          );
        })}
        </div>
      </div>
    </nav>
  );
}
