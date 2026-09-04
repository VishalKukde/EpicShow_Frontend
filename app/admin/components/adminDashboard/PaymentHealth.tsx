import { compact } from "./formatters";
import type { DashboardData } from "./types";

type PaymentHealthProps = {
    kpis: DashboardData["kpis"];
};

export default function PaymentHealth({ kpis }: PaymentHealthProps) {
    return (
        <div
            className="admin-dashboard-card"
            style={{
                background: "var(--admin-surface)",
                border: "1px solid var(--admin-border)",
                borderRadius: 20,
                padding: "20px 22px",
                boxShadow: "0 6px 28px rgba(15,13,26,.035)",
            }}
        >
            <p style={{ margin: 0, color: "var(--admin-text)", fontSize: 14, fontWeight: 700 }}>Payment Health</p>
            <p style={{ margin: "2px 0 0", color: "var(--admin-text-secondary)", fontSize: 12, fontWeight: 500 }}>Order status distribution</p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginTop: 14 }}>
                {[
                    ["Paid", kpis?.paidOrders || 0, "#10B981"],
                    ["Failed", kpis?.failedOrders || 0, "#EF4444"],
                    ["Refunded", kpis?.refundedOrders || 0, "#6366F1"],
                ].map(([label, value, color]) => (
                    <div key={label as string} style={{ background: "var(--admin-soft)", border: "1px solid var(--admin-border)", borderRadius: 12, padding: "10px 12px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                            <span style={{ width: 6, height: 6, borderRadius: 999, background: color as string }} />
                            <span style={{ color: "var(--admin-text-secondary)", fontSize: 11, fontWeight: 600 }}>{label}</span>
                        </div>
                        <span style={{ color: color as string, fontSize: 16, fontWeight: 700 }}>{compact.format(value as number)}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
