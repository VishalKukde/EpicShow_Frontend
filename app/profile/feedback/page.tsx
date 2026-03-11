"use client";

import { useState } from "react";
import { MessageSquareHeart, Send, Star } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";

const categories = [
  "Booking Experience",
  "Payments",
  "App Performance",
  "UI and Design",
  "Feature Request",
];

export default function FeedbackPage() {
  const mode = useThemeStore((s) => s.mode);
  const dark = mode === "dark";
  const [rating, setRating] = useState(4);
  const [category, setCategory] = useState(categories[0]);
  const [message, setMessage] = useState("");

  return (
    <div className="space-y-6 px-3 py-3 pb-6 select-none sm:px-4 lg:px-0">
      <section
        className={`rounded-3xl border p-6 text-white shadow-lg sm:p-8 ${
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

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-semibold text-gray-900">Rate your experience</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
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
            >
              {categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
        </div>

        <label className="mt-4 block space-y-2">
          <span className="text-sm font-medium text-gray-700">Your feedback</span>
          <textarea
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe your experience and suggestions..."
            className="w-full resize-none rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-indigo-300"
          />
        </label>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">
            <Send className="h-4 w-4" />
            Submit Feedback
          </button>
          <div className="inline-flex items-center gap-2 rounded-xl bg-indigo-50 px-3 py-2 text-xs text-gray-700">
            <MessageSquareHeart className="h-4 w-4" />
            We typically respond within 24-48 hours
          </div>
        </div>
      </section>
    </div>
  );
}
