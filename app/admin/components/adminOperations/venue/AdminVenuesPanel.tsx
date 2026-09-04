"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Armchair, Clapperboard, Plane, Train, Trophy, Grid, Sparkles, Tag, Layers, CheckCircle2 } from "lucide-react";
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
        { key: "movie", label: "Movie Cinema", icon: Clapperboard },
        { key: "sport", label: "Stadium Arena", icon: Trophy },
        { key: "train", label: "Express Train", icon: Train },
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

function formatInteger(val: number) {
    return new Intl.NumberFormat("en-IN").format(Math.floor(val || 0));
}

function ModernVenueKpiCard({
    accent,
    icon,
    label,
    sublabel,
    value,
}: {
    accent: string;
    icon: ReactNode;
    label: string;
    sublabel: string;
    value: string;
}) {
    return (
        <div
            className="admin-kpi-card select-none"
            style={{
                background: "var(--admin-surface)",
                border: "1px solid var(--admin-border)",
                borderRadius: 16,
                padding: "14px 16px",
                minHeight: 96,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow: "0 10px 28px rgba(15,13,26,.035)",
                transition: "all 0.2s ease",
            }}
        >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span
                    style={{
                        color: "var(--admin-text-muted)",
                        fontSize: 10.5,
                        fontWeight: 800,
                        letterSpacing: ".06em",
                        textTransform: "uppercase",
                    }}
                >
                    {label}
                </span>
                <div
                    style={{
                        width: 28,
                        height: 28,
                        borderRadius: 9,
                        background: `${accent}18`,
                        color: accent,
                        display: "grid",
                        placeItems: "center",
                    }}
                >
                    {icon}
                </div>
            </div>

            <div>
                <p
                    style={{
                        margin: "4px 0 0",
                        color: "var(--admin-text)",
                        fontSize: 19,
                        fontWeight: 900,
                        letterSpacing: "-.03em",
                        lineHeight: 1.1,
                    }}
                >
                    {value}
                </p>
                <p
                    style={{
                        margin: "3px 0 0",
                        color: "var(--admin-text-secondary)",
                        fontSize: 10.5,
                        fontWeight: 600,
                    }}
                >
                    {sublabel}
                </p>
            </div>
        </div>
    );
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
        if (!activeLayout) return { seats: 0, rows: 0, minPrice: 0, maxPrice: 0, uniquePrices: [] as number[] };

        const prices = activeLayout.seats.flatMap((row) => row.seats.map((seat) => seat.price));
        const unique = Array.from(new Set(prices)).sort((a, b) => a - b);

        return {
            seats: activeLayout.seats.reduce((sum, row) => sum + row.seats.length, 0),
            rows: activeLayout.seats.length,
            minPrice: prices.length ? Math.min(...prices) : 0,
            maxPrice: prices.length ? Math.max(...prices) : 0,
            uniquePrices: unique,
        };
    }, [activeLayout]);

    return (
        <section style={{ display: "grid", gap: 16, paddingBottom: 32 }} className="select-none">
            {/* Venue Header & Category Switcher */}
            <div
                style={{
                    background: "var(--admin-surface)",
                    border: "1px solid var(--admin-border)",
                    borderRadius: 18,
                    padding: "16px 20px",
                    boxShadow: "0 14px 40px rgba(15,13,26,.04)",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                    <div>
                        <span
                            style={{
                                color: "#6C63FF",
                                fontSize: 10.5,
                                fontWeight: 900,
                                letterSpacing: ".08em",
                                textTransform: "uppercase",
                            }}
                        >
                            Infrastructure Layout Engine
                        </span>
                        <h2 style={{ margin: "4px 0 0", color: "var(--admin-text)", fontSize: 20, fontWeight: 900, letterSpacing: "-.03em" }}>
                            Venue Seat Layout Previewer
                        </h2>
                        <p style={{ margin: "3px 0 0", color: "var(--admin-text-secondary)", fontSize: 12, fontWeight: 500 }}>
                            Inspect seat maps, row configurations, pricing tiers, and hall capacities.
                        </p>
                    </div>

                    {/* Category Tabs */}
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
                                        gap: 8,
                                        border: active ? "1px solid #6366F1" : "1px solid var(--admin-border)",
                                        background: active ? "#6366F1" : "var(--admin-soft)",
                                        color: active ? "#FFFFFF" : "var(--admin-text)",
                                        borderRadius: 10,
                                        padding: "8px 14px",
                                        fontSize: 12,
                                        fontWeight: 800,
                                        cursor: "pointer",
                                        boxShadow: active ? "0 4px 14px rgba(99, 102, 241, 0.3)" : "none",
                                        transition: "all 0.15s ease",
                                    }}
                                    className="cursor-pointer select-none"
                                >
                                    <Icon size={14} strokeWidth={2.4} />
                                    {category.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {activeCategory === "movie" ? (
                <div style={{ display: "grid", gap: 16 }}>
                    {/* KPI Metrics bar for active venue */}
                    {activeLayout && !loading && !error && (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 12 }}>
                            <ModernVenueKpiCard
                                label="Total Capacity"
                                value={`${formatInteger(activeStats.seats)} Seats`}
                                sublabel={`${activeStats.rows} configured seating rows`}
                                accent="#6C63FF"
                                icon={<Armchair size={16} />}
                            />
                            <ModernVenueKpiCard
                                label="Seating Rows"
                                value={`${activeStats.rows} Rows`}
                                sublabel={`Rows A through ${String.fromCharCode(64 + activeStats.rows)}`}
                                accent="#0EA5E9"
                                icon={<Layers size={16} />}
                            />
                            <ModernVenueKpiCard
                                label="Price Range"
                                value={`${formatCurrency(activeStats.minPrice)} - ${formatCurrency(activeStats.maxPrice)}`}
                                sublabel={`${activeStats.uniquePrices.length} distinct price tiers`}
                                accent="#10B981"
                                icon={<Tag size={16} />}
                            />
                            <ModernVenueKpiCard
                                label="Venue Status"
                                value="Operational"
                                sublabel="Live booking layout synchronized"
                                accent="#F59E0B"
                                icon={<CheckCircle2 size={16} />}
                            />
                        </div>
                    )}

                    {/* Main Cinema Layout Container */}
                    <div
                        style={{
                            background: "var(--admin-surface)",
                            border: "1px solid var(--admin-border)",
                            borderRadius: 18,
                            padding: 20,
                            boxShadow: "0 18px 50px rgba(15,13,26,.05)",
                        }}
                    >
                        {loading ? (
                            <VenueState title="Loading Cinema Layouts" text="Fetching seat blueprints from backend API..." />
                        ) : error ? (
                            <VenueState title="Seat Layout Unavailable" text={error} />
                        ) : layouts.length === 0 ? (
                            <VenueState title="No Cinema Layouts Found" text="Add movie seat layouts in the admin backend to preview them here." />
                        ) : (
                            <>
                                {/* Cinema Selector Bar */}
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        gap: 12,
                                        flexWrap: "wrap",
                                        marginBottom: 20,
                                        paddingBottom: 16,
                                        borderBottom: "1px solid var(--admin-border)",
                                    }}
                                >
                                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                        <span style={{ color: "var(--admin-text-secondary)", fontSize: 12, fontWeight: 800 }}>
                                            Select Cinema Screen:
                                        </span>
                                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                            {layouts.map((layout) => {
                                                const active = layout.cinemaId === activeLayout?.cinemaId;

                                                return (
                                                    <button
                                                        key={layout.cinemaId}
                                                        type="button"
                                                        onClick={() => setActiveCinemaId(layout.cinemaId)}
                                                        style={{
                                                            border: active ? "1px solid #10B981" : "1px solid var(--admin-border)",
                                                            background: active ? "#10B981" : "transparent",
                                                            color: active ? "#FFFFFF" : "var(--admin-text)",
                                                            borderRadius: 8,
                                                            padding: "7px 14px",
                                                            fontSize: 12,
                                                            fontWeight: 800,
                                                            cursor: "pointer",
                                                            boxShadow: active ? "0 2px 10px rgba(16, 185, 129, 0.3)" : "none",
                                                            transition: "all 0.15s ease",
                                                        }}
                                                        className="cursor-pointer select-none"
                                                    >
                                                        {layout.name}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Cinema Badge info */}
                                    {activeLayout && (
                                        <div
                                            style={{
                                                background: "transparent",
                                                border: "1px solid var(--admin-border)",
                                                borderRadius: 8,
                                                padding: "6px 12px",
                                                fontSize: 12,
                                                fontWeight: 700,
                                                color: "var(--admin-text-secondary)",
                                            }}
                                        >
                                            Cinema ID: <span style={{ color: "#6C63FF", fontWeight: 900 }}>{activeLayout.cinemaId}</span>
                                        </div>
                                    )}
                                </div>

                                {activeLayout ? <MovieLayoutPreview layout={activeLayout} prices={activeStats.uniquePrices} /> : null}
                            </>
                        )}
                    </div>
                </div>
            ) : (
                <div
                    style={{
                        background: "var(--admin-surface)",
                        border: "1px solid var(--admin-border)",
                        borderRadius: 18,
                        padding: 24,
                        boxShadow: "0 18px 50px rgba(15,13,26,.05)",
                    }}
                >
                    <VenueState
                        title={`${categories.find((cat) => cat.key === activeCategory)?.label} Integration Prepared`}
                        text="Only movie cinema seat layouts are enabled in backend API endpoints right now. This tab module is configured and ready for upcoming transport & arena data."
                    />
                </div>
            )}
        </section>
    );
}

