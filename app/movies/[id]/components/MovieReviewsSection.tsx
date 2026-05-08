"use client";

import { useEffect, useState } from "react";
import { BadgeCheck, LoaderCircle, MessageSquareText, UserRound } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { useThemeStore } from "@/store/themeStore";
import type { Review, ReviewListResponse, ReviewSummary } from "@/types/Review";
import RatingStars from "@/components/reviews/RatingStars";

type MovieReviewsSectionProps = {
  movieId: string;
  initialReviewCount?: number;
  initialAverageRating?: number;
};

const PAGE_SIZE = 5;

const formatRelativeTime = (value: string) => {
  const createdAt = new Date(value);
  if (Number.isNaN(createdAt.getTime())) {
    return "Recently";
  }

  const diffMs = Date.now() - createdAt.getTime();
  const units = [
    { label: "year", ms: 365 * 24 * 60 * 60 * 1000 },
    { label: "month", ms: 30 * 24 * 60 * 60 * 1000 },
    { label: "week", ms: 7 * 24 * 60 * 60 * 1000 },
    { label: "day", ms: 24 * 60 * 60 * 1000 },
    { label: "hour", ms: 60 * 60 * 1000 },
    { label: "minute", ms: 60 * 1000 },
  ] as const;

  for (const unit of units) {
    if (diffMs >= unit.ms) {
      const valueToFormat = Math.floor(diffMs / unit.ms);
      return `${valueToFormat} ${unit.label}${valueToFormat === 1 ? "" : "s"} ago`;
    }
  }

  return "Just now";
};

