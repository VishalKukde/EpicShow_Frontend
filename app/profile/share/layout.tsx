import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://epicshow.in";
const inviteCode = "VISHAL50";
const title = "Join EpicShow with an invite code";
const description = "Use an EpicShow invite code for booking rewards on movies, sports, events, and more.";
const imageUrl = `/api/og/invite?code=${encodeURIComponent(inviteCode)}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  alternates: {
    canonical: "/profile/share",
  },
  openGraph: {
    title,
    description,
    url: "/profile/share",
    siteName: "EpicShow",
    type: "website",
    images: [
      {
        url: imageUrl,
        width: 1200,
        height: 630,
        alt: "EpicShow invite rewards share preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [imageUrl],
  },
};

export default function ShareLayout({ children }: { children: React.ReactNode }) {
  return children;
}
