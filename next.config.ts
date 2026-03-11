import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "api.qrserver.com" },
      { protocol: "https", hostname: "image.tmdb.org" },
      { protocol: "https", hostname: "api.dicebear.com" },
    ],
  },
  devIndicators: false,
}

export default nextConfig;
