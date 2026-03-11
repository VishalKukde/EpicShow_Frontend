import type { Metadata } from "next";
import { headers } from "next/headers";

type MovieMetadataPayload = {
  name?: string;
  description?: string;
  imageUrl?: string;
};

const DEFAULT_DESCRIPTION =
  "Book movie tickets with premium seats, quick checkout, and live show timings on Epic Show.";

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

async function fetchMovie(id: string): Promise<MovieMetadataPayload | null> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!baseUrl) {
    return null;
  }

  try {
    const response = await fetch(`${baseUrl}/movies/${encodeURIComponent(id)}`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 60 * 60 * 6 },
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as
      | MovieMetadataPayload
      | { movie?: MovieMetadataPayload }
      | null;

    if (!payload || typeof payload !== "object") {
      return null;
    }

    if ("movie" in payload) {
      return payload.movie || null;
    }

    return payload as MovieMetadataPayload;
  } catch {
    return null;
  }
}

async function resolveBaseUrl() {
  const headerStore = await headers();
  const forwardedHost = headerStore.get("x-forwarded-host");
  const host = forwardedHost || headerStore.get("host");
  const forwardedProto = headerStore.get("x-forwarded-proto");

  if (host) {
    const protocol =
      forwardedProto || (host.includes("localhost") ? "http" : "https");
    return `${protocol}://${host}`;
  }

  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const movie = await fetchMovie(id);
  const baseUrl = await resolveBaseUrl();

  const movieTitle = sanitizeText(movie?.name, titleFromIdentifier(id), 72);
  const pageTitle = `${movieTitle} | Epic Show`;
  const description = sanitizeText(movie?.description, DEFAULT_DESCRIPTION, 160);
  const pageUrl = `${baseUrl}/movies/${encodeURIComponent(id)}`;

  const ogParams = new URLSearchParams({
    eventId: id,
    title: movieTitle,
    venue: "PVR Cinemas",
    location: "Mumbai",
    date: "Today 7:00 PM",
    price: "From ₹199",
    description,
  });

  if (movie?.imageUrl) {
    ogParams.set("poster", movie.imageUrl);
  }

  const ogImageUrl = `${baseUrl}/api/og?${ogParams.toString()}`;

  return {
    title: pageTitle,
    description,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: movieTitle,
      description,
      type: "website",
      url: pageUrl,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${movieTitle} cinematic poster`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: movieTitle,
      description,
      images: [ogImageUrl],
    },
  };
}

export default function MovieDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
