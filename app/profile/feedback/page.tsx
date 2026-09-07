"use client";

import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Eye, EyeOff, MessageSquareHeart, Send, Sparkles, Star } from "lucide-react";
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
    <div className="select-none space-y-4 px-3 py-2 pb-6 sm:px-4 lg:px-0">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3 border-slate-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${dark
                ? "border-indigo-400/30 bg-indigo-500/15 text-indigo-300"
                : "border-indigo-200 bg-indigo-50 text-indigo-700"
                }`}
            >
              <Sparkles className="h-3 w-3" />
              Community Voice
            </span>
          </div>
          <h1 className={`mt-1.5 text-xl font-black tracking-tight ${dark ? "text-white" : "text-slate-900"} dark:text-white`}>
            Share Feedback
          </h1>
          <p className={`text-xs font-medium ${dark ? "text-zinc-400" : "text-slate-500"} dark:text-zinc-400`}>
            Help us refine features, improve booking workflows, and build a better experience.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className={`rounded-2xl border p-4 sm:p-5 shadow-xs ${dark ? "border-zinc-800 bg-[#18181b]" : "border-slate-200 bg-white"
          } dark:bg-[#18181b] dark:border-zinc-800`}
      >
        <div className="flex items-center justify-between gap-2 border-b pb-3 border-slate-100 dark:border-zinc-800/80">
          <h2 className={`text-sm font-bold uppercase tracking-wider ${dark ? "text-zinc-300" : "text-slate-700"}`}>
            Rate Experience
          </h2>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-500">
            <Star className="h-3.5 w-3.5 fill-current" />
            {rating} / 5 Stars
          </span>
        </div>

        {/* Rating Pills */}
        <div className="mt-3 flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              type="button"
              key={value}
              onClick={() => setRating(value)}
              className={`inline-flex cursor-pointer items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition duration-150 ${value <= rating
                ? "border-amber-500/30 bg-amber-500/15 text-amber-500"
                : dark
                  ? "border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700"
                  : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`}
            >
              <Star className={`h-3.5 w-3.5 ${value <= rating ? "fill-current" : ""}`} />
              {value} {value === 1 ? "Star" : "Stars"}
            </button>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          <label className="block space-y-1.5">
            <span className={`text-xs font-bold uppercase tracking-wider ${dark ? "text-zinc-400" : "text-slate-600"}`}>
              Category
            </span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`h-11 w-full rounded-xl border px-3 text-xs font-semibold outline-none transition ${dark
                  ? "border-zinc-700 bg-zinc-900 text-zinc-100 focus:border-indigo-500"
                  : "border-slate-200 bg-white text-slate-800 focus:border-indigo-400"
                }`}
              required
            >
              {categories.map((item) => (
                <option key={item} className={dark ? "bg-zinc-900 text-zinc-100" : ""}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label className="block space-y-1.5 cursor-pointer">
            <span className={`text-xs font-bold uppercase tracking-wider ${dark ? "text-zinc-400" : "text-slate-600"}`}>
              Visibility
            </span>
            <div
              className={`flex h-11 items-center justify-between gap-3 rounded-xl border px-3.5 ${dark ? "border-zinc-800 bg-zinc-900/60" : "border-slate-200 bg-slate-50"
                }`}
            >
              <span className="flex items-center gap-2.5">
                {isPublic ? (
                  <Eye className="h-4 w-4 text-indigo-500" />
                ) : (
                  <EyeOff className={`h-4 w-4 ${dark ? "text-zinc-500" : "text-slate-400"}`} />
                )}
                <span className={`text-xs font-bold ${dark ? "text-zinc-200" : "text-slate-800"}`}>
                  Show as Testimonial
                </span>
              </span>
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(event) => setIsPublic(event.target.checked)}
                className="h-4 w-4 accent-indigo-600 cursor-pointer"
              />
            </div>
          </label>
        </div>

        <label className="mt-3.5 block space-y-1.5">
          <span className={`flex items-center justify-between text-xs font-bold uppercase tracking-wider ${dark ? "text-zinc-400" : "text-slate-600"}`}>
            <span>Your Feedback</span>
            <span
              className={`text-[11px] font-medium ${trimmedMessage.length > MAX_MESSAGE_LENGTH
                ? "text-rose-500"
                : dark
                  ? "text-zinc-500"
                  : "text-slate-400"
                }`}
            >
              {trimmedMessage.length} / {MAX_MESSAGE_LENGTH}
            </span>
          </span>
          <textarea
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe your experience, suggestions, or feature requests in detail..."
            className={`w-full resize-none rounded-xl border px-3 py-2 text-xs font-medium outline-none transition ${dark
              ? "border-zinc-700 bg-zinc-900 text-zinc-100 placeholder:text-zinc-500 focus:border-indigo-500"
              : "border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:border-indigo-400"
              }`}
            minLength={MIN_MESSAGE_LENGTH}
            maxLength={MAX_MESSAGE_LENGTH}
            required
          />
        </label>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={submitting || Boolean(validationError)}
            className={`inline-flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition shadow-xs ${dark
              ? "bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50"
              : "bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
              }`}
          >
            <Send className="h-3.5 w-3.5" />
            {submitting ? "Submitting..." : "Submit Feedback"}
          </button>
          <div
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-[11px] font-semibold ${dark
              ? "border-indigo-500/20 bg-indigo-500/10 text-indigo-300"
              : "border-indigo-100 bg-indigo-50 text-indigo-700"
              }`}
          >
            <MessageSquareHeart className="h-3.5 w-3.5 text-indigo-400" />
            Reviewed by engineering within 24 hours
          </div>
        </div>
      </form>

      {/* History */}
      <section
        className={`rounded-2xl border p-4 sm:p-5 shadow-xs ${dark ? "border-zinc-800 bg-[#18181b]" : "border-slate-200 bg-white"
          } dark:bg-[#18181b] dark:border-zinc-800`}
      >
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500" />
          <h2 className={`text-sm font-bold uppercase tracking-wider ${dark ? "text-white" : "text-slate-900"}`}>
            Recent Submissions
          </h2>
        </div>

        {loadingHistory ? (
          <p className={`mt-3 text-xs ${dark ? "text-zinc-400" : "text-slate-500"}`}>Loading history...</p>
        ) : feedbackItems.length === 0 ? (
          <p className={`mt-3 text-xs ${dark ? "text-zinc-400" : "text-slate-500"}`}>
            Your submitted feedback history will appear here.
          </p>
        ) : (
          <div className="mt-3 space-y-2.5">
            {feedbackItems.map((item) => (
              <article
                key={item.id}
                className={`rounded-xl border p-3 ${dark ? "border-zinc-800 bg-zinc-900/60" : "border-slate-100 bg-slate-50"
                  }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${dark ? "bg-indigo-500/20 text-indigo-300" : "bg-indigo-100 text-indigo-700"
                        }`}
                    >
                      {item.category}
                    </span>
                    <span className={`text-[10px] font-medium ${dark ? "text-zinc-400" : "text-slate-500"}`}>
                      {item.isPublic ? "Public Testimonial" : "Private Feedback"}
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-500">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    {item.rating} / 5
                  </span>
                </div>
                <p className={`mt-2 text-xs leading-relaxed ${dark ? "text-zinc-300" : "text-slate-700"}`}>
                  {item.message}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
