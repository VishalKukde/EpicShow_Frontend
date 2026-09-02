"use client";

import { BrainCircuit, Heart, MessageSquareText, Play } from "lucide-react";
import { useEffect, useEffectEvent, useRef, useState } from "react";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/lib/toast";

const ASK_AI_COOLDOWN_MS = 6000;

type QuickActionProps = {
  movieTitle: string;
  releaseDate?: string;
  movieId: string;
  reviewCount?: number;
  onOpenAskAi?: () => void;
};

const QuickAction = ({
  movieTitle,
  releaseDate,
  movieId,
  reviewCount = 0,
  onOpenAskAi,
}: QuickActionProps) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAskAiSearching, setIsAskAiSearching] = useState(false);
  const askAiCooldownTimerRef = useRef<number | null>(null);
  const askAiCooldownUntilRef = useRef<number>(0);
  const { user, loading } = useAuth();

  const fetchWishlistStatus = useEffectEvent(async () => {
    if (loading || !user) {
      setIsWishlisted(false);
      return;
    }

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
  }, [movieId, user, loading]);

  const toggleWishlist = async (movieId: string) => {
    if (loading) return;

    if (!user) {
      toast.error("Please log in to use wishlist.");
      return;
    }

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

  useEffect(() => {
    return () => {
      if (askAiCooldownTimerRef.current) {
        window.clearTimeout(askAiCooldownTimerRef.current);
      }
    };
  }, []);

  const handleAskAiClick = () => {
    const now = Date.now();
    const isLocked = isAskAiSearching || now < askAiCooldownUntilRef.current;

    if (isLocked) return;

    setIsAskAiSearching(true);
    askAiCooldownUntilRef.current = now + ASK_AI_COOLDOWN_MS;

    if (askAiCooldownTimerRef.current) {
      window.clearTimeout(askAiCooldownTimerRef.current);
    }

    askAiCooldownTimerRef.current = window.setTimeout(() => {
      setIsAskAiSearching(false);
      askAiCooldownUntilRef.current = 0;
    }, ASK_AI_COOLDOWN_MS);

    onOpenAskAi?.();
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
          type="button"
          className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-300 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
          onClick={handleAskAiClick}
          disabled={isAskAiSearching}
          aria-label={`Ask AI about ${movieTitle}${releaseDate ? `, released ${releaseDate}` : ""}`}
          title={`Ask AI about ${movieTitle}`}
        >
          <span className="absolute inset-0 rounded-xl bg-[linear-gradient(135deg,#22d3ee,#a78bfa,#f472b6,#f59e0b)] opacity-80 blur-[1px]" />
          <span className="absolute inset-[1.5px] rounded-[10px] bg-gray-100 group-hover:bg-gray-200" />
          <span className="relative z-10 flex items-center gap-2">
            <BrainCircuit size={16} className="text-violet-600" />
            <span className="inline">{isAskAiSearching ? "Searching AI..." : "Ask AI"}</span>
          </span>
        </button>

        <button
          type="button"
          onClick={scrollToReviews}
          className="flex cursor-pointer items-center gap-2 rounded-xl bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200 border border-gray-200"
        >
          <MessageSquareText size={16} />
          <span className="inline">
            Reviews {reviewCount > 0 ? `(${reviewCount})` : ""}
            {/* {reviewCount > 0 ? ` • ${averageRating.toFixed(1)}/5` : ""} */}
          </span>
        </button>
      </div>
    </>

  )
}

export default QuickAction
