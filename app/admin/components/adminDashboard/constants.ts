import {
  Award,
  BarChart3,
  Bell,
  FileSpreadsheet,
  Film,
  Gamepad2,
  Gift,
  LayoutDashboard,
  Megaphone,
  ReceiptText,
  RefreshCcw,
  Settings,
  ShieldCheck,
  Train,
  Trophy,
  Users,
  WalletCards,
  type LucideIcon,
} from "lucide-react";
import type { ActivePage, BookingType } from "./types";

type NavItem = {
  key: ActivePage;
  label: string;
  icon: LucideIcon;
  badge?: string;
};

export const NAV_SECTIONS: { label: string; items: NavItem[] }[] = [
  {
    label: "Dashboard",
    items: [{ key: "dashboard", label: "Overview", icon: LayoutDashboard }],
  },
  {
    label: "Bookings",
    items: [
      { key: "movies", label: "Movies", icon: Film },
      { key: "sports", label: "Sports", icon: Trophy },
      { key: "gaming", label: "Gaming & Esports", icon: Gamepad2 },
      { key: "trains", label: "Transit & Trains", icon: Train },
    ],
  },
  {
    label: "Catalog & Add Content",
    items: [
      { key: "add-movie", label: "Add Movie", icon: Film, badge: "TMDB" },
      { key: "add-sport", label: "Add Sport", icon: Trophy },
      { key: "add-gaming", label: "Add Gaming", icon: Gamepad2 },
      { key: "add-train", label: "Add Train", icon: Train },
    ],
  },
  {
    label: "Operations",
    items: [
      { key: "orders", label: "Orders", icon: ReceiptText },
      { key: "venues", label: "Venues & Seats", icon: WalletCards },
      { key: "refunds", label: "Refunds & Claims", icon: RefreshCcw },
      { key: "customers", label: "Customers", icon: Users },
    ],
  },
  {
    label: "Marketing & Growth",
    items: [
      { key: "coupons", label: "Coupons & Offers", icon: Gift },
      { key: "loyalty", label: "Loyalty & VIP", icon: Award },
      { key: "banners", label: "Hero Banners", icon: Megaphone },
    ],
  },
  {
    label: "Financial Analytics",
    items: [
      { key: "revenue", label: "Revenue Intelligence", icon: BarChart3 },
      { key: "reporting", label: "Reports & Export", icon: FileSpreadsheet },
    ],
  },
  {
    label: "System & Security",
    items: [
      { key: "staff", label: "Staff Access", icon: ShieldCheck },
      { key: "notifications", label: "Push Broadcast", icon: Bell },
      { key: "settings", label: "Portal Settings", icon: Settings },
    ],
  },
];

export const BOOKING_TYPES = new Set<string>(["movies", "sports", "gaming", "trains"]);

export const ACTIVE_PAGES = new Set<string>([
  "dashboard",
  "movies",
  "sports",
  "gaming",
  "trains",
  "add-movie",
  "add-sport",
  "add-gaming",
  "add-train",
  "orders",
  "venues",
  "refunds",
  "customers",
  "coupons",
  "loyalty",
  "banners",
  "revenue",
  "reporting",
  "staff",
  "notifications",
  "settings",
]);

export const COLORS = ["#6C63FF", "#0EA5E9", "#10B981", "#F59E0B"];

export const ADMIN_PAGE_ROUTES: Record<ActivePage, string> = {
  dashboard: "/admin",
  movies: "/admin/bookings/movies",
  sports: "/admin/bookings/sports",
  gaming: "/admin/bookings/gaming",
  trains: "/admin/bookings/trains",
  "add-movie": "/admin/catalog/add-movie",
  "add-sport": "/admin/catalog/add-sport",
  "add-gaming": "/admin/catalog/add-gaming",
  "add-train": "/admin/catalog/add-train",
  orders: "/admin/operation/order",
  venues: "/admin/operation/venues",
  refunds: "/admin/operation/refunds",
  customers: "/admin/operation/customers",
  coupons: "/admin/marketing/coupons",
  loyalty: "/admin/marketing/loyalty",
  banners: "/admin/marketing/banners",
  revenue: "/admin/analytics/revenue",
  reporting: "/admin/analytics/reporting",
  staff: "/admin/system/staff",
  notifications: "/admin/system/notifications",
  settings: "/admin/system/settings",
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

  if (section === "catalog") {
    if (leaf === "add-movie" || leaf === "movie") return "add-movie";
    if (leaf === "add-sport" || leaf === "sport") return "add-sport";
    if (leaf === "add-gaming" || leaf === "gaming") return "add-gaming";
    if (leaf === "add-train" || leaf === "train") return "add-train";
  }

  if (section === "bookings" && ACTIVE_PAGES.has(leaf)) {
    return leaf as ActivePage;
  }

  if (section === "operation") {
    if (leaf === "order" || leaf === "orders") return "orders";
    if (leaf === "venue" || leaf === "venues") return "venues";
    if (leaf === "refund" || leaf === "refunds") return "refunds";
    if (leaf === "customer" || leaf === "customers") return "customers";
  }

  if (section === "marketing") {
    if (leaf === "coupons") return "coupons";
    if (leaf === "loyalty") return "loyalty";
    if (leaf === "banners") return "banners";
  }
  if (section === "analytics") {
    if (leaf === "revenue") return "revenue";
    if (leaf === "reporting" || leaf === "reports") return "reporting";
  }
  if (section === "system") {
    if (leaf === "staff") return "staff";
    if (leaf === "notifications") return "notifications";
    if (leaf === "settings") return "settings";
  }

  return "dashboard";
}

export function isBookingType(value: ActivePage): value is BookingType {
  return BOOKING_TYPES.has(value);
}

export function getActiveArea(activeItem: ActivePage) {
  if (activeItem === "dashboard") return "Overview";
  if (["movies", "sports", "gaming", "trains"].includes(activeItem)) return "Bookings";
  if (["add-movie", "add-sport", "add-gaming", "add-train"].includes(activeItem)) return "Catalog";
  if (["orders", "venues", "refunds", "customers"].includes(activeItem)) return "Operations";
  if (["coupons", "loyalty", "banners"].includes(activeItem)) return "Marketing";
  if (["revenue", "reporting"].includes(activeItem)) return "Analytics";
  return "System";
}
