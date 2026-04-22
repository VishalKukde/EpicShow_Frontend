"use client";

import ProfileNavbar from "./components/ProfileNavbar";
import Sidebar from "./components/Sidebar";
import MobileProfileHeader from "./components/MobileProfileHeader";
import { usePathname } from "next/navigation";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isChatRoute = pathname.startsWith("/profile/chat");
  const isBookingRoute = pathname.startsWith("/profile/bookings");

  const mainClass = isChatRoute
    ? "flex-1 p-0 lg:p-8"
    : isBookingRoute
      ? "flex flex-1 min-h-0 flex-col overflow-hidden p-0 pb-24 pt-14 lg:p-8 lg:pt-0"
      : "flex-1 p-0 pb-24 pt-14 lg:p-8 lg:pt-0";

  return (
    <div
      className={`transition-colors bg-[var(--profile-mobile-bg)] lg:bg-[var(--profile-desktop-bg)] ${
        isBookingRoute ? "h-screen overflow-hidden" : "min-h-screen"
      }`}
    >
      {/* Sidebar */}
      <Sidebar />

      {/* Right Content Area */}
      <div
        className={`flex flex-col lg:ml-[250px] ${
          isBookingRoute ? "h-screen overflow-hidden" : "min-h-screen"
        }`}
      >
        {/* Navbar */}
        <div className="hidden shrink-0 lg:block">
          <ProfileNavbar />
        </div>
        <div className="shrink-0 lg:hidden">
          <MobileProfileHeader />
        </div>

        {/* Page Content */}
        <main className={mainClass}>
          {children}
        </main>
      </div>
    </div>
  );
}
