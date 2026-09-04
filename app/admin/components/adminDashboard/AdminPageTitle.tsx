"use client";

import type { ActivePage } from "./types";

type AdminPageTitleProps = {
  activeItem: ActivePage;
  activeLabel: string;
};

export default function AdminPageTitle({ activeItem, activeLabel }: AdminPageTitleProps) {
  return (
    <div style={{ display: "flex", alignItems: "end", justifyContent: "space-between", marginBottom: 20 }}>
      <div>
        <h1 style={{ margin: 0, color: "var(--admin-text)", fontSize: 24, fontWeight: 800, letterSpacing: "-.04em", lineHeight: 1.1 }}>
          {activeItem === "dashboard" ? "Admin Dashboard" : `${activeLabel} Dashboard`}
        </h1>
        <p style={{ margin: "5px 0 0", color: "var(--admin-text-secondary)", fontSize: 13, fontWeight: 500, lineHeight: 1.4 }}>
          {getPageDescription(activeItem, activeLabel)}
        </p>
      </div>
    </div>
  );
}

function getPageDescription(activeItem: ActivePage, activeLabel: string) {
  if (activeItem === "dashboard") return "High-level booking, order, user, revenue, and payment intelligence.";
  if (activeItem === "orders") return "Track order payments, methods, and customer transaction volume.";
  if (activeItem === "venues") return "Inspect venue seat layouts across booking categories.";
  if (activeItem === "refunds") return "Review eligible bookings and initiate refunds from one focused queue.";
  if (activeItem === "customers") return "Browse customers, account details, wallet balance, rewards, and preferences.";
  return `Track only ${activeLabel.toLowerCase()} bookings, sales, tickets, and route health.`;
}
