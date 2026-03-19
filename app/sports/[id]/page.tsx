"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Calendar, Clock, MapPin, Ticket } from "lucide-react";
import { motion } from "framer-motion";
import PageTransition from "@/app/components/PageTransition";
import { getSportMatchById, toSportBookingItem } from "@/app/sports/data";
import { useBookingStore } from "@/store/bookingStore";
import { useThemeStore } from "@/store/themeStore";

const TRANSPARENT_BLUR_DATA_URL =
  "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";

type StandTier = "vip" | "premium" | "standard";

const STANDS: { code: string; label: string; tier: StandTier }[] = [
  { code: "A", label: "Stand A", tier: "premium" },
  { code: "B", label: "Stand B", tier: "vip" },
  { code: "C", label: "Stand C", tier: "standard" },
  { code: "D", label: "Stand D", tier: "standard" },
  { code: "E", label: "Stand E", tier: "premium" },
  { code: "F", label: "Stand F", tier: "vip" },
  { code: "G", label: "Stand G", tier: "standard" },
  { code: "H", label: "Stand H", tier: "standard" },
];

const STAND_ROWS = ["A", "B", "C", "D"];
const SEATS_PER_ROW = 20;

const tierHue: Record<StandTier, number> = {
  vip: 28,
  premium: 150,
  standard: 210,
};

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));

export default function SportDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const match = getSportMatchById(String(id));
  const setItem = useBookingStore((s) => s.setItem);
  const setShow = useBookingStore((s) => s.setShow);
  const mode = useThemeStore((s) => s.mode);
  const dark = mode === "dark";
  const seatIdExample = `${STANDS[0].code}${STAND_ROWS[0]}1`;

  if (!match) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Match not found</p>
      </div>
    );
  }

  const handleProceed = () => {
    setItem("sport", toSportBookingItem(match));
    setShow(match.venueId, match.venue, match.date, match.time);
    router.push(`/sports/${match._id}/seat-layout`);
  };

  const getStandColor = (tier: StandTier) => {
    const hue = tierHue[tier];
    const saturation = dark ? 42 : 38;
    const lightness = dark ? 50 : 90;
    const alpha = dark ? 0.85 : 0.95;
    return `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
  };

  return (
    <PageTransition>
      <div className={`min-h-screen select-none px-4 pb-24 pt-20 sm:px-6 ${dark ? "bg-zinc-950 text-zinc-100" : "bg-background text-slate-900"}`}>
        <div className="mx-auto max-w-6xl space-y-8">
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={`rounded-3xl border p-5 shadow-sm sm:p-6 ${dark ? "border-zinc-800 bg-zinc-900" : "border-slate-200 bg-white"}`}
          >
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <div className="relative h-40 w-full overflow-hidden rounded-2xl sm:h-44 sm:w-56">
                <Image
                  src={match.imageUrl || "/dummy.webp"}
                  alt={`${match.teamA} vs ${match.teamB}`}
                  fill
                  sizes="(max-width: 640px) 100vw, 35vw"
                  className="object-cover"
                  placeholder="blur"
                  blurDataURL={TRANSPARENT_BLUR_DATA_URL}
                />
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-500">
                  <span>{match.league}</span>
                  <span className="h-1 w-1 rounded-full bg-indigo-400" />
                  <span>{match.matchNo}</span>
                </div>
                <h1 className={`text-2xl font-semibold sm:text-3xl ${dark ? "text-zinc-100" : "text-slate-900"}`}>
                  {match.teamA} vs {match.teamB}
                </h1>
                <p className={`text-sm ${dark ? "text-zinc-400" : "text-slate-600"}`}>
                  {match.description}
                </p>
                <div className={`flex flex-wrap items-center gap-3 text-sm ${dark ? "text-zinc-300" : "text-slate-600"}`}>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(match.date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{match.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{match.venue}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          <div className="grid gap-6 lg:grid-cols-[1.15fr_1.85fr]">
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className={`rounded-3xl border p-5 sm:p-6 ${dark ? "border-zinc-800 bg-zinc-900" : "border-slate-200 bg-white"}`}
            >
              <div className="flex items-center gap-2">
                <Ticket className="h-4 w-4 text-indigo-500" />
                <h2 className={`text-base font-semibold ${dark ? "text-zinc-100" : "text-slate-900"}`}>
                  Seating Overview
                </h2>
              </div>
              <div className="mt-4 space-y-4 text-sm">
                <div className={`rounded-2xl border px-4 py-3 ${dark ? "border-zinc-700 bg-zinc-800 text-zinc-200" : "border-slate-200 bg-slate-50 text-slate-700"}`}>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-500">
                    Layout Info
                  </p>
                  <div className="mt-2 grid gap-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className={dark ? "text-zinc-400" : "text-slate-500"}>Stands</span>
                      <span>{STANDS.map((stand) => stand.code).join(" · ")}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={dark ? "text-zinc-400" : "text-slate-500"}>Rows per stand</span>
                      <span>{STAND_ROWS.join(" - ")}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={dark ? "text-zinc-400" : "text-slate-500"}>Seats per row</span>
                      <span>{SEATS_PER_ROW}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={dark ? "text-zinc-400" : "text-slate-500"}>Seat ID format</span>
                      <span>{seatIdExample}</span>
                    </div>
                  </div>
                </div>
                <div className={`rounded-2xl border px-4 py-3 text-xs ${dark ? "border-zinc-700 bg-zinc-800 text-zinc-300" : "border-slate-200 bg-slate-50 text-slate-600"}`}>
                  Max 2 seats per booking. You can select seats by stand on the next screen.
                </div>
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className={`rounded-3xl border p-5 sm:p-6 ${dark ? "border-zinc-800 bg-zinc-900" : "border-slate-200 bg-white"}`}
            >
              <div className="flex items-center gap-2">
                <Ticket className="h-4 w-4 text-indigo-500" />
                <h2 className={`text-base font-semibold ${dark ? "text-zinc-100" : "text-slate-900"}`}>
                  Stand Pricing
                </h2>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {STANDS.map((stand) => (
                  <div
                    key={stand.code}
                    className={`rounded-2xl border px-4 py-3 text-sm ${dark ? "border-zinc-700 bg-zinc-800 text-zinc-200" : "border-slate-200 bg-slate-50 text-slate-700"}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: getStandColor(stand.tier) }} />
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-500">
                        {stand.label}
                      </p>
                    </div>
                    <p className={`mt-2 text-lg font-semibold ${dark ? "text-white" : "text-slate-900"}`}>
                      ₹{match.prices[stand.tier]}
                    </p>
                    <p className={`text-xs ${dark ? "text-zinc-400" : "text-slate-500"}`}>
                      Rows {STAND_ROWS.join(" - ")}
                    </p>
                    <p className={`text-xs ${dark ? "text-zinc-500" : "text-slate-500"}`}>
                      Tier {stand.tier.toUpperCase()}
                    </p>
                  </div>
                ))}
              </div>
            </motion.section>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className={`text-sm ${dark ? "text-zinc-400" : "text-slate-600"}`}>
              Secure your seats now. You can pick up to 2 seats per booking.
            </div>
            <button
              onClick={handleProceed}
              className={`cursor-pointer inline-flex items-center justify-center rounded-2xl px-6 py-3 text-sm font-medium text-white transition ${dark ? "bg-indigo-600 hover:bg-indigo-500" : "bg-gray-900 hover:bg-gray-800"}`}
            >
              Proceed to Seats
            </button>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
