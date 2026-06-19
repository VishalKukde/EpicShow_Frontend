import type { ActivePage } from "./types";

type AdminPageTitleProps = {
  activeItem: ActivePage;
  activeLabel: string;
};

export default function AdminPageTitle({ activeItem, activeLabel }: AdminPageTitleProps) {
  return (
    <div style={{ display: "flex", alignItems: "end", justifyContent: "space-between", marginBottom: 16 }}>
      <div>
        <h1 style={{ margin: 0, color: "var(--admin-text)", fontSize: 22, fontWeight: 950, letterSpacing: "-.055em" }}>{activeLabel} Dashboard</h1>
        <p style={{ margin: "4px 0 0", color: "var(--admin-text-secondary)", fontSize: 12.5 }}>{getPageDescription(activeItem, activeLabel)}</p>
      </div>
      <span style={{ color: "#4F46E5", background: "rgba(99, 102, 241, 0.14)", border: "1px solid rgba(99, 102, 241, 0.35)", borderRadius: 999, padding: "7px 10px", fontSize: 11.5, fontWeight: 900 }}>{activeItem === "refunds" ? "Refund queue" : "Route-specific analytics"}</span>
    </div>
  );
}

function getPageDescription(activeItem: ActivePage, activeLabel: string) {
  if (activeItem === "dashboard") return "High-level booking, order, user, revenue, and payment intelligence.";
  if (activeItem === "orders") return "Track order payments, methods, and ticket volume.";
  if (activeItem === "venues") return "Inspect venue seat layouts across booking categories.";
  if (activeItem === "refunds") return "Review eligible bookings and initiate refunds from one focused queue.";
  if (activeItem === "customers") return "Browse customers, account details, wallet balance, rewards, and preferences.";
  if (activeItem === "concerts" || activeItem === "flights" || activeItem === "hotels") return `${activeLabel} admin tools are prepared for the next booking module.`;
  return `Track only ${activeLabel.toLowerCase()} bookings, sales, tickets, and route health.`;
}
