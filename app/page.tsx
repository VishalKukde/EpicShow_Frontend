"use client";
import MovieRow, { type MovieRowItem } from "./components/MovieRow";
import CategoryGateway from "./components/CategoryGateway";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import CinematicHeroSpotlight from "@/components/HeroSection";
import TrendingFooter from "./components/TrendingFooter";
import HeroSectionNewAgain from "@/components/HeroSectionNewAgain";
import HeroCategoryCards from "@/components/hero/HeroCategoryCards";
import { apiFetch } from "@/lib/api";
import UpcomingMovieModal from "./components/UpcomingMovieModal";


// page.tsx (or wherever you use the component)
// const CinematicHeroSpotlightNew = dynamic(
//   () => import("@/components/HeroSectionNew"),
//   {
//     ssr: false,
//     loading: () => (
//       <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
//         <div className="flex flex-col items-center gap-4">
//           <div className="w-10 h-10 rounded-full border-2 border-blue-400/30 border-t-blue-400 animate-spin" />
//           <span className="text-blue-400/50 text-xs tracking-widest uppercase font-light">
//             Loading
//           </span>
//         </div>
//       </div>
//     ),
//   }
// );

export default function LandingPage() {
  const router = useRouter();
  const [latestReleaseItems, setLatestReleaseItems] = useState<MovieRowItem[]>([]);
  const [upcomingItems, setUpcomingItems] = useState<MovieRowItem[]>([]);
  const [latestLoading, setLatestLoading] = useState(true);
  const [upcomingLoading, setUpcomingLoading] = useState(true);
  const [selectedUpcoming, setSelectedUpcoming] = useState<MovieRowItem | null>(null);
  const [isUpcomingOpen, setIsUpcomingOpen] = useState(false);

  useEffect(() => {
    const blockBack = () => {
      window.history.pushState(null, "", "/");
      window.addEventListener("popstate", blockBack);

      return () => window.removeEventListener("popstate", blockBack);
    };

    window.addEventListener("popstate", blockBack);
    return () => window.removeEventListener("popstate", blockBack);
  }, []);

  useEffect(() => {
    let active = true;

    const loadLatestReleases = async () => {
      if (active) setLatestLoading(true);
      try {
        const data = await apiFetch("/movies/latest?limit=5", {
          method: "GET",
          notifyOnError: false,
        });
        const items = Array.isArray(data) ? data : data?.movies ?? [];
        const mapped = items.map((movie: { _id?: string; name?: string; imageUrl?: string }) => ({
          id: movie._id,
          title: movie.name || "Untitled",
          imageUrl: movie.imageUrl,
        }));
        if (active) setLatestReleaseItems(mapped);
      } catch {
        if (active) setLatestReleaseItems([]);
      } finally {
        if (active) setLatestLoading(false);
      }
    };

    loadLatestReleases();
    return () => {
      active = false;
    };
  }, []);

  // useEffect(() => {
  //   let active = true;

  //   const loadUpcoming = async () => {
  //     if (active) setUpcomingLoading(true);
  //     try {
  //       const data = await apiFetch("/tmdb/upcoming?limit=5", {
  //         method: "GET",
  //         notifyOnError: false,
  //       });
  //       const items = Array.isArray(data?.items) ? data.items : [];
  //       const mapped = items.map(
  //         (movie: {
  //           tmdbId?: number;
  //           name?: string;
  //           imageUrl?: string;
  //           releaseDate?: string | null;
  //           description?: string;
  //           rating?: number | null;
  //           voteCount?: number | null;
  //         }) => ({
  //           id: movie.tmdbId ? String(movie.tmdbId) : undefined,
  //           tmdbId: movie.tmdbId,
  //           title: movie.name || "Untitled",
  //           imageUrl: movie.imageUrl || null,
  //           releaseDate: movie.releaseDate || null,
  //           description: movie.description || null,
  //           rating: movie.rating ?? null,
  //           voteCount: movie.voteCount ?? null,
  //         })
  //       );
  //       if (active) setUpcomingItems(mapped);
  //     } catch {
  //       if (active) setUpcomingItems([]);
  //     } finally {
  //       if (active) setUpcomingLoading(false);
  //     }
  //   };

  //   loadUpcoming();
  //   return () => {
  //     active = false;
  //   };
  // }, []);


  
  const SectionLoader = ({ title }: { title: string }) => (
    <section className="relative z-10 mx-auto mb-16 max-w-7xl sm:mb-24">
      <div className="mb-5 flex flex-col items-start gap-3 text-left">
        <h2 className="section-header text-2xl lg:text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
          {title}
        </h2>
      </div>
      <div className="flex min-h-[200px] items-center justify-center text-slate-500 dark:text-slate-300">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent opacity-70" />
        <span className="ml-3 text-sm">Loading...</span>
      </div>
    </section>
  );

  return (
    <div
      className="relative min-h-screen select-none overflow-x-hidden"
      style={{ backgroundColor: "var(--hero-page-bg)" }}
    >
      {/* <LandingIntroModal /> */}
      {/* <AmbientBlobs /> */}

      <div className="relative z-10 flex flex-col pb-[calc(env(safe-area-inset-bottom)+3rem)] sm:pb-0">
        {/* <CinematicHeroSpotlight /> */} 
        {/* <CinematicHeroSpotlightNew/> */}
        <HeroSectionNewAgain/>

        <div className="mx-auto w-full max-w-7xl space-y-28 px-4 pb-20 pt-12 sm:space-y-32 sm:px-6 sm:pb-24 sm:pt-16 lg:space-y-36 lg:px-2 lg:pb-28 lg:pt-12">
          {latestLoading ? (
            <SectionLoader title="Latest Releases" />
          ) : (
            latestReleaseItems.length > 0 && (
              <MovieRow
                title="Latest Releases"
                movies={latestReleaseItems}
                showTitles={false}
                showViewAll={false}
                onMovieClick={(movie) => {
                  if (!movie.id) return;
                  router.push(`/movies/${movie.id}`);
                }}
              />
            )
          )}

          <HeroCategoryCards className="mt-8" />

          {/* <CategoryGateway /> */}

          {upcomingLoading ? (
            <SectionLoader title="Coming Soon" />
          ) : (
            upcomingItems.length > 0 && (
              <MovieRow
                title="Coming Soon"
                movies={upcomingItems}
                showTitles={false}
                showReleaseDate
                showViewAll={false}
                onMovieClick={(movie) => {
                  if (!movie.tmdbId) return;
                  setSelectedUpcoming(movie);
                  setIsUpcomingOpen(true);
                }}
              />
            )
          )}
        </div>

        <TrendingFooter />
      </div>
      {/* <UpcomingMovieModal
        open={isUpcomingOpen}
        movie={selectedUpcoming}
        onClose={() => setIsUpcomingOpen(false)}
      /> */}
    </div>
  );
}
