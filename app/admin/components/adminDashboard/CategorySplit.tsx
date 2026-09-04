import { COLORS } from "./constants";
import { compact } from "./formatters";
import type { DashboardData } from "./types";

type CategorySplitProps = {
    data: DashboardData["categoryStats"];
};

export default function CategorySplit({ data }: CategorySplitProps) {
    return (
        <div
            className="admin-dashboard-card"
            style={{
                background: "var(--admin-surface)",
                border: "1px solid var(--admin-border)",
                borderRadius: 20,
                padding: "20px 22px",
                boxShadow: "0 6px 28px rgba(15,13,26,.035)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
            }}
        >
            <div>
                <p style={{ margin: 0, color: "var(--admin-text)", fontSize: 14, fontWeight: 700 }}>Category Share</p>
                <p style={{ margin: "2px 0 0", color: "var(--admin-text-secondary)", fontSize: 12, fontWeight: 500 }}>
                    Booking distribution across verticals
                </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 14 }}>
                {data.map((item, index) => {
                    const labelName = item.label || item.name || item.type || "Category";
                    const percentVal = item.percent ?? 0;
                    const bookingsCount = item.bookings ?? item.count ?? item.totalBookings ?? 0;

                    return (
                        <div key={item.type || item.name || index}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                                <span style={{ color: "var(--admin-text)", fontSize: 12.5, fontWeight: 600 }}>{labelName}</span>
                                <span style={{ color: "var(--admin-text-secondary)", fontSize: 11.5, fontWeight: 600 }}>
                                    {percentVal}% · {compact.format(bookingsCount)}
                                </span>
                            </div>
                            <div style={{ height: 6, background: "var(--admin-border)", borderRadius: 999, overflow: "hidden" }}>
                                <div
                                    style={{
                                        width: `${percentVal}%`,
                                        height: "100%",
                                        background: COLORS[index % COLORS.length],
                                        borderRadius: 999,
                                        transition: "width 600ms cubic-bezier(.22,1,.36,1)",
                                    }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
