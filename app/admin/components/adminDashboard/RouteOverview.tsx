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
  const split = dashboard?.categorySplits.find((item) => item.type === activeItem);
  const label = stats?.label || activeItem;

  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 12 }}>
        <KpiCard label={`${label} Bookings`} value={loading ? "-" : compact.format(stats?.totalBookings || 0)} helper="Only this route" color="#6C63FF" />
        <KpiCard label={`${label} Revenue`} value={loading ? "-" : formatCurrency(stats?.totalSales || 0)} helper="Paid sales" color="#10B981" />
        <KpiCard label="Tickets Booked" value={loading ? "-" : compact.format(stats?.totalTickets || 0)} helper={`${label} seats`} color="#0EA5E9" />
        <KpiCard label="Pending / Refunds" value={loading ? "-" : `${stats?.pending || 0}/${stats?.refunds || 0}`} helper={`${split?.percent || 0}% of mix`} color="#F59E0B" />
      </div>
    </div>
  );
}
