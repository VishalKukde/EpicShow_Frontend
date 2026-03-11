export type TicketSharePayload = {
  movieTitle?: string | null;
  movieId?: string | null;
  bookingId: string;
  cinemaId?: string | null;
  date?: string | null;
  slot?: string | null;
  seatIds?: string[] | null;
  amount?: number | null;
  status?: string | null;
  posterUrl?: string | null;
};

const CINEMA_NAME_BY_ID: Record<string, string> = {
  "1921": "PVR Cinemas",
  "1922": "INOX",
  "1923": "Cinepolis",
};

function sanitizeText(value: string | null | undefined, fallback: string, max = 80) {
  const normalized = (value || "").replace(/\s+/g, " ").trim();
  const selected = normalized || fallback;

  if (selected.length <= max) {
    return selected;
  }

  return `${selected.slice(0, max - 1).trim()}...`;
}

function getSeatsPreview(seatIds?: string[] | null) {
  if (!seatIds || seatIds.length === 0) {
    return "Seats not selected";
  }

  const cleaned = seatIds.map((seat) => seat.trim()).filter(Boolean);
  if (cleaned.length === 0) {
    return "Seats not selected";
  }

  const visible = cleaned.slice(0, 6).join(", ");
  const remaining = cleaned.length - 6;
  return remaining > 0 ? `${visible} +${remaining} more` : visible;
}

export function resolveCinemaName(cinemaId?: string | null) {
  if (!cinemaId) {
    return "Cinema TBA";
  }

  return CINEMA_NAME_BY_ID[cinemaId] || cinemaId;
}

export function buildTicketSharePath(payload: TicketSharePayload) {
  const params = new URLSearchParams();

  params.set("title", sanitizeText(payload.movieTitle, "Movie Ticket", 72));
  params.set("bid", sanitizeText(payload.bookingId, "N/A", 48));
  params.set("cinema", sanitizeText(resolveCinemaName(payload.cinemaId), "Cinema TBA", 48));
  params.set("date", sanitizeText(payload.date, "Date TBA", 36));
  params.set("slot", sanitizeText(payload.slot, "Showtime TBA", 24));
  params.set("seats", sanitizeText(getSeatsPreview(payload.seatIds), "Seats not selected", 72));

  if (Number.isFinite(payload.amount)) {
    params.set("amount", `Rs ${Math.round(Number(payload.amount))}`);
  }

  if (payload.status) {
    params.set("status", sanitizeText(payload.status, "confirmed", 20).toLowerCase());
  }

  if (payload.posterUrl) {
    params.set("poster", payload.posterUrl);
  }

  if (payload.movieId) {
    params.set("movieId", payload.movieId);
  }

  return `/ticket/share?${params.toString()}`;
}

export function buildTicketShareUrl(payload: TicketSharePayload, origin: string) {
  const url = new URL(buildTicketSharePath(payload), origin);
  return url.toString();
}
