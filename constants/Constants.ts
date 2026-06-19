export const BOOKING_STATUS = {
  PENDING: "pending",
  PAID: "paid",
  UPCOMING: "paid",
  FAILED: "failed",
  CANCELLED: "cancelled",
  REFUNDED: "refunded",
  EXPIRED: "expired",
} as const;

export type BookingStatus = typeof BOOKING_STATUS[keyof typeof BOOKING_STATUS];

export const SHOW_TYPE = {
  MOVIE: "movie",
  SPORT: "sport",
  EVENT: "event",
  GAMING: "gaming",
  TRAIN: "train",
} as const;

export type ShowType = typeof SHOW_TYPE[keyof typeof SHOW_TYPE];
