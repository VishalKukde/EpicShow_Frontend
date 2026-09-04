import KpiCard from "./KpiCard";
import { compact, formatCurrency } from "./formatters";
import type { DashboardData } from "./types";

type KpiHighlightsProps = {
    dashboard: DashboardData | null;
    loading: boolean;
};

export default function KpiHighlights({ dashboard, loading }: KpiHighlightsProps) {
    const totalBookings = dashboard?.kpis?.totalBookings ?? dashboard?.totalBookings ?? 0;
    const revenue = dashboard?.kpis?.revenue ?? dashboard?.totalRevenue ?? 0;
    const totalUsers = dashboard?.kpis?.totalUsers ?? dashboard?.activeUsers ?? 0;
    const proUsers = dashboard?.kpis?.proUsers ?? 0;
    const freeUsers =
        dashboard?.kpis?.freeUsers !== undefined && dashboard.kpis.freeUsers > 0
            ? dashboard.kpis.freeUsers
            : Math.max(totalUsers - proUsers, 0);
    const totalOrders = dashboard?.kpis?.totalOrders ?? dashboard?.totalBookings ?? 0;
    const paidOrders = dashboard?.kpis?.paidOrders ?? dashboard?.totalBookings ?? 0;
    const failedOrders = dashboard?.kpis?.failedOrders ?? 0;
    const refundedOrders = dashboard?.kpis?.refundedOrders ?? 0;

    return (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
            <KpiCard
                label="Total Bookings"
                rawValue={totalBookings}
                formatter={(val) => (loading ? "–" : compact.format(val))}
                isInteger={true}
                helper="All active categories"
                color="#6C63FF"
            />
            <KpiCard
                label="Total Revenue"
                rawValue={revenue}
                formatter={(val) => (loading ? "–" : formatCurrency(val))}
                isInteger={false}
                helper="Paid & confirmed sales"
                color="#10B981"
            />
            <KpiCard
                label="Total Users"
                rawValue={totalUsers}
                formatter={(val) => (loading ? "–" : compact.format(val))}
                isInteger={true}
                helper="Membership breakdown"
                color="#0EA5E9"
                subMetrics={[
                    { label: "Free", rawValue: freeUsers, formatter: (val) => compact.format(val), isInteger: true, color: "#0EA5E9" },
                    { label: "Pro", rawValue: proUsers, formatter: (val) => compact.format(val), isInteger: true, color: "#8B5CF6" },
                ]}
            />
            <KpiCard
                label="Total Orders"
                rawValue={totalOrders}
                formatter={(val) => (loading ? "–" : compact.format(val))}
                isInteger={true}
                helper="Order breakdown"
                color="#F59E0B"
                subMetrics={[
                    { label: "Paid", rawValue: paidOrders, formatter: (val) => compact.format(val), isInteger: true, color: "#10B981" },
                    { label: "Failed", rawValue: failedOrders, formatter: (val) => compact.format(val), isInteger: true, color: "#EF4444" },
                    { label: "Refunded", rawValue: refundedOrders, formatter: (val) => compact.format(val), isInteger: true, color: "#6366F1" },
                ]}
            />
        </div>
    );
}
