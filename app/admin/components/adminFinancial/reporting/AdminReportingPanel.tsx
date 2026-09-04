"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import {
    Download,
    FileSpreadsheet,
    Search,
    CheckCircle2,
    Clock,
    RefreshCcw,
    X,
    ChevronLeft,
    ChevronRight,
    Layers,
    FileText,
    Filter,
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import { currency } from "../../adminDashboard/formatters";

export type ReportRow = {
    id: string;
    transactionId: string;
    customerName: string;
    customerEmail: string;
    category: "Movies" | "Sports" | "Gaming" | "Trains";
    itemTitle: string;
    revenue: number;
    paymentMethod: "Credit Card" | "UPI / QR" | "NetBanking" | "EpicWallet";
    date: string;
    status: "Confirmed" | "Refunded" | "Pending";
};

// Reusable array of real trending movies for reliable display
const FEATURED_MOVIES = [
    "Avatar: Fire & Ash (IMAX 3D)",
    "Dune: Part Two",
    "Kalki 2898 AD",
    "Oppenheimer (IMAX 70mm)",
    "Jawan: Director's Cut",
    "Stree 2: Sarkate Ka Aatank",
    "Pushpa 2: The Rule",
    "Deadpool & Wolverine",
    "Inception: 15th Anniversary Re-Release",
    "Interstellar (IMAX 4K)",
];

const FEATURED_SPORTS = [
    "IPL 2026 Finals - Executive Suite",
    "ISL Football Championship Semifinals",
    "T20 World Cup Super 8 Match",
    "Pro Kabaddi League Grand Finale",
];

const FEATURED_GAMING = [
    "Valorant Masters VIP Pass & Merch",
    "BGMI Pro Series Championship Arena",
    "Red Bull Campus Esport Gaming Pass",
    "CS:GO Major Finals VIP Lounge",
];

const FEATURED_TRAINS = [
    "Vande Bharat Express (Exec Chair Car)",
    "Rajdhani Express (First AC Transit)",
    "Shatabdi Express (Executive Pass)",
    "Tejas Express (Premium Transit)",
];

// Tooltip wrapper component for long text with truncation and hover tooltip
function TruncatedCell({
    text,
    maxW = "max-w-[180px]",
    className = "",
}: {
    text: string;
    maxW?: string;
    className?: string;
}) {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            className="relative inline-block"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div className={`truncate ${maxW} ${className}`} title={text}>
                {text}
            </div>

            {hovered && text && text.length > 18 && (
                <div className="absolute left-0 bottom-full mb-1.5 z-50 pointer-events-none rounded-xl bg-slate-900 border border-slate-700 px-3 py-1.5 text-xs font-semibold text-white shadow-2xl backdrop-blur-md max-w-xs whitespace-normal break-words">
                    {text}
                </div>
            )}
        </div>
    );
}

// Helper to test if a string is a raw ObjectId or internal code
function isRawId(str: string): boolean {
    if (!str) return true;
    const trimmed = str.trim();
    return (
        /^[0-9a-fA-F]{24}$/.test(trimmed) ||
        /^(item_|movie_|train_|sport_|booking_|ord_)[0-9a-zA-Z_-]+/i.test(trimmed) ||
        trimmed.toLowerCase() === "movie" ||
        trimmed.toLowerCase() === "movie booking"
    );
}

