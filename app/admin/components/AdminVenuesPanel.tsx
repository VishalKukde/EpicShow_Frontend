"use client";

import { useEffect, useMemo, useState } from "react";
import { Armchair, Clapperboard, Plane, Train, Trophy } from "lucide-react";
import { apiFetch } from "@/lib/api";
import type { SeatRow } from "@/types/Seat";

type VenueCategory = "movie" | "sport" | "flight" | "train";

type MovieSeatLayout = {
  id: string;
  name: string;
  cinemaId: string;
  seats: SeatRow[];
};

type MovieSeatLayoutsPayload = {
  data: MovieSeatLayout[];
};

const categories: {
  key: VenueCategory;
  label: string;
  icon: typeof Clapperboard;
}[] = [
  { key: "movie", label: "Movie", icon: Clapperboard },
  { key: "sport", label: "Sport", icon: Trophy },
  { key: "flight", label: "Flight", icon: Plane },
  { key: "train", label: "Train", icon: Train },
];

const hiddenSeatIndexes = new Set([0, 1, 9, 10, 18, 19]);

function isSeatHidden(row: string, seatIndex: number) {
  return ["A", "B", "C", "D"].includes(row) && hiddenSeatIndexes.has(seatIndex);
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function AdminVenuesPanel() {
  const [activeCategory, setActiveCategory] = useState<VenueCategory>("movie");
  const [layouts, setLayouts] = useState<MovieSeatLayout[]>([]);
  const [activeCinemaId, setActiveCinemaId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    apiFetch("/seat-layouts/movie", { notifyOnError: false, publicRequest: true })
      .then((payload: MovieSeatLayoutsPayload) => {
        if (!mounted) return;
        const movieLayouts = Array.isArray(payload?.data) ? payload.data : [];
        setLayouts(movieLayouts);
        setActiveCinemaId((current) => current || movieLayouts[0]?.cinemaId || "");
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : "Failed to load venue seat layouts");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const activeLayout = useMemo(
    () => layouts.find((layout) => layout.cinemaId === activeCinemaId) || layouts[0],
    [activeCinemaId, layouts]
  );

  const activeStats = useMemo(() => {
    if (!activeLayout) return { seats: 0, rows: 0, minPrice: 0, maxPrice: 0 };

    const prices = activeLayout.seats.flatMap((row) => row.seats.map((seat) => seat.price));

    return {
      seats: activeLayout.seats.reduce((sum, row) => sum + row.seats.length, 0),
      rows: activeLayout.seats.length,
      minPrice: prices.length ? Math.min(...prices) : 0,
      maxPrice: prices.length ? Math.max(...prices) : 0,
    };
  }, [activeLayout]);

  return (
    <section style={{ display: "grid", gap: 16 }}>
      <div style={{ background: "var(--admin-surface)", border: "1px solid var(--admin-border)", borderRadius: 20, padding: 18, boxShadow: "0 18px 50px rgba(15,13,26,.06)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div>
            <p style={{ margin: 0, color: "#4F46E5", fontSize: 11, fontWeight: 900, letterSpacing: ".08em", textTransform: "uppercase" }}>Venue layouts</p>
            <h2 style={{ margin: "7px 0 0", color: "var(--admin-text)", fontSize: 20, fontWeight: 950, letterSpacing: "-.04em" }}>Seat layout preview</h2>
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {categories.map((category) => {
              const Icon = category.icon;
              const active = activeCategory === category.key;

              return (
                <button
                  key={category.key}
                  type="button"
                  onClick={() => setActiveCategory(category.key)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 7,
                    border: active ? "1px solid rgba(79,70,229,.6)" : "1px solid var(--admin-border)",
                    background: active ? "rgba(79,70,229,.12)" : "var(--admin-bg)",
                    color: active ? "#4338CA" : "var(--admin-text-secondary)",
                    borderRadius: 999,
                    padding: "8px 11px",
                    fontSize: 12,
                    fontWeight: 900,
                    cursor: "pointer",
                  }}
                >
                  <Icon size={15} />
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {activeCategory === "movie" ? (
        <div style={{ background: "var(--admin-surface)", border: "1px solid var(--admin-border)", borderRadius: 20, padding: 18, boxShadow: "0 18px 50px rgba(15,13,26,.06)" }}>
          {loading ? (
            <VenueState title="Loading movie theaters" text="Fetching seat layouts from the backend." />
          ) : error ? (
            <VenueState title="Seat layout unavailable" text={error} />
          ) : layouts.length === 0 ? (
            <VenueState title="No movie theaters found" text="Add movie seat layouts in the backend to preview them here." />
          ) : (
            <>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {layouts.map((layout) => {
                    const active = layout.cinemaId === activeLayout?.cinemaId;

                    return (
                      <button
                        key={layout.cinemaId}
                        type="button"
                        onClick={() => setActiveCinemaId(layout.cinemaId)}
                        style={{
                          border: active ? "1px solid rgba(16,185,129,.55)" : "1px solid var(--admin-border)",
                          background: active ? "rgba(16,185,129,.12)" : "var(--admin-bg)",
                          color: active ? "#047857" : "var(--admin-text)",
                          borderRadius: 999,
                          padding: "8px 12px",
                          fontSize: 12,
                          fontWeight: 900,
                          cursor: "pointer",
                        }}
                      >
                        {layout.name}
                      </button>
                    );
                  })}
                </div>

                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", color: "var(--admin-text-secondary)", fontSize: 12, fontWeight: 800 }}>
                  <span>{activeStats.rows} rows</span>
                  <span>{activeStats.seats} seats</span>
                  <span>{formatCurrency(activeStats.minPrice)}-{formatCurrency(activeStats.maxPrice)}</span>
                </div>
              </div>

              {activeLayout ? <MovieLayoutPreview layout={activeLayout} /> : null}
            </>
          )}
        </div>
      ) : (
        <div style={{ background: "var(--admin-surface)", border: "1px solid var(--admin-border)", borderRadius: 20, padding: 18, boxShadow: "0 18px 50px rgba(15,13,26,.06)" }}>
          <VenueState
            title={`${categories.find((category) => category.key === activeCategory)?.label} layout coming next`}
            text="Only movie seat layouts are available from the backend right now. This tab is ready for its category endpoint."
          />
        </div>
      )}
    </section>
  );
}

function MovieLayoutPreview({ layout }: { layout: MovieSeatLayout }) {
  return (
    <div>
      <div style={{ marginBottom: 16, borderRadius: 12, border: "1px solid rgba(99,102,241,.25)", background: "linear-gradient(90deg, rgba(99,102,241,.14), rgba(14,165,233,.08))", padding: "12px 14px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div>
            <p style={{ margin: 0, color: "var(--admin-text)", fontSize: 15, fontWeight: 950 }}>{layout.name}</p>
            <p style={{ margin: "3px 0 0", color: "var(--admin-text-secondary)", fontSize: 12, fontWeight: 800 }}>Cinema ID: {layout.cinemaId}</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#4F46E5", fontSize: 12, fontWeight: 900 }}>
            <Armchair size={16} />
            Backend layout
          </div>
        </div>
      </div>

      <div style={{ overflowX: "auto", border: "1px solid var(--admin-border)", borderRadius: 14, background: "var(--admin-bg)", padding: 14 }}>
        <div style={{ margin: "0 auto 18px", height: 8, width: "min(520px, 78vw)", borderRadius: 999, background: "linear-gradient(90deg, rgba(79,70,229,.18), rgba(14,165,233,.5), rgba(79,70,229,.18))", boxShadow: "0 14px 35px rgba(14,165,233,.22)" }} />

        <div style={{ display: "grid",alignItems: "center", justifyContent: "center", gap: 9, minWidth: 720, padding: 18 }}>
          {layout.seats.map((row) => (
            <div key={row.row} style={{ display: "grid", gridTemplateColumns: "34px max-content", alignItems: "center", gap: 12 }}>
              <span style={{ display: "inline-flex", height: 28, width: 28, alignItems: "center", justifyContent: "center", borderRadius: 8, border: "1px solid var(--admin-border)", background: "var(--admin-surface)", color: "var(--admin-text)", fontSize: 12, fontWeight: 950 }}>
                {row.row}
              </span>
              <div style={{ display: "flex", gap: 8 }}>
                {row.seats.map((seat, seatIndex) => {
                  if (isSeatHidden(row.row, seatIndex)) {
                    return <span key={seat.id} style={{ height: 26, width: 26 }} />;
                  }

                  return (
                    <span
                      key={seat.id}
                      title={`${seat.id} - ${formatCurrency(seat.price)}`}
                      style={{
                        display: "inline-flex",
                        height: 26,
                        width: 26,
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 6,
                        border: "1px solid rgba(15,23,42,.18)",
                        background: "#FFFFFF",
                        color: "#334155",
                        fontSize: 10,
                        fontWeight: 850,
                        marginRight: seatIndex === 4 || seatIndex === 14 ? 22 : 0,
                      }}
                    >
                      {seat.number}
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function VenueState({ title, text }: { title?: string; text: string }) {
  return (
    <div style={{ display: "grid", minHeight: 240, placeItems: "center", border: "1px dashed var(--admin-border)", borderRadius: 16, background: "var(--admin-bg)", padding: 24, textAlign: "center" }}>
      <div>
        <p style={{ margin: 0, color: "var(--admin-text)", fontSize: 15, fontWeight: 950 }}>{title}</p>
        <p style={{ margin: "7px auto 0", maxWidth: 460, color: "var(--admin-text-secondary)", fontSize: 13, fontWeight: 700 }}>{text}</p>
      </div>
    </div>
  );
}
