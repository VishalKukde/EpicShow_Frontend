import { BookingStatus, ShowType } from "@/constants/Constants";
import { Movie } from "./Movie";

// export type BookingStatus = "pending" | "paid" | "failed" | "cancelled" | "refunded" | "expired";
// export type ShowType = "movie";

export interface Booking {
  _id: string;

  userId: string;

  cinemaId: string;
  itemId: string; // movieId reference

  date: string;   // ISO date string (YYYY-MM-DD)
  slot: string;   // e.g. "01:30 PM"

  seatIds: string[];

  amount: number;
  coupon?: string | null;

  status: BookingStatus;

  paymentId?: string; // only exists when paid

  showType: ShowType;

  createdAt: string;  // ISO string from backend
}


export interface BookingStats {
  totalBookings: number;
  upcomingPaidBookings: number;
}

export interface LatestBooking {
  booking: Booking;
  item: Movie | null;
}
