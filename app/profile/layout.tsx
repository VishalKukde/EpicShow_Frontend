"use client";

import ProfileNavbar from "./components/ProfileNavbar";
import Sidebar from "./components/Sidebar";
import MobileProfileHeader from "./components/MobileProfileHeader";
import { usePathname } from "next/navigation";
import { useThemeStore } from "@/store/themeStore";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isChatRoute = pathname.startsWith("/profile/chat");
  const mode = useThemeStore((s) => s.mode);
  const dark = mode === "dark";

  return (
    <div
      className={`min-h-screen transition-colors ${
        dark
          ? "bg-[radial-gradient(circle_at_top,rgba(63,63,70,0.2),transparent_42%),linear-gradient(180deg,#09090b_0%,#0f0f13_52%,#09090b_100%)]"
          : "bg-gray-50"
      }`}
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
