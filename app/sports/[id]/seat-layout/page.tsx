"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { X } from "lucide-react";
import PageTransition from "@/app/components/PageTransition";
import { Seat, SeatRow } from "@/types/Seat";
import { toast } from "@/lib/toast";
import { useBookingStore } from "@/store/bookingStore";
import { useAuth } from "@/context/AuthContext";
import { getSportMatchById, toSportBookingItem } from "@/app/sports/data";
import { useThemeStore } from "@/store/themeStore";

const DEFAULT_PRICES = {
  standard: 320,
  premium: 420,
  vip: 520,
};

type StandTier = keyof typeof DEFAULT_PRICES;

type Stand = {
  id: string;
  label: string;
  shortLabel: string;
  tier: StandTier;
  code: string;
  rows: number;
  seatsPerRow: number;
  angle: number;
};

const STAND_ROWS = 4;
const STAND_SEATS = 20;

const STANDS: Stand[] = [
  {
    id: "stand-a",
    label: "Stand A",
    shortLabel: "A",
    tier: "premium",
    code: "A",
    rows: STAND_ROWS,
    seatsPerRow: STAND_SEATS,
    angle: 0,
  },
  {
    id: "stand-b",
    label: "Stand B",
    shortLabel: "B",
    tier: "vip",
    code: "B",
    rows: STAND_ROWS,
    seatsPerRow: STAND_SEATS,
    angle: 45,
  },
  {
    id: "stand-c",
    label: "Stand C",
    shortLabel: "C",
    tier: "standard",
    code: "C",
    rows: STAND_ROWS,
    seatsPerRow: STAND_SEATS,
    angle: 90,
  },
  {
    id: "stand-d",
    label: "Stand D",
    shortLabel: "D",
    tier: "standard",
    code: "D",
    rows: STAND_ROWS,
    seatsPerRow: STAND_SEATS,
    angle: 135,
  },
  {
    id: "stand-e",
    label: "Stand E",
    shortLabel: "E",
    tier: "premium",
    code: "E",
    rows: STAND_ROWS,
    seatsPerRow: STAND_SEATS,
    angle: 180,
  },
  {
    id: "stand-f",
    label: "Stand F",
    shortLabel: "F",
    tier: "vip",
    code: "F",
    rows: STAND_ROWS,
    seatsPerRow: STAND_SEATS,
    angle: 225,
  },
  {
    id: "stand-g",
    label: "Stand G",
    shortLabel: "G",
    tier: "standard",
    code: "G",
    rows: STAND_ROWS,
    seatsPerRow: STAND_SEATS,
    angle: 270,
  },
  {
    id: "stand-h",
    label: "Stand H",
    shortLabel: "H",
    tier: "standard",
    code: "H",
    rows: STAND_ROWS,
    seatsPerRow: STAND_SEATS,
    angle: 315,
  },
];

const buildStandLayout = (
  stand: Stand,
  prices: typeof DEFAULT_PRICES
): SeatRow[] => {
  const rows = Array.from({ length: stand.rows }, (_, index) =>
    String.fromCharCode(65 + index)
  );

  return rows.map((row, rowIndex) => {
    const seats: Seat[] = Array.from(
      { length: stand.seatsPerRow },
      (_, seatIndex) => {
        const number = seatIndex + 1;
        const seed =
          stand.code.charCodeAt(0) * 17 + rowIndex * 11 + seatIndex * 7;
        let status: Seat["status"] = "available";

        if (seed % 9 === 0) status = "sold";
        else if (seed % 13 === 0) status = "locked";

        return {
          id: `${stand.code}${row}${number}`,
          number,
          price: prices[stand.tier],
          status,
        };
      }
    );

    return {
      row,
      seats,
    };
  });
};

const buildStandLayouts = (prices: typeof DEFAULT_PRICES) =>
  STANDS.reduce<Record<string, SeatRow[]>>((acc, stand) => {
    acc[stand.id] = buildStandLayout(stand, prices);
    return acc;
  }, {});

