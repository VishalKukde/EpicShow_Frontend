import { createElement } from "react";
import { ImageResponse } from "next/og";
import OgTicketPoster from "./OgTicketPoster";

export const runtime = "edge";
export const preferredRegion = "auto";

const CACHE_CONTROL = "public, max-age=86400, immutable";

type MoviePayload = {
  name?: string;
  imageUrl?: string;
};

function sanitizeText(
  value: string | null | undefined,
  fallback: string,
  maxLength: number
) {
  const normalized = (value || "").replace(/\s+/g, " ").trim();
  const selected = normalized || fallback;

  if (selected.length <= maxLength) {
    return selected;
  }

  return `${selected.slice(0, maxLength - 1).trim()}...`;
}

function sanitizeImageUrl(value: string | null, origin: string) {
  if (!value) {
    return null;
  }

  try {
    const url = new URL(value, origin);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return null;
    }
    return url.toString();
  } catch {
    return null;
  }
}

async function fetchMovieById(id: string): Promise<MoviePayload | null> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!baseUrl) {
    return null;
  }

  try {
    const response = await fetch(`${baseUrl}/movies/${encodeURIComponent(id)}`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 60 * 60 * 24 },
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as
      | MoviePayload
      | { movie?: MoviePayload }
      | null;

    if (!payload || typeof payload !== "object") {
      return null;
    }

    if ("movie" in payload) {
      return payload.movie || null;
    }

    return payload as MoviePayload;
  } catch {
    return null;
  }
}

function responseWithPoster(payload: {
  title: string;
  bookingId: string;
  cinema: string;
  date: string;
  slot: string;
  seats: string;
  amount: string;
  status: string;
  posterUrl: string | null;
}) {
  return new ImageResponse(createElement(OgTicketPoster, payload), {
    width: 1200,
    height: 630,
    headers: {
      "Cache-Control": CACHE_CONTROL,
    },
  });
}

export async function GET(request: Request) {
  try {
    const { searchParams, origin } = new URL(request.url);
    const movieId = searchParams.get("movieId") || "";
    const shouldFetchMovie =
      Boolean(movieId) &&
      (!searchParams.get("title") || !searchParams.get("poster"));

    const movie = shouldFetchMovie ? await fetchMovieById(movieId) : null;

    const title = sanitizeText(
      searchParams.get("title") ?? movie?.name,
      "Movie Ticket",
      62
    );
    const bookingId = sanitizeText(searchParams.get("bid"), "N/A", 36);
    const cinema = sanitizeText(searchParams.get("cinema"), "Cinema TBA", 40);
    const date = sanitizeText(searchParams.get("date"), "Date TBA", 30);
    const slot = sanitizeText(searchParams.get("slot"), "Showtime TBA", 24);
    const seats = sanitizeText(searchParams.get("seats"), "Seats not selected", 52);
    const amount = sanitizeText(searchParams.get("amount"), "Rs 0", 18);
    const status = sanitizeText(searchParams.get("status"), "confirmed", 18).toLowerCase();

    const posterUrl =
      sanitizeImageUrl(searchParams.get("poster"), origin) ||
      sanitizeImageUrl(movie?.imageUrl || null, origin);

    return responseWithPoster({
      title,
      bookingId,
      cinema,
      date,
      slot,
      seats,
      amount,
      status,
      posterUrl,
    });
  } catch {
    return responseWithPoster({
      title: "Movie Ticket",
      bookingId: "N/A",
      cinema: "Cinema TBA",
      date: "Date TBA",
      slot: "Showtime TBA",
      seats: "Seats not selected",
      amount: "Rs 0",
      status: "confirmed",
      posterUrl: null,
    });
  }
}
