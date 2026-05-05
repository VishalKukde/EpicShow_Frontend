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
    question: "Why can I select only 2 seats?",
    answer:
      "Current booking flow is configured with a maximum of 2 seats per transaction for the selected show flow.",
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
    <div className="space-y-6 px-3 py-3 pb-6 select-none sm:px-4 lg:px-0">
      <section
        className={`rounded-3xl border p-6 text-white shadow-lg sm:p-8 ${
          dark
            ? "border-zinc-700 bg-zinc-900"
            : "border-gray-200 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900"
        }`}
      >
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-indigo-200">
          Frequently Asked Questions
        </p>
        <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">
          Find answers quickly
        </h1>
        <p className="mt-2 max-w-xl text-sm text-indigo-100/90">
          Search common booking, payment, account, and support questions.
        </p>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <label className="flex items-center gap-2 rounded-xl border border-gray-200  px-3 py-2">
          <Search className="h-4 w-4 text-gray-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search FAQ by keyword..."
            className={`w-full text-sm text-gray-800 outline-none ${dark ? "bg-zinc-800" : "bg-white"} `}
          />
        </label>

        <div className="mt-5 flex flex-wrap gap-2">
          {["All", "Bookings", "Payments", "Refunds", "Account", "Security", "Technical"].map(
            (tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => {
                  setActiveTag(tag);
                  setOpenIndex(0);
                }}
                className={`cursor-pointer rounded-full border px-3 py-1 text-xs ${
                  activeTag === tag
                    ? "border-indigo-600 bg-indigo-600 text-white"
                    : "border-gray-200 bg-white text-gray-600"
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
