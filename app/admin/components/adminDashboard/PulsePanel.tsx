import { COLORS } from "./constants";
import { compact, formatCurrency } from "./formatters";
import type { DashboardData } from "./types";

type PulsePanelProps = {
    stats: DashboardData["categoryStats"];
};

export default function PulsePanel({ stats }: PulsePanelProps) {
    const sorted = [...stats].sort((a, b) => (b.totalSales ?? b.revenue ?? 0) - (a.totalSales ?? a.revenue ?? 0));

    return (
        <div
            className="admin-hero-panel"
            style={{
                background: "var(--admin-hero-bg)",
                borderRadius: 20,
                padding: "22px 24px",
                color: "var(--admin-hero-text)",
                boxShadow: "0 10px 40px rgba(24,34,53,.10)",
            }}
        >
            <div style={{ marginBottom: 18 }}>
                <p style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>Revenue Pulse</p>
                <p style={{ margin: "3px 0 0", color: "var(--admin-hero-muted)", fontSize: 12, fontWeight: 500 }}>
                    Revenue ranking across active categories (Movies, Sports, Trains & Gaming)
                </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: `repeat(${sorted.length}, 1fr)`, gap: 12 }}>
                {sorted.map((item, index) => (
                    <div
                        key={item.type}
                        style={{
                            background: "var(--admin-hero-metric-bg)",
                            border: "1px solid var(--admin-hero-metric-border)",
                            borderRadius: 14,
                            padding: "16px 18px",
                            backdropFilter: "blur(12px)",
                            WebkitBackdropFilter: "blur(12px)",
                            textAlign: "center",
                        }}
                    >
                        <span
                            style={{
                                display: "inline-flex",
                                width: 24,
                                height: 24,
                                borderRadius: 8,
                                background: `${COLORS[index % COLORS.length]}20`,
                                placeItems: "center",
                                justifyContent: "center",
                                alignItems: "center",
                                fontSize: 12,
                                fontWeight: 800,
                                color: COLORS[index % COLORS.length],
                                marginBottom: 8,
                            }}
                        >
                            {index + 1}
                        </span>
                        <p style={{ margin: "0 0 2px", fontSize: 13.5, fontWeight: 600 }}>{item.label}</p>
                        <p style={{ margin: 0, fontSize: 16, color: "var(--admin-hero-accent)", fontWeight: 700 }}>
                            {formatCurrency(item.totalSales ?? item.revenue ?? 0)}
                        </p>
                        <p style={{ margin: "6px 0 0", fontSize: 11, color: "var(--admin-hero-muted)", fontWeight: 500 }}>
                            {compact.format(item.totalBookings ?? item.bookings ?? item.count ?? 0)} bookings
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
