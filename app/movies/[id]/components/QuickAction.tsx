"use client";

import { Heart, Info, Play } from "lucide-react";
import { useEffect, useState } from "react";
import AskAiModal from "./AskAiModal";
import { apiFetch } from "@/lib/api";

type QuickActionProps = {
  movieTitle: string;
  releaseDate?: string;
  movieId: string
};

const QuickAction = ({ movieTitle, releaseDate, movieId }: QuickActionProps) => {
  const [askOpen, setAskOpen] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    fetchWishlistStatus();
  }, [movieId]);

const fetchWishlistStatus = async () => {
  try {
    const res = await apiFetch("/getwishlist");
    const isPresent = res?.data?.some(
      (movie: { _id: string }) => movie._id === movieId
    );

    setIsWishlisted(isPresent);
  } catch (error) {
    console.error("Wishlist fetch error:", error);
  }
};

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
    } catch (error) {
      // rollback if failed
      setIsWishlisted(prevState);
    }
  };


  return (
    <>
      {/* ⚡ Quick Actions */}
      <div
        className="flex flex-wrap items-center gap-3">
        <button
          className=" flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition cursor-pointer">
          <Play size={16} />
          <span className="inline">Trailer</span>
        </button>

        <button
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition cursor-pointer ${isWishlisted
            ? "bg-red-100 text-red-600"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          onClick={() => toggleWishlist(movieId)}
        >
          <Heart size={16} fill={isWishlisted ? "red" : "none"} />
          <span>{isWishlisted ? "Remove" : "Wishlist"}</span>
        </button>

        <button
          className="flex items-center gap-2 px-4 py-2rounded-xl bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition cursor-pointer"
          onClick={() => setAskOpen(true)}
        >
          <Info size={16} />
          <span className="inline">Ask AI</span>
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
