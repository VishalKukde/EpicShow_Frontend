"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import ProfileDropdown from "./ProfileDropdown";
import { useBookingStore } from "@/store/bookingStore";
import { usePaymentStore } from "@/store/paymentStore";
import { unlockAllSeatsForCurrentShow } from "@/hooks/useSeatActions";
// import { useSeatSession } from "@/hooks/useSeatSession";
import { useSeatLayout } from "@/hooks/useSeatLayout";
import { motion } from "framer-motion";
import { Home, Layers3, Search } from "lucide-react";
import SeatTimer from "@/app/components/SeatTimer";
import { useThemeStore } from "@/store/themeStore";
import { useFeatureShowcase } from "@/components/FeatureShowcaseProvider";

export default function Navbar() {
  const { user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const mode = useThemeStore((state) => state.mode);
  const dark = mode === "dark";
  const { openShowcase } = useFeatureShowcase();
  const [scrolled, setScrolled] = useState(false);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 10);

      const hideThreshold = 80;

      if (currentY <= hideThreshold) {
        setIsNavbarVisible(true);
        lastScrollY.current = currentY;
        return;
      }

      const delta = currentY - lastScrollY.current;

      if (delta > 6) {
        setIsNavbarVisible(false); // scrolling down -> hide
      } else if (delta < -6) {
        setIsNavbarVisible(true); // scrolling up -> show
      }

      lastScrollY.current = currentY;
    };

    lastScrollY.current = window.scrollY;
    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  const booking = useBookingStore();
  // const sessionId = useSeatSession();
  const { setSeats } = useSeatLayout(booking);

  const handleHome = () => {
    unlockAllSeatsForCurrentShow(setSeats, user?.id);
    useBookingStore.getState().resetBooking();
    usePaymentStore.getState().resetPayment();
    router.replace("/");
  };

  const hiddenRoutes = ["/profile", "/payment", "/review"];
  const isAuthEntryPage = pathname === "/login" || pathname === "/register";
  const hideNavbar = hiddenRoutes.some((route) => pathname.includes(route));
  const showSeatTimer = pathname.includes("/seat-layout");

  const handleSearchClick = () => {
    if (typeof window !== "undefined" && window.matchMedia("(max-width: 639px)").matches) {
      window.location.href = "/explore";
      return;
    }
    router.push("/explore");
  };

  if (hideNavbar) return null;

  return (
    <>
      <motion.nav
        initial={false}
        animate={{
          opacity: isNavbarVisible ? 1 : 0.02,
          y: isNavbarVisible ? 0 : -120,
        }}
        transition={{
          type: "spring",
          stiffness: 190,
          damping: 26,
          mass: 0.9,
        }}
        className={`fixed left-1/2 -translate-x-1/2 z-50 transform-gpu will-change-transform
    ${pathname === "/explore" ? "hidden sm:block" : ""}
    ${isNavbarVisible ? "pointer-events-auto" : "pointer-events-none"}
    ${scrolled ? "top-2" : "top-3"}
    w-[calc(100%-2rem)] sm:w-[calc(100%-3rem)] lg:w-[calc(100%-4rem)] max-w-[100rem] rounded-2xl
    bg-transparent shadow-none 
  `}
      >
          <div
            className={`relative flex justify-between items-center px-3 sm:px-6 lg:px-3 transition-all duration-500
      ${scrolled ? "py-2 sm:py-2" : "py-3 sm:py-2"}`}
          >
            {/* Logo */}
           <div
  onClick={handleHome}
  className="text-xl sm:text-2xl font-bold tracking-tight lg:pl-2 text-gray-900 cursor-pointer transition-transform duration-300 hover:scale-110 hover:-rotate-1"
>
  EpicShow
</div>

            {showSeatTimer ? (
              <div className="absolute right-3 sm:left-1/2 sm:-translate-x-1/2">
                <SeatTimer variant="navbar" />
              </div>
            ) : null}

            {/* Right */}
          <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={openShowcase}
            aria-label="Open app feature guide"
            className={`inline-flex h-10 shrink-0 cursor-pointer items-center gap-2 whitespace-nowrap rounded-xl border px-3.5 text-xs font-semibold transition hover:-translate-y-0.5 sm:text-sm ${
              dark
                ? "border-white/10 bg-slate-900/70 text-zinc-100 hover:bg-slate-800"
                : "border-slate-200 bg-white/85 text-slate-700 hover:bg-white"
            }`}
            style={{
              backdropFilter: "blur(14px)",
              boxShadow: dark
                ? "0 14px 32px rgba(2, 6, 23, 0.28)"
                : "0 14px 32px rgba(148, 163, 184, 0.2)",
            }}
          >
            <Layers3 className="h-4 w-4" />
            <span className="hidden md:inline">Inside App</span>
          </button>

          {pathname === "/" ? (
            <button
              type="button"
              onClick={handleSearchClick}
              aria-label="Open search"
              className="hidden cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition sm:inline-flex sm:text-sm"
              style={{
                borderColor: "var(--hero-header-btn-border)",
                background: "var(--hero-header-btn-bg)",
                color: "var(--hero-header-btn-text)",
                backdropFilter: "blur(14px)",
                boxShadow: "var(--hero-header-btn-shadow)",
                transform: "translateY(0)",
              }}
              onMouseOver={(event) => {
                const target = event.currentTarget;
                target.style.transform = "translateY(-2px)";
                target.style.borderColor = "var(--hero-header-btn-hover-border)";
                target.style.boxShadow = "var(--hero-header-btn-shadow-hover)";
              }}
              onMouseOut={(event) => {
                const target = event.currentTarget;
                target.style.transform = "translateY(0)";
                target.style.borderColor = "var(--hero-header-btn-border)";
                target.style.boxShadow = "var(--hero-header-btn-shadow)";
              }}
            >
              <Search className="h-4 w-4" />
              <span>Search</span>
            </button>
          ) : null}

          {user ? (
            <div className="hidden sm:block">
              <ProfileDropdown />
            </div>
          ) : isAuthEntryPage ? (
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700">
                Secure access portal
              </span>
              <Link href="/">
                <button className="inline-flex items-center gap-2 cursor-pointer rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
                  <Home className="h-4 w-4" />
                  Home
                </button>
              </Link>
            </div>
          ) : (
            <>
              <Link href="/login">
                <button className="cursor-pointer rounded-lg px-2 py-1 text-xs sm:text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition">
                  Sign in
                </button>
              </Link>

              <Link href="/register">
                <button className="cursor-pointer px-3 sm:px-4 py-2 rounded-xl bg-gray-900 text-white text-xs sm:text-sm font-medium shadow-[0_6px_20px_rgba(0,0,0,0.12)] hover:scale-[1.03] active:scale-[0.97] transition">
                  Get started
                </button>
              </Link>
            </>
          )}
        </div>
        </div>
      </motion.nav>
    </>
  );
}