export default function SportSeatLayout() {
  const router = useRouter();
  const { id } = useParams();
  const match = getSportMatchById(String(id));
  const { user, loading } = useAuth();
  const mode = useThemeStore((s) => s.mode);
  const dark = mode === "dark";

  const booking = useBookingStore();
  const setItem = useBookingStore((s) => s.setItem);
  const setShow = useBookingStore((s) => s.setShow);
  const setSelectedSeats = useBookingStore((s) => s.setSeats);

  const [standLayouts, setStandLayouts] = useState<Record<string, SeatRow[]>>(
    () => buildStandLayouts(match?.prices ?? DEFAULT_PRICES)
  );
  const [activeStandId, setActiveStandId] = useState<string | null>(null);

  useEffect(() => {
    if (!match) return;
    setStandLayouts(buildStandLayouts(match.prices));
  }, [match]);

  useEffect(() => {
    if (!match) return;
    if (
      booking.type !== "sport" ||
      booking.item?._id !== match._id ||
      !booking.venueId ||
      !booking.date ||
      !booking.slot
    ) {
      setItem("sport", toSportBookingItem(match));
      setShow(match.venueId, match.venue, match.date, match.time);
    }
  }, [
    match,
    booking.item?._id,
    booking.type,
    booking.venueId,
    booking.date,
    booking.slot,
    setItem,
    setShow,
  ]);

  useEffect(() => {
    const root = document.documentElement;
    const update = () => {
      const isSmall = window.matchMedia("(max-width: 639px)").matches;
      if (isSmall) {
        root.style.setProperty("--app-toast-top", "1rem");
        root.style.setProperty("--app-toast-timer", "3000");
        root.style.removeProperty("--app-toast-bottom");
      } else {
        root.style.removeProperty("--app-toast-top");
        root.style.removeProperty("--app-toast-timer");
      }
    };

    update();
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("resize", update);
      root.style.removeProperty("--app-toast-top");
      root.style.removeProperty("--app-toast-timer");
    };
  }, []);

  const selectedSeats = useMemo(
    () =>
      Object.values(standLayouts)
        .flatMap((rows) => rows.flatMap((row) => row.seats))
        .filter((seat) => seat.status === "selected"),
    [standLayouts]
  );

  const totalPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

  useEffect(() => {
    setSelectedSeats(selectedSeats, totalPrice);
  }, [selectedSeats, totalPrice, setSelectedSeats]);

  const toggleSeat = (standId: string, rowIndex: number, seatIndex: number) => {
    if (loading) return;
    if (!user) {
      router.push(`/login?redirect=${window.location.pathname}`);
      return;
    }

    const layout = standLayouts[standId];
    if (!layout) return;

    const seat = layout[rowIndex].seats[seatIndex];
    if (seat.status === "sold" || seat.status === "locked") return;

    const isUnlocking = seat.status === "selected";
    const selectedCount = selectedSeats.length;

    if (!isUnlocking && selectedCount >= 2) {
      toast.warning("You can select a maximum of 2 seats.");
      return;
    }

    setStandLayouts((prev) => ({
      ...prev,
      [standId]: prev[standId].map((row, rIndex) =>
        rIndex !== rowIndex
          ? row
          : {
              ...row,
              seats: row.seats.map((s, sIndex) =>
                sIndex === seatIndex
                  ? {
                      ...s,
                      status: isUnlocking ? "available" : "selected",
                    }
                  : s
              ),
            }
      ),
    }));
  };

  const goToReviewBooking = () => {
    if (selectedSeats.length === 0) {
      toast.warning("Please select at least one seat before continuing.");
      return;
    }
    if (selectedSeats.length > 2) {
      toast.warning("You can select a maximum of 2 seats.");
      return;
    }

    setSelectedSeats(selectedSeats, totalPrice);
    router.push(`/sports/${booking.item?._id ?? match?._id}/review`);
  };

  if (!match) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Match not found</p>
      </div>
    );
  }

  const activeStand = STANDS.find((stand) => stand.id === activeStandId) || null;
  const activeLayout = activeStand ? standLayouts[activeStand.id] : null;
  const getStandOccupancy = (standId: string) => {
    const seats = standLayouts[standId]?.flatMap((row) => row.seats) ?? [];
    const total = seats.length || 1;
    const filled = seats.filter((seat) => seat.status !== "available").length;
    return {
      total,
      filled,
      ratio: filled / total,
    };
  };
  const segmentAngle = 360 / STANDS.length;
  const arcGap = 3;
  const arcRadius = 432;
  const arcStroke = 96;
  const seatRowOffsets = [
    arcStroke / 2.8,
    arcStroke / 6,
    -arcStroke / 6,
    -arcStroke / 2.8,
  ];
  const seatArcInset = 2;

  const polarToCartesian = (cx: number, cy: number, r: number, angleDeg: number) => {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad),
    };
  };

  const describeArc = (
    cx: number,
    cy: number,
    r: number,
    startAngle: number,
    endAngle: number,
    sweepFlag: 0 | 1
  ) => {
    const start = polarToCartesian(cx, cy, r, startAngle);
    const end = polarToCartesian(cx, cy, r, endAngle);
    const delta = Math.abs(endAngle - startAngle);
    const largeArc = delta <= 180 ? 0 : 1;
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} ${sweepFlag} ${end.x} ${end.y}`;
  };

  const tierHue: Record<StandTier, number> = {
    vip: 28,
    premium: 150,
    standard: 210,
  };

  const getStandArcColor = (tier: StandTier, ratio: number) => {
    const hue = tierHue[tier];
    const saturation = dark ? 42 : 38;
    const lightness = dark ? 50 + ratio * 6 : 90 - ratio * 6;
    const alpha = dark ? 0.8 : 0.95;
    return `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
  };

  return (
    <PageTransition>
      <div className="relative bg-background sm:px-10 pt-18 pb-20 select-none">
        <div className="mx-auto max-w-5xl px-4">
          <div className="text-center space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">
              Stadium Map
            </p>
            <h2 className={`text-2xl font-semibold ${dark ? "text-zinc-100" : "text-slate-900"}`}>
              {match.teamA} vs {match.teamB}
            </h2>
            <p className={`text-sm ${dark ? "text-zinc-400" : "text-slate-600"}`}>
              Tap a stand to choose your seats. Max 2 seats per booking.
            </p>
          </div>

          <div className="mt-10 flex items-center justify-center">
            <div className="relative w-full max-w-[400px] sm:max-w-[520px] aspect-square">
              <svg
                className="absolute inset-0 z-10 overflow-visible"
                viewBox="0 0 1000 1000"
                aria-hidden="true"
              >
                {STANDS.map((stand) => {
                  const startAngle = stand.angle - segmentAngle / 2 + arcGap / 2;
                  const endAngle = stand.angle + segmentAngle / 2 - arcGap / 2;
                  const arcPath = describeArc(500, 500, arcRadius, startAngle, endAngle, 1);
                  const occupancy = getStandOccupancy(stand.id);
                  const isActive = activeStandId === stand.id;
                  const seatStroke = "rgba(255,255,255,0.55)";

                  return (
                    <g key={stand.id}>
                      <path
                        d={arcPath}
                        fill="none"
                        stroke={getStandArcColor(stand.tier, occupancy.ratio)}
                        strokeWidth={arcStroke}
                        strokeLinecap="butt"
                        onClick={() => setActiveStandId(stand.id)}
                        style={{
                          cursor: "pointer",
                          opacity: isActive ? 1 : 0.9,
                          filter: isActive ? "drop-shadow(0 0 12px rgba(16,185,129,0.35))" : "none",
                        }}
                      />
                      {seatRowOffsets.map((offset, rowIndex) => {
                        const seatPath = describeArc(
                          500,
                          500,
                          arcRadius + offset,
                          startAngle + seatArcInset,
                          endAngle - seatArcInset,
                          1
                        );
                        return (
                          <path
                            key={`${stand.id}-seats-${rowIndex}`}
                            d={seatPath}
                            fill="none"
                            stroke={seatStroke}
                            strokeWidth={6}
                            strokeDasharray="6 9"
                            strokeLinecap="square"
                            pointerEvents="none"
                            opacity={0.85 - rowIndex * 0.12}
                          />
                        );
                      })}
                    </g>
                  );
                })}
              </svg>
              <div
                className={`absolute inset-[1%] rounded-full border-[0.5px] z-0 ${
                  dark
                    ? "border-zinc-700 bg-zinc-900/60"
                    : "border-slate-200 bg-white"
                } shadow-inner`}
              />
              <div
                className={`absolute inset-[12%] rounded-full border-2 border-dashed z-10 pointer-events-none ${
                  dark ? "border-emerald-500/40" : "border-emerald-500/50"
                }`}
              >
                <div
                  className="absolute inset-2 rounded-full"
                  style={{
                    background: dark
                      ? "radial-gradient(circle at 30% 30%, rgba(16,185,129,0.25), rgba(15,23,42,0) 60%), radial-gradient(circle at 70% 70%, rgba(16,185,129,0.18), rgba(15,23,42,0) 60%), linear-gradient(180deg, rgba(16,185,129,0.08), rgba(16,185,129,0.02))"
                      : "radial-gradient(circle at 30% 30%, rgba(16,185,129,0.35), rgba(16,185,129,0.05) 60%), radial-gradient(circle at 70% 70%, rgba(16,185,129,0.25), rgba(16,185,129,0.05) 60%), linear-gradient(180deg, rgba(16,185,129,0.12), rgba(16,185,129,0.02))",
                  }}
                />
                <div
                  className="absolute inset-4 rounded-full opacity-80"
                  style={{
                    background: dark
                      ? "repeating-linear-gradient(90deg, rgba(16,185,129,0.08) 0px, rgba(16,185,129,0.08) 10px, rgba(16,185,129,0.02) 10px, rgba(16,185,129,0.02) 20px)"
                      : "repeating-linear-gradient(90deg, rgba(16,185,129,0.18) 0px, rgba(16,185,129,0.18) 10px, rgba(16,185,129,0.06) 10px, rgba(16,185,129,0.06) 20px)",
                  }}
                />
                <div
                  className={`absolute inset-[28%] rounded-full border ${
                    dark ? "border-emerald-400/20" : "border-emerald-400/40"
                  }`}
                />
                <div
                  className={`absolute inset-[40%] rounded-full border ${
                    dark ? "border-emerald-300/25" : "border-emerald-300/50"
                  }`}
                />
                <div
                  className={`absolute left-1/2 top-1/2 h-[24%] w-[10%] -translate-x-1/2 -translate-y-1/2 rounded-[9px] border ${
                    dark
                      ? "border-amber-200/45 bg-amber-200/10"
                      : "border-amber-300/80 bg-amber-100"
                  } shadow-inner`}
                >
                  <div
                    className={`absolute inset-x-2 top-[20%] h-px ${
                      dark ? "bg-amber-200/55" : "bg-amber-300/90"
                    }`}
                  />
                  <div
                    className={`absolute inset-x-2 bottom-[20%] h-px ${
                      dark ? "bg-amber-200/55" : "bg-amber-300/90"
                    }`}
                  />
                  <div className="absolute left-1/2 top-[12%] -translate-x-1/2 flex items-end gap-1">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={`top-stump-${i}`}
                        className={`block h-3 w-[2px] rounded-full ${
                          dark ? "bg-amber-200/70" : "bg-amber-300/90"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="absolute left-1/2 bottom-[12%] -translate-x-1/2 flex items-end gap-1">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={`bottom-stump-${i}`}
                        className={`block h-3 w-[2px] rounded-full ${
                          dark ? "bg-amber-200/70" : "bg-amber-300/90"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Stand selection handled by clickable arc segments */}
            </div>
          </div>
        </div>

        {activeStand && activeLayout && (
          <StandSeatModal
            stand={activeStand}
            layout={activeLayout}
            price={match.prices[activeStand.tier]}
            selectedSeats={selectedSeats}
            totalPrice={totalPrice}
            onClose={() => setActiveStandId(null)}
            onToggle={(rowIndex, seatIndex) =>
              toggleSeat(activeStand.id, rowIndex, seatIndex)
            }
            onProceed={goToReviewBooking}
          />
        )}
      </div>
    </PageTransition>
  );
}