function MovieLayoutPreview({ layout, prices }: { layout: MovieSeatLayout; prices: number[] }) {
    // Border colors by price tier (No gradients, distinct solid borders)
    const tierBorderColors = ["#3B82F6", "#10B981", "#F59E0B", "#A855F7", "#EC4899"];

    const getPriceBadgeStyle = (price: number) => {
        const sortedPrices = [...prices].sort((a, b) => a - b);
        const index = sortedPrices.indexOf(price);
        const borderColor = tierBorderColors[index % tierBorderColors.length] || "#3B82F6";

        let label = "Standard Tier";
        if (sortedPrices.length > 1) {
            if (index === 0) label = "Economy Tier";
            else if (index === sortedPrices.length - 1) label = "VIP Tier";
            else label = `Executive Tier`;
        }

        return {
            borderColor,
            bg: "transparent", // Transparent background
            textColor: "var(--admin-text)", // Theme text color
            label,
        };
    };

    return (
        <div style={{ display: "grid", gap: 20 }}>
            {/* Legend Bar (Transparent Background) */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                    flexWrap: "wrap",
                    background: "transparent",
                    border: "1px solid var(--admin-border)",
                    borderRadius: 12,
                    padding: "12px 16px",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 11, fontWeight: 900, textTransform: "uppercase", color: "var(--admin-text-secondary)" }}>
                        Price Tiers:
                    </span>
                    {prices.map((p) => {
                        const badge = getPriceBadgeStyle(p);
                        return (
                            <div key={p} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                <span
                                    style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        width: 24,
                                        height: 24,
                                        borderRadius: 5,
                                        background: badge.bg,
                                        color: badge.textColor,
                                        border: `1px solid ${badge.borderColor}`,
                                        fontSize: 10,
                                        fontWeight: 900,
                                    }}
                                >
                                    ₹
                                </span>
                                <span style={{ fontSize: 12, fontWeight: 800, color: "var(--admin-text)" }}>
                                    {formatCurrency(p)} <span style={{ color: "var(--admin-text-secondary)", fontSize: 11 }}>({badge.label})</span>
                                </span>
                            </div>
                        );
                    })}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#10B981", fontSize: 12, fontWeight: 800 }}>
                    <Sparkles size={14} />
                    Interactive Seat Map
                </div>
            </div>

            {/* Screen Representation & Seat Grid (Transparent Background) */}
            <div
                style={{
                    overflowX: "auto",
                    border: "1px solid var(--admin-border)",
                    borderRadius: 16,
                    background: "transparent",
                    padding: "24px 16px 20px",
                }}
            >
                {/* Curved Solid Screen Bar */}
                <div style={{ textAlign: "center", marginBottom: 24 }}>
                    <div
                        style={{
                            margin: "0 auto 8px",
                            height: 6,
                            width: "min(560px, 80vw)",
                            borderRadius: 999,
                            background: "#6366F1",
                            boxShadow: "0 4px 14px rgba(99, 102, 241, 0.35)",
                        }}
                    />
                    <span
                        style={{
                            fontSize: 10,
                            fontWeight: 900,
                            letterSpacing: ".25em",
                            textTransform: "uppercase",
                            color: "var(--admin-text-secondary)",
                        }}
                    >
                        CINEMA SCREEN THIS WAY
                    </span>
                </div>

                {/* Seat Rows Map */}
                <div
                    style={{
                        display: "grid",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 10,
                        minWidth: 720,
                        padding: "10px 12px 18px",
                    }}
                >
                    {layout.seats.map((row) => (
                        <div key={row.row} style={{ display: "grid", gridTemplateColumns: "36px max-content", alignItems: "center", gap: 14 }}>
                            {/* Row Label Badge */}
                            <span
                                style={{
                                    display: "inline-flex",
                                    height: 28,
                                    width: 28,
                                    alignItems: "center",
                                    justifyContent: "center",
                                    borderRadius: 7,
                                    border: "1px solid var(--admin-border)",
                                    background: "transparent",
                                    color: "var(--admin-text)",
                                    fontSize: 12,
                                    fontWeight: 900,
                                }}
                            >
                                {row.row}
                            </span>

                            {/* Row Seats */}
                            <div style={{ display: "flex", gap: 8 }}>
                                {row.seats.map((seat, seatIndex) => {
                                    if (isSeatHidden(row.row, seatIndex)) {
                                        return <span key={seat.id} style={{ height: 28, width: 28 }} />;
                                    }

                                    const tierStyle = getPriceBadgeStyle(seat.price);

                                    return (
                                        <span
                                            key={seat.id}
                                            title={`${seat.id} • ${formatCurrency(seat.price)}`}
                                            style={{
                                                display: "inline-flex",
                                                height: 28,
                                                width: 28,
                                                alignItems: "center",
                                                justifyContent: "center",
                                                borderRadius: 7,
                                                border: `1px solid ${tierStyle.borderColor}`,
                                                background: "transparent", // Transparent background
                                                color: "var(--admin-text)", // Dynamic theme text color
                                                fontSize: 11,
                                                fontWeight: 900,
                                                marginRight: seatIndex === 4 || seatIndex === 14 ? 24 : 0,
                                                cursor: "pointer",
                                                transition: "all 0.15s ease",
                                            }}
                                            className="hover:scale-110 select-none"
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
        <div
            style={{
                display: "grid",
                minHeight: 220,
                placeItems: "center",
                border: "1px dashed var(--admin-border)",
                borderRadius: 16,
                background: "transparent",
                padding: 24,
                textAlign: "center",
            }}
        >
            <div>
                <p style={{ margin: 0, color: "var(--admin-text)", fontSize: 15, fontWeight: 900 }}>{title}</p>
                <p style={{ margin: "6px auto 0", maxWidth: 440, color: "var(--admin-text-secondary)", fontSize: 12.5, fontWeight: 500 }}>
                    {text}
                </p>
            </div>
        </div>
    );
}
