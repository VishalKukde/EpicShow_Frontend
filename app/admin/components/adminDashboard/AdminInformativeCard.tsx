"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import AnimatedNumber from "./AnimatedNumber";
import { compact, formatCurrency } from "./formatters";
import type { DashboardData } from "./types";

type AdminInformativeCardProps = {
    dashboard: DashboardData | null;
    loading: boolean;
};

const CHANNELS_CONFIG = [
    {
        type: "movies",
        badge: "🍿 Movie Channel",
        tag: "🎬 Top Trending Vertical",
        color: "#6C63FF",
    },
    {
        type: "sports",
        badge: "⚽ Sports Channel",
        tag: "🏆 Live Arena Bookings",
        color: "#10B981",
    },
    {
        type: "gaming",
        badge: "🎮 Gaming Channel",
        tag: "🕹️ Esports & Arcade Hub",
        color: "#F59E0B",
    },
    {
        type: "trains",
        badge: "🚆 Train Channel",
        tag: "🎫 Express Transit Lines",
        color: "#0EA5E9",
    },
];

export default function AdminInformativeCard({ dashboard, loading }: AdminInformativeCardProps) {
    const totalOrders = Math.max(dashboard?.kpis?.totalOrders || dashboard?.totalBookings || 1, 1);
    const totalRevenue = dashboard?.kpis?.revenue || dashboard?.totalRevenue || 0;
    const paidOrders = dashboard?.kpis?.paidOrders || dashboard?.totalBookings || 0;

    const aov = Math.round(totalRevenue / totalOrders);
    const successRate = Math.round((paidOrders / totalOrders) * 100);

    const [channelIndex, setChannelIndex] = useState(0);
    const tickerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timer = setInterval(() => {
            if (tickerRef.current) {
                gsap.to(tickerRef.current, {
                    y: -8,
                    opacity: 0,
                    duration: 0.3,
                    ease: "power2.in",
                    onComplete: () => {
                        setChannelIndex((prev) => (prev + 1) % CHANNELS_CONFIG.length);
                        gsap.fromTo(
                            tickerRef.current,
                            { y: 8, opacity: 0 },
                            { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" }
                        );
                    },
                });
            } else {
                setChannelIndex((prev) => (prev + 1) % CHANNELS_CONFIG.length);
            }
        }, 2500);

        return () => clearInterval(timer);
    }, []);

    const activeChannelConfig = CHANNELS_CONFIG[channelIndex];
    const activeStats = dashboard?.categoryStats.find((c) => c.type === activeChannelConfig.type);
    const bookings = activeStats?.totalBookings || 0;
    const sales = activeStats?.totalSales || 0;

    return (
        <div
            className="admin-dashboard-card"
            style={{
                background: "var(--admin-hero-bg)",
                border: "1px solid var(--admin-border)",
                borderRadius: 20,
                padding: "20px 24px",
                boxShadow: "0 8px 32px rgba(15,13,26,.06)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: 310,
                boxSizing: "border-box",
                color: "var(--admin-hero-text)",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Background radial glow */}
            <div
                style={{
                    position: "absolute",
                    top: -40,
                    right: -40,
                    width: 200,
                    height: 200,
                    borderRadius: 999,
                    background: "radial-gradient(circle, rgba(108,99,255,0.18) 0%, rgba(0,0,0,0) 70%)",
                    pointerEvents: "none",
                }}
            />

            {/* Header section */}
            <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span
                        style={{
                            color: "#10B981",
                            background: "rgba(16,185,129,.12)",
                            border: "1px solid rgba(16,185,129,.25)",
                            borderRadius: 999,
                            padding: "3px 10px",
                            fontSize: 10.5,
                            fontWeight: 700,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            letterSpacing: ".04em",
                            textTransform: "uppercase",
                        }}
                    >
                        <span style={{ width: 6, height: 6, borderRadius: 999, background: "#10B981" }} />
                        Gateways Healthy
                    </span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: "var(--admin-hero-muted)" }}>
                        Peak Traffic Window: 7:00 PM – 9:30 PM
                    </span>
                </div>

                <h3 style={{ margin: 0, fontSize: 19, fontWeight: 800, letterSpacing: "-.03em" }}>
                    Executive Platform Intelligence
                </h3>
                <p style={{ margin: "4px 0 0", color: "var(--admin-hero-muted)", fontSize: 12, fontWeight: 500 }}>
                    Real-time transactional health, revenue velocity, & vertical channel metrics.
                </p>
            </div>

            {/* Highlights Grid - 3 Focused Metrics */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, margin: "8px 0" }}>
                <div
                    style={{
                        background: "var(--admin-hero-metric-bg)",
                        border: "1px solid var(--admin-hero-metric-border)",
                        borderRadius: 14,
                        padding: "10px 14px",
                        backdropFilter: "blur(12px)",
                    }}
                >
                    <span style={{ fontSize: 10.5, color: "var(--admin-hero-muted)", fontWeight: 600, display: "block" }}>
                        Conversion Rate
                    </span>
                    <span style={{ fontSize: 17, fontWeight: 800, color: "var(--admin-hero-accent)", marginTop: 2, display: "block" }}>
                        4.82%
                    </span>
                    <span style={{ fontSize: 9.5, color: "#10B981", fontWeight: 700, marginTop: 2, display: "block" }}>
                        ↑ +0.6% MoM
                    </span>
                </div>

                <div
                    style={{
                        background: "var(--admin-hero-metric-bg)",
                        border: "1px solid var(--admin-hero-metric-border)",
                        borderRadius: 14,
                        padding: "10px 14px",
                        backdropFilter: "blur(12px)",
                    }}
                >
                    <span style={{ fontSize: 10.5, color: "var(--admin-hero-muted)", fontWeight: 600, display: "block" }}>
                        Avg Order Value
                    </span>
                    <span style={{ fontSize: 17, fontWeight: 800, color: "var(--admin-hero-text)", marginTop: 2, display: "block" }}>
                        <AnimatedNumber value={aov} formatter={(val) => (loading ? "–" : formatCurrency(val))} />
                    </span>
                    <span style={{ fontSize: 9.5, color: "var(--admin-hero-muted)", fontWeight: 500, marginTop: 2, display: "block" }}>
                        Across all categories
                    </span>
                </div>

                <div
                    style={{
                        background: "var(--admin-hero-metric-bg)",
                        border: "1px solid var(--admin-hero-metric-border)",
                        borderRadius: 14,
                        padding: "10px 14px",
                        backdropFilter: "blur(12px)",
                    }}
                >
                    <span style={{ fontSize: 10.5, color: "var(--admin-hero-muted)", fontWeight: 600, display: "block" }}>
                        Payment Rate
                    </span>
                    <span style={{ fontSize: 17, fontWeight: 800, color: "#10B981", marginTop: 2, display: "block" }}>
                        <AnimatedNumber value={successRate} formatter={(val) => (loading ? "–" : `${Math.round(val)}%`)} isInteger={true} />
                    </span>
                    <span style={{ fontSize: 9.5, color: "var(--admin-hero-muted)", fontWeight: 500, marginTop: 2, display: "block" }}>
                        Completed orders
                    </span>
                </div>
            </div>

            {/* GSAP Rotating Channel Ticker (4-Second Interval) without counter animation */}
            <div
                style={{
                    paddingTop: 10,
                    borderTop: "1px solid var(--admin-hero-metric-border)",
                    overflow: "hidden",
                    height: 35,
                }}
            >
                <div
                    ref={tickerRef}
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span
                            style={{
                                background: `${activeChannelConfig.color}20`,
                                color: activeChannelConfig.color,
                                border: `1px solid ${activeChannelConfig.color}40`,
                                borderRadius: 8,
                                padding: "3px 10px",
                                fontSize: 11,
                                fontWeight: 700,
                                transition: "all 300ms ease",
                            }}
                        >
                            {activeChannelConfig.badge}
                        </span>
                        <span style={{ fontSize: 11.5, color: "var(--admin-hero-muted)", fontWeight: 500 }}>
                            Bookings:{" "}
                            <strong style={{ color: "var(--admin-hero-text)" }}>
                                {compact.format(bookings)}
                            </strong>
                        </span>
                        <span style={{ fontSize: 11.5, color: "var(--admin-hero-muted)", fontWeight: 500 }}>
                            Sales:{" "}
                            <strong style={{ color: "#10B981" }}>
                                {formatCurrency(sales)}
                            </strong>
                        </span>
                    </div>

                    <span
                        style={{
                            color: "var(--admin-hero-muted)",
                            fontSize: 11,
                            fontWeight: 600,
                            letterSpacing: ".02em",
                        }}
                    >
                        {activeChannelConfig.tag}
                    </span>
                </div>
            </div>
        </div>
    );
}