function StandSeatModal({
  stand,
  layout,
  price,
  selectedSeats,
  totalPrice,
  onClose,
  onToggle,
  onProceed,
}: {
  stand: Stand;
  layout: SeatRow[];
  price: number;
  selectedSeats: Seat[];
  totalPrice: number;
  onClose: () => void;
  onToggle: (rowIndex: number, seatIndex: number) => void;
  onProceed: () => void;
}) {
  const mode = useThemeStore((s) => s.mode);
  const dark = mode === "dark";
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-10"
      onClick={handleBackdropClick}
    >
      <div
        className={`w-full max-w-3xl rounded-3xl border p-4 shadow-2xl sm:p-5 ${
          dark ? "border-zinc-700 bg-zinc-900" : "border-slate-200 bg-white"
        }`}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className={`text-xs font-semibold uppercase tracking-[0.3em] ${dark ? "text-emerald-300" : "text-emerald-600"}`}>
              {stand.label}
            </p>
            <h3 className={`mt-2 text-lg font-semibold ${dark ? "text-zinc-100" : "text-slate-900"}`}>
              Choose your seats
            </h3>
            <p className={`mt-1 text-sm ${dark ? "text-zinc-400" : "text-slate-600"}`}>
              Seats in this stand are priced at ₹{price}.
            </p>
          </div>
          <button
            onClick={onClose}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-full border transition cursor-pointer ${
              dark
                ? "border-zinc-700 text-zinc-200 hover:bg-zinc-800"
                : "border-slate-200 text-slate-700 hover:bg-slate-100"
            }`}
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <div className="mt-6 space-y-3 overflow-x-auto py-2">
          {layout.map((row, rowIndex) => (
            <div key={row.row} className="flex items-center gap-2">
              <span className={`w-10 text-[10px] font-mono ${dark ? "text-zinc-400" : "text-slate-500"}`}>
                {stand.shortLabel}-{row.row}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {row.seats.map((seat, seatIndex) => (
                  <button
                    key={seat.id}
                    onClick={() => onToggle(rowIndex, seatIndex)}
                    disabled={seat.status === "sold" || seat.status === "locked"}
                    className={`h-6 w-6 rounded-md text-[9px] font-semibold transition cursor-pointer ${
                      seat.status === "sold"
                        ? dark
                          ? "bg-zinc-800 border border-zinc-600 text-zinc-300 cursor-not-allowed"
                          : "bg-gray-200 border border-gray-300 text-gray-700 cursor-not-allowed"
                        : seat.status === "locked"
                          ? dark
                            ? "bg-amber-900/40 border border-amber-500 text-amber-300 cursor-not-allowed"
                            : "bg-amber-100 border border-amber-400 text-amber-700 cursor-not-allowed"
                          : seat.status === "selected"
                            ? "bg-emerald-600 text-white ring-1 ring-emerald-400"
                            : dark
                              ? "bg-zinc-900 border border-zinc-600 text-zinc-200 hover:bg-zinc-800"
                              : "bg-black border border-black text-white hover:bg-zinc-800"
                    }`}
                  >
                    <span className="relative inline-flex h-full w-full items-center justify-center">
                      {seat.status !== "sold" && seat.number}
                      {seat.status === "sold" && (
                        <span className="pointer-events-none absolute inset-[2px]">
                          <span className="absolute left-1/2 top-1/2 h-[1px] w-full -translate-x-1/2 -translate-y-1/2 rotate-45 bg-rose-500/90" />
                          <span className="absolute left-1/2 top-1/2 h-[1px] w-full -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-rose-500/90" />
                        </span>
                      )}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div
            className={`inline-flex flex-wrap items-center gap-4 rounded-2xl border px-4 py-2 text-xs font-medium ${
              dark
                ? "border-zinc-700 bg-zinc-900 text-zinc-200"
                : "border-gray-200 bg-white text-gray-700"
            }`}
          >
            <Legend
              color="bg-black"
              border={dark ? "border border-zinc-700" : "border border-black"}
              label="Available"
            />
            <Legend color="bg-emerald-600" label="Selected" />
            <Legend
              color={dark ? "bg-amber-900/60" : "bg-amber-200"}
              border={dark ? "border border-amber-500" : "border border-amber-500"}
              label="Locked"
            />
            <Legend
              color={dark ? "bg-zinc-700" : "bg-gray-300"}
              border={dark ? "border border-zinc-600" : "border border-gray-400"}
              label="Sold"
              cross
            />
          </div>

          <div
            className={`flex flex-wrap items-center gap-4 transition-opacity ${
              selectedSeats.length > 0 ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            style={{ minHeight: "40px" }}
          >
            <div className={`text-sm ${dark ? "text-zinc-200" : "text-slate-900"}`}>
              <p className="font-semibold">{selectedSeats.length} seat(s)</p>
              <p className={`${dark ? "text-zinc-400" : "text-slate-600"}`}>
                ₹ {totalPrice}
              </p>
            </div>
            <button
              className={`px-6 py-3 rounded-xl font-medium transition cursor-pointer ${
                dark
                  ? "bg-emerald-500 text-white hover:bg-emerald-400"
                  : "bg-gray-900 text-white hover:bg-gray-800"
              }`}
              onClick={onProceed}
            >
              Proceed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Legend({
  color,
  label,
  border,
  cross,
}: {
  color: string;
  label: string;
  border?: string;
  cross?: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className={`relative h-3 w-3 rounded-sm ${color} ${border ?? ""}`}>
        {cross && (
          <>
            <span className="absolute inset-[2px]">
              <span className="absolute left-1/2 top-1/2 h-px w-full -translate-x-1/2 -translate-y-1/2 rotate-45 bg-rose-500/90" />
              <span className="absolute left-1/2 top-1/2 h-px w-full -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-rose-500/90" />
            </span>
          </>
        )}
      </span>
      <span>{label}</span>
    </span>
  );
}
