"use client";

import { useState } from "react";
import { formatCurrency } from "./formatters";
import type { DashboardData } from "./types";

type RevenueChartProps = {
    data: DashboardData["monthlyRevenue"];
    expanded?: boolean;
};

export default function RevenueChart({ data = [], expanded }: RevenueChartProps) {
    const chartData = data || [];
    const max = Math.max(...chartData.map((i) => i.revenue), 1);
    const cm = new Date().getMonth();
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    return (
        <div
            className="admin-dashboard-card"
            style={{
                background: "var(--admin-surface)",
                border: "1px solid var(--admin-border)",
                borderRadius: 20,
                padding: "18px 22px",
                boxShadow: "0 6px 28px rgba(15,13,26,.035)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                position: "relative",
            }}
        >
            {/* Clean Header without top right chip */}
            <div style={{ marginBottom: 14 }}>
                <p style={{ margin: 0, color: "var(--admin-text)", fontSize: 14, fontWeight: 700 }}>Monthly Revenue</p>
                <p style={{ margin: "2px 0 0", color: "var(--admin-text-secondary)", fontSize: 11.5, fontWeight: 500 }}>
                    Paid sales trend across active verticals
                </p>
            </div>

            {/* Interactive Bars Container */}
            <div
                style={{
                    height: expanded ? 180 : 140,
                    display: "flex",
                    alignItems: "end",
                    gap: expanded ? 10 : 8,
                    paddingTop: 14,
                    position: "relative",
                }}
            >
                {chartData.map((item, i) => {
                    const isHovered = hoveredIndex === i;
                    const isCurrentMonth = i === cm;
                    const cats = item.byCategory;

                    return (
                        <div
                            key={item.month}
                            onMouseEnter={() => setHoveredIndex(i)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            style={{
                                flex: 1,
                                display: "flex",
                                flexDirection: "column",
                                gap: 6,
                                alignItems: "center",
                                justifyContent: "flex-end",
                                height: "100%",
                                cursor: "pointer",
                                position: "relative",
                            }}
                        >
                            {/* Floating Professional Hover Card Popover */}
                            {isHovered && (
                                <div
                                    style={{
                                        position: "absolute",
                                        bottom: "calc(100% + 8px)",
                                        left: i > 8 ? "auto" : i < 3 ? "0" : "50%",
                                        right: i > 8 ? "0" : "auto",
                                        transform: i > 8 || i < 3 ? "none" : "translateX(-50%)",
                                        background: "var(--admin-surface)",
                                        border: "1px solid var(--admin-border)",
                                        borderRadius: 16,
                                        padding: "12px 16px",
                                        boxShadow: "0 16px 40px rgba(15,13,26,.22)",
                                        zIndex: 100,
                                        whiteSpace: "nowrap",
                                        pointerEvents: "none",
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 8,
                                        minWidth: 240,
                                    }}
                                >
                                    {/* Popover Header */}
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 14 }}>
                                        <span style={{ fontWeight: 800, color: "var(--admin-text)", fontSize: 12.5 }}>
                                            {item.month} Revenue
                                        </span>
                                        <span style={{ fontWeight: 800, color: "#6C63FF", fontSize: 13 }}>
                                            {formatCurrency(item.revenue)}
                                        </span>
                                    </div>

                                    <div style={{ height: 1, background: "var(--admin-border)" }} />

                                    {/* Payment Status Details */}
                                    <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 11 }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", color: "#10B981" }}>
                                            <span>Successful ({item.paidCount || 0})</span>
                                            <strong>{formatCurrency(item.paidAmount ?? item.revenue)}</strong>
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "space-between", color: "#EF4444" }}>
                                            <span>Failed ({item.failedCount || 0})</span>
                                            <strong>{formatCurrency(item.failedAmount || 0)}</strong>
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "space-between", color: "#6366F1" }}>
                                            <span>Refunded ({item.refundedCount || 0})</span>
                                            <strong>{formatCurrency(item.refundedAmount || 0)}</strong>
                                        </div>
                                    </div>

                                    {/* Category Sales Breakdown */}
                                    {cats && (
                                        <>
                                            <div style={{ height: 1, background: "var(--admin-border)", margin: "2px 0" }} />
                                            <div style={{ fontSize: 10.5, fontWeight: 700, color: "var(--admin-text-secondary)", marginBottom: 2 }}>
                                                Category Breakdown
                                            </div>
                                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 12px", fontSize: 10.5 }}>
                                                <div style={{ display: "flex", justifyContent: "space-between", color: "var(--admin-text)" }}>
                                                    <span>Movies ({cats.movies?.count || 0})</span>
                                                    <strong style={{ color: "#6C63FF", marginLeft: 6 }}>{formatCurrency(cats.movies?.sales || 0)}</strong>
                                                </div>
                                                <div style={{ display: "flex", justifyContent: "space-between", color: "var(--admin-text)" }}>
                                                    <span>Sports ({cats.sports?.count || 0})</span>
                                                    <strong style={{ color: "#10B981", marginLeft: 6 }}>{formatCurrency(cats.sports?.sales || 0)}</strong>
                                                </div>
                                                <div style={{ display: "flex", justifyContent: "space-between", color: "var(--admin-text)" }}>
                                                    <span>Gaming ({cats.gaming?.count || 0})</span>
                                                    <strong style={{ color: "#F59E0B", marginLeft: 6 }}>{formatCurrency(cats.gaming?.sales || 0)}</strong>
                                                </div>
                                                <div style={{ display: "flex", justifyContent: "space-between", color: "var(--admin-text)" }}>
                                                    <span>Trains ({cats.trains?.count || 0})</span>
                                                    <strong style={{ color: "#0EA5E9", marginLeft: 6 }}>{formatCurrency(cats.trains?.sales || 0)}</strong>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}

                            {/* Bar Element */}
                            <div
                                className="admin-revenue-bar"
                                style={{
                                    width: "100%",
                                    minHeight: 6,
                                    height: `${Math.max((item.revenue / max) * (expanded ? 140 : 100), 6)}px`,
                                    borderRadius: "6px 6px 2px 2px",
                                    background: isHovered
                                        ? "#6C63FF"
                                        : isCurrentMonth
                                            ? "rgba(108, 99, 255, 0.75)"
                                            : "var(--admin-chart-muted)",
                                    boxShadow: isHovered ? "0 0 16px rgba(108, 99, 255, 0.45)" : "none",
                                    transform: isHovered ? "scaleY(1.04)" : "scaleY(1)",
                                    transformOrigin: "bottom",
                                    transition: "all 180ms ease",
                                }}
                            />

                            {/* Month Label */}
                            <span
                                style={{
                                    color: isHovered || isCurrentMonth ? "var(--admin-text)" : "var(--admin-text-muted)",
                                    fontSize: 10.5,
                                    fontWeight: isHovered || isCurrentMonth ? 700 : 500,
                                    display: "block",
                                    transition: "color 150ms ease",
                                }}
                            >
                                {item.month}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
