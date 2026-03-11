"use client";

import { useMemo, useState } from "react";
import { AlertCircle, Bug, CheckCircle2, LifeBuoy, Send } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";
import { toast } from "@/lib/toast";

const issueTypes = [
  "App crash",
  "Payment failed",
  "Booking issue",
  "Wallet issue",
  "Login or account issue",
  "UI bug",
  "Performance problem",
  "Something else",
];

const affectedAreas = [
  "Home Page",
  "Movie Details",
  "Seat Selection",
  "Payment",
  "Wallet",
  "Profile",
  "Notifications",
  "Other",
];

const priorities = [
  { id: "low", label: "Low", hint: "Minor issue, workaround available" },
  { id: "medium", label: "Medium", hint: "Affects normal usage" },
  { id: "high", label: "High", hint: "Blocks booking or payment" },
] as const;

export default function ReportIssuePage() {
  const mode = useThemeStore((s) => s.mode);
  const dark = mode === "dark";

  const [issueType, setIssueType] = useState(issueTypes[0]);
  const [priority, setPriority] = useState<(typeof priorities)[number]["id"]>("medium");
  const [selectedAreas, setSelectedAreas] = useState<string[]>(["Profile"]);
  const [summary, setSummary] = useState("");
  const [steps, setSteps] = useState("");
  const [expected, setExpected] = useState("");
  const [actual, setActual] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const isFormValid = useMemo(() => {
    return summary.trim().length >= 8 && steps.trim().length >= 10;
  }, [summary, steps]);

  const toggleArea = (area: string) => {
    setSelectedAreas((prev) =>
      prev.includes(area) ? prev.filter((item) => item !== area) : [...prev, area]
    );
  };

  const resetForm = () => {
    setIssueType(issueTypes[0]);
    setPriority("medium");
    setSelectedAreas(["Profile"]);
    setSummary("");
    setSteps("");
    setExpected("");
    setActual("");
    setContactEmail("");
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isFormValid) {
      toast.warning("Please add a clear summary and detailed steps to reproduce.");
      return;
    }

    setSubmitted(true);
    toast.success("Issue submitted successfully. Thanks for reporting.");
    // Placeholder submission flow until backend endpoint is wired.
    window.setTimeout(() => setSubmitted(false), 4500);
    resetForm();
  };

  return (
    <div className="select-none space-y-6 px-3 py-3 pb-6 sm:px-4 lg:px-0">
      <section
        className={`rounded-3xl border p-6 text-white shadow-lg sm:p-8 ${
          dark
            ? "border-zinc-700 bg-zinc-900"
            : "border-gray-200 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900"
        }`}
      >
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-indigo-200">
          Report Issue
        </p>
        <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">
          Tell us what went wrong
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-indigo-100/90">
          Share issue details with the team so we can fix bugs faster and improve
          your booking experience.
        </p>
      </section>

      <section
        className={`rounded-2xl border p-5 shadow-sm sm:p-6 ${
          dark ? "border-zinc-700 bg-zinc-900" : "border-gray-200 bg-white"
        }`}
      >
        <div className="mb-5 flex items-center gap-2">
          <Bug className={`h-5 w-5 ${dark ? "text-indigo-300" : "text-indigo-600"}`} />
          <h2 className={`text-lg font-semibold ${dark ? "text-zinc-100" : "text-gray-900"}`}>
            Issue Details
          </h2>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className={`text-sm font-medium ${dark ? "text-zinc-200" : "text-gray-700"}`}>
                Issue Type
              </span>
              <select
                value={issueType}
                onChange={(e) => setIssueType(e.target.value)}
                className={`w-full rounded-xl border px-3 py-2 text-sm outline-none transition ${
                  dark
                    ? "border-zinc-700 bg-zinc-950 text-zinc-100 focus:border-indigo-400"
                    : "border-gray-200 bg-white text-gray-800 focus:border-indigo-300"
                }`}
              >
                {issueTypes.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className={`text-sm font-medium ${dark ? "text-zinc-200" : "text-gray-700"}`}>
                Contact Email (optional)
              </span>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="you@example.com"
                className={`w-full rounded-xl border px-3 py-2 text-sm outline-none transition ${
                  dark
                    ? "border-zinc-700 bg-zinc-950 text-zinc-100 placeholder:text-zinc-500 focus:border-indigo-400"
                    : "border-gray-200 bg-white text-gray-800 placeholder:text-gray-400 focus:border-indigo-300"
                }`}
              />
            </label>
          </div>

          <div className="space-y-2">
            <span className={`text-sm font-medium ${dark ? "text-zinc-200" : "text-gray-700"}`}>
              Priority
            </span>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {priorities.map((item) => {
                const active = priority === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPriority(item.id)}
                    className={`rounded-xl border px-3 py-2 text-left transition ${
                      active
                        ? dark
                          ? "border-indigo-400 bg-indigo-500/20"
                          : "border-indigo-300 bg-indigo-50"
                        : dark
                          ? "border-zinc-700 bg-zinc-950 hover:border-zinc-600"
                          : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <p className={`text-sm font-semibold ${dark ? "text-zinc-100" : "text-gray-900"}`}>
                      {item.label}
                    </p>
                    <p className={`mt-0.5 text-xs ${dark ? "text-zinc-400" : "text-gray-500"}`}>
                      {item.hint}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <span className={`text-sm font-medium ${dark ? "text-zinc-200" : "text-gray-700"}`}>
              Affected Areas (choose multiple)
            </span>
            <div className="flex flex-wrap gap-2">
              {affectedAreas.map((area) => {
                const active = selectedAreas.includes(area);
                return (
                  <button
                    key={area}
                    type="button"
                    onClick={() => toggleArea(area)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                      active
                        ? dark
                          ? "border-indigo-400 bg-indigo-500/20 text-indigo-200"
                          : "border-indigo-300 bg-indigo-50 text-indigo-700"
                        : dark
                          ? "border-zinc-700 text-zinc-300 hover:border-zinc-600"
                          : "border-gray-300 text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    {area}
                  </button>
                );
              })}
            </div>
          </div>

          <label className="block space-y-2">
            <span className={`text-sm font-medium ${dark ? "text-zinc-200" : "text-gray-700"}`}>
              Short Summary
            </span>
            <input
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Example: Wallet top-up fails after payment"
              className={`w-full rounded-xl border px-3 py-2 text-sm outline-none transition ${
                dark
                  ? "border-zinc-700 bg-zinc-950 text-zinc-100 placeholder:text-zinc-500 focus:border-indigo-400"
                  : "border-gray-200 bg-white text-gray-800 placeholder:text-gray-400 focus:border-indigo-300"
              }`}
            />
          </label>

          <label className="block space-y-2">
            <span className={`text-sm font-medium ${dark ? "text-zinc-200" : "text-gray-700"}`}>
              Steps to Reproduce
            </span>
            <textarea
              rows={4}
              value={steps}
              onChange={(e) => setSteps(e.target.value)}
              placeholder="1) Open wallet, 2) Click Add Money, 3) Complete payment..."
              className={`w-full resize-none rounded-xl border px-3 py-2 text-sm outline-none transition ${
                dark
                  ? "border-zinc-700 bg-zinc-950 text-zinc-100 placeholder:text-zinc-500 focus:border-indigo-400"
                  : "border-gray-200 bg-white text-gray-800 placeholder:text-gray-400 focus:border-indigo-300"
              }`}
            />
          </label>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className={`text-sm font-medium ${dark ? "text-zinc-200" : "text-gray-700"}`}>
                Expected Result (optional)
              </span>
              <textarea
                rows={3}
                value={expected}
                onChange={(e) => setExpected(e.target.value)}
                placeholder="Payment should credit wallet instantly."
                className={`w-full resize-none rounded-xl border px-3 py-2 text-sm outline-none transition ${
                  dark
                    ? "border-zinc-700 bg-zinc-950 text-zinc-100 placeholder:text-zinc-500 focus:border-indigo-400"
                    : "border-gray-200 bg-white text-gray-800 placeholder:text-gray-400 focus:border-indigo-300"
                }`}
              />
            </label>

            <label className="space-y-2">
              <span className={`text-sm font-medium ${dark ? "text-zinc-200" : "text-gray-700"}`}>
                Actual Result (optional)
              </span>
              <textarea
                rows={3}
                value={actual}
                onChange={(e) => setActual(e.target.value)}
                placeholder="Payment succeeded but balance did not update."
                className={`w-full resize-none rounded-xl border px-3 py-2 text-sm outline-none transition ${
                  dark
                    ? "border-zinc-700 bg-zinc-950 text-zinc-100 placeholder:text-zinc-500 focus:border-indigo-400"
                    : "border-gray-200 bg-white text-gray-800 placeholder:text-gray-400 focus:border-indigo-300"
                }`}
              />
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              type="submit"
              disabled={!isFormValid}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-white transition ${
                isFormValid
                  ? dark
                    ? "bg-indigo-600 hover:bg-indigo-500"
                    : "bg-gray-900 hover:bg-gray-800"
                  : "cursor-not-allowed bg-gray-400"
              }`}
            >
              <Send className="h-4 w-4" />
              Submit Issue
            </button>

            <div
              className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs ${
                dark ? "bg-zinc-800 text-zinc-300" : "bg-indigo-50 text-gray-700"
              }`}
            >
              <LifeBuoy className="h-4 w-4" />
              Include exact steps for faster resolution.
            </div>
          </div>

          {!isFormValid && (
            <p className={`inline-flex items-center gap-2 text-xs ${dark ? "text-amber-300" : "text-amber-700"}`}>
              <AlertCircle className="h-4 w-4" />
              Add at least 8 characters in summary and 10 in steps.
            </p>
          )}
        </form>

        {submitted && (
          <div
            className={`mt-5 inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm ${
              dark
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                : "border-emerald-300 bg-emerald-50 text-emerald-700"
            }`}
          >
            <CheckCircle2 className="h-4 w-4" />
            Thanks. Your issue report has been submitted.
          </div>
        )}
      </section>
    </div>
  );
}
