import {
  BarChart3,
  CalendarDays,
  Gamepad2,
  Hotel,
  LayoutDashboard,
  Music,
  Plane,
  ReceiptText,
  RefreshCcw,
  Search,
  Ticket,
  Train,
  Trophy,
  Users,
  WalletCards,
  type LucideIcon,
} from "lucide-react";
import type { ActivePage, BookingType } from "./types";

type NavItem = {
  key: ActivePage | "revenue" | "reports";
  label: string;
  icon: LucideIcon;
};

export const NAV_SECTIONS: { label: string; items: NavItem[] }[] = [
  {
    label: "Dashboard",
    items: [{ key: "dashboard", label: "Overview", icon: LayoutDashboard }],
  },
  {
    label: "Bookings",
    items: [
      { key: "movies", label: "Movies", icon: Ticket },
      { key: "sports", label: "Sports", icon: Trophy },
      { key: "events", label: "Events", icon: CalendarDays },
      { key: "gaming", label: "Gaming", icon: Gamepad2 },
      { key: "concerts", label: "Concerts", icon: Music },
      { key: "flights", label: "Flights", icon: Plane },
      { key: "hotels", label: "Hotels", icon: Hotel },
      { key: "trains", label: "Trains", icon: Train },
    ],
  },
  {
    label: "Operations",
    items: [
      { key: "orders", label: "Orders", icon: ReceiptText },
      { key: "venues", label: "Venues", icon: WalletCards },
      { key: "refunds", label: "Refunds", icon: RefreshCcw },
      { key: "customers", label: "Customers", icon: Users },
    ],
  },
  {
    label: "Analytics",
    items: [
      { key: "revenue", label: "Revenue", icon: BarChart3 },
      { key: "reports", label: "Reports", icon: Search },
    ],
  },
];

export const BOOKING_TYPES = new Set<string>(["movies", "sports", "events", "gaming", "trains"]);
export const ACTIVE_PAGES = new Set<string>(["dashboard", "movies", "sports", "events", "gaming", "concerts", "flights", "hotels", "trains", "orders", "venues", "refunds", "customers"]);
export const COLORS = ["#6C63FF", "#0EA5E9", "#10B981", "#F59E0B"];

export const ADMIN_PAGE_ROUTES: Record<ActivePage, string> = {
  dashboard: "/admin",
  movies: "/admin/bookings/movies",
  sports: "/admin/bookings/sports",
  events: "/admin/bookings/events",
  gaming: "/admin/bookings/gaming",
  concerts: "/admin/bookings/concerts",
  flights: "/admin/bookings/flights",
  hotels: "/admin/bookings/hotels",
  trains: "/admin/bookings/trains",
  orders: "/admin/operation/order",
  venues: "/admin/operation/venues",
  refunds: "/admin/operation/refunds",
  customers: "/admin/operation/customers",
};

export function getAdminRoute(activeItem: ActivePage) {
  return ADMIN_PAGE_ROUTES[activeItem] || ADMIN_PAGE_ROUTES.dashboard;
}

export function getActivePageFromPath(pathname: string): ActivePage {
  const cleanPath = pathname.split("?")[0].replace(/\/+$/, "") || "/admin";
  const exactMatch = Object.entries(ADMIN_PAGE_ROUTES).find(([, route]) => route === cleanPath);
  if (exactMatch) return exactMatch[0] as ActivePage;

  const parts = cleanPath.split("/").filter(Boolean);
  const section = parts[1];
  const leaf = parts[2];

  if (section === "bookings" && ACTIVE_PAGES.has(leaf)) {
    return leaf as ActivePage;
  }

  if (section === "operation") {
    if (leaf === "order" || leaf === "orders") return "orders";
    if (leaf === "venue" || leaf === "venues") return "venues";
    if (leaf === "refund" || leaf === "refunds") return "refunds";
    if (leaf === "customer" || leaf === "customers") return "customers";
  }

  return "dashboard";
}

export function isBookingType(value: ActivePage): value is BookingType {
  return BOOKING_TYPES.has(value);
}

export function getActiveArea(activeItem: ActivePage) {
  if (activeItem === "dashboard") return "Overview";
  if (activeItem === "orders" || activeItem === "venues" || activeItem === "refunds" || activeItem === "customers") return "Operations";
  return "Bookings";
}
