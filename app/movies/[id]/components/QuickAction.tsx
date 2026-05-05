"use client";

import { Heart, Info, MessageSquareText, Play } from "lucide-react";
import { useEffect, useEffectEvent, useState } from "react";
import AskAiModal from "./AskAiModal";
import { apiFetch } from "@/lib/api";

type QuickActionProps = {
  movieTitle: string;
  releaseDate?: string;
  movieId: string;
  reviewCount?: number;
  averageRating?: number;
};

const QuickAction = ({
  movieTitle,
  releaseDate,
  movieId,
  reviewCount = 0,
  averageRating = 0,
}: QuickActionProps) => {
  const [askOpen, setAskOpen] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const fetchWishlistStatus = useEffectEvent(async () => {
    try {
      const res = await apiFetch("/getwishlist");
      const isPresent = res?.data?.some(
        (movie: { _id: string }) => movie._id === movieId
      );

      setIsWishlisted(isPresent);
    } catch (error) {
      console.error("Wishlist fetch error:", error);
    }
  });

  useEffect(() => {
    void fetchWishlistStatus();
  }, [movieId]);

  const toggleWishlist = async (movieId: string) => {
    const prevState = isWishlisted;
    // 🔥 instant UI update
    setIsWishlisted(!prevState);

    try {
      const res = await apiFetch(`/wishlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movieId }),
      });

      // optional: sync with backend response
      if (res.action === "added") {
        setIsWishlisted(true);
      } else {
        setIsWishlisted(false);
      }
    } catch {
      // rollback if failed
      setIsWishlisted(prevState);
    }
  };

  const scrollToReviews = () => {
    const reviewsSection = document.getElementById("movie-reviews");
    if (reviewsSection) {
      reviewsSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      {/* ⚡ Quick Actions */}
      <div
        className="flex flex-wrap items-center gap-3">
        <button
          className=" flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition cursor-pointer border border-gray-200">
          <Play size={16} />
          <span className="inline">Trailer</span>
        </button>

        <button
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition hover:bg-gray-200 cursor-pointer border border-gray-200 ${isWishlisted
            ? "bg-gray-100 text-red-600"
            : "bg-gray-100 text-gray-700 "
            }`}
          onClick={() => toggleWishlist(movieId)}
        >
          <Heart size={16} fill={isWishlisted ? "red" : "none"} />
          <span>{isWishlisted ? "Remove" : "Wishlist"}</span>
        </button>

        <button
          className="flex items-center gap-2 rounded-xl bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200 cursor-pointer border border-gray-200"
          onClick={() => setAskOpen(true)}
        >
          <Info size={16} />
          <span className="inline">Ask AI</span>
        </button>

        <button
          type="button"
          onClick={scrollToReviews}
          className="flex cursor-pointer items-center gap-2 rounded-xl bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200 border border-gray-200"
        >
          <MessageSquareText size={16} />
          <span className="inline">
            Reviews {reviewCount > 0 ? `(${reviewCount})` : ""}
            {reviewCount > 0 ? ` • ${averageRating.toFixed(1)}/5` : ""}
          </span>
        </button>
      </div>
      <AskAiModal
        open={askOpen}
        movieTitle={movieTitle}
        releaseDate={releaseDate}
        onClose={() => setAskOpen(false)}
      />
    </>

  )
}

export default QuickAction
