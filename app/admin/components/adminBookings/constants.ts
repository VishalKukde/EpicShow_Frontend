import type { BookingType } from "./types";

export const TYPE_LABELS: Record<BookingType, string> = {
  movies: "Movie",
  sports: "Sport",
  events: "Event",
  gaming: "Gaming",
};

export const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  paid: { bg: "var(--admin-success-bg)", text: "#166534" },
  pending: { bg: "#FEF3C7", text: "#92400E" },
  refunded: { bg: "#E0E7FF", text: "#3730A3" },
  cancelled: { bg: "#FEE2E2", text: "#991B1B" },
  failed: { bg: "#FEE2E2", text: "#991B1B" },
  expired: { bg: "#F3F4F6", text: "#374151" },
};