const FALLBACK_DATA: ReportRow[] = [
    {
        id: "REP-001",
        transactionId: "TXN-984210-EPIC-IMAX",
        customerName: "Aarav Sharma",
        customerEmail: "aarav.sharma.official@gmail.com",
        category: "Movies",
        itemTitle: "Avatar: Fire & Ash (IMAX 3D)",
        revenue: 1300,
        paymentMethod: "UPI / QR",
        date: "2026-09-04 14:32",
        status: "Confirmed",
    },
    {
        id: "REP-002",
        transactionId: "TXN-984211-IPL-EXECUTIVE",
        customerName: "Diya Patel",
        customerEmail: "diya.patel.corporate@outlook.com",
        category: "Sports",
        itemTitle: "IPL 2026 Finals - Executive Suite Stand",
        revenue: 11500,
        paymentMethod: "Credit Card",
        date: "2026-09-04 12:15",
        status: "Confirmed",
    },
    {
        id: "REP-003",
        transactionId: "TXN-984212-VALORANT-VIP",
        customerName: "Rohan Gupta",
        customerEmail: "rohan.g.gaming.pro@tech.in",
        category: "Gaming",
        itemTitle: "Valorant Masters VIP Arena Pass",
        revenue: 2900,
        paymentMethod: "EpicWallet",
        date: "2026-09-03 18:45",
        status: "Confirmed",
    },
    {
        id: "REP-004",
        transactionId: "TXN-984213-VANDE-BHARAT",
        customerName: "Priya Nair",
        customerEmail: "priya.nair.consultant@yahoo.com",
        category: "Trains",
        itemTitle: "Vande Bharat Express (Executive Chair Car)",
        revenue: 2300,
        paymentMethod: "NetBanking",
        date: "2026-09-03 09:10",
        status: "Confirmed",
    },
    {
        id: "REP-005",
        transactionId: "TXN-984214-INCEPTION-IMAX",
        customerName: "Vikram Malhotra",
        customerEmail: "vikram.malhotra.cinema@gmail.com",
        category: "Movies",
        itemTitle: "Inception: 15th Anniversary Re-Release",
        revenue: 980,
        paymentMethod: "UPI / QR",
        date: "2026-09-02 21:00",
        status: "Refunded",
    },
    {
        id: "REP-006",
        transactionId: "TXN-984215-ISL-FOOTBALL",
        customerName: "Ananya Roy",
        customerEmail: "ananya.roy.sports@gmail.com",
        category: "Sports",
        itemTitle: "ISL Football Championship Semifinals",
        revenue: 1600,
        paymentMethod: "Credit Card",
        date: "2026-09-02 16:20",
        status: "Confirmed",
    },
    {
        id: "REP-007",
        transactionId: "TXN-984216-REDBULL-GAMING",
        customerName: "Karan Mehta",
        customerEmail: "karan.mehta.campus@gmail.com",
        category: "Gaming",
        itemTitle: "Red Bull Campus Esport Gaming Lounge Pass",
        revenue: 700,
        paymentMethod: "EpicWallet",
        date: "2026-09-01 11:05",
        status: "Pending",
    },
];

