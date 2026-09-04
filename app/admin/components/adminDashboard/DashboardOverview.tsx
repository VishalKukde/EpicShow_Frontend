"use client";

import type { DashboardData } from "./types";
import AdminInformativeCard from "./AdminInformativeCard";
import AdminCalendarCard, { DateFilterState } from "./AdminCalendarCard";
import KpiHighlights from "./KpiHighlights";
import CategoryStatsGrid from "./CategoryStatsGrid";
import RevenueChart from "./RevenueChart";
import CategorySplit from "./CategorySplit";

const ACTIVE_CATEGORIES = new Set(["movies", "sports", "trains", "gaming"]);

type DashboardOverviewProps = {
  dashboard: DashboardData | null;
  loading: boolean;
  onDateFilterChange?: (filterState: DateFilterState) => void;
};

export default function DashboardOverview({ dashboard, loading, onDateFilterChange }: DashboardOverviewProps) {
  const allStats = dashboard?.categoryStats || [];
  const stats = allStats.filter((s) => s.type && ACTIVE_CATEGORIES.has(s.type));
  const splits = (dashboard?.categorySplits || []).filter((s) => s.type && ACTIVE_CATEGORIES.has(s.type));

  return (
    <section style={{ display: "grid", gap: 20 }}>
      {/* ── Row 1 · Hero Section: SaaS Informative Card (Left) & Fixed Calendar Card (Right) ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 16, alignItems: "start" }}>
        <AdminInformativeCard dashboard={dashboard} loading={loading} />
        <AdminCalendarCard onFilterChange={onDateFilterChange} />
      </div>

      {/* ── Row 2 · KPI Highlights (Total Bookings, Total Revenue, Total Users with Free/Pro, Total Orders with Breakdown) ── */}
      <KpiHighlights dashboard={dashboard} loading={loading} />

      {/* ── Row 3 · Category Stat Cards (Movies, Sports, Trains, Gaming) ── */}
      <CategoryStatsGrid stats={stats} />

      {/* ── Row 4 · Revenue & Category Share ── */}
      {dashboard && (
        <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 16, alignItems: "stretch" }}>
          <RevenueChart data={dashboard.monthlyRevenue} />
          <CategorySplit data={splits} />
        </div>
      )}
    </section>
  );
}
