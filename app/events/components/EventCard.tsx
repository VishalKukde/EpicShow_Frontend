"use client";

import type { Event } from "@/types/Event";
import Image from "next/image";
import Link from "next/link";

const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  }).format(date);
};

const formatTime = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function EventCard({ event }: { event: Event }) {
  const rawImageUrl = event.imageUrl?.trim() || "";
  const normalizedImageUrl = rawImageUrl.startsWith("/public/")
    ? rawImageUrl.replace("/public", "")
    : rawImageUrl;
  const imageSrc = normalizedImageUrl || "/assets/category/Event.png";

  return (
    <Link href={`/events/${event._id}`} className="group cursor-pointer">
      <div className="relative h-[240px] overflow-hidden rounded-2xl bg-gray-200 transition-all duration-300 ease-out lg:group-hover:scale-[1.03] lg:group-hover:shadow-lg">
        <Image
          src={imageSrc}
          alt={event.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <p className="text-sm font-semibold line-clamp-2">{event.title}</p>
          <p className="mt-1 text-xs text-white/80">
            {formatDate(event.startDateTime)}
            {event.startDateTime ? ` • ${formatTime(event.startDateTime)}` : ""}
          </p>
        </div>
      </div>

      <div className="mt-3 space-y-1">
        <p className="text-sm font-medium text-gray-900 line-clamp-1">
          {event.venue}
        </p>
        <p className="text-xs text-gray-500 line-clamp-1">
          {event.city} • {event.organizer}
        </p>
      </div>
    </Link>
  );
}
