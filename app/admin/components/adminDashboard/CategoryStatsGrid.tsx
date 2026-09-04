import AnimatedNumber from "./AnimatedNumber";
import { COLORS } from "./constants";
import { compact, formatCurrency } from "./formatters";
import type { DashboardData } from "./types";

type CategoryStatsGridProps = {
    stats: DashboardData["categoryStats"];
};

export default function CategoryStatsGrid({ stats }: CategoryStatsGridProps) {
    return (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
            {stats.map((item, index) => (
                <div
                    key={item.type || index}
                    className="admin-stat-pill"
                    style={{
                        background: "var(--admin-surface)",
                        border: "1px solid var(--admin-border)",
                        borderRadius: 16,
                        padding: "16px 18px 14px",
                        position: "relative",
                        overflow: "hidden",
                        boxShadow: "0 6px 24px rgba(15,13,26,.03)",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        minHeight: 132,
                    }}
                >
                    {/* Accent bar bending seamlessly with card outer radius */}
                    <div
                        style={{
                            position: "absolute",
                            left: 0,
                            top: 0,
                            bottom: 0,
                            width: 4.5,
                            background: COLORS[index % COLORS.length],
                            borderRadius: "16px 0 0 16px",
                        }}
                    />

                    <div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                            <p style={{ margin: 0, color: "var(--admin-text)", fontSize: 13, fontWeight: 800 }}>{item.label}</p>
                            <span style={{ width: 8, height: 8, borderRadius: 999, background: COLORS[index % COLORS.length] }} />
                        </div>

                        <p style={{ margin: 0, color: "var(--admin-text-secondary)", fontSize: 10.5, fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase" }}>
                            Bookings
                        </p>
                        <p style={{ margin: "3px 0 0", color: "var(--admin-text)", fontSize: 22, fontWeight: 800, letterSpacing: "-.03em", lineHeight: 1.1 }}>
                            <AnimatedNumber value={item.totalBookings ?? 0} formatter={(val) => compact.format(val)} isInteger={true} />
                        </p>
                    </div>

                    {/* Bottom Revenue Row */}
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: 10,
                            marginTop: 10,
                            paddingTop: 8,
                            borderTop: "1px solid var(--admin-border)",
                        }}
                    >
                        <span style={{ color: "var(--admin-text-secondary)", fontSize: 11, fontWeight: 600 }}>Total Revenue</span>
                        <span style={{ fontWeight: 800, color: COLORS[index % COLORS.length], fontSize: 13, letterSpacing: "-.01em" }}>
                            <AnimatedNumber value={item.totalSales ?? 0} formatter={(val) => formatCurrency(val)} isInteger={false} />
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}
