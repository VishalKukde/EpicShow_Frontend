"use client";

import { useMemo, useState } from "react";
import { ChevronDown, HelpCircle, Search, Sparkles } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";

const faqItems = [
  {
    category: "Bookings",
    question: "How do I cancel a ticket booking?",
    answer:
      "Navigate to Profile > My Activity, select your booking card, and click 'Cancel Booking'. If the event or show is eligible, your refund will automatically enter the refund queue.",
  },
  {
    category: "Bookings",
    question: "How many seats can I reserve per booking?",
    answer:
      "Standard accounts can reserve up to 2 seats per checkout transaction. Verified Pro members can select up to 5 seats with realtime seat locking.",
  },
  {
    category: "Payments",
    question: "Money was debited, but my booking failed. What should I do?",
    answer:
      "Our system reconciles pending transactions every 10–15 minutes. If your booking is not created, the full amount will automatically refund to your wallet or original payment source.",
  },
  {
    category: "Payments",
    question: "Which payment gateways and methods are supported?",
    answer:
      "We support Razorpay (UPI, Credit/Debit cards, NetBanking) and instant wallet balance checkout for seamless 1-click transactions.",
  },
  {
    category: "Refunds",
    question: "How long does it take for refunds to reflect?",
    answer:
      "Wallet refunds are processed instantly. Razorpay card/bank refunds typically take 3–5 business days to reflect in your bank account statement.",
  },
  {
    category: "Account",
    question: "How do I update my profile or saved passengers?",
    answer:
      "Go to Profile > Saved Passengers or Account Settings to manage your personal contact information, default passenger list, and security preferences.",
  },
  {
    category: "Security",
    question: "How does token session security work on EpicShow?",
    answer:
      "We use encrypted JWT access and refresh token pairs. Changing your password or signing out invalidates all active sessions across devices.",
  },
  {
    category: "Technical",
    question: "Seat layout is not loading. How can I resolve it?",
    answer:
      "Ensure you have a stable network connection, refresh the webpage, or clear browser cache. If the issue persists, contact live support via Profile > Chat.",
  },
];

const categoryTags = ["All", "Bookings", "Payments", "Refunds", "Account", "Security", "Technical"];

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
    <div className="select-none space-y-4 px-3 py-2 pb-6 sm:px-4 lg:px-0">
      {/* Header */}
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
              Help Center
            </span>
          </div>
          <h1 className={`mt-1.5 text-xl font-black tracking-tight ${dark ? "text-white" : "text-slate-900"} dark:text-white`}>
            Frequently Asked Questions
          </h1>
          <p className={`text-xs font-medium ${dark ? "text-zinc-400" : "text-slate-500"} dark:text-zinc-400`}>
            Instant answers for ticketing, train PNRs, payments, wallet top-ups, and account management.
          </p>
        </div>
      </div>

      {/* Search & Tags Bar */}
      <section
        className={`rounded-2xl border p-4 shadow-xs ${dark ? "border-zinc-800 bg-[#18181b]" : "border-slate-200 bg-white"
          } dark:bg-[#18181b] dark:border-zinc-800`}
      >
        <label
          className={`flex h-10 items-center gap-2.5 rounded-xl border px-3 transition ${dark
              ? "border-zinc-700 bg-zinc-900/80 focus-within:border-indigo-500"
              : "border-slate-200 bg-slate-50 focus-within:border-indigo-400"
            }`}
        >
          <Search className={`h-4 w-4 shrink-0 ${dark ? "text-zinc-400" : "text-slate-400"}`} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search FAQs by keywords (e.g. refund, payment, seats)..."
            className={`w-full text-xs font-medium outline-none ${dark
                ? "bg-transparent text-zinc-100 placeholder:text-zinc-500"
                : "bg-transparent text-slate-800 placeholder:text-slate-400"
              }`}
          />
        </label>

        {/* Category Pills */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {categoryTags.map((tag) => {
            const active = activeTag === tag;
            return (
              <button
                key={tag}
                type="button"
                onClick={() => {
                  setActiveTag(tag);
                  setOpenIndex(0);
                }}
                className={`cursor-pointer rounded-lg border px-3 py-1 text-xs font-bold transition duration-150 ${active
                    ? "border-indigo-600 bg-indigo-600 text-white shadow-xs"
                    : dark
                      ? "border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                      : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                  }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </section>

      {/* Accordion Items */}
      <section className="space-y-2.5">
        {filteredFaq.length === 0 ? (
          <div
            className={`rounded-2xl border p-6 text-center shadow-xs ${dark ? "border-zinc-800 bg-[#18181b]" : "border-slate-200 bg-white"
              } dark:bg-[#18181b] dark:border-zinc-800`}
          >
            <HelpCircle className={`mx-auto h-6 w-6 ${dark ? "text-zinc-400" : "text-slate-400"}`} />
            <p className={`mt-2 text-xs font-medium ${dark ? "text-zinc-300" : "text-slate-700"}`}>
              No matching FAQ found. Try searching for a different keyword or select another category.
            </p>
          </div>
        ) : (
          filteredFaq.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <article
                key={`${item.category}-${item.question}`}
                className={`overflow-hidden rounded-xl border transition-all duration-200 shadow-xs ${dark ? "border-zinc-800 bg-[#18181b]" : "border-slate-200 bg-white"
                  } dark:bg-[#18181b] dark:border-zinc-800`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left cursor-pointer transition hover:bg-indigo-500/5"
                >
                  <div className="space-y-0.5">
                    <span
                      className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${dark
                          ? "bg-indigo-500/15 text-indigo-300 border border-indigo-500/20"
                          : "bg-indigo-50 text-indigo-700 border border-indigo-100"
                        }`}
                    >
                      {item.category}
                    </span>
                    <h3 className={`text-xs sm:text-sm font-bold ${dark ? "text-zinc-100" : "text-slate-900"} dark:text-white`}>
                      {item.question}
                    </h3>
                  </div>
                  <span
                    className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg border transition-transform duration-200 ${dark
                        ? "border-zinc-800 bg-zinc-900 text-zinc-400"
                        : "border-slate-200 bg-slate-50 text-slate-500"
                      } ${isOpen ? "rotate-180 bg-indigo-600 text-white border-indigo-600" : ""}`}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </span>
                </button>

                {isOpen && (
                  <div
                    className={`border-t px-4 py-3 sm:px-5 ${dark ? "border-zinc-800/80 bg-zinc-900/40" : "border-slate-100 bg-slate-50/50"
                      }`}
                  >
                    <p className={`text-xs leading-relaxed ${dark ? "text-zinc-300" : "text-slate-600"} dark:text-zinc-300`}>
                      {item.answer}
                    </p>
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
