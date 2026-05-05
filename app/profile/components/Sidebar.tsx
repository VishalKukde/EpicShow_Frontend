"use client";

import { useState } from "react";
import Image from "next/image";
import {
  User,
  Ticket,
  CreditCard,
  Settings,
  Shield,
  LogOut,
  Film,
  Trophy,
  Gamepad2,
  ChevronDown,
  Wallet,
  HelpCircle,
  MessageCircle,
  Info,
  Activity,
  Star,
  Send,
  Bug,
  Crown,
  SlidersHorizontal,
  Heart,
  BadgePercent,
  TicketPercent,
  TrainFront,
  Plane,
  Hotel,
  Music2,
  RotateCcw,
  Bell,
  Share2,
} from "lucide-react";

import SidebarItem from "./SidebarItem";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Sidebar() {
  const route = useRouter();
  const pathname = usePathname();
  const { user, logout, loading } = useAuth();
  const [openBookings, setOpenBookings] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // 🔥 Improved active check
  const isActive = (path: string) => pathname.startsWith(path);

  const handleConfirmLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      route.replace("/login");
    } finally {
      setIsLoggingOut(false);
      setShowLogoutConfirm(false);
    }
  };

  return (
    <>
      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-[250px] bg-white border-r border-gray-200 flex-col select-none">
        {/* HEADER */}
        <div className="px-6 py-4 border-b border-gray-200 cursor-pointer" onClick={() => route.push("/")}>
          <span className="font-semibold text-2xl text-gray-900 tracking-tight">
            EpicShow
          </span>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">

          {/* USER */}
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div
              className={`w-12 h-12 rounded-full overflow-hidden flex items-center justify-center text-lg font-semibold
    ${loading ? "bg-gray-200 dark:bg-gray-700 animate-pulse" : "bg-white text-white"}`}
            >
              {loading ? (
                <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-200 dark:via-gray-300 dark:to-gray-200 animate-[shimmer_1.5s_infinite]"></div>
              ) : (
                <Image
                  src={user?.avatar || "/assets/profiles/user.webp"}
                  alt="avatar"
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* User Info */}
            <div>
              {loading ? (
                <>
                  <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-1"></div>
                  <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </>
              ) : (
                <>
                  <p className="font-semibold ">
                    {user?.name || "Guest"}
                  </p>
                  <p className="text-sm ">
                    {user?.email}
                  </p>
                </>
              )}
            </div>
          </div>

          {/* MAIN */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase mb-2">
              Home
            </p>

            <nav className="space-y-1">
              <SidebarItem href="/profile" icon={User}>
                Overview
              </SidebarItem>

              <SidebarItem href="/profile/wallet" icon={Wallet}>
                Wallet
              </SidebarItem>

              <SidebarItem href="/profile/favorite" icon={Heart}>
                Favorites
              </SidebarItem>

              <SidebarItem href="/offers" icon={BadgePercent}>
                Offers
              </SidebarItem>

              <SidebarItem href="/profile/my-coupons" icon={TicketPercent}>
                My Coupons
              </SidebarItem>
            </nav>
          </div>

          {/* BOOKINGS */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase mb-2">
              Bookings
            </p>

            <button
              onClick={() => setOpenBookings(!openBookings)}
              className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Ticket className="w-4 h-4" />
                My Bookings
              </div>

              <ChevronDown
                className={`w-4 h-4 transition-transform ${openBookings ? "rotate-180" : ""
                  }`}
              />
            </button>

            <div
              className={`overflow-hidden transition-all ${openBookings ? "max-h-78 mt-2" : "max-h-0"
                }`}
            >
              <div className="ml-6 space-y-1 border-l border-gray-200 pl-3">

                <SubLink
                  href="/profile/bookings/movies"
                  icon={Film}
                  label="Movies"
                  active={isActive("/profile/bookings/movies")}
                />

                <SubLink
                  href="/profile/bookings/sports"
                  icon={Trophy}
                  label="Sports"
                  active={isActive("/profile/bookings/sports")}
                />

                <SubLink
                  href="/profile/bookings/gaming"
                  icon={Gamepad2}
                  label="Gaming"
                  active={isActive("/profile/bookings/gaming")}
                />

                <SubLink
                  href="/profile/bookings/events"
                  icon={Trophy}
                  label="Events"
                  active={isActive("/profile/bookings/events")}
                />
                <SubLink
                  href="/profile/bookings/concerts"
                  icon={Music2}
                  label="Concerts"
                  active={isActive("/profile/bookings/concerts")}
                />
                <SubLink
                  href="/profile/bookings/trains"
                  icon={TrainFront}
                  label="Trains"
                  active={isActive("/profile/bookings/trains")}
                />
                <SubLink
                  href="/profile/bookings/flights"
                  icon={Plane}
                  label="Flights"
                  active={isActive("/profile/bookings/flights")}
                />
                <SubLink
                  href="/profile/bookings/hotels"
                  icon={Hotel}
                  label="Hotels"
                  active={isActive("/profile/bookings/hotels")}
                />
              </div>
            </div>

             <button
              onClick={() => route.push("/profile/refunds")}
              className="flex items-center justify-between w-full px-3 py-2 mt-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4" />
                Refunds
              </div>
            </button>
          </div>

          {/* ACTIVITY */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase mb-2">
              Activity
            </p>

            <nav className="space-y-1">
              <SidebarItem href="/profile/notifications" icon={Bell}>
                Notifications
              </SidebarItem>

              <SidebarItem href="/profile/reviews" icon={Star}>
                Your Reviews
              </SidebarItem>

              <SidebarItem href="/profile/activity" icon={Activity}>
                Your Activity
              </SidebarItem>
            </nav>
          </div>

          {/* ACCOUNT */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase mb-2">
              Account
            </p>

            <nav className="space-y-1">
              <SidebarItem href="/profile/payments" icon={CreditCard}>
                Payments
              </SidebarItem>

              <SidebarItem href="/profile/security" icon={Shield}>
                Security
              </SidebarItem>

              <SidebarItem href="/profile/account-settings" icon={Settings}>
                Account Settings
              </SidebarItem>

              <SidebarItem href="/profile/subscription" icon={Crown}>
                Subscription
              </SidebarItem>

              <SidebarItem href="/profile/preferences" icon={SlidersHorizontal}>
                Preferences
              </SidebarItem>

              <SidebarItem href="/profile/share" icon={Share2}>
                Invite & Share
              </SidebarItem>


            </nav>
          </div>

          {/* SUPPORT */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase mb-2">
              Help & Support
            </p>

            <nav className="space-y-1">
              <SidebarItem href="/profile/faqs" icon={HelpCircle}>
                FAQs
              </SidebarItem>

              <SidebarItem href="/profile/chat" icon={MessageCircle}>
                Chat with us
              </SidebarItem>

              <SidebarItem href="/profile/about" icon={Info}>
                About Us
              </SidebarItem>

              <SidebarItem href="/profile/feedback" icon={Send}>
                Share Feedback
              </SidebarItem>

              <SidebarItem href="/profile/report-issue" icon={Bug}>
                Report an Issue
              </SidebarItem>
            </nav>
          </div>

          {/* 🔥 PRO CARD */}

          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-xl p-4 shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-5 h-5" />
              <p className="font-semibold">Upgrade to Pro</p>
            </div>

            <p className="text-xs opacity-90 mb-3">
              Get priority booking, exclusive deals & rewards.
            </p>

            <button
              onClick={() => route.push("/profile/subscription")}
              className="w-full bg-white text-indigo-600 text-sm font-medium py-1.5 rounded-md hover:bg-gray-100 transition cursor-pointer"
            >
              Upgrade Now
            </button>
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 border-t border-gray-200">
          <button
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-100  transition cursor-pointer"
            onClick={() => setShowLogoutConfirm(true)}
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl">
            <h3 className="text-lg font-semibold text-gray-900">Confirm Logout</h3>
            <p className="mt-2 text-sm text-gray-600">
              Are you sure you want to logout from your account?
            </p>

            <div className="mt-5 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                disabled={isLoggingOut}
                className="cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmLogout}
                disabled={isLoggingOut}
                className=" cursor-pointer  rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
              >
                {isLoggingOut ? "Logging out..." : "Logout"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* 🔹 SUB LINK COMPONENT */
function SubLink({
  href,
  icon: Icon,
  label,
  active,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition ${active
        ? "bg-gray-900 text-white"
        : "text-gray-600 hover:bg-gray-100"
        }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </Link>
  );
}
