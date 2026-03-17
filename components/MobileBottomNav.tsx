"use client";

import { BadgePercent, Compass, Heart, Home, User2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useThemeStore } from "@/store/themeStore";
import { motion } from "framer-motion";

const items = [
  { href: "/", label: "Home", icon: Home },
  { href: "/explore", label: "Search", icon: Compass },
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

  if (loading || shouldHide) {
    return null;
  }

  const navBackgroundColor = "var(--bottom-nav-bg)";
  const handleExploreClick = () => {
    window.location.href = "/explore";
  };
  const navItems = user
    ? items
    : [
        ...items.slice(0, 4),
        { href: "/login", label: "Login", icon: User2 },
      ];

  return (
    <nav
      className={`pointer-events-none fixed inset-x-0 bottom-0 z-50 transition-all duration-300 ease-out lg:hidden ${
        showNav ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0"
      }`}
    >
      <div className={`${showNav ? "pointer-events-auto" : "pointer-events-none"} w-full`}>
        <div
          className={`relative grid grid-cols-5 border-t px-2 py-2 shadow-[0_-12px_30px_rgba(15,23,42,0.18)] backdrop-blur-2xl ${
            dark ? "border-[#1b2540]/80" : "border-[#cfdaf6]/95"
          }`}
          style={{ backgroundColor: navBackgroundColor }}
        >
        {navItems.map((item) => {
          const active =
            pathname === item.href ||
            pathname.startsWith(item.href + "/") ||
            (item.href === "/profile/menu" && isProfileRoute);

          const Icon = item.icon;
          const isExplore = item.href === "/explore";

          const content = (
            <>
              <motion.div
                whileTap={{ scale: 0.9 }}
                className="relative z-10 flex h-full w-full flex-col items-center justify-center gap-0.5 px-1 py-1"
              >
                <span className="inline-flex items-center justify-center rounded-full p-1">
                  <Icon
                    className={`h-4 w-4 transition-transform duration-200 ${
                      dark
                        ? active
                          ? "text-blue-300"
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
            </>
          );

          const sharedClassName = `relative flex h-12 flex-col items-center justify-center rounded-xl text-[10px] font-medium transition-colors duration-200 ${
            dark
              ? active
                ? "text-blue-300"
                : "text-zinc-400"
              : active
                ? "text-blue-700"
                : "text-gray-600"
          }`;

          if (isExplore) {
            return (
              <button
                key={item.href}
                type="button"
                onClick={handleExploreClick}
                className={sharedClassName}
              >
                {content}
              </button>
            );
          }

          return (
            <Link key={item.href} href={item.href} className={sharedClassName}>
              {content}
            </Link>
          );
        })}
        </div>
      </div>
    </nav>
  );
}
