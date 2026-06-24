import type { Metadata } from "next";
import "./globals.css";
import "sweetalert2/dist/sweetalert2.min.css";
import { AuthProvider } from "@/context/AuthContext";
import ScrollToTop from "./components/ScrollToTop";
import BackendWarmup from "./components/BackendWarmup";
import Navbar from "@/components/Navbar";
import ThemeBridge from "@/components/ThemeBridge";
import MobileBottomNav from "@/components/MobileBottomNav";
import AskEpicAiOverlay from "@/components/AskEpicAiOverlay";
import GlobalErrorToastBridge from "@/components/GlobalErrorToastBridge";

import { FeatureShowcaseProvider } from "@/components/FeatureShowcaseProvider";
import NotificationBridge from "./components/NotificationBridge";

const siteUrl = "https://epicshow.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "EpicShow - Premium Ticket Booking Platform",
    template: "%s | EpicShow",
  },

  description:
    "EpicShow is a modern ticket booking platform developed by Vishal Kukde. Book tickets, select seats in real-time, make secure payments, and enjoy a seamless cinema experience.",

  authors: [
    {
      name: "Vishal Kukde",
      url: "https://github.com/VishalKukde",
    },
  ],

  creator: "Vishal Kukde",
  publisher: "EpicShow",

  applicationName: "EpicShow",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },

  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
  },

  openGraph: {
    title: "EpicShow - Premium Ticket Booking Platform",
    description:
      "EpicShow is a modern ticket booking platform developed by Vishal Kukde. Book tickets, select seats in real-time, make secure payments, and enjoy a seamless cinema experience.",
    url: siteUrl,
    siteName: "EpicShow",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: `${siteUrl}/opengraph-image.png`,
        secureUrl: `${siteUrl}/opengraph-image.png`,
        width: 1200,
        height: 630,
        alt: "EpicShow - Developed by Vishal Kukde",
        type: "image/png",
      },
    ],
  },
  category: "Entertainment",
};


const themeInitScript = `
(() => {
  try {
    let mode = "light";
    const raw = localStorage.getItem("user-theme-preferences-v1");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (raw) {
      const parsed = JSON.parse(raw);
      const storedMode = parsed?.state?.mode;

      if (storedMode === "dark" || storedMode === "light") {
        mode = storedMode;
      } else {
        const userThemes = parsed?.state?.userThemes || {};
        const lastUserId = parsed?.state?.lastUserId;

        if (lastUserId && userThemes[lastUserId]) {
          mode = userThemes[lastUserId];
        } else {
          mode = userThemes.guest || (prefersDark ? "dark" : "light");
        }
      }
    } else {
      mode = prefersDark ? "dark" : "light";
    }

    const html = document.documentElement;
    html.classList.remove("theme-light", "theme-dark", "light", "dark");
    html.classList.add(mode === "dark" ? "theme-dark" : "theme-light");
    html.classList.add(mode === "dark" ? "dark" : "light");
    html.style.colorScheme = mode;
  } catch {}
})();
`;

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body
        className="antialiased"
      >
        <AuthProvider>
          <FeatureShowcaseProvider>
            <GlobalErrorToastBridge />
            <NotificationBridge />
            <BackendWarmup />
            <ThemeBridge />
            {/* <SmoothScroll> */}
            <Navbar />
            {/* <FloatingChatButton /> */}
            <MobileBottomNav />
            <ScrollToTop />
            {children}
            {modal}
            <AskEpicAiOverlay />
            {/* </SmoothScroll> */}
          </FeatureShowcaseProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
