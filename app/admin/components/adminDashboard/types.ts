export type BookingType = "movies" | "sports" | "gaming" | "trains";

export type ActivePage =
  | "dashboard"
  // Bookings
  | "movies"
  | "sports"
  | "gaming"
  | "trains"
  // Catalog & Inventory
  | "add-movie"
  | "add-sport"
  | "add-gaming"
  | "add-train"
  // Operations Hub
  | "orders"
  | "venues"
  | "refunds"
  | "customers"
  // Marketing & Growth
  | "coupons"
  | "loyalty"
  | "banners"
  // Financial Analytics
  | "revenue"
  | "reporting"
  // System & Security
  | "staff"
  | "notifications"
  | "settings";

export type MetricDelta = {
  value: string;
  isPositive: boolean;
};

export type CategoryStat = {
  name: string;
  count: number;
  revenue: number;
  type?: string;
  label?: string;
  percent?: number;
  bookings?: number;
  totalBookings?: number;
  totalSales?: number;
  totalTickets?: number;
  pending?: number;
  refunds?: number;
  averageOrderValue?: number;
};

export type RecentBooking = {
  id: string;
  bookingId?: string;
  customerName: string;
  title: string;
  type: string;
  category?: string;
  seatsCount: number;
  amount: number;
  bookingDate: string;
  status: string;
};

export type DashboardKpis = {
  totalBookings?: number;
  revenue?: number;
  totalUsers?: number;
  proUsers?: number;
  freeUsers?: number;
  totalOrders?: number;
  paidOrders?: number;
  failedOrders?: number;
  refundedOrders?: number;
  pendingRefunds?: number;
};

export type MonthlyCategoryBreakdown = {
  movies?: { count?: number; sales?: number };
  sports?: { count?: number; sales?: number };
  gaming?: { count?: number; sales?: number };
  trains?: { count?: number; sales?: number };
};

export type MonthlyRevenueItem = {
  month: string;
  revenue: number;
  paidCount?: number;
  failedCount?: number;
  refundedCount?: number;
  paidAmount?: number;
  failedAmount?: number;
  refundedAmount?: number;
  byCategory?: MonthlyCategoryBreakdown;
};

export type DashboardData = {
  totalBookings: number;
  totalRevenue: number;
  activeUsers: number;
  occupancyRate: number;
  bookingsDelta: MetricDelta;
  revenueDelta: MetricDelta;
  usersDelta: MetricDelta;
  occupancyDelta: MetricDelta;
  categoryStats: CategoryStat[];
  recentBookings: RecentBooking[];
  kpis?: DashboardKpis;
  categorySplits?: CategoryStat[];
  monthlyRevenue?: MonthlyRevenueItem[];
};