export default function MovieReviewsSection({
  movieId,
  initialReviewCount = 0,
  initialAverageRating = 0,
}: MovieReviewsSectionProps) {
  const mode = useThemeStore((state) => state.mode);
  const dark = mode === "dark";
  const [reviews, setReviews] = useState<Review[]>([]);
  const [summary, setSummary] = useState<ReviewSummary>({
    avg_rating: initialAverageRating,
    total_reviews: initialReviewCount,
  });
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadReviews = async (nextPage: number, append: boolean) => {
      try {
        if (append) {
          setLoadingMore(true);
        } else {
          setLoading(true);
          setError(null);
        }

        const response = (await apiFetch(
          `/movies/reviews?movieId=${encodeURIComponent(movieId)}&page=${nextPage}&limit=${PAGE_SIZE}`,
          { notifyOnError: !append, publicRequest: true }
        )) as ReviewListResponse;

        if (!active) {
          return;
        }

        const nextReviews = Array.isArray(response.data) ? response.data : [];
        setReviews((prev) => (append ? [...prev, ...nextReviews] : nextReviews));
        setSummary(response.summary);
        setHasMore(Boolean(response.pagination?.hasMore));
        setPage(nextPage);
      } catch (err: unknown) {
        if (!active) {
          return;
        }

        setError(err instanceof Error ? err.message : "Failed to load reviews");
        if (!append) {
          setReviews([]);
        }
      } finally {
        if (!active) {
          return;
        }

        if (append) {
          setLoadingMore(false);
        } else {
          setLoading(false);
        }
      }
    };

    void loadReviews(1, false);

    return () => {
      active = false;
    };
  }, [movieId]);

  const handleLoadMore = async () => {
    if (loading || loadingMore || !hasMore) {
      return;
    }

    try {
      setLoadingMore(true);
      const response = (await apiFetch(
        `/movies/reviews?movieId=${encodeURIComponent(movieId)}&page=${page + 1}&limit=${PAGE_SIZE}`,
        { notifyOnError: false, publicRequest: true }
      )) as ReviewListResponse;

      const nextReviews = Array.isArray(response.data) ? response.data : [];
      setReviews((prev) => [...prev, ...nextReviews]);
      setSummary(response.summary);
      setHasMore(Boolean(response.pagination?.hasMore));
      setPage((prev) => prev + 1);
    } catch {
      // apiFetch already surfaces a toast for unexpected errors when needed
    } finally {
      setLoadingMore(false);
    }
  };

  const sectionSurface = dark
    ? "border-zinc-800 bg-zinc-950 text-zinc-100"
    : "border-slate-200 bg-white text-slate-900";

  return (
    <section
      id="movie-reviews"
      className={`rounded-[2rem] border px-5 py-5 shadow-sm sm:px-6 sm:py-6 ${sectionSurface}`}
    >
      <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className={`text-[11px] font-semibold uppercase tracking-[0.22em] ${dark ? "text-zinc-500" : "text-slate-500"}`}>
            Audience Reviews
          </p>
          <h2 className="mt-2 text-2xl font-semibold">What viewers are saying</h2>
          <p className={`mt-2 text-sm ${dark ? "text-zinc-400" : "text-slate-600"}`}>
            Latest ratings and comments from completed bookings.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {/* <SummaryChip
            dark={dark}
            label="Average"
            value={summary.total_reviews > 0 ? `${summary.avg_rating.toFixed(1)}/5` : "No rating"}
          /> */}
          <SummaryChip
            dark={dark}
            label="Reviews"
            value={String(summary.total_reviews ?? 0)}
          />
        </div>
      </div>

      <div className="mt-5">
        {loading ? (
          <ReviewSkeletonList dark={dark} />
        ) : error ? (
          <div
            className={`rounded-3xl border px-4 py-5 text-sm ${
              dark ? "border-red-900/40 bg-red-950/40 text-red-200" : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {error}
          </div>
        ) : reviews.length === 0 ? (
          <div
            className={`rounded-[1.7rem] border px-5 py-10 text-center ${
              dark ? "border-zinc-800 bg-zinc-900/70" : "border-slate-200 bg-slate-50"
            }`}
          >
            <div
              className={`mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl ${
                dark ? "bg-zinc-800 text-zinc-200" : "bg-white text-slate-700"
              }`}
            >
              <MessageSquareText className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">No reviews yet</h3>
            <p className={`mt-2 text-sm ${dark ? "text-zinc-400" : "text-slate-600"}`}>
              Reviews will show up here once viewers complete their bookings and leave feedback.
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {reviews.map((review) => (
                <article
                  key={review._id}
                  className={`rounded-[1.7rem] border px-4 py-4 sm:px-5 ${
                    dark ? "border-zinc-800 bg-zinc-900/70" : "border-slate-200 bg-slate-50/80"
                  }`}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex h-9 w-9 items-center justify-center rounded-full ${
                            dark ? "bg-zinc-800 text-zinc-200" : "bg-white text-slate-700"
                          }`}
                        >
                          <UserRound className="h-4 w-4" />
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold">{review.user?.name || "Anonymous"}</p>
                          <div className="mt-0.5 flex flex-wrap items-center gap-2">
                            {review.verified_booking ? (
                              <span
                                className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${
                                  dark
                                    ? "border-emerald-400/30 bg-emerald-500/15 text-emerald-200"
                                    : "border-emerald-200 bg-emerald-50 text-emerald-700"
                                }`}
                              >
                                <BadgeCheck className="h-3 w-3" />
                                Verified viewer
                              </span>
                            ) : null}
                            <p className={`text-xs ${dark ? "text-zinc-500" : "text-slate-500"}`}>
                              {formatRelativeTime(review.created_at)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center gap-3">
                        <RatingStars value={review.rating} readOnly />
                        <span className={`text-sm font-medium ${dark ? "text-zinc-300" : "text-slate-600"}`}>
                          {review.rating}/5
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className={`mt-4 text-sm leading-6 ${dark ? "text-zinc-300" : "text-slate-700"}`}>
                    {review.comment?.trim() || "No written comment shared."}
                  </p>
                </article>
              ))}
            </div>

            <div className="mt-5 flex items-center justify-center">
              {hasMore ? (
                <button
                  type="button"
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition ${
                    dark
                      ? "bg-zinc-100 text-zinc-900 hover:bg-white disabled:bg-zinc-800 disabled:text-zinc-500"
                      : "bg-slate-950 text-white hover:bg-black disabled:bg-slate-200 disabled:text-slate-400"
                  }`}
                >
                  {loadingMore ? (
                    <>
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Load More Reviews"
                  )}
                </button>
              ) : summary.total_reviews > 0 ? (
                <p className={`text-sm ${dark ? "text-zinc-500" : "text-slate-500"}`}>
                  You’ve reached the latest reviews.
                </p>
              ) : null}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function SummaryChip({
  dark,
  label,
  value,
}: {
  dark: boolean;
  label: string;
  value: string;
}) {
  return (
    <div
      className={`rounded-2xl border px-4 py-3 ${
        dark ? "border-zinc-800 bg-zinc-900/80" : "border-slate-200 bg-slate-50"
      }`}
    >
      <p className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${dark ? "text-zinc-500" : "text-slate-500"}`}>
        {label}
      </p>
      <p className="mt-1 text-base font-semibold">{value}</p>
    </div>
  );
}

function ReviewSkeletonList({ dark }: { dark: boolean }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className={`animate-pulse rounded-[1.7rem] border px-4 py-4 sm:px-5 ${
            dark ? "border-zinc-800 bg-zinc-900/70" : "border-slate-200 bg-slate-50/80"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`h-10 w-10 rounded-full ${dark ? "bg-zinc-800" : "bg-slate-200"}`} />
            <div className="space-y-2">
              <div className={`h-4 w-32 rounded ${dark ? "bg-zinc-800" : "bg-slate-200"}`} />
              <div className={`h-3 w-20 rounded ${dark ? "bg-zinc-800" : "bg-slate-200"}`} />
            </div>
          </div>
          <div className="mt-4 flex gap-1">
            {Array.from({ length: 5 }).map((_, starIndex) => (
              <div
                key={starIndex}
                className={`h-5 w-5 rounded ${dark ? "bg-zinc-800" : "bg-slate-200"}`}
              />
            ))}
          </div>
          <div className="mt-4 space-y-2">
            <div className={`h-4 w-full rounded ${dark ? "bg-zinc-800" : "bg-slate-200"}`} />
            <div className={`h-4 w-5/6 rounded ${dark ? "bg-zinc-800" : "bg-slate-200"}`} />
          </div>
        </div>
      ))}
    </div>
  );
}
