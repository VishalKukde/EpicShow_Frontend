"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { LoaderCircle, X } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { toast } from "@/lib/toast";
import { useThemeStore } from "@/store/themeStore";
import type { CreateReviewResponse, Review } from "@/types/Review";
import RatingStars from "@/components/reviews/RatingStars";

type ReviewModalProps = {
  open: boolean;
  bookingId: string;
  movieId: string;
  movieTitle: string;
  onClose: () => void;
  onSubmitted: (review: Review) => void;
};

const MAX_COMMENT_LENGTH = 1000;

export default function ReviewModal({
  open,
  bookingId,
  movieId,
  movieTitle,
  onClose,
  onSubmitted,
}: ReviewModalProps) {
  const mode = useThemeStore((state) => state.mode);
  const dark = mode === "dark";
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !submitting) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose, submitting]);

  useEffect(() => {
    if (open) {
      setRating(0);
      setComment("");
      setSubmitting(false);
    }
  }, [open]);

  if (!open || !mounted) {
    return null;
  }

  const remainingCharacters = MAX_COMMENT_LENGTH - comment.length;

  const handleSubmit = async () => {
    if (rating < 1 || submitting) {
      return;
    }

    try {
      setSubmitting(true);
      const response = (await apiFetch("/reviews", {
        method: "POST",
        body: JSON.stringify({
          bookingId,
          movieId,
          rating,
          comment,
        }),
      })) as CreateReviewResponse;

      onSubmitted(response.data.review);
      toast.success("Review submitted successfully");
      onClose();
    } catch {
      // apiFetch already surfaces a toast
    } finally {
      setSubmitting(false);
    }
  };

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 px-3 py-4"
      onClick={() => {
        if (!submitting) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Write review"
    >
      <motion.div
        initial={{ y: 32, opacity: 0.95 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 32, opacity: 0.95 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        className={`w-full max-w-xl overflow-hidden rounded-[2rem] border shadow-2xl ${
          dark ? "border-zinc-700 bg-zinc-950 text-zinc-100" : "border-slate-200 bg-white text-slate-900"
        }`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className={`flex items-start justify-between gap-4 border-b px-5 py-4 ${dark ? "border-zinc-800" : "border-slate-200"}`}>
          <div>
            <p className={`text-[11px] font-semibold uppercase tracking-[0.22em] ${dark ? "text-zinc-400" : "text-slate-500"}`}>
              Movie Review
            </p>
            <h2 className="mt-1 text-xl font-semibold">{movieTitle}</h2>
            <p className={`mt-1 text-sm ${dark ? "text-zinc-400" : "text-slate-600"}`}>
              Rate your completed show and share a quick takeaway.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className={`inline-flex h-10 w-10 items-center justify-center rounded-full border transition ${
              dark
                ? "border-zinc-700 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50"
                : "border-slate-200 bg-slate-50 hover:bg-slate-100 disabled:opacity-50"
            }`}
            aria-label="Close review modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-5 px-5 py-5">
          <div>
            <p className={`text-sm font-medium ${dark ? "text-zinc-200" : "text-slate-800"}`}>
              Your rating
            </p>
            <div className="mt-3 flex items-center gap-3">
              <RatingStars value={rating} onChange={setRating} size={24} />
              <span className={`text-sm font-medium ${dark ? "text-zinc-300" : "text-slate-600"}`}>
                {rating > 0 ? `${rating}/5` : "Tap to rate"}
              </span>
            </div>
          </div>

          <div>
            <label
              htmlFor={`review-comment-${bookingId}`}
              className={`text-sm font-medium ${dark ? "text-zinc-200" : "text-slate-800"}`}
            >
              Comment
            </label>
            <textarea
              id={`review-comment-${bookingId}`}
              value={comment}
              onChange={(event) => setComment(event.target.value.slice(0, MAX_COMMENT_LENGTH))}
              rows={5}
              maxLength={MAX_COMMENT_LENGTH}
              placeholder="What stood out for you about the movie experience?"
              className={`mt-3 w-full rounded-2xl border px-4 py-3 text-sm outline-none transition ${
                dark
                  ? "border-zinc-700 bg-zinc-900 text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-500"
                  : "border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-slate-400"
              }`}
            />
            <p className={`mt-2 text-right text-xs ${remainingCharacters < 120 ? "text-amber-500" : dark ? "text-zinc-500" : "text-slate-500"}`}>
              {remainingCharacters} characters left
            </p>
          </div>
        </div>

        <div className={`flex flex-col gap-3 border-t px-5 py-4 sm:flex-row sm:items-center sm:justify-between ${dark ? "border-zinc-800" : "border-slate-200"}`}>
          <p className={`text-xs leading-5 ${dark ? "text-zinc-500" : "text-slate-500"}`}>
            One review is allowed per completed booking.
          </p>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={rating < 1 || submitting}
            className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition ${
              rating < 1 || submitting
                ? dark
                  ? "cursor-not-allowed bg-zinc-800 text-zinc-500"
                  : "cursor-not-allowed bg-slate-200 text-slate-400"
                : dark
                  ? "bg-amber-400 text-slate-950 hover:bg-amber-300"
                  : "bg-slate-950 text-white hover:bg-black"
            }`}
          >
            {submitting ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Review"
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
}
