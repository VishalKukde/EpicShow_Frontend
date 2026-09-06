"use client";

import { useMemo, useState } from "react";
import { ChevronDown, HelpCircle, Search } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";

const faqItems = [
  {
    category: "Bookings",
    question: "How do I cancel a booking?",
    answer:
      "Open Profile > Bookings, select the booking, and click Cancel if the show is eligible for cancellation.",
  },
  {
    category: "Bookings",
    question: "How many seats can I book?",
    answer:
      "Free users can book up to 2 seats per transaction. Pro members can book up to 5 seats.",
  },
  {
    category: "Payments",
    question: "Payment is debited but booking failed. What should I do?",
    answer:
      "Wait 10-15 minutes for automatic reconciliation. If not resolved, contact support with booking ID and payment reference.",
  },
  {
    category: "Payments",
    question: "Which payment methods are supported?",
    answer:
      "UPI, debit or credit cards, and supported wallets are available based on your region and provider availability.",
  },
  {
    category: "Refunds",
    question: "How long do refunds take?",
    answer:
      "Refunds are usually processed in 3-7 business days, depending on your payment provider and bank timelines.",
  },
  {
    category: "Account",
    question: "How can I update my profile details?",
    answer:
      "Go to Profile > Account Settings to update name, email, phone, language, and country preferences.",
  },
  {
    category: "Security",
    question: "How do I secure my account?",
    answer:
      "Use a strong password, enable 2FA, and review active sessions regularly from Profile > Security.",
  },
  {
    category: "Technical",
    question: "The app is not loading seat layout. How can I fix it?",
    answer:
      "Check your network, refresh the page, and retry. If it continues, clear browser cache or contact support.",
  },
];

export default function FAQPage() {
  const mode = useThemeStore((s) => s.mode);
  const dark = mode === "dark";
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string>("All");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filteredFaq = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const byTag =
      activeTag === "All"
        ? faqItems
        : faqItems.filter((item) => item.category === activeTag);
    if (!normalized) return byTag;

    return byTag.filter(
      (item) =>
        item.question.toLowerCase().includes(normalized) ||
        item.answer.toLowerCase().includes(normalized) ||
        item.category.toLowerCase().includes(normalized)
    );
  }, [activeTag, query]);

  return (
    <div className="space-y-5 px-3 py-2 pb-6 select-none sm:px-4 lg:px-0">
      {/* Admin-Style Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-b pb-4 border-slate-200 dark:border-zinc-800">
        <div>
          <h1 className={`text-xl sm:text-2xl font-black tracking-tight ${dark ? "text-zinc-50" : "text-slate-900"}`}>
            Frequently Asked Questions
          </h1>
          <p className={`text-xs font-medium mt-0.5 ${dark ? "text-zinc-400" : "text-slate-500"}`}>
            Quick answers to common questions about bookings, payments, refunds, and your account.
          </p>
        </div>
      </div>

      <section
        className={`rounded-2xl border p-5 shadow-sm sm:p-6 ${
          dark ? "border-zinc-800 bg-zinc-900" : "border-slate-200 bg-white"
        }`}
      >
        <label
          className={`flex items-center gap-2 rounded-xl border px-3.5 py-2 transition ${
            dark ? "border-zinc-700 bg-zinc-950/60 focus-within:border-indigo-500" : "border-slate-200 bg-slate-50 focus-within:border-indigo-500"
          }`}
        >
          <Search className={`h-4 w-4 shrink-0 ${dark ? "text-zinc-400" : "text-slate-400"}`} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search FAQ by keyword..."
            className={`w-full text-sm outline-none ${
              dark ? "bg-transparent text-zinc-100 placeholder:text-zinc-500" : "bg-transparent text-slate-800 placeholder:text-slate-400"
            }`}
          />
        </label>

        <div className="mt-4 flex flex-wrap gap-2">
          {["All", "Bookings", "Payments", "Refunds", "Account", "Security", "Technical"].map(
            (tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => {
                  setActiveTag(tag);
                  setOpenIndex(0);
                }}
                className={`cursor-pointer rounded-full border px-3 py-1 text-xs font-semibold transition ${
                  activeTag === tag
                    ? "border-indigo-600 bg-indigo-600 text-white"
                    : dark
                      ? "border-zinc-700 bg-zinc-800 text-zinc-300 hover:border-zinc-600"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                }`}
              >
                {tag}
              </button>
            )
          )}
        </div>
      </section>

      <section className="space-y-3">
        {filteredFaq.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm">
            <HelpCircle className="mx-auto h-6 w-6 text-gray-500" />
            <p className="mt-2 text-sm text-gray-700">
              No matching FAQ found. Try a broader keyword.
            </p>
          </div>
        ) : (
          filteredFaq.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <article
                key={`${item.category}-${item.question}`}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left sm:px-5 cursor-pointer"
                >
                  <div>
                    <p className="mb-1 text-xs font-medium uppercase tracking-wide text-indigo-600">
                      {item.category}
                    </p>
                    <p className="text-sm font-medium text-gray-900 sm:text-base">
                      {item.question}
                    </p>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 text-gray-500 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="border-t border-gray-100 px-4 py-4 sm:px-5">
                    <p className="text-sm leading-6 text-gray-600">{item.answer}</p>
                  </div>
                )}
              </article>
            );
          })
        )}
      </section>
    </div>
  );
}
