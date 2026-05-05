"use client";

import Image from "next/image";
import { ChevronDown, LogOut, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLayoutEffect, useRef, useState, type ComponentType, type UIEvent } from "react";
import { useAuth } from "@/context/AuthContext";
import { ACTIVE_PAGES, NAV_SECTIONS } from "./constants";
import type { ActivePage } from "./types";

type AdminSidebarProps = {
  activeItem: ActivePage;
  onSelect: (item: ActivePage) => void;
};

const SIDEBAR_SCROLL_KEY = "epicshow-admin-sidebar-scroll";

export default function AdminSidebar({ activeItem, onSelect }: AdminSidebarProps) {
  const router = useRouter();
  const { logout, user, loading } = useAuth();
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [openBookings, setOpenBookings] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const dashboardSection = NAV_SECTIONS.find((section) => section.label === "Dashboard");
  const bookingSection = NAV_SECTIONS.find((section) => section.label === "Bookings");
  const otherSections = NAV_SECTIONS.filter(
    (section) => section.label !== "Dashboard" && section.label !== "Bookings"
  );

  async function handleConfirmLogout() {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await logout();
      router.replace("/login");
    } finally {
      setLoggingOut(false);
      setShowLogoutConfirm(false);
    }
  }

  function handleSelect(item: ActivePage) {
    if (scrollRef.current) {
      window.sessionStorage.setItem(SIDEBAR_SCROLL_KEY, String(scrollRef.current.scrollTop));
    }
    onSelect(item);
  }

  function handleSidebarScroll(event: UIEvent<HTMLDivElement>) {
    window.sessionStorage.setItem(SIDEBAR_SCROLL_KEY, String(event.currentTarget.scrollTop));
  }

  useLayoutEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const savedScroll = Number(window.sessionStorage.getItem(SIDEBAR_SCROLL_KEY) || 0);
    if (Number.isFinite(savedScroll)) {
      scrollContainer.scrollTop = savedScroll;
    }
  }, []);

  return (
    <aside className="hidden h-screen w-[250px] min-w-[250px] select-none flex-col border-r border-gray-200 bg-white text-gray-900 lg:flex">
      <button
        type="button"
        onClick={() => router.push("/")}
        className="border-b border-gray-200 px-6 py-4 text-left"
      >
        <span className="text-2xl font-semibold tracking-tight text-gray-900">
          EpicShow
        </span>
      </button>

      <div
        ref={scrollRef}
        onScroll={handleSidebarScroll}
        className="flex-1 space-y-6 overflow-y-auto px-6 py-6"
      >
        <div className="flex items-center gap-3">
          <div
            className={`flex h-12 w-12 items-center justify-center overflow-hidden rounded-full text-lg font-semibold ${
              loading ? "animate-pulse bg-gray-200" : "bg-gray-100"
            }`}
          >
            {loading ? null : (
              <Image
                src={user?.avatar || "/assets/profiles/user.webp"}
                alt={user?.name || "Admin"}
                width={48}
                height={48}
                className="h-full w-full object-cover"
              />
            )}
          </div>

          <div className="min-w-0">
            {loading ? (
              <>
                <div className="mb-1 h-4 w-24 animate-pulse rounded bg-gray-200" />
                <div className="h-3 w-32 animate-pulse rounded bg-gray-200" />
              </>
            ) : (
              <>
                <p className="truncate font-semibold text-gray-900">
                  {user?.name || "Admin"}
                </p>
                <p className="truncate text-sm text-gray-500">
                  {user?.email || "admin@epicshow.app"}
                </p>
              </>
            )}
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase text-gray-400">
            Dashboard
          </p>
          <nav className="space-y-1">
            {dashboardSection?.items.map((item) => (
              <AdminNavItem
                key={item.key}
                active={item.key === activeItem}
                disabled={!ACTIVE_PAGES.has(item.key)}
                icon={item.icon}
                label={item.label}
                planned={!ACTIVE_PAGES.has(item.key)}
                onClick={() => handleSelect(item.key as ActivePage)}
              />
            ))}
          </nav>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase text-gray-400">
            Bookings
          </p>

          <button
            type="button"
            onClick={() => setOpenBookings((current) => !current)}
            className="flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-100"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              Booking Center
            </div>
            <ChevronDown
              className={`h-4 w-4 transition-transform ${openBookings ? "rotate-180" : ""}`}
            />
          </button>

          <div className={`overflow-hidden transition-all ${openBookings ? "mt-2 max-h-96" : "max-h-0"}`}>
            <div className="ml-6 grid grid-cols-1 gap-1 border-l border-gray-200 pl-3">
              {bookingSection?.items.map((item) => (
                <AdminSubItem
                  key={item.key}
                  active={item.key === activeItem}
                  disabled={!ACTIVE_PAGES.has(item.key)}
                  icon={item.icon}
                  label={item.label}
                  planned={!ACTIVE_PAGES.has(item.key)}
                  onClick={() => handleSelect(item.key as ActivePage)}
                />
              ))}
            </div>
          </div>
        </div>

        {otherSections.map((section) => (
          <div key={section.label}>
            <p className="mb-2 text-xs font-semibold uppercase text-gray-400">
              {section.label}
            </p>
            <nav className="space-y-1">
              {section.items.map((item) => (
                <AdminNavItem
                  key={item.key}
                  active={item.key === activeItem}
                  disabled={!ACTIVE_PAGES.has(item.key)}
                  icon={item.icon}
                  label={item.label}
                  planned={!ACTIVE_PAGES.has(item.key)}
                  onClick={() => handleSelect(item.key as ActivePage)}
                />
              ))}
            </nav>
          </div>
        ))}

        <div className="rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 p-4 text-white shadow-md">
          <div className="mb-2 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5" />
            <p className="font-semibold">Admin Workspace</p>
          </div>
          <p className="mb-3 text-xs opacity-90">
            Manage bookings, orders, customers, and refunds.
          </p>
          <button
            type="button"
            onClick={() => handleSelect("dashboard")}
            className="w-full cursor-pointer rounded-md bg-white py-1.5 text-sm font-medium text-indigo-600 transition hover:bg-gray-100"
          >
            Go to Overview
          </button>
        </div>
      </div>

      <div className="border-t border-gray-200 px-6 py-4">
        <button
          type="button"
          disabled={loggingOut}
          onClick={() => setShowLogoutConfirm(true)}
          className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <LogOut className="h-4 w-4" />
          {loggingOut ? "Logging out..." : "Logout"}
        </button>
      </div>

      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl">
            <h3 className="text-lg font-semibold text-gray-900">Confirm Logout</h3>
            <p className="mt-2 text-sm text-gray-600">
              Are you sure you want to logout from your admin account?
            </p>

            <div className="mt-5 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                disabled={loggingOut}
                className="cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmLogout}
                disabled={loggingOut}
                className="cursor-pointer rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-60"
              >
                {loggingOut ? "Logging out..." : "Logout"}
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

function AdminNavItem({
  active,
  disabled,
  icon: Icon,
  label,
  planned,
  onClick,
}: {
  active: boolean;
  disabled: boolean;
  icon: ComponentType<{ className?: string }>;
  label: string;
  planned?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
        active
          ? "bg-indigo-50 font-medium text-indigo-600"
          : disabled
            ? "cursor-not-allowed text-gray-300"
            : "cursor-pointer text-gray-600 hover:bg-gray-100"
      }`}
    >
      <Icon className="h-4 w-4" />
      <span className="truncate">{label}</span>
      {planned ? (
        <span className="ml-auto rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-500">
          Planned
        </span>
      ) : null}
    </button>
  );
}

function AdminSubItem({
  active,
  disabled,
  icon: Icon,
  label,
  planned,
  onClick,
}: {
  active: boolean;
  disabled: boolean;
  icon: ComponentType<{ className?: string }>;
  label: string;
  planned?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition ${
        active
          ? "bg-gray-900 text-white"
          : disabled
            ? "cursor-not-allowed text-gray-300"
            : "cursor-pointer text-gray-600 hover:bg-gray-100"
      }`}
    >
      <Icon className="h-4 w-4" />
      <span className="truncate">{label}</span>
      {planned ? (
        <span className="ml-auto rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-500">
          Planned
        </span>
      ) : null}
    </button>
  );
}
