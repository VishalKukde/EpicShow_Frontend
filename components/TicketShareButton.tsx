"use client";

import { Share2 } from "lucide-react";
import { toast } from "@/lib/toast";
import { buildTicketShareUrl, type TicketSharePayload } from "@/lib/ticketShare";

type TicketShareButtonProps = TicketSharePayload & {
  iconOnly?: boolean;
  className?: string;
};

export default function TicketShareButton({
  iconOnly = false,
  className,
  ...payload
}: TicketShareButtonProps) {
  const onShare = async () => {
    if (typeof window === "undefined") {
      return;
    }

    const shareUrl = buildTicketShareUrl(payload, window.location.origin);
    const title = `My ticket for ${payload.movieTitle || "the show"}`;
    const text = `I booked ${payload.movieTitle || "a show"} on Epic Show.`;

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url: shareUrl,
        });
        toast.success("Ticket link shared.");
        return;
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          toast.info("Share cancelled.");
          return;
        }
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Ticket share link copied.");
    } catch {
      toast.error("Could not share ticket link on this device.");
    }
  };

  if (iconOnly) {
    return (
      <button
        onClick={onShare}
        className={
          className ||
          "flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 shadow-sm transition hover:border-gray-300 hover:bg-gray-50 cursor-pointer sm:h-10 sm:w-10 sm:rounded-xl"
        }
        title="Share Ticket"
        aria-label="Share ticket"
      >
        <Share2 size={16} />
      </button>
    );
  }

  return (
    <button
      onClick={onShare}
      className={
        className ||
        "inline-flex items-center gap-2 rounded-xl border border-gray-300 px-6 py-2.5 text-sm font-semibold text-gray-900 transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-100 hover:shadow-md cursor-pointer"
      }
      title="Share Ticket"
    >
      <Share2 size={16} strokeWidth={2} />
      Share Ticket
    </button>
  );
}
