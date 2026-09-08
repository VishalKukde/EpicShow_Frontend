"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import MovieCard from "./components/MovieCard";
import Cinemas from "./components/Cinemas";
import MovieReviewsSection from "./components/MovieReviewsSection";
import AskAiModal from "./components/AskAiModal";
import { apiFetch } from "@/lib/api";
import PageTransition from "@/app/components/PageTransition";
import { useBookingStore } from "@/store/bookingStore";
import { useThemeStore } from "@/store/themeStore";
import type { Movie } from "@/types/Movie";
import { toast } from "@/lib/toast";

export default function MovieDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const todayISO = new Date().toISOString().split("T")[0];
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedCinemaId, setSelectedCinemaId] = useState<string | null>(null);
  const [selectedCinema, setSelectedCinema] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(todayISO);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [askAiOpen, setAskAiOpen] = useState(false);

  const isReady = selectedDate && selectedCinema && selectedSlot;
  const mode = useThemeStore((s) => s.mode);
  const dark = mode === "dark";

  const setItem = useBookingStore((s) => s.setItem);
  // const setBookingId = useBookingStore((s) => s.setBookingId);
  const setShow = useBookingStore((state) => state.setShow);


  useEffect(() => {
    async function loadMovie() {
      try {
        setLoading(true);
        const data = await apiFetch(`/movies/${id}`, { publicRequest: true });
        setMovie(data);
      } catch {
        setError("Failed to load movie details");
      } finally {
        setLoading(false);
      }
    }

    if (id) loadMovie();
  }, [id]);

  useEffect(() => {
    const root = document.documentElement;
    if (isReady) {
      root.style.setProperty(
        "--app-toast-bottom",
        "calc(env(safe-area-inset-bottom) + 6rem)"
      );
    } else {
      root.style.removeProperty("--app-toast-bottom");
    }
    return () => {
      root.style.removeProperty("--app-toast-bottom");
    };
  }, [isReady]);


  const handleBooking = () => {
    if (!selectedCinema || !selectedDate || !selectedSlot || !selectedCinemaId) {
      toast.warning("Please select cinema, date, and slot to continue.");
      return;
    }

    // const bookingId = nanoid();

    // setBookingId(bookingId);
    setItem("movie", movie);
    setShow(selectedCinemaId, selectedCinema, selectedDate, selectedSlot);
    router.push(`/movies/${id}/seat-layout`);
  };


  // 🌀 Loading UI
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg animate-pulse">
          Loading movie details...
        </p>
      </div>
    );
  }

  // ❌ Error UI
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-red-600 text-lg">{error}</p>
        <button
          onClick={() => location.reload()}
          className="px-4 py-2 bg-gray-900 text-white rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  // 🚫 No movie found
  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Movie not found</p>
      </div>
    );
  }

  const isUpcoming = Boolean(
    movie?.releaseDate && new Date(movie.releaseDate).getTime() > Date.now()
  );

  return (
    <PageTransition>
      <div className="select-none px-3 pb-28 pt-20 sm:px-5 sm:pb-32 sm:pt-24 lg:px-0">
        <div className="mx-auto max-w-6xl space-y-10 sm:space-y-14">
          <MovieCard movie={movie} onOpenAskAi={() => setAskAiOpen(true)} />

          {isUpcoming ? (
            <div className={`rounded-3xl border p-6 sm:p-8 text-center space-y-4 shadow-lg ${dark
              ? "border-amber-500/30 bg-amber-950/20 text-amber-100"
              : "border-amber-200 bg-amber-50/70 text-amber-900"
              }`}>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400">
                🔒
              </div>
              <div>
                <h3 className="text-xl font-bold">Booking Not Available Yet</h3>
                <p className="mt-1 text-sm opacity-80 max-w-lg mx-auto">
                  {movie.name} is an upcoming release scheduled for{" "}
                  <span className="font-semibold underline">
                    {new Date(movie.releaseDate!).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  . Tickets will open closer to the release date!
                </p>
              </div>
            </div>
          ) : (
            <Cinemas
              setSelectedCinemaId={setSelectedCinemaId}
              setSelectedDate={setSelectedDate}
              setSelectedCinema={setSelectedCinema}
              setSelectedSlot={setSelectedSlot}
              selectedDate={selectedDate}
              selectedCinema={selectedCinema}
              selectedSlot={selectedSlot}
              selectedCinemaId={selectedCinemaId}
            />
          )}

          <MovieReviewsSection
            movieId={String(id)}
            initialReviewCount={movie.total_reviews ?? 0}
            initialAverageRating={movie.avg_rating ?? 0}
          />
        </div>

        <AskAiModal
          open={askAiOpen}
          movieTitle={movie.name}
          releaseDate={movie.releaseDate}
          onClose={() => setAskAiOpen(false)}
        />

        {/* call to action button  */}
        {isReady && !isUpcoming && (
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className={`fixed bottom-0 left-0 right-0 z-50 border-t px-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3 sm:px-5 sm:py-4 ${dark ? "border-zinc-700 bg-zinc-950" : "border-gray-200 bg-white"
              }`}
          >
            <div className="mx-auto flex max-w-6xl flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className={`truncate text-base font-medium ${dark ? "text-zinc-100" : "text-gray-900"}`}>
                  {selectedCinema}
                </p>
                <p className={`truncate text-sm ${dark ? "text-zinc-300" : "text-gray-600"}`}>
                  {selectedDate} • {selectedSlot}
                </p>
              </div>

              <button
                className={`w-full cursor-pointer rounded-xl px-6 py-3 font-medium text-white transition sm:w-auto ${dark ? "bg-indigo-600 hover:bg-indigo-500" : "bg-gray-900 hover:bg-gray-800"
                  }`}
                onClick={handleBooking}
              >
                Proceed
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </PageTransition>

  );
}
