"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import AdminBookingTable from "./components/AdminBookingTable";
import AdminCustomersTable from "./components/AdminCustomersTable";
import AdminOrdersTable from "./components/AdminOrdersTable";
import AdminRefundsTable from "./components/AdminRefundsTable";
import AdminVenuesPanel from "./components/AdminVenuesPanel";
import AdminComingSoonPanel from "./components/adminDashboard/AdminComingSoonPanel";
import AdminPageTitle from "./components/adminDashboard/AdminPageTitle";
import AdminSidebar from "./components/adminDashboard/AdminSidebar";
import AdminTopbar from "./components/adminDashboard/AdminTopbar";
import DashboardOverview from "./components/adminDashboard/DashboardOverview";
import RouteOverview from "./components/adminDashboard/RouteOverview";
import { getActiveArea, getActivePageFromPath, getAdminRoute, isBookingType } from "./components/adminDashboard/constants";
import { formatActiveLabel } from "./components/adminDashboard/formatters";
import type { ActivePage, DashboardData } from "./components/adminDashboard/types";

export default function Dashboard() {
  const pathname = usePathname();
  const router = useRouter();
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    apiFetch("/admin/dashboard", { notifyOnError: false })
      .then((payload: { data: DashboardData }) => {
        if (active) setDashboard(payload.data);
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : "Failed to load admin dashboard");
      })
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, []);

  const activeItem = useMemo(() => getActivePageFromPath(pathname || "/admin"), [pathname]);
  const activeLabel = useMemo(() => formatActiveLabel(activeItem), [activeItem]);
  const activeArea = useMemo(() => getActiveArea(activeItem), [activeItem]);
  const handleSelect = (item: ActivePage) => {
    if (item === activeItem) return;
    router.push(getAdminRoute(item));
  };

  return (
    <div className="admin-shell" style={{ display: "flex", height: "100vh", fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", overflow: "hidden", fontSize: 13 }}>
      <AdminSidebar activeItem={activeItem} onSelect={handleSelect} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <AdminTopbar
          activeArea={activeArea}
          activeLabel={activeLabel}
        />

        <main  style={{ flex: 1, overflowY: "auto", padding: 20, paddingBottom: 0 }}>
          <AdminPageTitle activeItem={activeItem} activeLabel={activeLabel} />

          {error && <div style={{ background: "var(--auth-error-bg)", color: "var(--auth-error-text)", border: "1px solid var(--auth-error-border)", borderRadius: 16, padding: 16, marginBottom: 18, fontWeight: 800 }}>{error}</div>}

          {activeItem === "dashboard" ? (
            <DashboardOverview dashboard={dashboard} loading={loading} />
          ) : isBookingType(activeItem) ? (
            <>
              <RouteOverview activeItem={activeItem} dashboard={dashboard} loading={loading} />
              <AdminBookingTable key={activeItem} type={activeItem} />
            </>
          ) : activeItem === "concerts" || activeItem === "flights" || activeItem === "hotels" ? (
            <AdminComingSoonPanel label={activeLabel} />
          ) : activeItem === "orders" ? (
            <AdminOrdersTable />
          ) : activeItem === "venues" ? (
            <AdminVenuesPanel />
          ) : activeItem === "customers" ? (
            <AdminCustomersTable />
          ) : (
            <AdminRefundsTable />
          )}
        </main>
      </div>
    </div>
  );
}
