import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";

type ShareSearchParams = Record<string, string | string[] | undefined>;

type ShareTicketData = {
  title: string;
  bookingId: string;
  cinema: string;
  date: string;
  slot: string;
  seats: string;
  amount: string;
  status: string;
  poster: string;
  movieId: string;
};

function firstValue(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0] || "";
  }
  return value || "";
}

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

function extractShareData(searchParams: ShareSearchParams): ShareTicketData {
  return {
    title: sanitizeText(firstValue(searchParams.title), "Movie Ticket", 72),
    bookingId: sanitizeText(firstValue(searchParams.bid), "N/A", 50),
    cinema: sanitizeText(firstValue(searchParams.cinema), "Cinema TBA", 60),
    date: sanitizeText(firstValue(searchParams.date), "Date TBA", 40),
    slot: sanitizeText(firstValue(searchParams.slot), "Showtime TBA", 30),
    seats: sanitizeText(firstValue(searchParams.seats), "Seats not selected", 80),
    amount: sanitizeText(firstValue(searchParams.amount), "Rs 0", 20),
    status: sanitizeText(firstValue(searchParams.status), "confirmed", 24).toLowerCase(),
    poster: sanitizeText(firstValue(searchParams.poster), "", 700),
    movieId: sanitizeText(firstValue(searchParams.movieId), "", 60),
  };
}

function toQuery(data: ShareTicketData) {
  const params = new URLSearchParams();
  params.set("title", data.title);
  params.set("bid", data.bookingId);
  params.set("cinema", data.cinema);
  params.set("date", data.date);
  params.set("slot", data.slot);
  params.set("seats", data.seats);
  params.set("amount", data.amount);
  params.set("status", data.status);

  if (data.poster) {
    params.set("poster", data.poster);
  }

  if (data.movieId) {
    params.set("movieId", data.movieId);
  }

  return params;
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
  searchParams,
}: {
  searchParams: Promise<ShareSearchParams>;
}): Promise<Metadata> {
  const data = extractShareData(await searchParams);
  const baseUrl = await resolveBaseUrl();
  const params = toQuery(data);

  const pageUrl = `${baseUrl}/ticket/share?${params.toString()}`;
  const ogImageUrl = `${baseUrl}/api/og/ticket?${params.toString()}`;
  const description = `${data.cinema} • ${data.date} • ${data.slot} • ${data.seats}`;

  return {
    title: `${data.title} Ticket | Epic Show`,
    description,
    robots: {
      index: false,
      follow: false,
    },
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: `${data.title} Ticket`,
      description,
      type: "website",
      url: pageUrl,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${data.title} ticket share card`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${data.title} Ticket`,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function TicketSharePage({
  searchParams,
}: {
  searchParams: Promise<ShareSearchParams>;
}) {
  const data = extractShareData(await searchParams);
  const isConfirmed = data.status === "success" || data.status === "confirmed";
  const statusStyle = isConfirmed
    ? "border-green-200 bg-green-50 text-green-700"
    : "border-orange-200 bg-orange-50 text-orange-700";
  const movieHref = data.movieId ? `/movies/${data.movieId}` : "/movies";

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 px-4 py-14">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8">
          <div className="mb-6 flex items-center justify-between gap-4">
            <p className="text-sm font-semibold tracking-[0.12em] text-slate-500 uppercase">
              Epic Show Ticket
            </p>
            <span
              className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase ${statusStyle}`}
            >
              {isConfirmed ? "Confirmed" : "Updated"}
            </span>
          </div>

          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">{data.title}</h1>

          <div className="mt-6 space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm sm:text-base">
            <TicketRow label="Booking ID" value={data.bookingId} />
            <TicketRow label="Cinema" value={data.cinema} />
            <TicketRow label="Date" value={data.date} />
            <TicketRow label="Time" value={data.slot} />
            <TicketRow label="Seats" value={data.seats} />
            <TicketRow label="Amount" value={data.amount} />
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              href={movieHref}
              className="inline-flex items-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Book Another Show
            </Link>
            <Link
              href="/"
              className="inline-flex items-center rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

function TicketRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-slate-200 pb-2 last:border-none last:pb-0">
      <span className="text-slate-500">{label}</span>
      <span className="text-right font-semibold text-slate-800">{value}</span>
    </div>
  );
}
