"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import AdminBookingTable from "./components/adminBookings/AdminBookingTable";
import AdminCustomersTable from "./components/adminOperations/customer/AdminCustomersTable";
import AdminOrdersTable from "./components/adminOperations/orders/AdminOrdersTable";
import AdminRefundsTable from "./components/adminOperations/refunds/AdminRefundsTable";
import AdminVenuesPanel from "./components/adminOperations/venue/AdminVenuesPanel";
import AdminCouponsPanel from "./components/adminMarketing/coupons/AdminCouponsPanel";
import AdminLoyaltyPanel from "./components/adminMarketing/loyalty/AdminLoyaltyPanel";
import AdminBannersPanel from "./components/adminMarketing/banners/AdminBannersPanel";
import AdminRevenuePanel from "./components/adminFinancial/revenue/AdminRevenuePanel";
import AdminReportingPanel from "./components/adminFinancial/reporting/AdminReportingPanel";
import AdminStaffPanel from "./components/adminSystem/staff/AdminStaffPanel";
import AdminNotificationsPanel from "./components/adminSystem/notifications/AdminNotificationsPanel";
import AdminSettingsPanel from "./components/adminSystem/settings/AdminSettingsPanel";
import AdminAddMoviePanel from "./components/adminCatalog/AdminAddMoviePanel";
import AdminComingSoonPanel from "./components/adminDashboard/AdminComingSoonPanel";
import AdminPageTitle from "./components/adminDashboard/AdminPageTitle";
import AdminSidebar from "./components/adminDashboard/AdminSidebar";
import AdminTopbar from "./components/adminDashboard/AdminTopbar";
import DashboardOverview from "./components/adminDashboard/DashboardOverview";
import RouteOverview from "./components/adminDashboard/RouteOverview";
import type { DateFilterState } from "./components/adminDashboard/AdminCalendarCard";
import { getActiveArea, getActivePageFromPath, getAdminRoute, isBookingType } from "./components/adminDashboard/constants";
import { formatActiveLabel } from "./components/adminDashboard/formatters";
import type { ActivePage, DashboardData } from "./components/adminDashboard/types";

export default function Dashboard() {
  const pathname = usePathname();
  const router = useRouter();
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = useCallback((startDate?: string, endDate?: string) => {
    setLoading(true);
    let url = "/admin/dashboard";
    if (startDate && endDate) {
      url += `?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`;
    }
    apiFetch(url, { notifyOnError: false })
      .then((payload: { data: DashboardData }) => {
        setDashboard(payload.data);
        setError("");
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load admin dashboard");
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const handleDateFilterChange = useCallback((filterState: DateFilterState) => {
    if (filterState.mode === "overall") {
      loadDashboardData();
    } else if (filterState.startDate && filterState.endDate) {
      loadDashboardData(filterState.startDate, filterState.endDate);
    }
  }, [loadDashboardData]);

  const activeItem = useMemo(() => getActivePageFromPath(pathname || "/admin"), [pathname]);
  const activeLabel = useMemo(() => formatActiveLabel(activeItem), [activeItem]);
  const activeArea = useMemo(() => getActiveArea(activeItem), [activeItem]);

  const handleSelect = (item: ActivePage) => {
    if (item === activeItem) return;
    router.push(getAdminRoute(item));
  };

  return (
    <div
      className="admin-shell"
      style={{
        display: "flex",
        height: "100vh",
        fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        overflow: "hidden",
        fontSize: 13,
      }}
    >
      <AdminSidebar activeItem={activeItem} onSelect={handleSelect} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <AdminTopbar activeArea={activeArea} activeLabel={activeLabel} />

        <main style={{ flex: 1, overflowY: "auto", padding: 24, paddingBottom: 0 }}>
          <AdminPageTitle activeItem={activeItem} activeLabel={activeLabel} />

          {error && (
            <div
              style={{
                background: "var(--auth-error-bg)",
                color: "var(--auth-error-text)",
                border: "1px solid var(--auth-error-border)",
                borderRadius: 16,
                padding: 16,
                marginBottom: 18,
                fontWeight: 800,
              }}
            >
              {error}
            </div>
          )}

          {activeItem === "dashboard" ? (
            <DashboardOverview dashboard={dashboard} loading={loading} onDateFilterChange={handleDateFilterChange} />
          ) : isBookingType(activeItem) ? (
            <>
              <RouteOverview activeItem={activeItem} dashboard={dashboard} loading={loading} />
              <AdminBookingTable key={activeItem} type={activeItem} />
            </>
          ) : activeItem === "add-movie" ? (
            <AdminAddMoviePanel />
          ) : activeItem === "add-sport" ? (
            <AdminComingSoonPanel label="Add Sport Event" />
          ) : activeItem === "add-gaming" ? (
            <AdminComingSoonPanel label="Add Gaming Event" />
          ) : activeItem === "add-train" ? (
            <AdminComingSoonPanel label="Add Train Route" />
          ) : activeItem === "orders" ? (
            <AdminOrdersTable />
          ) : activeItem === "venues" ? (
            <AdminVenuesPanel />
          ) : activeItem === "customers" ? (
            <AdminCustomersTable />
          ) : activeItem === "refunds" ? (
            <AdminRefundsTable />
          ) : activeItem === "coupons" ? (
            <AdminCouponsPanel />
          ) : activeItem === "loyalty" ? (
            <AdminLoyaltyPanel />
          ) : activeItem === "banners" ? (
            <AdminBannersPanel />
          ) : activeItem === "revenue" ? (
            <AdminRevenuePanel dashboard={dashboard} loading={loading} />
          ) : activeItem === "reporting" ? (
            <AdminReportingPanel />
          ) : activeItem === "staff" ? (
            <AdminStaffPanel />
          ) : activeItem === "notifications" ? (
            <AdminNotificationsPanel />
          ) : activeItem === "settings" ? (
            <AdminSettingsPanel />
          ) : (
            <AdminComingSoonPanel label={activeLabel} />
          )}
        </main>
      </div>
    </div>
  );
}
