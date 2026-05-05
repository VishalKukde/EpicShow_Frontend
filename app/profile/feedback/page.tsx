"use client";

import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Eye, EyeOff, MessageSquareHeart, Send, Star } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { toast } from "@/lib/toast";
import { useThemeStore } from "@/store/themeStore";

const categories = [
  "Booking Experience",
  "Payments",
  "App Performance",
  "UI and Design",
  "Feature Request",
  "Support",
  "Other",
];

type FeedbackItem = {
  id: string;
  userName: string;
  category: string;
  rating: number;
  message: string;
  displayMessage?: string;
  isPublic: boolean;
  createdAt: string;
};

const MIN_MESSAGE_LENGTH = 20;
const MAX_MESSAGE_LENGTH = 500;

export default function FeedbackPage() {
  const mode = useThemeStore((s) => s.mode);
  const dark = mode === "dark";
  const [rating, setRating] = useState(4);
  const [category, setCategory] = useState(categories[0]);
  const [message, setMessage] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const trimmedMessage = message.trim();
  const validationError = useMemo(() => {
    if (!categories.includes(category)) return "Choose a valid category.";
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return "Choose a rating from 1 to 5.";
    }
    if (trimmedMessage.length < MIN_MESSAGE_LENGTH) {
      return `Write at least ${MIN_MESSAGE_LENGTH} characters.`;
    }
    if (trimmedMessage.length > MAX_MESSAGE_LENGTH) {
      return `Keep feedback under ${MAX_MESSAGE_LENGTH} characters.`;
    }
    return "";
  }, [category, rating, trimmedMessage.length]);

  useEffect(() => {
    let active = true;

    const loadMyFeedback = async () => {
      try {
        const data = await apiFetch("/feedback/me", {
          method: "GET",
          notifyOnError: false,
        });
        if (active) {
          setFeedbackItems(Array.isArray(data?.feedback) ? data.feedback : []);
        }
      } catch {
        if (active) setFeedbackItems([]);
      } finally {
        if (active) setLoadingHistory(false);
      }
    };

    loadMyFeedback();
    return () => {
      active = false;
    };
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (validationError) {
      toast.error(validationError);
      return;
    }

    setSubmitting(true);
    try {
      const data = await apiFetch("/feedback", {
        method: "POST",
        body: JSON.stringify({
          rating,
          category,
          message: trimmedMessage,
          isPublic,
        }),
      });

      const created = data?.feedback as FeedbackItem | undefined;
      if (created) {
        setFeedbackItems((items) => [created, ...items].slice(0, 10));
      }

      setRating(5);
      setCategory(categories[0]);
      setMessage("");
      setIsPublic(true);
      toast.success(data?.message || "Feedback submitted successfully");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 px-3 py-3 pb-6 select-none sm:px-4 lg:px-0">
      <section
        className={`rounded-2xl border p-6 text-white shadow-lg sm:p-8 ${
          dark
            ? "border-zinc-700 bg-zinc-900"
            : "border-gray-200 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900"
        }`}
      >
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-indigo-200">
          Share Feedback
        </p>
        <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">
          Tell us how we can improve
        </h1>
        <p className="mt-2 max-w-xl text-sm text-indigo-100/90">
          Your feedback directly shapes upcoming features and booking
          experiences.
        </p>
      </section>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6 dark:border-zinc-800 dark:bg-zinc-950"
      >
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Rate your experience
        </h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              type="button"
              key={value}
              onClick={() => setRating(value)}
              className={`inline-flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-medium ${
                value <= rating
                  ? "bg-amber-100 text-amber-800 border border-amber-300"
                  : "bg-gray-100 text-gray-600 border border-gray-300"
              }`}
            >
              <Star className={`h-4 w-4 ${value <= rating ? "fill-current" : ""}`} />
              {value}
            </button>
          ))}
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium text-gray-700">Category</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-indigo-300"
              required
            >
              {categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>

          <label className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
            <span className="flex items-center gap-3">
              {isPublic ? (
                <Eye className="h-5 w-5 text-indigo-600" />
              ) : (
                <EyeOff className="h-5 w-5 text-gray-500" />
              )}
              <span>
                <span className="block text-sm font-medium text-gray-800">
                  Show as testimonial
                </span>
                <span className="block text-xs text-gray-500">
                  Public feedback may appear on the home page.
                </span>
              </span>
            </span>
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(event) => setIsPublic(event.target.checked)}
              className="h-5 w-5 accent-indigo-600"
            />
          </label>
        </div>

        <label className="mt-4 block space-y-2">
          <span className="flex items-center justify-between gap-3 text-sm font-medium text-gray-700">
            <span>Your feedback</span>
            <span
              className={`text-xs ${
                trimmedMessage.length > MAX_MESSAGE_LENGTH ? "text-red-600" : "text-gray-400"
              }`}
            >
              {trimmedMessage.length}/{MAX_MESSAGE_LENGTH}
            </span>
          </span>
          <textarea
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe your experience and suggestions..."
            className="w-full resize-none rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-indigo-300"
            minLength={MIN_MESSAGE_LENGTH}
            maxLength={MAX_MESSAGE_LENGTH}
            required
          />
        </label>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={submitting || Boolean(validationError)}
            className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            <Send className="h-4 w-4" />
            {submitting ? "Submitting..." : "Submit Feedback"}
          </button>
          <div className="inline-flex items-center gap-2 rounded-xl bg-indigo-50 px-3 py-2 text-xs text-gray-700">
            <MessageSquareHeart className="h-4 w-4" />
            We typically respond within 24-48 hours
          </div>
        </div>
      </form>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Your recent feedback
          </h2>
        </div>

        {loadingHistory ? (
          <p className="mt-4 text-sm text-gray-500">Loading feedback...</p>
        ) : feedbackItems.length === 0 ? (
          <p className="mt-4 text-sm text-gray-500">
            Your submitted feedback will appear here.
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {feedbackItems.map((item) => (
              <article
                key={item.id}
                className="rounded-xl border border-gray-200 bg-gray-50 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700">
                      {item.category}
                    </span>
                    <span className="text-xs text-gray-500">
                      {item.isPublic ? "Public testimonial" : "Private feedback"}
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-amber-700">
                    <Star className="h-4 w-4 fill-current" />
                    {item.rating}/5
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-gray-700">{item.message}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
