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

  return (
    <div
      className="min-h-screen transition-colors bg-[var(--profile-mobile-bg)] lg:bg-[var(--profile-desktop-bg)]"
    >
      {/* Sidebar */}
      <Sidebar />

      {/* Right Content Area */}
      <div className="flex flex-col min-h-screen lg:ml-[250px]">
        {/* Navbar */}
        <div className="hidden lg:block">
          <ProfileNavbar />
        </div>
        <div className="lg:hidden">
          <MobileProfileHeader />
        </div>

        {/* Page Content */}
        <main
          className={
            isChatRoute
              ? "flex-1 p-0 lg:p-8"
              : "flex-1 p-0 pb-24 pt-14 lg:p-8 lg:pt-0"
          }
        >
          {children}
        </main>
      </div>
    </div>
  );
}
