import { createElement } from "react";
import { ImageResponse } from "next/og";
import OgPoster from "./OgPoster";

export const runtime = "edge";
export const preferredRegion = "auto";

const CACHE_CONTROL = "public, max-age=86400, immutable";
const FALLBACK_DESCRIPTION =
  "Experience blockbuster cinema with premium seats and instant ticket booking.";

type MoviePayload = {
  name?: string;
  imageUrl?: string;
  description?: string;
  genre?: string[];
  language?: string;
  runtimeMinutes?: number;
  rating?: number;
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

  return `${selected.slice(0, maxLength - 1).trim()}…`;
}

function titleFromIdentifier(identifier: string) {
  return identifier
    .replace(/[-_]+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
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

function buildMovieSubtitle(movie: MoviePayload | null) {
  if (!movie) {
    return "";
  }

  const info: string[] = [];

  if (Array.isArray(movie.genre) && movie.genre.length > 0) {
    info.push(movie.genre.slice(0, 2).join(" / "));
  }

  if (movie.language) {
    info.push(movie.language.toUpperCase());
  }

  if (Number.isFinite(movie.runtimeMinutes)) {
    info.push(`${movie.runtimeMinutes} mins`);
  }

  if (Number.isFinite(movie.rating)) {
    info.push(`${movie.rating?.toFixed(1)}★`);
  }

  return info.join(" • ");
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

function createImageResponse(payload: {
  title: string;
  description: string;
  venue: string;
  location: string;
  dateTime: string;
  price: string;
  posterUrl: string | null;
}) {
  return new ImageResponse(createElement(OgPoster, payload), {
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
    const eventId =
      searchParams.get("eventId") ||
      searchParams.get("movieId") ||
      searchParams.get("id") ||
      "";

    const shouldFetchMovie =
      Boolean(eventId) &&
      (!searchParams.get("title") ||
        !searchParams.get("poster") ||
        !searchParams.get("description"));

    const movie = shouldFetchMovie ? await fetchMovieById(eventId) : null;

    const fallbackTitle = eventId ? titleFromIdentifier(eventId) : "Now Showing";

    const title = sanitizeText(
      searchParams.get("title") ?? movie?.name,
      fallbackTitle,
      62
    );
    const venue = sanitizeText(searchParams.get("venue"), "PVR Cinemas", 38);
    const location = sanitizeText(searchParams.get("location"), "Mumbai", 38);
    const dateTime = sanitizeText(searchParams.get("date"), "Today 7:00 PM", 42);
    const price = sanitizeText(searchParams.get("price"), "From ₹199", 24);
    const description = sanitizeText(
      searchParams.get("description") ?? movie?.description ?? buildMovieSubtitle(movie),
      FALLBACK_DESCRIPTION,
      124
    );

    const posterUrl =
      sanitizeImageUrl(searchParams.get("poster"), origin) ||
      sanitizeImageUrl(movie?.imageUrl || null, origin);

    return createImageResponse({
      title,
      description,
      venue,
      location,
      dateTime,
      price,
      posterUrl,
    });
  } catch {
    return createImageResponse({
      title: "Now Showing",
      description: FALLBACK_DESCRIPTION,
      venue: "PVR Cinemas",
      location: "Mumbai",
      dateTime: "Today 7:00 PM",
      price: "From ₹199",
      posterUrl: null,
    });
  }
}
