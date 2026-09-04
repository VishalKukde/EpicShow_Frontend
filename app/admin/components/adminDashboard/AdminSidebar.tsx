"use client";

import Image from "next/image";
import { ChevronDown, LogOut, ShieldCheck, PlusCircle } from "lucide-react";
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
  const [openCatalog, setOpenCatalog] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const dashboardSection = NAV_SECTIONS.find((section) => section.label === "Dashboard");
  const bookingSection = NAV_SECTIONS.find((section) => section.label === "Bookings");
  const catalogSection = NAV_SECTIONS.find((section) => section.label === "Catalog & Add Content");
  const otherSections = NAV_SECTIONS.filter(
    (section) =>
      section.label !== "Dashboard" &&
      section.label !== "Bookings" &&
      section.label !== "Catalog & Add Content"
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
    <aside className="hidden h-screen w-[260px] min-w-[260px] select-none flex-col border-r border-slate-200 bg-white text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 lg:flex">
      {/* Top Admin Brand Banner */}
      <button
        type="button"
        onClick={() => router.push("/")}
        className="flex w-full items-center justify-start border-b border-slate-200 bg-transparent px-6 py-4 text-center dark:border-slate-800 cursor-pointer"
      >
        <span className="inline-block text-2xl font-black tracking-tight text-slate-900 transition-transform duration-200 ease-out hover:-rotate-3 hover:scale-105 dark:text-white">
          EpicShow
        </span>
      </button>

      {/* Main Nav Scroll View */}
      <div
        ref={scrollRef}
        onScroll={handleSidebarScroll}
        className="flex-1 space-y-5 overflow-y-auto px-4 py-5"
      >
        {/* User Mini Profile Header */}
        <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/80 p-2.5 dark:border-slate-800 dark:bg-slate-950/60">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg text-sm font-bold ${loading ? "animate-pulse bg-slate-200 dark:bg-slate-800" : "bg-indigo-600 text-white"
              }`}
          >
            {loading ? null : (
              <Image
                src={user?.avatar || "/assets/profiles/user.webp"}
                alt={user?.name || "Admin"}
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
            )}
          </div>

          <div className="min-w-0 flex-1">
            {loading ? (
              <>
                <div className="mb-1 h-3.5 w-20 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                <div className="h-2.5 w-28 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
              </>
            ) : (
              <>
                <p className="truncate text-xs font-extrabold text-slate-900 dark:text-white m-0">
                  {user?.name || "Super Admin"}
                </p>
                <p className="truncate text-[10.5px] font-semibold text-slate-500 dark:text-slate-400 m-0">
                  {user?.email || "admin@epicshow.app"}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Dashboard Section */}
        <div>
          <p className="mb-1.5 px-2 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Dashboard
          </p>
          <nav className="space-y-[1px]">
            {dashboardSection?.items.map((item) => (
              <AdminNavItem
                key={item.key}
                active={item.key === activeItem}
                disabled={!ACTIVE_PAGES.has(item.key)}
                icon={item.icon}
                label={item.label}
                badge={item.badge}
                onClick={() => handleSelect(item.key as ActivePage)}
              />
            ))}
          </nav>
        </div>

        {/* Booking Center (Collapsible Group) */}
        <div>
          <button
            type="button"
            onClick={() => setOpenBookings((current) => !current)}
            className="flex w-full cursor-pointer items-center justify-between rounded-xl px-2.5 py-2 text-xs font-black uppercase tracking-wider text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/60"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5 text-indigo-500 dark:text-indigo-400" />
              <span>Booking Center</span>
            </div>
            <ChevronDown
              className={`h-3.5 w-3.5 transition-transform duration-200 ${openBookings ? "rotate-180" : ""}`}
            />
          </button>

          <div className={`overflow-hidden transition-all duration-200 ${openBookings ? "mt-1 max-h-96" : "max-h-0"}`}>
            <div className="ml-3.5 grid grid-cols-1 gap-[1px] border-l-2 border-slate-200 pl-2 dark:border-slate-800">
              {bookingSection?.items.map((item) => (
                <AdminSubItem
                  key={item.key}
                  active={item.key === activeItem}
                  disabled={!ACTIVE_PAGES.has(item.key)}
                  icon={item.icon}
                  label={item.label}
                  onClick={() => handleSelect(item.key as ActivePage)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Catalog & Add Content (Collapsible Group) */}
        <div>
          <button
            type="button"
            onClick={() => setOpenCatalog((current) => !current)}
            className="flex w-full cursor-pointer items-center justify-between rounded-xl px-2.5 py-3 text-xs font-black uppercase tracking-wider text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/60"
          >
            <div className="flex items-center gap-2">
              <PlusCircle className="h-3.5 w-3.5 text-indigo-500 dark:text-indigo-400" />
              <span>Catalog Center</span>
            </div>
            <ChevronDown
              className={`h-3.5 w-3.5 transition-transform duration-200 ${openCatalog ? "rotate-180" : ""}`}
            />
          </button>

          <div className={`overflow-hidden transition-all duration-200 ${openCatalog ? "mt-1 max-h-96" : "max-h-0"}`}>
            <div className="ml-3.5 grid grid-cols-1 gap-[1px] border-l-2 border-slate-200 pl-2 dark:border-slate-800">
              {catalogSection?.items.map((item) => (
                <AdminSubItem
                  key={item.key}
                  active={item.key === activeItem}
                  disabled={!ACTIVE_PAGES.has(item.key)}
                  icon={item.icon}
                  label={item.label}
                  badge={item.badge}
                  onClick={() => handleSelect(item.key as ActivePage)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Remaining Enterprise Sections */}
        {otherSections.map((section) => (
          <div key={section.label}>
            <p className="mb-1.5 px-2 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {section.label}
            </p>
            <nav className="space-y-[1px]">
              {section.items.map((item) => (
                <AdminNavItem
                  key={item.key}
                  active={item.key === activeItem}
                  disabled={!ACTIVE_PAGES.has(item.key)}
                  icon={item.icon}
                  label={item.label}
                  badge={item.badge}
                  onClick={() => handleSelect(item.key as ActivePage)}
                />
              ))}
            </nav>
          </div>
        ))}
      </div>

      {/* Logout Footer Section */}
      <div className="border-t border-slate-200 px-4 py-3 dark:border-slate-800">
        <button
          type="button"
          disabled={loggingOut}
          onClick={() => setShowLogoutConfirm(true)}
          className="flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-extrabold text-rose-600 transition hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <LogOut className="h-4 w-4" />
          <span>{loggingOut ? "Logging out..." : "Sign Out Session"}</span>
        </button>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-lg font-black text-slate-900 dark:text-white m-0">Confirm Logout</h3>
            <p className="mt-2 text-xs font-semibold text-slate-600 dark:text-slate-400 m-0">
              Are you sure you want to end your active administrator session?
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                disabled={loggingOut}
                className="cursor-pointer rounded-xl border border-slate-200 px-4 py-2 text-xs font-extrabold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmLogout}
                disabled={loggingOut}
                className="cursor-pointer rounded-xl bg-rose-600 px-4 py-2 text-xs font-extrabold text-white transition hover:bg-rose-700 disabled:opacity-60"
              >
                {loggingOut ? "Logging out..." : "Yes, Sign Out"}
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
  badge,
  onClick,
}: {
  active: boolean;
  disabled: boolean;
  icon: ComponentType<{ className?: string }>;
  label: string;
  badge?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-extrabold transition-all duration-150 ${active
        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 border border-indigo-500/40 dark:bg-indigo-600 dark:text-white dark:border-indigo-400/50 dark:shadow-lg dark:shadow-indigo-500/40"
        : disabled
          ? "cursor-not-allowed opacity-40"
          : "cursor-pointer text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/80"
        }`}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <Icon className={`h-4 w-4 shrink-0 ${active ? "text-white dark:text-white" : "text-slate-400 dark:text-slate-400"}`} />
        <span className="truncate">{label}</span>
      </div>
      {badge && (
        <span
          className={`rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${active
            ? "bg-white/20 text-white"
            : badge === "TMDB"
              ? "bg-indigo-500/20 text-indigo-500"
              : "bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
            }`}
        >
          {badge}
        </span>
      )}
    </button>
  );
}

function AdminSubItem({
  active,
  disabled,
  icon: Icon,
  label,
  badge,
  onClick,
}: {
  active: boolean;
  disabled: boolean;
  icon: ComponentType<{ className?: string }>;
  label: string;
  badge?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-extrabold transition-all duration-150 ${active
        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 border border-indigo-500/40 dark:bg-indigo-600 dark:text-white dark:border-indigo-400/50 dark:shadow-lg dark:shadow-indigo-500/40"
        : disabled
          ? "cursor-not-allowed opacity-40"
          : "cursor-pointer text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/80"
        }`}
    >
      <div className="flex items-center gap-2 min-w-0">
        <Icon className={`h-3.5 w-3.5 shrink-0 ${active ? "text-white dark:text-white" : "text-slate-400 dark:text-slate-400"}`} />
        <span className="truncate">{label}</span>
      </div>
      {badge && (
        <span
          className={`rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${active
            ? "bg-white/20 text-white"
            : badge === "TMDB"
              ? "bg-indigo-500/20 text-indigo-500"
              : "bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
            }`}
        >
          {badge}
        </span>
      )}
    </button>
  );
}
