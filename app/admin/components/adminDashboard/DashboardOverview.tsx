import { COLORS } from "./constants";
import KpiCard from "./KpiCard";
import { compact, formatCurrency } from "./formatters";
import type { DashboardData } from "./types";

type DashboardOverviewProps = {
  dashboard: DashboardData | null;
  loading: boolean;
};

export default function DashboardOverview({ dashboard, loading }: DashboardOverviewProps) {
  const totalTickets = dashboard?.categoryStats.reduce((sum, item) => sum + item.totalTickets, 0) || 0;
  const topCategory = [...(dashboard?.categoryStats || [])].sort((a, b) => b.totalSales - a.totalSales)[0];

  return (
    <section style={{ display: "grid", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 12 }}>
        <KpiCard label="Total Bookings" value={loading ? "-" : compact.format(dashboard?.kpis.totalBookings || 0)} helper="All booking types" color="#6C63FF" />
        <KpiCard label="Total Revenue" value={loading ? "-" : formatCurrency(dashboard?.kpis.revenue || 0)} helper="Paid sales" color="#10B981" />
        <KpiCard label="Total Users" value={loading ? "-" : compact.format(dashboard?.kpis.totalUsers || 0)} helper="Registered users" color="#0EA5E9" />
        <KpiCard label="Total Orders" value={loading ? "-" : compact.format(dashboard?.kpis.totalOrders || 0)} helper={`${dashboard?.kpis.paidOrders || 0} paid`} color="#F59E0B" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.45fr .9fr .9fr", gap: 14 }}>
        <div className="admin-hero-panel" style={{ background: "var(--admin-hero-bg)", borderRadius: 20, padding: 18, color: "var(--admin-hero-text)", minHeight: 210, position: "relative", overflow: "hidden", boxShadow: "0 20px 70px rgba(24,34,53,.18)" }}>
          <div style={{ position: "absolute", right: -60, top: -70, width: 210, height: 210, borderRadius: "50%", background: "rgba(167,139,250,.22)" }} />
          <p style={{ margin: 0, color: "var(--admin-hero-accent)", fontSize: 11, fontWeight: 900, letterSpacing: ".08em", textTransform: "uppercase" }}>Command Center</p>
          <h2 style={{ margin: "8px 0 8px", fontSize: 26, lineHeight: 1.05, letterSpacing: "-.06em" }}>All EpicShow operations in one place.</h2>
          <p style={{ margin: 0, color: "var(--admin-hero-muted)", fontSize: 12.5, maxWidth: 520 }}>Monitor bookings, orders, users, payments, venues, refunds and category performance from the default dashboard.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginTop: 22, maxWidth: 560 }}>
            <MiniMetric label="Tickets" value={compact.format(totalTickets)} />
            <MiniMetric label="Active Venues" value={compact.format(dashboard?.kpis.activeVenues || 0)} />
            <MiniMetric label="Top Category" value={topCategory?.label || "-"} />
          </div>
        </div>

        <PaymentHealth dashboard={dashboard} />
        <CategorySplit data={dashboard?.categorySplits || []} />
      </div>

      {dashboard && (
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 14 }}>
          <RevenueChart data={dashboard.monthlyRevenue} />
          <PulsePanel stats={dashboard.categoryStats} />
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 12 }}>
        {(dashboard?.categoryStats || []).map((item, index) => (
          <div key={item.type} className="admin-stat-pill" style={{ background: "var(--admin-surface)", border: "1px solid var(--admin-border)", borderRadius: 18, padding: 15, boxShadow: "0 12px 36px rgba(15,13,26,.045)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <p style={{ margin: 0, color: "var(--admin-text)", fontSize: 14, fontWeight: 950 }}>{item.label}</p>
              <span style={{ width: 10, height: 10, borderRadius: 999, background: COLORS[index % COLORS.length] }} />
            </div>
            <p style={{ margin: 0, color: "var(--admin-text-secondary)", fontSize: 11, fontWeight: 800 }}>Bookings</p>
            <p style={{ margin: "2px 0 10px", color: "var(--admin-text)", fontSize: 22, fontWeight: 950, letterSpacing: "-.05em" }}>{compact.format(item.totalBookings)}</p>
            <div style={{ display: "flex", justifyContent: "space-between", color: "var(--admin-text-secondary)", fontSize: 12, fontWeight: 800 }}>
              <span>{compact.format(item.totalTickets)} tickets</span>
              <span>{formatCurrency(item.totalSales)}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: "var(--admin-hero-metric-bg)", border: "1px solid var(--admin-hero-metric-border)", borderRadius: 14, padding: 12 }}>
      <p style={{ margin: 0, color: "var(--admin-hero-accent)", fontSize: 10.5, fontWeight: 900, letterSpacing: ".06em", textTransform: "uppercase" }}>{label}</p>
      <p style={{ margin: "4px 0 0", color: "var(--admin-hero-text)", fontSize: 17, fontWeight: 950, letterSpacing: "-.04em" }}>{value}</p>
    </div>
  );
}

function PaymentHealth({ dashboard }: { dashboard: DashboardData | null }) {
  return (
    <div className="admin-dashboard-card" style={{ background: "var(--admin-surface)", border: "1px solid var(--admin-border)", borderRadius: 20, padding: 16, boxShadow: "0 14px 42px rgba(15,13,26,.05)" }}>
      <p style={{ margin: 0, color: "var(--admin-text)", fontSize: 14, fontWeight: 900 }}>Payment Health</p>
      <p style={{ margin: "3px 0 14px", color: "var(--admin-text-secondary)", fontSize: 12 }}>Order state summary</p>
      {[
        ["Paid Orders", dashboard?.kpis.paidOrders || 0, "#10B981"],
        ["Failed Orders", dashboard?.kpis.failedOrders || 0, "#EF4444"],
        ["Refunded", dashboard?.kpis.refundedOrders || 0, "#6366F1"],
      ].map(([label, value, color]) => (
        <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--admin-border)" }}>
          <span style={{ color: "var(--admin-text-secondary)", fontSize: 12, fontWeight: 800 }}>{label}</span>
          <span style={{ color: color as string, fontSize: 14, fontWeight: 950 }}>{compact.format(value as number)}</span>
        </div>
      ))}
    </div>
  );
}

