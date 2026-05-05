export type BookingType = "movies" | "sports" | "events" | "gaming";

export type ActivePage = BookingType | "concerts" | "flights" | "hotels" | "trains" | "orders" | "refunds" | "customers" | "dashboard";

export type DashboardData = {
  kpis: {
    totalBookings: number;
    revenue: number;
    pendingRefunds: number;
    activeVenues: number;
    totalUsers: number;
    totalOrders: number;
    paidOrders: number;
    failedOrders: number;
    refundedOrders: number;
  };
  monthlyRevenue: { month: string; revenue: number }[];
  categorySplits: { type: BookingType; label: string; bookings: number; revenue: number; percent: number }[];
  categoryStats: {
    type: BookingType;
    label: string;
    totalBookings: number;
    totalTickets: number;
    totalSales: number;
    pending: number;
    refunds: number;
    averageOrderValue: number;
  }[];
};
