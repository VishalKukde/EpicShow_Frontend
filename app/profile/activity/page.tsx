"use client";

import type { ComponentType } from "react";
import { Activity, CheckCircle2, Clock3, Ticket, Wallet } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";

const activityFeed = [
  {
    type: "booking",
    title: "Booked 2 tickets for Dune: Part Two",
    detail: "PVR IMAX • Seat A5, A6",
    time: "Today • 09:18 AM",
  },
  {
    type: "payment",
    title: "Payment successful",
    detail: "₹740 via UPI",
    time: "Today • 09:19 AM",
  },
  {
    type: "refund",
    title: "Refund processed",
    detail: "₹460 credited to wallet",
    time: "Yesterday • 05:12 PM",
  },
  {
    type: "login",
    title: "Signed in on new device",
    detail: "Chrome on Windows",
    time: "Yesterday • 11:03 AM",
  },
];

export default function ActivityPage() {
  const mode = useThemeStore((s) => s.mode);
  const dark = mode === "dark";

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
          Your Activity
        </p>
        <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">
          Timeline of your account actions
        </h1>
        <p className="mt-2 max-w-xl text-sm text-indigo-100/90">
          Review bookings, payments, refunds, and sign-in events in one place.
        </p>
      </section>

      {/* <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Metric title="Bookings This Month" value="6" icon={Ticket} />
        <Metric title="Successful Payments" value="5" icon={CheckCircle2} />
        <Metric title="Wallet Credits" value="₹1,120" icon={Wallet} />
      </section> */}

      <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">

         <p className={`py-10 text-center text-sm ${dark ? "text-zinc-400" : "text-gray-500"}`}>
             This feature is coming soon. Check back shortly or explore other sections in the meantime.
          </p>
        {/* <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            <p className="text-sm text-gray-500">Latest account events</p>
          </div>
          <button className="rounded-xl border border-indigo-700 bg-indigo-600 px-3 py-2 text-xs font-medium text-white hover:bg-indigo-700">
            Filter
          </button>
        </div> */}

        {/* <div className="space-y-3">
          {activityFeed.map((item) => (
            <article
              key={`${item.title}-${item.time}`}
              className="rounded-xl border border-gray-200 bg-gray-50/70 p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className={`rounded-lg ${dark ? "bg-indigo-700" : "bg-indigo-100"} p-2`}>
                    <Activity className="h-4 w-4 text-indigo-700" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{item.title}</p>
                    <p className="text-sm text-gray-600">{item.detail}</p>
                  </div>
                </div>
                <p className="inline-flex items-center gap-1 text-xs text-gray-500">
                  <Clock3 className="h-3.5 w-3.5" />
                  {item.time}
                </p>
              </div>
            </article>
          ))}
        </div> */}
      </section>
    </div>
  );
}

function Metric({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string;
  icon: ComponentType<{ className?: string }>;
}) {
  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <p className="text-sm text-gray-500">{title}</p>
        <Icon className="h-5 w-5 text-indigo-600" />
      </div>
      <p className="mt-3 text-2xl font-semibold text-gray-900">{value}</p>
    </article>
  );
}
