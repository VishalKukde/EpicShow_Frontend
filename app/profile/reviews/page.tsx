"use client";

import { useEffect, useState } from "react";
import type { ComponentType } from "react";
import Image from "next/image";
import { CalendarDays, Clapperboard, MapPin, ReceiptText, Ticket } from "lucide-react";
import RatingStars from "@/components/reviews/RatingStars";
import { apiFetch } from "@/lib/api";
import { useThemeStore } from "@/store/themeStore";
import type { UserReview, UserReviewListResponse } from "@/types/Review";
import ReviewHero from "./components/ReviewHero";

const PAGE_SIZE = 10;

export default function ReviewPage() {
  const dark = useThemeStore((state) => state.mode === "dark");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [reviews, setReviews] = useState<UserReview[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [totalReviews, setTotalReviews] = useState(0);

  useEffect(() => {
    let active = true;

    setLoading(true);
    setError("");

    apiFetch(`/reviews/me?page=1&limit=${PAGE_SIZE}`, { method: "GET", notifyOnError: false })
      .then((payload: UserReviewListResponse) => {
        if (!active) return;
        setReviews(payload.data || []);
        setPage(payload.pagination?.page || 1);
        setHasMore(Boolean(payload.pagination?.hasMore));
        setTotalReviews(payload.summary?.total_reviews || payload.pagination?.total || 0);
      })
      .catch((err) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Failed to load your reviews");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      const payload = (await apiFetch(`/reviews/me?page=${nextPage}&limit=${PAGE_SIZE}`, {
        method: "GET",
        notifyOnError: false,
      })) as UserReviewListResponse;

      setReviews((current) => [...current, ...(payload.data || [])]);
      setPage(payload.pagination?.page || nextPage);
      setHasMore(Boolean(payload.pagination?.hasMore));
      setTotalReviews(payload.summary?.total_reviews || payload.pagination?.total || totalReviews);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load more reviews");
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div className="select-none space-y-6 px-3 py-3 pb-6 sm:px-4 lg:px-0">
      <ReviewHero totalReviews={totalReviews} />

      <section
        className={`rounded-2xl border p-4 shadow-sm sm:p-5 ${
          dark ? "border-zinc-700 bg-zinc-900" : "border-gray-200 bg-white"
        }`}
      >


        {loading ? (
          <div className="grid gap-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className={`h-32 animate-pulse rounded-2xl ${
                  dark ? "bg-zinc-800" : "bg-gray-100"
                }`}
              />
            ))}
          </div>
        ) : error ? (
          <p className="py-10 text-center text-sm text-red-500">{error}</p>
        ) : reviews.length === 0 ? (
          <div className={`py-12 text-center ${dark ? "text-zinc-400" : "text-gray-500"}`}>
            <Clapperboard className="mx-auto h-10 w-10 opacity-60" />
            <p className="mt-3 text-sm font-medium">No reviews yet.</p>
            <p className="mt-1 text-xs">Completed movie bookings will show a Write Review action.</p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {reviews.map((review) => (
                <ReviewCard key={review._id} dark={dark} review={review} />
              ))}
            </div>

            {hasMore ? (
              <div className="mt-5 flex justify-center">
                <button
                  type="button"
                  onClick={loadMore}
                  disabled={loadingMore}
                  className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                    dark
                      ? "bg-zinc-100 text-zinc-950 hover:bg-zinc-200"
                      : "bg-slate-950 text-white hover:bg-black"
                  }`}
                >
                  {loadingMore ? "Loading..." : "Load More Reviews"}
                </button>
              </div>
            ) : null}
          </>
        )}
      </section>
    </div>
  );
}

function ReviewCard({ dark, review }: { dark: boolean; review: UserReview }) {
  const movie = review.movie;
  const booking = review.booking;
  const seats = booking?.seatIds?.length ? booking.seatIds.join(", ") : "No seats";

  return (
    <article
      className={`overflow-hidden rounded-2xl border ${
        dark ? "border-zinc-700 bg-zinc-950/60" : "border-gray-200 bg-gray-50/80"
      }`}
    >
      <div className="grid gap-4 p-4 sm:grid-cols-[88px_1fr]">
        <div className="relative h-32 overflow-hidden rounded-xl sm:h-full">
          {movie?.imageUrl ? (
            <Image
              src={movie.imageUrl}
              alt={movie.name || "Movie poster"}
              fill
              className="object-cover"
            />
          ) : (
            <div className={`flex h-full items-center justify-center ${dark ? "bg-zinc-800" : "bg-gray-200"}`}>
              <Clapperboard className={dark ? "text-zinc-500" : "text-gray-500"} />
            </div>
          )}
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <p className={`line-clamp-1 text-lg font-semibold ${dark ? "text-zinc-100" : "text-gray-900"}`}>
                {movie?.name || "Movie unavailable"}
              </p>
              <div className={`mt-1 flex flex-wrap items-center gap-2 text-xs ${dark ? "text-zinc-400" : "text-gray-500"}`}>
                {movie?.language ? <span>{movie.language}</span> : null}
                {movie?.genre?.length ? <span>{movie.genre.slice(0, 2).join(", ")}</span> : null}
                <span>{formatDate(review.created_at)}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <RatingStars value={review.rating} readOnly />
              <span className={`text-sm font-semibold ${dark ? "text-zinc-200" : "text-gray-700"}`}>
                {review.rating}/5
              </span>
            </div>
          </div>

          <p className={`mt-3 text-sm leading-6 ${dark ? "text-zinc-300" : "text-gray-700"}`}>
            {review.comment?.trim() || "No written comment shared."}
          </p>

          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <ReviewMeta dark={dark} icon={MapPin} label="Cinema" value={booking?.cinemaId || "Venue"} />
            <ReviewMeta dark={dark} icon={CalendarDays} label="Show" value={formatShow(booking?.date, booking?.slot)} />
            <ReviewMeta dark={dark} icon={Ticket} label="Seats" value={seats} />
            <ReviewMeta dark={dark} icon={ReceiptText} label="Amount" value={formatCurrency(booking?.amount || 0)} />
          </div>
        </div>
      </div>
    </article>
  );
}

function ReviewMeta({
  dark,
  icon: Icon,
  label,
  value,
}: {
  dark: boolean;
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className={`rounded-xl border px-3 py-2 ${dark ? "border-zinc-700 bg-zinc-900" : "border-gray-200 bg-white"}`}>
      <p className={`flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] ${dark ? "text-zinc-500" : "text-gray-500"}`}>
        <Icon className="h-3.5 w-3.5" />
        {label}
      </p>
      <p className={`mt-1 line-clamp-1 text-xs font-semibold ${dark ? "text-zinc-200" : "text-gray-800"}`}>
        {value}
      </p>
    </div>
  );
}

function formatDate(value?: string) {
  if (!value) return "Recently";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently";
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatShow(date?: string, slot?: string) {
  const showDate = formatDate(date);
  return slot ? `${showDate} • ${slot}` : showDate;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}
