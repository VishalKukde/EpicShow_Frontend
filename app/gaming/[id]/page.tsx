"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import PageTransition from "@/app/components/PageTransition";
import { apiFetch } from "@/lib/api";
import { useGamingBookingStore } from "@/store/gamingBookingStore";
import { useThemeStore } from "@/store/themeStore";
import type { Gaming } from "@/types/Gaming";
import Image from "next/image";
import { toast } from "@/lib/toast";

const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

const formatTime = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function GamingDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const [item, setItem] = useState<Gaming | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mode = useThemeStore((s) => s.mode);
  const dark = mode === "dark";

  const setItemStore = useGamingBookingStore((s) => s.setItem);
  const setShow = useGamingBookingStore((s) => s.setShow);
  const setSeats = useGamingBookingStore((s) => s.setSeats);

  useEffect(() => {
    async function loadGaming() {
      try {
        setLoading(true);
        const data = await apiFetch(`/gaming/${id}`);
        setItem(data);
      } catch {
        setError("Failed to load gaming details");
      } finally {
        setLoading(false);
      }
    }

    if (id) loadGaming();
  }, [id]);

  const eventDate = useMemo(
    () => (item?.startDateTime ? new Date(item.startDateTime).toISOString().split("T")[0] : null),
    [item?.startDateTime]
  );
  const eventTime = useMemo(
    () => (item?.startDateTime ? formatTime(item.startDateTime) : null),
    [item?.startDateTime]
  );
  const venueLabel = useMemo(() => {
    if (!item) return null;
    if (item.venue && item.city) return `${item.venue}, ${item.city}`;
    return item.venue || item.city || null;
  }, [item]);
  const venueId = item?.venueId || "2921";
  const isReady = Boolean(eventDate && eventTime && venueLabel);

  const handleBooking = () => {
    if (!item || !eventDate || !eventTime || !venueLabel) {
      toast.warning("Gaming details are missing.");
      return;
    }

    setItemStore("gaming", { ...item, name: item.title });
    setShow(venueId, venueLabel, eventDate, eventTime);
    setSeats([], Number(item.price || 0));
    router.push(`/gaming/${id}/review`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg animate-pulse">
          Loading gaming details...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-red-600 text-lg">{error}</p>
        <button
          onClick={() => location.reload()}
          className="px-4 py-2 bg-gray-900 text-white rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Gaming show not found</p>
      </div>
    );
  }

  const rawImageUrl = item.imageUrl?.trim() || "";
  const normalizedImageUrl = rawImageUrl.startsWith("/public/")
    ? rawImageUrl.replace("/public", "")
    : rawImageUrl;
  const imageSrc = normalizedImageUrl || "/assets/category/Gaming.png";

  return (
    <PageTransition>
      <div className="select-none px-3 pb-28 pt-20 sm:px-5 sm:pb-32 sm:pt-24 lg:px-0">
        <div className="mx-auto max-w-6xl space-y-10 sm:space-y-14">
          <section className={`relative overflow-hidden rounded-[32px] border p-5 sm:p-6 lg:p-8 ${dark ? "border-zinc-800/80 bg-zinc-900/90" : "border-slate-200 bg-white"}`}>
            <div
              className={`pointer-events-none absolute inset-0 ${
                dark
                  ? "bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.18),_transparent_60%)]"
                  : "bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.12),_transparent_55%)]"
              }`}
            />
            <div className="relative grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
              <div className={`relative min-h-[18rem] overflow-hidden rounded-3xl border ${dark ? "border-zinc-800/80 bg-zinc-950" : "border-slate-200 bg-slate-100"} sm:h-80`}>
                <Image
                  src={imageSrc}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                <div className="absolute top-4 left-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white backdrop-blur">
                  Gaming Live
                </div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                    {item.organizer}
                  </p>
                  <h1 className="mt-2 text-3xl font-semibold leading-tight">
                    {item.title}
                  </h1>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-white/75">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      {item.startDateTime ? formatDate(item.startDateTime) : "-"}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      {item.startDateTime ? formatTime(item.startDateTime) : "-"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${dark ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>
                      Tournament Pass
                    </span>
                    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${dark ? "border-indigo-500/40 bg-indigo-500/10 text-indigo-200" : "border-indigo-200 bg-indigo-50 text-indigo-700"}`}>
                      Mobile Entry
                    </span>
                  </div>
                  <h2 className={`text-2xl font-semibold sm:text-3xl ${dark ? "text-zinc-100" : "text-slate-900"}`}>
                    About the experience
                  </h2>
                  <p className={`text-sm leading-relaxed ${dark ? "text-zinc-400" : "text-slate-600"}`}>
                    {item.description}
                  </p>
                </div>

                <div className="grid auto-rows-fr items-stretch gap-3 sm:grid-cols-2">
                  <div className={`h-full rounded-2xl border p-4 ${dark ? "border-zinc-800 bg-zinc-950/80" : "border-slate-200 bg-slate-50"}`}>
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-500">
                      <Calendar className="h-3.5 w-3.5" />
                      Date
                    </div>
                    <p className={`mt-2 text-sm font-medium ${dark ? "text-zinc-100" : "text-slate-900"}`}>
                      {item.startDateTime ? formatDate(item.startDateTime) : "-"}
                    </p>
                  </div>
                  <div className={`h-full rounded-2xl border p-4 ${dark ? "border-zinc-800 bg-zinc-950/80" : "border-slate-200 bg-slate-50"}`}>
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-500">
                      <Clock className="h-3.5 w-3.5" />
                      Time
                    </div>
                    <p className={`mt-2 text-sm font-medium ${dark ? "text-zinc-100" : "text-slate-900"}`}>
                      {item.startDateTime ? formatTime(item.startDateTime) : "-"}
                    </p>
                  </div>
                  <div className={`h-full rounded-2xl border p-4 ${dark ? "border-zinc-800 bg-zinc-950/80" : "border-slate-200 bg-slate-50"}`}>
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-500">
                      <MapPin className="h-3.5 w-3.5" />
                      Venue
                    </div>
                    <p className={`mt-2 text-sm font-medium ${dark ? "text-zinc-100" : "text-slate-900"}`}>
                      {venueLabel}
                    </p>
                  </div>
                  <div className={`h-full rounded-2xl border p-4 ${dark ? "border-zinc-800 bg-zinc-950/80" : "border-slate-200 bg-slate-50"}`}>
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-500">
                      <Users className="h-3.5 w-3.5" />
                      Availability
                    </div>
                    <p className={`mt-2 text-sm font-medium ${dark ? "text-zinc-100" : "text-slate-900"}`}>
                      {item.availableSeats} seats left
                    </p>
                  </div>
                </div>

                <div className="grid auto-rows-fr items-stretch gap-3 sm:grid-cols-2">
                  <div className={`flex h-full flex-col justify-between rounded-2xl border p-4 ${dark ? "border-emerald-500/40 bg-emerald-500/10" : "border-emerald-200 bg-emerald-50"}`}>
                    <div>
                      <p className={`text-xs font-semibold uppercase tracking-[0.2em] ${dark ? "text-emerald-200" : "text-emerald-700"}`}>
                        Starting at
                      </p>
                      <p className={`mt-2 text-2xl font-semibold ${dark ? "text-white" : "text-slate-900"}`}>
                        ₹{item.price}
                      </p>
                    </div>
                    <p className={`mt-3 text-xs ${dark ? "text-emerald-200/80" : "text-emerald-700/80"}`}>
                      per ticket, taxes included
                    </p>
                  </div>
                  <div className={`flex h-full flex-col justify-between rounded-2xl border p-4 ${dark ? "border-zinc-800 bg-zinc-950/80" : "border-slate-200 bg-slate-50"}`}>
                    <p className={`text-xs font-semibold uppercase tracking-[0.2em] ${dark ? "text-zinc-400" : "text-slate-500"}`}>
                      Experience
                    </p>
                    <ul className={`mt-2 space-y-1 text-xs ${dark ? "text-zinc-300" : "text-slate-600"}`}>
                      <li>Instant confirmation</li>
                      <li>Mobile ticket access</li>
                      <li>Secure checkout</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {isReady && (
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className={`fixed bottom-0 left-0 right-0 z-50 border-t px-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3 shadow-[0_-12px_30px_rgba(0,0,0,0.12)] backdrop-blur sm:px-5 sm:py-4 ${
              dark ? "border-zinc-800/80 bg-zinc-950/85" : "border-gray-200 bg-white/90"
            }`}
          >
            <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className={`truncate text-base font-medium ${dark ? "text-zinc-100" : "text-gray-900"}`}>
                  {venueLabel}
                </p>
                <p className={`truncate text-sm ${dark ? "text-zinc-300" : "text-gray-600"}`}>
                  {eventDate} • {eventTime}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                <div className="text-right">
                  <p className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${dark ? "text-zinc-400" : "text-slate-500"}`}>
                    From
                  </p>
                  <p className={`text-lg font-semibold ${dark ? "text-white" : "text-slate-900"}`}>
                    ₹{item.price}
                  </p>
                </div>

                <button
                  className={`w-full cursor-pointer rounded-xl px-6 py-3 font-medium text-white transition sm:w-auto ${
                    dark
                      ? "bg-emerald-600 hover:bg-emerald-500"
                      : "bg-gradient-to-r from-slate-900 to-slate-800 hover:opacity-90"
                  }`}
                  onClick={handleBooking}
                >
                  Proceed
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
}
