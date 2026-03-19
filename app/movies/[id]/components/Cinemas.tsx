import { useThemeStore } from "@/store/themeStore";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

type ICinemaProps = {
  setSelectedDate: (date: string | null) => void;
  setSelectedCinema: (cinema: string | null) => void;
  setSelectedCinemaId: (id: string | null) => void;
  setSelectedSlot: (slot: string | null) => void;
  selectedDate: string | null;
  selectedCinema: string | null;
  selectedSlot: string | null;
  selectedCinemaId: string | null;
};

export const cinemas = [
  {
    id: "1921",
    name: "PVR Cinemas",
    slots: ["10:00 AM", "01:30 PM", "05:00 PM", "09:00 PM"],
  },
  {
    id: "1922",
    name: "INOX",
    slots: ["11:00 AM", "02:30 PM", "06:00 PM", "10:15 PM"],
  },
  {
    id: "1923",
    name: "Cinepolis",
    slots: ["09:45 AM", "01:00 PM", "04:30 PM", "08:45 PM"],
  },
];
const Cinemas = ({
  setSelectedDate,
  setSelectedCinema,
  setSelectedSlot,
  setSelectedCinemaId,
  selectedDate,
  selectedCinema,
  selectedSlot,
  selectedCinemaId,
}: ICinemaProps) => {

  const mode = useThemeStore((s) => s.mode);
  const dark = mode === "dark";
  const [now, setNow] = useState(() => new Date());

  /* Generate next 7 days */
  const dates = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      return {
        label: d.toLocaleDateString("en-US", {
          weekday: "short",
          day: "numeric",
        }),
        value: d.toISOString().split("T")[0],
      };
    });
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      setNow(new Date());
    }, 30000);
    return () => window.clearInterval(id);
  }, []);

  const parseSlotToDate = (dateStr: string, slot: string) => {
    const [time, periodRaw] = slot.trim().split(" ");
    if (!time || !periodRaw) return null;
    const [hhRaw, mmRaw] = time.split(":");
    const hoursRaw = Number.parseInt(hhRaw, 10);
    const minutes = Number.parseInt(mmRaw ?? "0", 10);
    if (!Number.isFinite(hoursRaw) || !Number.isFinite(minutes)) return null;

    const period = periodRaw.toUpperCase();
    let hours = hoursRaw % 12;
    if (period === "PM") hours += 12;

    const [y, m, d] = dateStr.split("-").map((n) => Number.parseInt(n, 10));
    if (!Number.isFinite(y) || !Number.isFinite(m) || !Number.isFinite(d)) return null;
    return new Date(y, m - 1, d, hours, minutes, 0, 0);
  };

  const isSlotDisabled = (dateStr: string, slot: string) => {
    const todayISO = new Date().toISOString().split("T")[0];
    if (dateStr < todayISO) return true;
    if (dateStr > todayISO) return false;

    const slotTime = parseSlotToDate(dateStr, slot);
    if (!slotTime) return false;
    const cutoff = new Date(now.getTime() + 15 * 60 * 1000);
    return slotTime.getTime() <= cutoff.getTime();
  };

  useEffect(() => {
    if (!selectedDate || !selectedSlot || !selectedCinema || !selectedCinemaId) return;
    if (isSlotDisabled(selectedDate, selectedSlot)) {
      setSelectedSlot(null);
    }
  }, [now, selectedDate, selectedSlot, selectedCinema, selectedCinemaId, setSelectedSlot]);

  return (
    <div className="space-y-8 sm:space-y-12">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
      >
        <h2 className={`mb-3 text-lg font-medium sm:mb-4 ${dark ? "text-zinc-100" : "text-gray-900"}`}>
          Select Date
        </h2>

        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 no-scrollbar">
          {dates.map((d) => (
            <button
              key={d.value}
              onClick={() => {
                setSelectedDate(d.value);
                setSelectedCinema(null);
                setSelectedCinemaId(null);
                setSelectedSlot(null);
              }}
              className={`min-w-[78px] rounded-xl border px-2 py-3 text-sm font-medium transition cursor-pointer
                                    ${
                                      selectedDate === d.value
                                        ? dark
                                          ? "border-indigo-400 bg-zinc-900 text-zinc-100 ring-1 ring-indigo-300/60"
                                          : "border-gray-900 bg-gray-900 text-white"
                                        : dark
                                          ? "border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
                                          : "border-gray-200 bg-white text-gray-700 hover:bg-gray-100"
                }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* 🎥 CINEMA + SLOTS */}
      {selectedDate && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className={`mb-3 text-lg font-medium sm:mb-4 ${dark ? "text-zinc-100" : "text-gray-900"}`}>
            Select Cinema & Time
          </h2>

          <div className="space-y-4 sm:space-y-6">
            {cinemas.map((cinema) => (
              <div
                key={cinema.id}
                className={`rounded-2xl border p-4 sm:p-5 ${
                  dark ? "border-zinc-700 bg-zinc-900" : "border-gray-200 bg-white"
                }`}
              >
                <p className={`mb-4 font-medium ${dark ? "text-zinc-100" : "text-gray-900"}`}>
                  {cinema.name}
                </p>

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
                  {cinema.slots.map((slot) => {
                    const disabled = selectedDate ? isSlotDisabled(selectedDate, slot) : false;
                    const isSelected =
                      selectedSlot === slot &&
                      selectedCinema === cinema.name &&
                      selectedCinemaId === cinema.id;

                    return (
                      <button
                        key={slot}
                        disabled={disabled}
                        onClick={() => {
                          if (disabled) return;
                          setSelectedCinemaId(cinema.id);
                          setSelectedCinema(cinema.name);
                          setSelectedSlot(slot);
                        }}
                        className={`rounded-lg border px-2 py-2.5 text-sm font-medium transition
                          ${
                            disabled
                              ? dark
                                ? "cursor-not-allowed border-zinc-800 bg-zinc-950 text-zinc-500 opacity-60"
                                : "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400 opacity-70"
                              : isSelected
                                ? dark
                                  ? "border-indigo-400 bg-zinc-900 text-zinc-100 ring-1 ring-indigo-300/60"
                                  : "border-gray-900 bg-gray-900 text-white"
                                : dark
                                  ? "cursor-pointer border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
                                  : "cursor-pointer border-gray-200 bg-white text-gray-700 hover:bg-gray-100"
                          }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Cinemas;
