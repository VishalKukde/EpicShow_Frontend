export type BookingType = "movies" | "sports" | "events" | "gaming" | "trains";

export type BookingRow = {
  _id: string;
  title: string;
  userName: string;
  userEmail?: string;
  status: string;
  bookingTime: string;
  theater: string;
  ticketCount: number;
  saleAmount: number;
  itemId?: string;
  showId?: string;
  matchId?: string;
  sportType?: string;
  league?: string;
  matchNo?: string;
  teams?: {
    teamA?: string;
    teamB?: string;
    label?: string;
  };
  schedule?: {
    date?: string;
    time?: string;
  };
  venue?: {
    id?: string;
    name?: string;
    city?: string;
  };
  date?: string;
  slot?: string;
  seatIds?: string[];
  amount?: number;
  coupon?: string;
  couponDiscount?: number;
  rewardPointsRedeemed?: number;
  rewardDiscount?: number;
  paymentId?: string;
  razorpayOrderId?: string;
  showType?: string;
  createdAt?: string;
};

export type BookingStats = {
  totalBookings: number;
  totalTickets: number;
  totalSales: number;
  pending: number;
  refunds: number;
  averageOrderValue: number;
};

export type BookingPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
};

export type BookingResponse = {
  data: BookingRow[];
  filters: { statuses: string[]; theaters: string[] };
  stats: BookingStats;
  pagination: BookingPagination;
};
