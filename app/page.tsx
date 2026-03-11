"use client";
import MovieRow from "./components/MovieRow";
import CategoryGateway from "./components/CategoryGateway";
import { useEffect } from "react";
import { useThemeStore } from "@/store/themeStore";
import dynamic from "next/dynamic";
import { HERO_PAGE_BG } from "@/components/heroTheme";
import CinematicHeroSpotlight from "@/components/HeroSection";


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
      {/* <AmbientBlobs /> */}

      <div className="relative z-10 flex flex-col pb-[calc(env(safe-area-inset-bottom)+3rem)] sm:pb-0">
        {/* <CinematicHeroSpotlight /> */} 
        <CinematicHeroSpotlightNew/>

        <div className="mx-auto w-full max-w-7xl space-y-16 px-4 pb-0 pt-20 sm:space-y-20 sm:px-6 sm:pb-0 sm:pt-24 lg:px-8">
          <MovieRow
            title="Now Showing"
            movies={["Interstellar", "Inception", "Dune", "Avatar", "Tenet"]}
          />

          <CategoryGateway />

          <MovieRow
            title="Coming Soon"
            movies={[
              "Oppenheimer",
              "Joker 2",
              "Batman",
              "Matrix",
              "Blade Runner",
            ]}
          />
        </div>

        {/* Footer */}
        <footer className={`px-4 py-10 text-center text-sm sm:px-6 lg:px-8 ${dark ? "text-zinc-400" : "text-gray-500"}`}>
          © 2026 MovieBook. Inspired by great cinema.
        </footer>
      </div>
    </div>
  );
}
