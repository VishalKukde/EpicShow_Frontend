"use client";
import MovieRow, { type MovieRowItem } from "./components/MovieRow";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TrendingFooter from "./components/TrendingFooter";
import HeroCategoryCards from "@/components/hero/HeroCategoryCards";
import HomeTestimonials from "./components/HomeTestimonials";
import PinterestMovieHero from "@/components/hero/PinterestMovieHero";
import { apiFetch } from "@/lib/api";
import HeroSectionNewAgain from "@/components/HeroSectionNewAgain";


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

function SectionLoader({ title }: { title: string }) {
  return (
    <section className="relative z-10 mx-auto mb-16 max-w-7xl sm:mb-24">
      <div className="mb-5 flex flex-col items-start gap-3 text-left">
        <h2 className="section-header text-2xl lg:text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
          {title}
        </h2>
      </div>
      <div className="flex min-h-50 items-center justify-center text-slate-500 dark:text-slate-300">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent opacity-70" />
        <span className="ml-3 text-sm">Loading...</span>
      </div>
    </section>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const [latestReleaseItems, setLatestReleaseItems] = useState<MovieRowItem[]>([]);
  const [latestLoading, setLatestLoading] = useState(true);
  const [loadPercent, setLoadPercent] = useState(0);
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);
  const heroMovieItems = latestReleaseItems.slice(0, 5);
  // const [upcomingLoading, setUpcomingLoading] = useState(true);
  // const [selectedUpcoming, setSelectedUpcoming] = useState<MovieRowItem | null>(null);
  // const [isUpcomingOpen, setIsUpcomingOpen] = useState(false);

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
          publicRequest: true,
        });
        const items = Array.isArray(data) ? data : data?.movies ?? [];
        const mapped = items.map((movie: {
          _id?: string;
          name?: string;
          title?: string;
          imageUrl?: string | null;
          description?: string | null;
          genre?: string[] | string | null;
          rating?: number | null;
          releaseDate?: string | null;
        }) => ({
          id: movie._id || movie.name || movie.title,
          title: movie.name || movie.title || "Untitled",
          imageUrl: movie.imageUrl,
          description: movie.description || "A premium movie pick curated for your next watchlist.",
          genre: Array.isArray(movie.genre)
            ? movie.genre
            : movie.genre
              ? [String(movie.genre)]
              : ["Drama", "Action", "Adventure"],
          rating: typeof movie.rating === "number" ? movie.rating : 8.6,
          releaseDate: movie.releaseDate || null,
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

  useEffect(() => {
    const timer = window.setInterval(() => {
      setLoadPercent((current) => {
        const next = Math.min(current + Math.random() * 12 + 8, 100);
        return next;
      });
    }, 120);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (loadPercent < 100) return;

    const timer = window.setTimeout(() => setShowLoadingScreen(false), 500);
    return () => window.clearTimeout(timer);
  }, [loadPercent]);

  // if (showLoadingScreen && latestLoading) {
  //   return (
  //     <div
  //       className="flex min-h-screen items-center justify-center text-slate-900 dark:text-white"
  //       style={{ backgroundColor: "var(--hero-page-bg)" }}
  //     >
  //       <div className="text-center">
  //         <div className="text-[88px] font-black leading-none tracking-[-0.08em] text-current">
  //           {Math.round(loadPercent)}%
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div
      className="relative min-h-screen select-none overflow-x-hidden"
      style={{ backgroundColor: "var(--hero-page-bg)" }}
    >
      {/* <LandingIntroModal /> */}
      {/* <AmbientBlobs /> */}

      <div className="relative z-10 flex flex-col pb-[calc(env(safe-area-inset-bottom)+3rem)] sm:pb-0">
        {/* <CinematicHeroSpotlight />  */}
        {/* <CinematicHeroSpotlightNew/> */}
        <HeroSectionNewAgain/>
        {/* <PinterestMovieHero items={heroMovieItems.map((movie) => ({
          id: String(movie.id ?? movie.title),
          title: movie.title,
          subtitle: "Featured pick",
          year: movie.releaseDate ? new Date(movie.releaseDate).getFullYear().toString() : "2025",
          genre: movie.genre && movie.genre.length ? movie.genre.slice(0, 3) : ["Drama", "Action", "Adventure"],
          rating: typeof movie.rating === "number" ? movie.rating : 8.6,
          description: movie.description || "A premium movie pick selected for a refined, unforgettable watchlist.",
          image: movie.imageUrl || "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=80",
          href: movie.id ? `/movies/${movie.id}` : "/movies",
        }))} /> */}

        <div className="mx-auto w-full max-w-7xl space-y-28 px-4 pb-20 pt-12 sm:space-y-32 sm:px-6 sm:pb-24 sm:pt-16 lg:space-y-36 lg:px-2 lg:pb-28 lg:pt-20">
          {latestLoading ? (
            <SectionLoader title="Latest Releases" />
          ) : (
            latestReleaseItems.length > 0 && (
              <MovieRow
                title="Latest Releases"
                movies={latestReleaseItems}
                showTitles={false}
                showViewAll={true}
                onMovieClick={(movie) => {
                  if (!movie.id) return;
                  router.push(`/movies/${movie.id}`);
                }}
              />
            )
          )}

          <HeroCategoryCards className="mt-8" />

          <HomeTestimonials />
          
          {/* <CategoryGateway /> */}

          {/* {upcomingLoading ? (
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
          )} */}
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
