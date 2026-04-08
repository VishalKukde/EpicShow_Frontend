"use client";

import type { Gaming } from "@/types/Gaming";
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

export default function GamingCard({ item }: { item: Gaming }) {
  const rawImageUrl = item.imageUrl?.trim() || "";
  const normalizedImageUrl = rawImageUrl.startsWith("/public/")
    ? rawImageUrl.replace("/public", "")
    : rawImageUrl;
  const imageSrc = normalizedImageUrl || "/assets/category/Gaming.png";

  return (
    <Link href={`/gaming/${item._id}`} className="group cursor-pointer">
      <div className="relative h-[240px] overflow-hidden rounded-2xl bg-gray-200 transition-all duration-300 ease-out lg:group-hover:scale-[1.03] lg:group-hover:shadow-lg">
        <Image
          src={imageSrc}
          alt={item.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <p className="text-sm font-semibold line-clamp-2">{item.title}</p>
          <p className="mt-1 text-xs text-white/80">
            {formatDate(item.startDateTime)}
            {item.startDateTime ? ` • ${formatTime(item.startDateTime)}` : ""}
          </p>
        </div>
      </div>

      <div className="mt-3 space-y-1">
        <p className="text-sm font-medium text-gray-900 line-clamp-1">
          {item.venue}
        </p>
        <p className="text-xs text-gray-500 line-clamp-1">
          {item.city} • {item.organizer}
        </p>
      </div>
    </Link>
  );
}
