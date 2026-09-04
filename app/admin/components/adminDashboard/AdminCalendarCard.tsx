"use client";

import { useState, useMemo, useEffect } from "react";

export type CalendarFilterMode = "date" | "month" | "year" | "overall" | "custom";

export type DateFilterState = {
    mode: CalendarFilterMode;
    startDate?: string; // ISO String or YYYY-MM-DD
    endDate?: string; // ISO String or YYYY-MM-DD
    label: string;
};

type AdminCalendarCardProps = {
    onFilterChange?: (filterState: DateFilterState) => void;
};

const MONTH_NAMES = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export default function AdminCalendarCard({ onFilterChange }: AdminCalendarCardProps) {
    const today = useMemo(() => new Date(), []);

    const [mode, setMode] = useState<CalendarFilterMode>("date");
    const [selectedDate, setSelectedDate] = useState<Date>(today);
    const [currentMonthView, setCurrentMonthView] = useState<number>(today.getMonth());
    const [currentYearView, setCurrentYearView] = useState<number>(today.getFullYear());

    const [selectedMonth, setSelectedMonth] = useState<number>(today.getMonth());
    const [selectedYear, setSelectedYear] = useState<number>(today.getFullYear());
    const [customStart, setCustomStart] = useState<string>(today.toISOString().split("T")[0]);
    const [customEnd, setCustomEnd] = useState<string>(today.toISOString().split("T")[0]);

    // Helper to calculate exact date boundaries and notify parent
    const notifyFilter = (
        currentMode: CalendarFilterMode,
        dateVal: Date = selectedDate,
        monthVal: number = selectedMonth,
        yearVal: number = selectedYear,
        cStart: string = customStart,
        cEnd: string = customEnd
    ) => {
        let startDate: string | undefined;
        let endDate: string | undefined;
        let label = "All Time (Overall)";

        if (currentMode === "date") {
            const start = new Date(dateVal.getFullYear(), dateVal.getMonth(), dateVal.getDate(), 0, 0, 0, 0);
            const end = new Date(dateVal.getFullYear(), dateVal.getMonth(), dateVal.getDate(), 23, 59, 59, 999);
            startDate = start.toISOString();
            endDate = end.toISOString();
            const isToday = dateVal.toDateString() === today.toDateString();
            label = `${dateVal.getDate()} ${MONTH_NAMES[dateVal.getMonth()]} ${dateVal.getFullYear()}${isToday ? " (Today)" : ""}`;
        } else if (currentMode === "month") {
            const start = new Date(yearVal, monthVal, 1, 0, 0, 0, 0);
            const end = new Date(yearVal, monthVal + 1, 0, 23, 59, 59, 999);
            startDate = start.toISOString();
            endDate = end.toISOString();
            label = `${MONTH_NAMES[monthVal]} ${yearVal}`;
        } else if (currentMode === "year") {
            const start = new Date(yearVal, 0, 1, 0, 0, 0, 0);
            const end = new Date(yearVal, 11, 31, 23, 59, 59, 999);
            startDate = start.toISOString();
            endDate = end.toISOString();
            label = `Year ${yearVal}`;
        } else if (currentMode === "custom") {
            const start = new Date(`${cStart}T00:00:00.000Z`);
            const end = new Date(`${cEnd}T23:59:59.999Z`);
            startDate = start.toISOString();
            endDate = end.toISOString();
            label = `${cStart} to ${cEnd}`;
        }

        if (onFilterChange) {
            onFilterChange({ mode: currentMode, startDate, endDate, label });
        }
    };

    const handleModeChange = (newMode: CalendarFilterMode) => {
        setMode(newMode);
        notifyFilter(newMode);
    };

    // Generate calendar days for date view
    const calendarDays = useMemo(() => {
        const firstDay = new Date(currentYearView, currentMonthView, 1);
        const lastDay = new Date(currentYearView, currentMonthView + 1, 0);
        const startDayOfWeek = firstDay.getDay();
        const totalDays = lastDay.getDate();

        const days: (number | null)[] = [];
        for (let i = 0; i < startDayOfWeek; i++) {
            days.push(null);
        }
        for (let d = 1; d <= totalDays; d++) {
            days.push(d);
        }
        return days;
    }, [currentMonthView, currentYearView]);

    const activeSelectionLabel = useMemo(() => {
        if (mode === "date") {
            const isToday = selectedDate.toDateString() === today.toDateString();
            return `${selectedDate.getDate()} ${MONTH_NAMES[selectedDate.getMonth()]} ${selectedDate.getFullYear()}${isToday ? " (Today)" : ""}`;
        }
        if (mode === "month") {
            return `${MONTH_NAMES[selectedMonth]} ${selectedYear}`;
        }
        if (mode === "year") {
            return `Year ${selectedYear}`;
        }
        if (mode === "custom") {
            return `${customStart} to ${customEnd}`;
        }
        return "All Time (Overall)";
    }, [mode, selectedDate, selectedMonth, selectedYear, customStart, customEnd, today]);

    return (
        <div
            className="admin-dashboard-card"
            style={{
                background: "var(--admin-surface)",
                border: "1px solid var(--admin-border)",
                borderRadius: 20,
                padding: "18px 20px",
                boxShadow: "0 6px 28px rgba(15,13,26,.035)",
                display: "flex",
                flexDirection: "column",
                gap: 12,
                height: 310,
                boxSizing: "border-box",
                overflow: "hidden",
            }}
        >
            {/* ── Card Header ── */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                    <p style={{ margin: 0, color: "var(--admin-text)", fontSize: 13.5, fontWeight: 700 }}>Calendar Filter</p>
                    <p style={{ margin: "1px 0 0", color: "var(--admin-text-secondary)", fontSize: 11, fontWeight: 500 }}>
                        Select date range to filter overview
                    </p>
                </div>
                <span
                    style={{
                        color: "#6C63FF",
                        background: "rgba(99, 102, 241, 0.08)",
                        border: "1px solid rgba(99, 102, 241, 0.18)",
                        borderRadius: 999,
                        padding: "2px 8px",
                        fontSize: 10,
                        fontWeight: 700,
                    }}
                >
                    {activeSelectionLabel}
                </span>
            </div>

            {/* ── Filter Mode Selector Tabs (Date, Month, Year, Overall, Custom) ── */}
            <div
                style={{
                    display: "flex",
                    gap: 3,
                    background: "var(--admin-soft)",
                    padding: 3,
                    borderRadius: 10,
                    border: "1px solid var(--admin-border)",
                    overflowX: "auto",
                }}
            >
                {(["date", "month", "year", "overall", "custom"] as CalendarFilterMode[]).map((m) => (
                    <button
                        key={m}
                        type="button"
                        onClick={() => handleModeChange(m)}
                        style={{
                            flex: 1,
                            padding: "4px 6px",
                            fontSize: 10.5,
                            fontWeight: mode === m ? 700 : 600,
                            color: mode === m ? "#6C63FF" : "var(--admin-text-secondary)",
                            background: mode === m ? "var(--admin-surface)" : "transparent",
                            border: "none",
                            borderRadius: 7,
                            cursor: "pointer",
                            boxShadow: mode === m ? "0 2px 6px rgba(0,0,0,0.05)" : "none",
                            transition: "all 120ms ease",
                            textTransform: "capitalize",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {m}
                    </button>
                ))}
            </div>

            {/* ── Inner View Container ── */}
            <div style={{ height: 200, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                {/* 1. DATE MODE */}
                {mode === "date" && (
                    <div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                            <button
                                type="button"
                                onClick={() => {
                                    if (currentMonthView === 0) {
                                        setCurrentMonthView(11);
                                        setCurrentYearView((y) => y - 1);
                                    } else {
                                        setCurrentMonthView((m) => m - 1);
                                    }
                                }}
                                style={{ background: "transparent", border: "none", color: "var(--admin-text-secondary)", cursor: "pointer", fontSize: 13 }}
                            >
                                ‹
                            </button>
                            <span style={{ fontSize: 11.5, fontWeight: 700, color: "var(--admin-text)" }}>
                                {MONTH_NAMES[currentMonthView]} {currentYearView}
                            </span>
                            <button
                                type="button"
                                onClick={() => {
                                    if (currentMonthView === 11) {
                                        setCurrentMonthView(0);
                                        setCurrentYearView((y) => y + 1);
                                    } else {
                                        setCurrentMonthView((m) => m + 1);
                                    }
                                }}
                                style={{ background: "transparent", border: "none", color: "var(--admin-text-secondary)", cursor: "pointer", fontSize: 13 }}
                            >
                                ›
                            </button>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, textAlign: "center", marginBottom: 2 }}>
                            {WEEKDAYS.map((day) => (
                                <span key={day} style={{ fontSize: 9.5, fontWeight: 600, color: "var(--admin-text-muted)" }}>{day}</span>
                            ))}
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
                            {calendarDays.map((day, idx) => {
                                if (day === null) {
                                    return <div key={`empty-${idx}`} />;
                                }
                                const isSelected =
                                    selectedDate.getDate() === day &&
                                    selectedDate.getMonth() === currentMonthView &&
                                    selectedDate.getFullYear() === currentYearView;
                                const isToday =
                                    today.getDate() === day &&
                                    today.getMonth() === currentMonthView &&
                                    today.getFullYear() === currentYearView;

                                return (
                                    <button
                                        key={day}
                                        type="button"
                                        onClick={() => {
                                            const newD = new Date(currentYearView, currentMonthView, day);
                                            setSelectedDate(newD);
                                            notifyFilter("date", newD);
                                        }}
                                        style={{
                                            height: 24,
                                            borderRadius: 6,
                                            border: "none",
                                            background: isSelected ? "#6C63FF" : isToday ? "rgba(99, 102, 241, 0.12)" : "transparent",
                                            color: isSelected ? "#FFF" : isToday ? "#6C63FF" : "var(--admin-text)",
                                            fontSize: 10.5,
                                            fontWeight: isSelected || isToday ? 700 : 500,
                                            cursor: "pointer",
                                            transition: "all 120ms ease",
                                        }}
                                    >
                                        {day}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* 2. MONTH MODE */}
                {mode === "month" && (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
                        {MONTH_NAMES.map((mName, mIdx) => {
                            const isSelected = selectedMonth === mIdx && selectedYear === currentYearView;
                            return (
                                <button
                                    key={mName}
                                    type="button"
                                    onClick={() => {
                                        setSelectedMonth(mIdx);
                                        setSelectedYear(currentYearView);
                                        notifyFilter("month", selectedDate, mIdx, currentYearView);
                                    }}
                                    style={{
                                        padding: "8px 4px",
                                        borderRadius: 8,
                                        border: "none",
                                        background: isSelected ? "#6C63FF" : "var(--admin-soft)",
                                        color: isSelected ? "#FFF" : "var(--admin-text)",
                                        fontSize: 11,
                                        fontWeight: isSelected ? 700 : 600,
                                        cursor: "pointer",
                                    }}
                                >
                                    {mName}
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* 3. YEAR MODE */}
                {mode === "year" && (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
                        {[2024, 2025, 2026, 2027].map((yr) => {
                            const isSelected = selectedYear === yr;
                            return (
                                <button
                                    key={yr}
                                    type="button"
                                    onClick={() => {
                                        setSelectedYear(yr);
                                        notifyFilter("year", selectedDate, selectedMonth, yr);
                                    }}
                                    style={{
                                        padding: "12px 8px",
                                        borderRadius: 10,
                                        border: "none",
                                        background: isSelected ? "#6C63FF" : "var(--admin-soft)",
                                        color: isSelected ? "#FFF" : "var(--admin-text)",
                                        fontSize: 12,
                                        fontWeight: isSelected ? 700 : 600,
                                        cursor: "pointer",
                                    }}
                                >
                                    {yr}
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* 4. OVERALL MODE */}
                {mode === "overall" && (
                    <div
                        style={{
                            padding: 16,
                            borderRadius: 12,
                            background: "var(--admin-soft)",
                            border: "1px dashed var(--admin-border)",
                            textAlign: "center",
                        }}
                    >
                        <p style={{ margin: 0, fontSize: 11.5, fontWeight: 600, color: "var(--admin-text-secondary)" }}>
                            Showing aggregated metrics across all time periods.
                        </p>
                    </div>
                )}

                {/* 5. CUSTOM RANGE MODE */}
                {mode === "custom" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        <div>
                            <label style={{ display: "block", fontSize: 10, fontWeight: 600, color: "var(--admin-text-secondary)", marginBottom: 3 }}>
                                Start Date
                            </label>
                            <input
                                type="date"
                                value={customStart}
                                onChange={(e) => {
                                    setCustomStart(e.target.value);
                                    notifyFilter("custom", selectedDate, selectedMonth, selectedYear, e.target.value, customEnd);
                                }}
                                style={{
                                    width: "100%",
                                    padding: "5px 8px",
                                    borderRadius: 7,
                                    border: "1px solid var(--admin-border)",
                                    background: "var(--admin-surface)",
                                    color: "var(--admin-text)",
                                    fontSize: 11,
                                    boxSizing: "border-box",
                                }}
                            />
                        </div>
                        <div>
                            <label style={{ display: "block", fontSize: 10, fontWeight: 600, color: "var(--admin-text-secondary)", marginBottom: 3 }}>
                                End Date
                            </label>
                            <input
                                type="date"
                                value={customEnd}
                                onChange={(e) => {
                                    setCustomEnd(e.target.value);
                                    notifyFilter("custom", selectedDate, selectedMonth, selectedYear, customStart, e.target.value);
                                }}
                                style={{
                                    width: "100%",
                                    padding: "5px 8px",
                                    borderRadius: 7,
                                    border: "1px solid var(--admin-border)",
                                    background: "var(--admin-surface)",
                                    color: "var(--admin-text)",
                                    fontSize: 11,
                                    boxSizing: "border-box",
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