function RevenueChart({ data }: { data: DashboardData["monthlyRevenue"] }) {
  const max = Math.max(...data.map((item) => item.revenue), 1);
  return (
    <div className="admin-dashboard-card" style={{ background: "var(--admin-surface)", border: "1px solid var(--admin-border)", borderRadius: 22, padding: 20, boxShadow: "0 18px 50px rgba(15,13,26,.05)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
        <div>
          <p style={{ margin: 0, color: "var(--admin-text)", fontSize: 16, fontWeight: 900 }}>Monthly Revenue</p>
          <p style={{ margin: "4px 0 0", color: "var(--admin-text-secondary)", fontSize: 13 }}>Paid bookings across all categories</p>
        </div>
        <span style={{ color: "var(--admin-success-text)", background: "var(--admin-success-bg)", borderRadius: 999, padding: "5px 10px", fontSize: 12, fontWeight: 900 }}>Live</span>
      </div>
      <div style={{ height: 190, display: "flex", alignItems: "end", gap: 9 }}>
        {data.map((item, index) => (
          <div key={item.month} style={{ flex: 1, display: "grid", gap: 8, alignItems: "end" }} title={formatCurrency(item.revenue)}>
            <div style={{ minHeight: 8, height: `${Math.max((item.revenue / max) * 150, 8)}px`, borderRadius: "12px 12px 5px 5px", background: index === data.length - 1 ? "#6C63FF" : "var(--admin-chart-muted)" }} />
            <span style={{ color: "var(--admin-text-muted)", fontSize: 11, textAlign: "center" }}>{item.month}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CategorySplit({ data }: { data: DashboardData["categorySplits"] }) {
  return (
    <div className="admin-dashboard-card" style={{ background: "var(--admin-surface)", border: "1px solid var(--admin-border)", borderRadius: 22, padding: 20, boxShadow: "0 18px 50px rgba(15,13,26,.05)" }}>
      <p style={{ margin: 0, color: "var(--admin-text)", fontSize: 16, fontWeight: 900 }}>Category Splits</p>
      <p style={{ margin: "4px 0 18px", color: "var(--admin-text-secondary)", fontSize: 13 }}>Booking distribution by vertical</p>
      <div style={{ display: "grid", gap: 14 }}>
        {data.map((item, index) => (
          <div key={item.type}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
              <span style={{ color: "var(--admin-text)", fontSize: 13, fontWeight: 800 }}>{item.label}</span>
              <span style={{ color: "var(--admin-text-secondary)", fontSize: 12, fontWeight: 800 }}>{item.percent}% - {compact.format(item.bookings)}</span>
            </div>
            <div style={{ height: 9, background: "var(--admin-border)", borderRadius: 999, overflow: "hidden" }}>
              <div style={{ width: `${item.percent}%`, height: "100%", background: COLORS[index % COLORS.length], borderRadius: 999 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PulsePanel({ stats }: { stats: DashboardData["categoryStats"] }) {
  const top = [...stats].sort((a, b) => b.totalSales - a.totalSales).slice(0, 4);
  return (
    <div className="admin-hero-panel" style={{ background: "var(--admin-hero-bg)", borderRadius: 22, padding: 20, color: "var(--admin-hero-text)", boxShadow: "0 18px 50px rgba(24,34,53,.18)" }}>
      <p style={{ margin: 0, fontSize: 16, fontWeight: 900 }}>Revenue Pulse</p>
      <p style={{ margin: "4px 0 18px", color: "var(--admin-hero-muted)", fontSize: 13 }}>Top booking categories right now</p>
      <div style={{ display: "grid", gap: 12 }}>
        {top.map((item, index) => (
          <div key={item.type} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--admin-hero-metric-bg)", border: "1px solid var(--admin-hero-metric-border)", borderRadius: 16, padding: "12px 14px" }}>
            <span style={{ fontSize: 13, fontWeight: 800 }}>{index + 1}. {item.label}</span>
            <span style={{ fontSize: 13, color: "var(--admin-hero-accent)", fontWeight: 900 }}>{formatCurrency(item.totalSales)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
