import KpiCard from "./KpiCard";
import { compact, formatCurrency } from "./formatters";
import type { BookingType, DashboardData } from "./types";

type RouteOverviewProps = {
  activeItem: BookingType;
  dashboard: DashboardData | null;
  loading: boolean;
};

export default function RouteOverview({ activeItem, dashboard, loading }: RouteOverviewProps) {
  const stats = dashboard?.categoryStats.find((item) => item.type === activeItem);
  const label = stats?.label || activeItem[0].toUpperCase() + activeItem.slice(1);

  const totalBookings = stats?.totalBookings || 0;
  const totalSales = stats?.totalSales || 0;
  const pendingCount = stats?.pending || 0;
  const refundCount = stats?.refunds || 0;

  const paidCount = Math.max(totalBookings - pendingCount - refundCount, 0);
  const successRate = totalBookings > 0 ? Math.min(Math.round((paidCount / totalBookings) * 100), 100) : 100;

  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 12 }}>
        <KpiCard
          label={`${label} Bookings`}
          rawValue={totalBookings}
          formatter={(val) => (loading ? "–" : compact.format(val))}
          isInteger={true}
          helper={`Overall ${label.toLowerCase()} bookings`}
          color="#6C63FF"
        />
        <KpiCard
          label={`${label} Revenue`}
          rawValue={totalSales}
          formatter={(val) => (loading ? "–" : formatCurrency(val))}
          isInteger={false}
          helper={`Overall ${label.toLowerCase()} sales`}
          color="#10B981"
        />
        <KpiCard
          label="Payment Success Rate"
          rawValue={successRate}
          formatter={(val) => (loading ? "–" : `${val}%`)}
          isInteger={true}
          helper={`${compact.format(paidCount)} paid & confirmed`}
          color="#0EA5E9"
        />
        <KpiCard
          label="Pending & Refund Queue"
          rawValue={pendingCount + refundCount}
          formatter={() => (loading ? "–" : `${pendingCount} Pending / ${refundCount} Refunded`)}
          isInteger={true}
          helper="Requires admin review"
          color="#F59E0B"
        />
      </div>
    </div>
  );
}
