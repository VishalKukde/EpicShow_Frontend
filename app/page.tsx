"use client";
import MovieRow from "./components/MovieRow";
import CategoryGateway from "./components/CategoryGateway";
import { useEffect } from "react";
import { useThemeStore } from "@/store/themeStore";
import dynamic from "next/dynamic";
import { HERO_PAGE_BG } from "@/components/heroTheme";
import CinematicHeroSpotlight from "@/components/HeroSection";
import TrendingFooter from "./components/TrendingFooter";
import HeroSectionNewAgain from "@/components/HeroSectionNewAgain";
import HeroCategoryCards from "@/components/hero/HeroCategoryCards";


// page.tsx (or wherever you use the component)
const CinematicHeroSpotlightNew = dynamic(
  () => import("@/components/HeroSectionNew"),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-blue-400/30 border-t-blue-400 animate-spin" />
          <span className="text-blue-400/50 text-xs tracking-widest uppercase font-light">
            Loading
          </span>
        </div>
      </div>
    ),
  }
);

export default function LandingPage() {
  const mode = useThemeStore((s) => s.mode);
  const dark = mode === "dark";
  const nowShowing = ["Interstellar", "Inception", "Dune", "Avatar", "Tenet"];
  const comingSoon = ["Oppenheimer", "Joker 2", "Batman", "Matrix", "Blade Runner"];
  const nowShowingList = Array.from({ length: 5 }, (_, i) => nowShowing[i % nowShowing.length]);
  const comingSoonList = Array.from({ length: 5 }, (_, i) => comingSoon[i % comingSoon.length]);

  useEffect(() => {
    const blockBack = () => {
      window.history.pushState(null, "", "/");
      window.addEventListener("popstate", blockBack);

      return () => window.removeEventListener("popstate", blockBack);
    };

    window.addEventListener("popstate", blockBack);
    return () => window.removeEventListener("popstate", blockBack);
  }, []);

  

  return (
    <div
      className="relative min-h-screen select-none overflow-x-hidden"
      style={{
        backgroundColor: dark ? HERO_PAGE_BG.dark : "#FFFFFF",
      }}
    >
      {/* <LandingIntroModal /> */}
      {/* <AmbientBlobs /> */}

      <div className="relative z-10 flex flex-col pb-[calc(env(safe-area-inset-bottom)+3rem)] sm:pb-0">
        {/* <CinematicHeroSpotlight /> */} 
        {/* <CinematicHeroSpotlightNew/> */}
        <HeroSectionNewAgain/>

        <div className="mx-auto w-full max-w-7xl space-y-20 px-4 pb-20 pt-12 sm:space-y-24 sm:px-6 sm:pb-24 sm:pt-16 lg:space-y-28 lg:px-2 lg:pb-28 lg:pt-12">
          <MovieRow
            title="Now Showing"
            movies={nowShowingList}
          />

          <HeroCategoryCards className="mt-6" />

          {/* <CategoryGateway /> */}

          <MovieRow
            title="Coming Soon"
            movies={comingSoonList}
          />
        </div>

        <TrendingFooter />
      </div>
    </div>
  );
}