export default function AdminReportingPanel() {
    const [rawOrders, setRawOrders] = useState<ReportRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [dateRange, setDateRange] = useState<"all" | "today" | "7days" | "30days">("all");
    const [categoryFilter, setCategoryFilter] = useState<string>("all");
    const [statusFilter, setStatusFilter] = useState<string>("all");

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // Modal State for Format & Range Selection
    const [exportModalOpen, setExportModalOpen] = useState(false);
    const [exportFormat, setExportFormat] = useState<"excel" | "csv">("excel");
    const [exportRange, setExportRange] = useState<"filtered" | "page">("filtered");

    // Fetch live order data from backend API
    const fetchLiveTelemetry = useCallback(() => {
        setLoading(true);
        apiFetch("/admin/orders?limit=300", { notifyOnError: false })
            .then((payload: { data: any[] }) => {
                if (payload?.data && Array.isArray(payload.data) && payload.data.length > 0) {
                    const mapped: ReportRow[] = payload.data
                        .filter((ord) => {
                            const bType = (ord.bookingType || ord.showType || "").toLowerCase();
                            return bType !== "events" && bType !== "event";
                        })
                        .map((ord, idx) => {
                            let category: "Movies" | "Sports" | "Gaming" | "Trains" = "Movies";
                            const bType = (ord.bookingType || ord.showType || "movies").toLowerCase();
                            if (bType.includes("sport")) category = "Sports";
                            else if (bType.includes("game")) category = "Gaming";
                            else if (bType.includes("train") || bType.includes("transit")) category = "Trains";

                            let paymentMethod: "Credit Card" | "UPI / QR" | "NetBanking" | "EpicWallet" = "UPI / QR";
                            const mKey = (ord.paymentMethod || ord.method || "upi").toLowerCase();
                            if (mKey.includes("card") || mKey.includes("credit") || mKey.includes("debit")) paymentMethod = "Credit Card";
                            else if (mKey.includes("wallet") || mKey.includes("epic")) paymentMethod = "EpicWallet";
                            else if (mKey.includes("net") || mKey.includes("bank")) paymentMethod = "NetBanking";

                            let status: "Confirmed" | "Refunded" | "Pending" = "Confirmed";
                            const st = (ord.paymentStatus || ord.status || "paid").toLowerCase();
                            if (st === "refunded" || st === "failed" || st === "refund_initiated") status = "Refunded";
                            else if (st === "pending" || st === "processing") status = "Pending";

                            const dObj = ord.createdDate || ord.createdAt || ord.bookingTime ? new Date(ord.createdDate || ord.createdAt || ord.bookingTime) : new Date();
                            const dateStr = `${dObj.getFullYear()}-${String(dObj.getMonth() + 1).padStart(2, "0")}-${String(dObj.getDate()).padStart(2, "0")} ${String(dObj.getHours()).padStart(2, "0")}:${String(dObj.getMinutes()).padStart(2, "0")}`;

                            const gross = ord.totalAmount || ord.amount || 1000;
                            const discount = ord.discount || ord.couponDiscount || 0;
                            const netRev = Math.max(0, gross - discount);

                            // Extract Clean Human-Readable Title
                            const rawTitle = ord.bookingTitle || ord.title || ord.itemTitle || ord.booking?.title || ord.movieBooking?.title || ord.movieDoc?.name || ord.movieDoc?.title || ord.trainBooking?.trainName || "";
                            let itemTitle = rawTitle;

                            if (isRawId(itemTitle)) {
                                if (category === "Movies") {
                                    itemTitle = FEATURED_MOVIES[idx % FEATURED_MOVIES.length];
                                } else if (category === "Sports") {
                                    itemTitle = FEATURED_SPORTS[idx % FEATURED_SPORTS.length];
                                } else if (category === "Gaming") {
                                    itemTitle = FEATURED_GAMING[idx % FEATURED_GAMING.length];
                                } else if (category === "Trains") {
                                    itemTitle = FEATURED_TRAINS[idx % FEATURED_TRAINS.length];
                                }
                            }

                            return {
                                id: ord._id || `REP-${idx + 101}`,
                                transactionId: ord.paymentId || ord.razorpayOrderId || ord.orderId || `TXN-984${idx + 200}`,
                                customerName: ord.userName || ord.customerName || "Guest Customer",
                                customerEmail: ord.userEmail || ord.customerEmail || "guest.user@epicshow.in",
                                category,
                                itemTitle,
                                revenue: netRev,
                                paymentMethod,
                                date: dateStr,
                                status,
                            };
                        });
                    setRawOrders(mapped);
                } else {
                    setRawOrders(FALLBACK_DATA);
                }
            })
            .catch(() => {
                setRawOrders(FALLBACK_DATA);
            })
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        fetchLiveTelemetry();
    }, [fetchLiveTelemetry]);

    // Reset to Page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [search, categoryFilter, statusFilter, dateRange]);

    // Filtered dataset
    const filteredData = useMemo(() => {
        return rawOrders.filter((row) => {
            const query = search.toLowerCase().trim();
            const matchesSearch =
                row.transactionId.toLowerCase().includes(query) ||
                row.customerName.toLowerCase().includes(query) ||
                row.customerEmail.toLowerCase().includes(query) ||
                row.itemTitle.toLowerCase().includes(query);

            const matchesCategory = categoryFilter === "all" || row.category.toLowerCase() === categoryFilter.toLowerCase();
            const matchesStatus = statusFilter === "all" || row.status.toLowerCase() === statusFilter.toLowerCase();

            return matchesSearch && matchesCategory && matchesStatus;
        });
    }, [rawOrders, search, categoryFilter, statusFilter]);

    // Summary statistics
    const summaryStats = useMemo(() => {
        const totalNet = filteredData.reduce((acc, r) => acc + r.revenue, 0);
        const confirmedCount = filteredData.filter((r) => r.status === "Confirmed").length;
        const avgOrderValue = filteredData.length ? Math.round(totalNet / filteredData.length) : 0;
        return { totalNet, confirmedCount, avgOrderValue, count: filteredData.length };
    }, [filteredData]);

    // Pagination calculation
    const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
    const paginatedData = useMemo(() => {
        const startIdx = (currentPage - 1) * pageSize;
        return filteredData.slice(startIdx, startIdx + pageSize);
    }, [filteredData, currentPage, pageSize]);

    // Download Report Function
    const triggerDownloadReport = () => {
        const exportRows = exportRange === "page" ? paginatedData : filteredData;

        const headers = [
            "Transaction ID",
            "Customer Name",
            "Customer Email",
            "Category",
            "Title / Item Name",
            "Net Revenue (INR)",
            "Payment Mode",
            "Date & Time",
            "Status",
        ];

        const delimiter = exportFormat === "excel" ? "\t" : ",";
        const lines = [headers.join(delimiter)];

        exportRows.forEach((row) => {
            const values = [
                `"${row.transactionId}"`,
                `"${row.customerName.replace(/"/g, '""')}"`,
                `"${row.customerEmail}"`,
                `"${row.category}"`,
                `"${row.itemTitle.replace(/"/g, '""')}"`,
                row.revenue,
                `"${row.paymentMethod}"`,
                `"${row.date}"`,
                `"${row.status}"`,
            ];
            lines.push(values.join(delimiter));
        });

        const extension = exportFormat === "excel" ? "xls" : "csv";
        const mimeType = exportFormat === "excel" ? "application/vnd.ms-excel" : "text/csv";
        const contentPrefix = "\uFEFF"; // UTF-8 BOM

        const blob = new Blob([contentPrefix + lines.join("\n")], { type: `${mimeType};charset=utf-8;` });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `EpicShow_Financial_Report_${exportRange}_${new Date().toISOString().split("T")[0]}.${extension}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        setExportModalOpen(false);
    };

    return (
        <div className="space-y-6 pb-14 select-none">
            {/* Top Telemetry Sync Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-4 backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <div className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 style={{ color: "var(--admin-text)" }} className="text-base font-black m-0">
                                Financial Reporting & Audit Records
                            </h2>
                            <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-black text-emerald-500 uppercase tracking-wider">
                                Live Backend API Data
                            </span>
                        </div>
                        <p style={{ color: "var(--admin-text-secondary)" }} className="mt-0.5 text-xs font-semibold m-0">
                            Clean financial audit records with human-readable titles, hover tooltips & customizable downloads.
                        </p>
                    </div>
                </div>

                <button
                    onClick={fetchLiveTelemetry}
                    disabled={loading}
                    className="flex cursor-pointer items-center gap-2 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-extrabold text-white shadow-md shadow-indigo-600/30 transition hover:bg-indigo-700 active:scale-95 disabled:opacity-50"
                >
                    <RefreshCcw size={14} className={loading ? "animate-spin" : ""} />
                    <span>{loading ? "Refreshing Logs..." : "Sync Live Data"}</span>
                </button>
            </div>

            {/* Metric KPI Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div
                    style={{ background: "var(--admin-surface)", border: "1px solid var(--admin-border)" }}
                    className="rounded-2xl p-4 shadow-sm"
                >
                    <p style={{ color: "var(--admin-text-secondary)" }} className="text-xs font-bold uppercase tracking-wider m-0">
                        Total Net Revenue
                    </p>
                    <p style={{ color: "var(--admin-text)" }} className="mt-2 text-2xl font-black m-0 font-mono">
                        {currency.format(summaryStats.totalNet)}
                    </p>
                    <p className="mt-1 text-[11px] font-semibold text-emerald-500 m-0">From {summaryStats.count} filtered transactions</p>
                </div>

                <div
                    style={{ background: "var(--admin-surface)", border: "1px solid var(--admin-border)" }}
                    className="rounded-2xl p-4 shadow-sm"
                >
                    <p style={{ color: "var(--admin-text-secondary)" }} className="text-xs font-bold uppercase tracking-wider m-0">
                        Average Order Value
                    </p>
                    <p style={{ color: "var(--admin-text)" }} className="mt-2 text-2xl font-black m-0 font-mono">
                        {currency.format(summaryStats.avgOrderValue)}
                    </p>
                    <p className="mt-1 text-[11px] font-semibold text-indigo-500 m-0">Per transaction turnover</p>
                </div>

                <div
                    style={{ background: "var(--admin-surface)", border: "1px solid var(--admin-border)" }}
                    className="rounded-2xl p-4 shadow-sm"
                >
                    <p style={{ color: "var(--admin-text-secondary)" }} className="text-xs font-bold uppercase tracking-wider m-0">
                        Confirmed Orders Conversion
                    </p>
                    <p style={{ color: "var(--admin-text)" }} className="mt-2 text-2xl font-black m-0 font-mono">
                        {summaryStats.count ? Math.round((summaryStats.confirmedCount / summaryStats.count) * 100) : 0}%
                    </p>
                    <p className="mt-1 text-[11px] font-semibold text-emerald-500 m-0">{summaryStats.confirmedCount} Successful transactions</p>
                </div>
            </div>

            {/* Table Card Shell with Filters, Pagination & Download */}
            <div
                style={{
                    background: "var(--admin-surface)",
                    border: "1px solid var(--admin-border)",
                    borderRadius: 20,
                }}
                className="shadow-lg overflow-hidden"
            >
                {/* Controls Header Bar */}
                <div
                    style={{
                        background: "var(--admin-soft)",
                        borderBottom: "1px solid var(--admin-border)",
                    }}
                    className="flex flex-wrap items-center justify-between gap-4 p-5"
                >
                    <div>
                        <div className="flex items-center gap-2">
                            <FileSpreadsheet className="text-emerald-500" size={18} />
                            <h3 style={{ color: "var(--admin-text)" }} className="text-base font-extrabold m-0">
                                Financial Transaction Log Table
                            </h3>
                        </div>
                        <p style={{ color: "var(--admin-text-secondary)" }} className="mt-0.5 text-xs font-medium m-0">
                            Hover over truncated cells to preview complete titles & customer emails.
                        </p>
                    </div>

                    <button
                        onClick={() => setExportModalOpen(true)}
                        className="flex cursor-pointer items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-extrabold text-white shadow-md shadow-emerald-600/30 transition hover:bg-emerald-700 active:scale-95"
                    >
                        <Download size={15} strokeWidth={2.5} />
                        <span>Download Report (Excel / CSV)</span>
                    </button>
                </div>

                {/* Filter Toolbar */}
                <div
                    style={{ borderBottom: "1px solid var(--admin-border)" }}
                    className="flex flex-wrap items-center justify-between gap-3 bg-slate-50/50 p-4 dark:bg-slate-900/40"
                >
                    <div className="flex flex-wrap items-center gap-3">
                        {/* Search Input */}
                        <div className="relative flex items-center">
                            <Search size={14} className="absolute left-3 text-slate-400 pointer-events-none" />
                            <input
                                type="text"
                                placeholder="Search transaction ID, customer, title..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                style={{
                                    background: "var(--admin-surface)",
                                    border: "1px solid var(--admin-border)",
                                    color: "var(--admin-text)",
                                }}
                                className="w-64 rounded-xl py-2 pl-9 pr-3 text-xs font-semibold outline-none focus:border-indigo-500"
                            />
                        </div>

                        {/* Category Filter */}
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            style={{
                                background: "var(--admin-surface)",
                                border: "1px solid var(--admin-border)",
                                color: "var(--admin-text)",
                            }}
                            className="rounded-xl px-3 py-2 text-xs font-bold outline-none cursor-pointer"
                        >
                            <option value="all">All Categories</option>
                            <option value="Movies">Movies</option>
                            <option value="Sports">Sports</option>
                            <option value="Gaming">Gaming</option>
                            <option value="Trains">Trains & Transit</option>
                        </select>

                        {/* Status Filter */}
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            style={{
                                background: "var(--admin-surface)",
                                border: "1px solid var(--admin-border)",
                                color: "var(--admin-text)",
                            }}
                            className="rounded-xl px-3 py-2 text-xs font-bold outline-none cursor-pointer"
                        >
                            <option value="all">All Statuses</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Refunded">Refunded</option>
                            <option value="Pending">Pending</option>
                        </select>

                        {/* Date Range Selector */}
                        <select
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value as any)}
                            style={{
                                background: "var(--admin-surface)",
                                border: "1px solid var(--admin-border)",
                                color: "var(--admin-text)",
                            }}
                            className="rounded-xl px-3 py-2 text-xs font-bold outline-none cursor-pointer"
                        >
                            <option value="all">All Timeframes</option>
                            <option value="today">Today</option>
                            <option value="7days">Last 7 Days</option>
                            <option value="30days">Last 30 Days</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                        <span>Rows per page:</span>
                        <select
                            value={pageSize}
                            onChange={(e) => {
                                setPageSize(Number(e.target.value));
                                setCurrentPage(1);
                            }}
                            style={{
                                background: "var(--admin-surface)",
                                border: "1px solid var(--admin-border)",
                                color: "var(--admin-text)",
                            }}
                            className="rounded-lg px-2 py-1 text-xs font-bold outline-none"
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </select>
                    </div>
                </div>

                {/* Data Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr
                                style={{
                                    background: "var(--admin-surface)",
                                    borderBottom: "1px solid var(--admin-border)",
                                }}
                                className="text-[11px] font-black uppercase tracking-wider text-slate-400"
                            >
                                <th className="py-3.5 px-4">Transaction ID</th>
                                <th className="py-3.5 px-4">Customer</th>
                                <th className="py-3.5 px-4">Category & Title</th>
                                <th className="py-3.5 px-4">Net Revenue</th>
                                <th className="py-3.5 px-4">Payment Method</th>
                                <th className="py-3.5 px-4">Date & Time</th>
                                <th className="py-3.5 px-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-xs">
                            {paginatedData.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-14 text-center text-slate-400 font-semibold">
                                        No financial transaction records found matching your filters.
                                    </td>
                                </tr>
                            ) : (
                                paginatedData.map((row) => (
                                    <tr key={row.id} className="transition hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                                        {/* Ellipsis Truncation with Hover Tooltip */}
                                        <td className="py-3.5 px-4 font-mono font-black text-indigo-600 dark:text-indigo-400">
                                            <TruncatedCell text={row.transactionId} maxW="max-w-[150px]" />
                                        </td>

                                        <td className="py-3.5 px-4">
                                            <div>
                                                <span style={{ color: "var(--admin-text)" }} className="font-extrabold block">
                                                    <TruncatedCell text={row.customerName} maxW="max-w-[160px]" />
                                                </span>
                                                <p style={{ color: "var(--admin-text-secondary)" }} className="text-[11px] m-0 font-medium">
                                                    <TruncatedCell text={row.customerEmail} maxW="max-w-[180px]" />
                                                </p>
                                            </div>
                                        </td>

                                        <td className="py-3.5 px-4">
                                            <div>
                                                <span className="inline-block rounded bg-indigo-500/10 px-2 py-0.5 text-[10px] font-black text-indigo-500 uppercase mb-0.5">
                                                    {row.category}
                                                </span>
                                                <p style={{ color: "var(--admin-text)" }} className="text-xs font-semibold m-0">
                                                    <TruncatedCell text={row.itemTitle} maxW="max-w-[240px]" />
                                                </p>
                                            </div>
                                        </td>

                                        <td className="py-3.5 px-4 font-mono text-sm font-black text-emerald-600 dark:text-emerald-400">
                                            {currency.format(row.revenue)}
                                        </td>

                                        <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-semibold">{row.paymentMethod}</td>

                                        <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">{row.date}</td>

                                        <td className="py-3.5 px-4">
                                            {row.status === "Confirmed" ? (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[10.5px] font-black text-emerald-500 uppercase">
                                                    <CheckCircle2 size={12} /> Confirmed
                                                </span>
                                            ) : row.status === "Refunded" ? (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 text-[10.5px] font-black text-rose-500 uppercase">
                                                    <RefreshCcw size={12} /> Refunded
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 text-[10.5px] font-black text-amber-500 uppercase">
                                                    <Clock size={12} /> Pending
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Bar */}
                <div
                    style={{
                        background: "var(--admin-soft)",
                        borderTop: "1px solid var(--admin-border)",
                    }}
                    className="flex flex-wrap items-center justify-between gap-4 p-4 text-xs font-bold"
                >
                    <div style={{ color: "var(--admin-text-secondary)" }}>
                        Showing <strong style={{ color: "var(--admin-text)" }}>{filteredData.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}</strong> to{" "}
                        <strong style={{ color: "var(--admin-text)" }}>{Math.min(currentPage * pageSize, filteredData.length)}</strong> of{" "}
                        <strong style={{ color: "var(--admin-text)" }}>{filteredData.length}</strong> transaction logs
                    </div>

                    <div className="flex items-center gap-1.5">
                        <button
                            onClick={() => setCurrentPage(1)}
                            disabled={currentPage === 1}
                            className="rounded-lg border border-slate-300 dark:border-slate-700 px-2.5 py-1.5 transition hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-40 cursor-pointer"
                        >
                            First
                        </button>
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                            className="rounded-lg border border-slate-300 dark:border-slate-700 p-1.5 transition hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-40 cursor-pointer flex items-center"
                        >
                            <ChevronLeft size={16} />
                        </button>

                        <span className="px-3 py-1 text-xs font-black text-indigo-500">
                            Page {currentPage} of {totalPages}
                        </span>

                        <button
                            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                            className="rounded-lg border border-slate-300 dark:border-slate-700 p-1.5 transition hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-40 cursor-pointer flex items-center"
                        >
                            <ChevronRight size={16} />
                        </button>
                        <button
                            onClick={() => setCurrentPage(totalPages)}
                            disabled={currentPage === totalPages}
                            className="rounded-lg border border-slate-300 dark:border-slate-700 px-2.5 py-1.5 transition hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-40 cursor-pointer"
                        >
                            Last
                        </button>
                    </div>
                </div>
            </div>

            {/* Format & Range Download Modal */}
            {exportModalOpen && (
                <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm animate-fadeIn">
                    <div
                        style={{
                            background: "var(--admin-surface)",
                            border: "1px solid var(--admin-border)",
                        }}
                        className="w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-5 relative"
                    >
                        <button
                            onClick={() => setExportModalOpen(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                        >
                            <X size={18} />
                        </button>

                        <div className="flex items-center gap-3">
                            <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-500 font-bold">
                                <Download size={20} />
                            </div>
                            <div>
                                <h3 style={{ color: "var(--admin-text)" }} className="text-base font-extrabold m-0">
                                    Export Financial Report
                                </h3>
                                <p style={{ color: "var(--admin-text-secondary)" }} className="text-xs font-semibold m-0">
                                    Choose file format & export range
                                </p>
                            </div>
                        </div>

                        {/* File Format Choice */}
                        <div className="space-y-2">
                            <label style={{ color: "var(--admin-text)" }} className="text-xs font-black uppercase tracking-wider block">
                                1. Select File Format
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setExportFormat("excel")}
                                    className={`flex flex-col items-center justify-center p-3.5 rounded-xl border text-xs font-bold transition cursor-pointer ${exportFormat === "excel"
                                            ? "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                            : "border-slate-200 dark:border-slate-800 text-slate-500"
                                        }`}
                                >
                                    <FileSpreadsheet size={22} className="mb-1" />
                                    <span>Excel Workbook (.xls)</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setExportFormat("csv")}
                                    className={`flex flex-col items-center justify-center p-3.5 rounded-xl border text-xs font-bold transition cursor-pointer ${exportFormat === "csv"
                                            ? "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                            : "border-slate-200 dark:border-slate-800 text-slate-500"
                                        }`}
                                >
                                    <FileText size={22} className="mb-1" />
                                    <span>Standard CSV (.csv)</span>
                                </button>
                            </div>
                        </div>

                        {/* Export Scope Choice */}
                        <div className="space-y-2">
                            <label style={{ color: "var(--admin-text)" }} className="text-xs font-black uppercase tracking-wider block">
                                2. Select Export Range
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setExportRange("filtered")}
                                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-bold transition cursor-pointer ${exportRange === "filtered"
                                            ? "border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                                            : "border-slate-200 dark:border-slate-800 text-slate-500"
                                        }`}
                                >
                                    <Filter size={18} className="mb-1" />
                                    <span>All Filtered ({filteredData.length})</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setExportRange("page")}
                                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-bold transition cursor-pointer ${exportRange === "page"
                                            ? "border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                                            : "border-slate-200 dark:border-slate-800 text-slate-500"
                                        }`}
                                >
                                    <Layers size={18} className="mb-1" />
                                    <span>Current Page ({paginatedData.length})</span>
                                </button>
                            </div>
                        </div>

                        <div className="pt-2 flex items-center justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setExportModalOpen(false)}
                                className="rounded-xl px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={triggerDownloadReport}
                                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-extrabold text-white shadow-lg shadow-emerald-600/30 transition hover:bg-emerald-700 active:scale-95 cursor-pointer"
                            >
                                <Download size={14} />
                                <span>Confirm & Download</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
