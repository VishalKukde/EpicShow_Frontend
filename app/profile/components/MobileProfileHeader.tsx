"use client";

import { ArrowLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useThemeStore } from "@/store/themeStore";

const routeTitle: Array<{ match: string; title: string }> = [
  { match: "/profile/bookings", title: "Bookings" },
  { match: "/profile/wallet", title: "Wallet" },
  { match: "/profile/payments", title: "Payments" },
  { match: "/profile/security", title: "Security" },
  { match: "/profile/account-settings", title: "Account Settings" },
  { match: "/profile/preferences", title: "Preferences" },
  { match: "/profile/subscription", title: "Subscription" },
  { match: "/profile/faqs", title: "FAQs" },
  { match: "/profile/chat", title: "Chat Support" },
  { match: "/profile/about", title: "About" },
  { match: "/profile/feedback", title: "Feedback" },
  { match: "/profile/report-issue", title: "Report Issue" },
  { match: "/profile/activity", title: "Activity" },
  { match: "/profile/menu", title: "Profile Menu" },
  { match: "/profile", title: "Profile" },
];

export default function MobileProfileHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const mode = useThemeStore((s) => s.mode);
  const dark = mode === "dark";

  if (pathname.startsWith("/profile/chat")) {
    return null;
  }

  const isMenuPage = pathname === "/profile/menu";
  const pageTitle =
    routeTitle.find((item) => pathname.startsWith(item.match))?.title || "Profile";

  const handleBack = () => {
    if (isMenuPage) {
      router.push("/");
      return;
    }
    router.back();
  };

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-40 border-b backdrop-blur-xl lg:hidden ${
        dark
          ? "border-zinc-700/45 bg-[linear-gradient(180deg,rgba(39,39,42,0.9)_0%,rgba(24,24,27,0.96)_100%)] shadow-[0_8px_24px_rgba(0,0,0,0.35)]"
          : "border-gray-200 bg-white/90"
      }`}
    >
      <div className="flex h-14 items-center justify-between px-4">
        <button
          type="button"
          onClick={handleBack}
          className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-medium transition ${
            dark ? "text-zinc-100 hover:bg-zinc-800/80" : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <p className={`max-w-[120px] truncate text-center text-sm font-semibold ${dark ? "text-zinc-100" : "text-gray-900"}`}>
          {pageTitle}
        </p>

        <div className="w-[52px]" />
      </div>
    </header>
  );
}
