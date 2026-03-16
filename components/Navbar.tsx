"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import ProfileDropdown from "./ProfileDropdown";
import MovieSearchModal from "./MovieSearchModal";
import { useBookingStore } from "@/store/bookingStore";
import { usePaymentStore } from "@/store/paymentStore";
import { unlockAllSeatsForCurrentShow } from "@/hooks/useSeatActions";
// import { useSeatSession } from "@/hooks/useSeatSession";
import { useSeatLayout } from "@/hooks/useSeatLayout";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";

export default function Navbar() {
  const { user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const mode = useThemeStore((s) => s.mode);
  const [scrolled, setScrolled] = useState(false);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 10);

      // Only auto-hide on landing page after crossing the hero/first viewport.
      if (pathname !== "/") {
        setIsNavbarVisible(true);
        lastScrollY.current = currentY;
        return;
      }

      const heroBoundary = Math.max(window.innerHeight - 100, 280);

      if (currentY <= heroBoundary) {
        setIsNavbarVisible(true);
        lastScrollY.current = currentY;
        return;
      }

      const delta = currentY - lastScrollY.current;

      if (delta > 8) {
        setIsNavbarVisible(false); // scrolling down -> hide
      } else if (delta < -8) {
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
    unlockAllSeatsForCurrentShow(setSeats);
    useBookingStore.getState().resetBooking();
    usePaymentStore.getState().resetPayment();
    router.replace("/");
  };

  const hiddenRoutes = ["/profile", "/payment", "/review"];
  const isAuthEntryPage = pathname === "/login" || pathname === "/register";
  const dark = mode === "dark";

  const hideNavbar = hiddenRoutes.some((route) => pathname.includes(route));

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
            className="text-xl sm:text-2xl font-bold tracking-tight lg:pl-2 text-gray-900 cursor-pointer hover:opacity-80 transition"
            onClick={handleHome}
          >
            MovieBook
          </div>

          {/* Right */}
          <div className="flex items-center gap-3 ">
          {/* <button
            type="button"
            onClick={handleMobileChat}
            aria-label="Open chatbot"
            title="Chatbot"
            className={`inline-flex h-9 w-9 items-center justify-center rounded-full border transition sm:hidden ${
              mode === "dark"
                ? "border-zinc-700 bg-zinc-900/80 text-indigo-300 hover:bg-zinc-800"
                : "border-gray-200 bg-white text-indigo-700 hover:bg-indigo-50"
            }`}
          >
            <BotMessageSquare className="h-4 w-4" />
          </button> */}

          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            aria-label="Open search"
            className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition sm:text-sm ${
              dark
                ? "border-zinc-700 bg-zinc-900/80 text-zinc-100 hover:border-zinc-500 hover:bg-zinc-800"
                : "border-gray-200 bg-white/90 text-gray-700 hover:border-gray-300 hover:bg-white"
            }`}
          >
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Search</span>
          </button>

          {user ? (
            <div className="hidden sm:block">
              <ProfileDropdown />
            </div>
          ) : isAuthEntryPage ? (
            <>
              <span className="hidden sm:inline-flex rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
                Secure access portal
              </span>
              <Link href="/">
                <button className="cursor-pointer rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
                  Back to home
                </button>
              </Link>
            </>
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
      <MovieSearchModal open={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
