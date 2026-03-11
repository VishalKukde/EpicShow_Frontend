import { useThemeStore } from "@/store/themeStore";
import { motion } from "framer-motion";
import { useMemo } from "react";

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
                  {cinema.slots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => {
                        setSelectedCinemaId(cinema.id);
                        setSelectedCinema(cinema.name);
                        setSelectedSlot(slot);
                      }}
                      className={`rounded-lg border px-2 py-2.5 text-sm font-medium transition cursor-pointer
                                             ${selectedSlot === slot &&
                          selectedCinema === cinema.name &&
                          selectedCinemaId === cinema.id
                          ? dark
                            ? "border-indigo-400 bg-zinc-900 text-zinc-100 ring-1 ring-indigo-300/60"
                            : "border-gray-900 bg-gray-900 text-white"
                          : dark
                            ? "border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
                            : "border-gray-200 bg-white text-gray-700 hover:bg-gray-100"
                        }`}
                    >
                      {slot}
                    </button>
                  ))}
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
