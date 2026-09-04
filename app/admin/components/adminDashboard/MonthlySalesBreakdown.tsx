import { formatCurrency } from "./formatters";
import type { DashboardData } from "./types";

type MonthlySalesBreakdownProps = {
    data: DashboardData["monthlyRevenue"];
};

export default function MonthlySalesBreakdown({ data = [] }: MonthlySalesBreakdownProps) {
    const salesData = data || [];
    const totalYearly = salesData.reduce((sum, m) => sum + m.revenue, 0);
    const cm = new Date().getMonth();

    return (
        <div
            className="admin-dashboard-card"
            style={{
                background: "var(--admin-surface)",
                border: "1px solid var(--admin-border)",
                borderRadius: 20,
                padding: "22px 24px",
                boxShadow: "0 6px 28px rgba(15,13,26,.035)",
            }}
        >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                <div>
                    <p style={{ margin: 0, color: "var(--admin-text)", fontSize: 15, fontWeight: 700 }}>Monthly Sales Breakdown</p>
                    <p style={{ margin: "3px 0 0", color: "var(--admin-text-secondary)", fontSize: 12, fontWeight: 500 }}>
                        Month-by-month revenue performance
                    </p>
                </div>
                <span style={{ color: "var(--admin-text)", fontSize: 16, fontWeight: 700, letterSpacing: "-.02em" }}>
                    {formatCurrency(totalYearly)}
                </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
                {salesData.map((item, i) => (
                    <div
                        key={item.month}
                        className="admin-stat-pill"
                        style={{
                            background: i === cm ? "rgba(99,102,241,.06)" : "var(--admin-soft)",
                            border: `1px solid ${i === cm ? "rgba(99,102,241,.18)" : "var(--admin-border)"}`,
                            borderRadius: 14,
                            padding: "14px 14px 12px",
                            position: "relative",
                        }}
                    >
                        {i === cm && <div style={{ position: "absolute", left: 0, top: 10, bottom: 10, width: 3, borderRadius: "0 999px 999px 0", background: "#6C63FF" }} />}
                        <p style={{ margin: 0, color: i === cm ? "#6C63FF" : "var(--admin-text-secondary)", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".04em" }}>
                            {item.month}
                        </p>
                        <p style={{ margin: "4px 0 0", color: "var(--admin-text)", fontSize: 17, fontWeight: 700, letterSpacing: "-.02em" }}>
                            {formatCurrency(item.revenue)}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
