"use client";

import { useMemo, useState } from "react";
import { Bug, CheckCircle2, Send, ShieldAlert } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";
import { toast } from "@/lib/toast";

const issueCategories = [
  "Booking & Tickets",
  "Payments & Wallet",
  "Train Travel & PNR",
  "Login & Account",
  "UI / Display Bug",
  "Performance & Speed",
  "Other",
];

export default function ReportIssuePage() {
  const mode = useThemeStore((s) => s.mode);
  const dark = mode === "dark";

  const [category, setCategory] = useState(issueCategories[0]);
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isFormValid = useMemo(() => {
    return summary.trim().length >= 5 && description.trim().length >= 10;
  }, [summary, description]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isFormValid) {
      toast.warning("Please provide a summary and brief description.");
      return;
    }

    setSubmitting(true);
    window.setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      toast.success("Issue reported successfully. Thanks for letting us know!");
      setSummary("");
      setDescription("");
      setContactEmail("");
      window.setTimeout(() => setSubmitted(false), 4500);
    }, 600);
  };

  return (
    <div className="select-none space-y-4 px-3 py-2 pb-6 sm:px-4 lg:px-0">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3 border-slate-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${dark
                  ? "border-amber-400/30 bg-amber-500/15 text-amber-300"
                  : "border-amber-200 bg-amber-50 text-amber-700"
                }`}
            >
              <ShieldAlert className="h-3 w-3" />
              Technical Support
            </span>
          </div>
          <h1 className={`mt-1.5 text-xl font-black tracking-tight ${dark ? "text-white" : "text-slate-900"} dark:text-white`}>
            Report an Issue
          </h1>
          <p className={`text-xs font-medium ${dark ? "text-zinc-400" : "text-slate-500"} dark:text-zinc-400`}>
            Encountered a bug or payment problem? Send us a quick report below.
          </p>
        </div>
      </div>

      <section
        className={`rounded-2xl border p-4 sm:p-5 shadow-xs ${dark ? "border-zinc-800 bg-[#18181b]" : "border-slate-200 bg-white"
          } dark:bg-[#18181b] dark:border-zinc-800`}
      >
        <div className="mb-4 flex items-center gap-2 border-b pb-3 border-slate-100 dark:border-zinc-800/80">
          <Bug className="h-4.5 w-4.5 text-indigo-500" />
          <h2 className={`text-sm font-bold uppercase tracking-wider ${dark ? "text-zinc-200" : "text-slate-800"}`}>
            Quick Issue Form
          </h2>
        </div>

        <form className="space-y-3.5" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="block space-y-1.5">
              <span className={`text-xs font-bold uppercase tracking-wider ${dark ? "text-zinc-400" : "text-slate-600"}`}>
                Issue Category
              </span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={`w-full rounded-xl border px-3 py-2 text-xs font-semibold outline-none transition ${dark
                    ? "border-zinc-700 bg-zinc-900 text-zinc-100 focus:border-indigo-500"
                    : "border-slate-200 bg-white text-slate-800 focus:border-indigo-400"
                  }`}
              >
                {issueCategories.map((item) => (
                  <option key={item} className={dark ? "bg-zinc-900 text-zinc-100" : ""}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label className="block space-y-1.5">
              <span className={`text-xs font-bold uppercase tracking-wider ${dark ? "text-zinc-400" : "text-slate-600"}`}>
                Your Email <span className="normal-case font-normal opacity-70">(Optional)</span>
              </span>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="For status updates (optional)"
                className={`w-full rounded-xl border px-3 py-2 text-xs font-medium outline-none transition ${dark
                    ? "border-zinc-700 bg-zinc-900 text-zinc-100 placeholder:text-zinc-500 focus:border-indigo-500"
                    : "border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:border-indigo-400"
                  }`}
              />
            </label>
          </div>

          <label className="block space-y-1.5">
            <span className={`text-xs font-bold uppercase tracking-wider ${dark ? "text-zinc-400" : "text-slate-600"}`}>
              Issue Summary
            </span>
            <input
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="e.g., Payment completed but ticket not generated"
              className={`w-full rounded-xl border px-3 py-2 text-xs font-medium outline-none transition ${dark
                  ? "border-zinc-700 bg-zinc-900 text-zinc-100 placeholder:text-zinc-500 focus:border-indigo-500"
                  : "border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:border-indigo-400"
                }`}
              required
            />
          </label>

          <label className="block space-y-1.5">
            <span className={`text-xs font-bold uppercase tracking-wider ${dark ? "text-zinc-400" : "text-slate-600"}`}>
              Description & Details
            </span>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Briefly describe what happened..."
              className={`w-full resize-none rounded-xl border px-3 py-2 text-xs font-medium outline-none transition ${dark
                  ? "border-zinc-700 bg-zinc-900 text-zinc-100 placeholder:text-zinc-500 focus:border-indigo-500"
                  : "border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:border-indigo-400"
                }`}
              required
            />
          </label>

          <div className="pt-1">
            <button
              type="submit"
              disabled={!isFormValid || submitting}
              className={`inline-flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold text-white transition shadow-xs ${isFormValid && !submitting
                  ? "bg-indigo-600 hover:bg-indigo-500"
                  : dark
                    ? "bg-zinc-800 text-zinc-500 border border-zinc-700/60 cursor-not-allowed"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                }`}
            >
              <Send className="h-3.5 w-3.5" />
              {submitting ? "Submitting..." : "Submit Report"}
            </button>
          </div>
        </form>

        {submitted && (
          <div
            className={`mt-4 inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-bold ${dark
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                : "border-emerald-300 bg-emerald-50 text-emerald-700"
              }`}
          >
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            Report submitted successfully. Thank you!
          </div>
        )}
      </section>
    </div>
  );
}
