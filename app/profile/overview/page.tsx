"use client";

import { useEffect, useMemo, useState, type ComponentType } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  CalendarDays,
  ChevronRight,
  CircleCheckBig,
  CreditCard,
  Film,
  Sparkles,
  Ticket,
  TicketPercent,
  UserRoundCheck,
  Wallet,
} from "lucide-react";
import { formatDateUI } from "@/lib/helper";
import { useBookingStats } from "@/hooks/useBookingStats";
import { useLatestBookings } from "@/hooks/useLatestBooking";
import { cinemas } from "@/app/movies/[id]/components/Cinemas";
import { useThemeStore } from "@/store/themeStore";

export default function ProfileOverview() {
  const { user } = useAuth();
  const router = useRouter();
  const { stats, loading } = useBookingStats();
  const { data } = useLatestBookings();
  const [now, setNow] = useState(() => new Date());
  const mode = useThemeStore((s) => s.mode);
  const dark = mode === "dark";

  const cinemaMap = useMemo(() => {
    const map = new Map();
    cinemas.forEach((c) => map.set(String(c.id), c.name));
    return map;
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 30_000);
    return () => clearInterval(interval);
  }, []);

  const upcomingBookings = useMemo(() => {
    return data
      .map((entry) => {
        const showDateTime = parseBookingDateTime(entry.booking.date, entry.booking.slot);
        return { ...entry, showDateTime };
      })
      .filter((entry) => entry.showDateTime.getTime() > now.getTime())
      .sort((a, b) => a.showDateTime.getTime() - b.showDateTime.getTime());
  }, [data, now]);

  return (
    <div className="space-y-5 px-3 py-2 pb-6 sm:px-4 lg:px-0 select-none">
      {/* Admin-Style Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-b pb-4 border-slate-200 dark:border-zinc-800">
        <div>
          <h1 className={`text-xl sm:text-2xl font-black tracking-tight ${dark ? "text-zinc-50" : "text-slate-900"}`}>
            Welcome back, {user?.name || "Movie Fan"}
          </h1>
          <p className={`text-xs font-medium mt-0.5 ${dark ? "text-zinc-400" : "text-slate-500"}`}>
            Overview of your movie bookings, wallet balance, and recent tickets.
          </p>
        </div>

        {/* Top Toolbar Quick Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => router.push("/movies")}
            className={`inline-flex cursor-pointer items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition shadow-sm ${
              dark
                ? "border border-zinc-700/70 bg-[#18181b] text-zinc-200 hover:bg-zinc-800 hover:text-white"
                : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            <Film className="h-3.5 w-3.5" />
            <span>Book Tickets</span>
          </button>

          <button
            type="button"
            onClick={() => router.push("/profile/wallet")}
            className={`inline-flex cursor-pointer items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition shadow-sm ${
              dark
                ? "border border-zinc-700/70 bg-[#18181b] text-zinc-100 hover:bg-zinc-800"
                : "bg-slate-900 text-white hover:bg-slate-800"
            }`}
          >
            <Wallet className="h-3.5 w-3.5" />
            <span>Top-up Wallet</span>
          </button>
        </div>
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Bookings"
          value={String(stats?.totalBookings)}
          note="All-time movie bookings"
          icon={Ticket}
          loading={loading}
          dark={dark}
        />
        <StatCard
          title="Active Tickets"
          value={String(stats?.upcomingPaidBookings)}
          note="Upcoming active shows"
          icon={CircleCheckBig}
          loading={loading}
          dark={dark}
        />
        <StatCard
          title="Wallet Balance"
          value={`₹${user?.walletBalance.toFixed(2)}`}
          note="Ready for quick checkout"
          icon={Wallet}
          loading={loading}
          dark={dark}
        />
        <StatCard
          title="Reward Points"
          value={String(user?.rewardPoints)}
          note="Use points for discounts"
          icon={Sparkles}
          loading={loading}
          dark={dark}
        />
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div
          className={`rounded-2xl border p-5 shadow-sm xl:col-span-2 ${
            dark
              ? "border-zinc-800 bg-[#18181b]"
              : "border-gray-200 bg-white"
          }`}
        >
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className={`text-lg font-semibold ${dark ? "text-zinc-100" : "text-gray-900"}`}>Upcoming Shows</h2>
              <p className={`text-sm ${dark ? "text-zinc-400" : "text-gray-500"}`}>Your next confirmed bookings</p>
            </div>
            <button
              className={`inline-flex cursor-pointer items-center gap-1 rounded-lg px-2 py-1 text-sm font-medium transition ${
                dark ? "text-indigo-300 hover:bg-zinc-800/70" : "text-indigo-700 hover:bg-indigo-50"
              }`}
              onClick={() => router.push("/profile/bookings/movies")}
            >
              View all
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-4 space-y-3">
            {upcomingBookings.length === 0 && (
              <div
                className={`rounded-xl border p-4 text-sm ${
                  dark
                    ? "border-zinc-800 bg-zinc-900/60 text-zinc-300"
                    : "border-gray-200 bg-gray-50/70 text-gray-600"
                }`}
              >
                No upcoming paid bookings right now.
              </div>
            )}

            {upcomingBookings.map((d) => (
              <article
                key={`${d.booking._id}-${d.booking.slot}`}
                className={`rounded-xl border p-4 ${
                  dark
                    ? "border-zinc-800 bg-zinc-900/60"
                    : "border-gray-200 bg-gray-50/70"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className={`font-medium ${dark ? "text-zinc-100" : "text-gray-900"}`}>{d.item?.name}</p>
                    <p className={`mt-1 text-sm ${dark ? "text-zinc-400" : "text-gray-600"}`}>
                      {cinemaMap.get(String(d.booking.cinemaId)) || "Unknown cinema"}
                    </p>
                  </div>
                  <span
                    className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${
                      dark
                        ? "border-indigo-300/40 bg-indigo-500/12 text-indigo-200"
                        : "border-indigo-300 bg-indigo-100 text-indigo-700"
                    }`}
                  >
                    {formatCountdown(d.showDateTime, now)}
                  </span>
                </div>

                <div className={`mt-2 flex flex-wrap items-center gap-2 text-xs ${dark ? "text-zinc-400" : "text-gray-500"}`}>
                  <span className="inline-flex items-center gap-1">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {d.booking.date} • {d.booking.slot}
                  </span>
                  <span className={`rounded-full px-2 py-1 ring-1 ${dark ? "bg-zinc-800/80 ring-zinc-700" : "bg-white ring-gray-200"}`}>
                    Seats {d.booking.seatIds.join(", ")}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div
            className={`rounded-2xl border p-5 shadow-sm ${
              dark
                ? "border-zinc-800 bg-[#18181b]"
                : "border-gray-200 bg-white"
            }`}
          >
            <h3 className={`font-semibold ${dark ? "text-zinc-100" : "text-gray-900"}`}>Account Snapshot</h3>
            <div className="mt-4 space-y-3 text-sm">
              <Row label="Name" value={user?.name || "Not set"} dark={dark} />
              <Row label="Email" value={user?.email || "Not set"} dark={dark} />
              <Row label="Membership" value={user?.membership ? user?.membership.toUpperCase() : "Not set"} dark={dark} />
              <Row
                label="Last Login"
                value={user?.lastLogin ? formatDateUI(user.lastLogin) : "Not set"}
                dark={dark}
              />
            </div>
          </div>

          <div
            className={`rounded-2xl border p-5 shadow-sm ${
              dark
                ? "border-zinc-800 bg-[#18181b]"
                : "border-indigo-100 bg-indigo-50"
            }`}
          >
            <h3 className={`font-semibold ${dark ? "text-indigo-200" : "text-indigo-900"}`}>Premium Access</h3>
            <p className={`mt-1 text-sm ${dark ? "text-zinc-400" : "text-indigo-700"}`}>
              Upgrade for early access bookings, priority support, and exclusive
              offers.
            </p>
            <button
              onClick={() => router.push("/profile/subscription")}
              className={`mt-4 cursor-pointer rounded-xl px-4 py-2 text-sm font-medium transition ${
                dark
                  ? "border border-zinc-700/70 bg-[#18181b] text-zinc-100 hover:bg-zinc-800"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
            >
              Upgrade Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatCard({
  title,
  value,
  note,
  icon: Icon,
  loading,
  dark,
}: {
  title: string;
  value: string;
  note: string;
  icon: ComponentType<{ className?: string }>;
  loading: boolean;
  dark: boolean;
}) {
  return (
    <article
      className={`rounded-2xl border p-5 shadow-sm ${
        dark
          ? "border-zinc-800 bg-[#18181b]"
          : "border-gray-200 bg-white"
      }`}
    >
      <div className="flex items-start justify-between">
        <p className={`text-sm ${dark ? "text-zinc-400" : "text-gray-500"}`}>{title}</p>
        <Icon className={`h-5 w-5 ${dark ? "text-indigo-400" : "text-indigo-600"}`} />
      </div>
      {loading ? (
        <div className={`mt-3 h-7 w-24 animate-pulse rounded-md ${dark ? "bg-zinc-800" : "bg-gray-200"}`} />
      ) : (
        <p className={`mt-3 text-2xl font-semibold ${dark ? "text-zinc-100" : "text-gray-900"}`}>
          {value}
        </p>
      )}

      <p className={`mt-1 text-xs ${dark ? "text-zinc-400" : "text-gray-500"}`}>{note}</p>
    </article>
  );
}

function Row({ label, value, dark }: { label: string; value: string; dark: boolean }) {
  return (
    <div
      className={`flex items-center justify-between rounded-lg px-3 py-2 ${
        dark ? "bg-zinc-900/60 border border-zinc-800/60" : "bg-gray-50"
      }`}
    >
      <span className={dark ? "text-zinc-400" : "text-gray-500"}>{label}</span>
      <span className={`font-medium ${dark ? "text-zinc-100" : "text-gray-900"}`}>{value}</span>
    </div>
  );
}

function parseBookingDateTime(date: string, slot: string) {
  const [time, meridiem] = slot.split(" ");
  const [hh, mm] = time.split(":").map(Number);

  let hour = hh;
  if (meridiem === "PM" && hour !== 12) hour += 12;
  if (meridiem === "AM" && hour === 12) hour = 0;

  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day, hour, mm, 0, 0);
}

function formatCountdown(target: Date, now: Date) {
  const diffMs = target.getTime() - now.getTime();
  if (diffMs <= 0) return "Started";

  const totalMins = Math.floor(diffMs / 60000);
  const days = Math.floor(totalMins / (60 * 24));
  const hours = Math.floor((totalMins % (60 * 24)) / 60);
  const mins = totalMins % 60;

  if (days > 0) {
    return `${days}d ${hours}h left`;
  }
  if (hours > 0) {
    return `${hours}h ${mins}m left`;
  }
  return `${Math.max(mins, 1)}m left`;
}
