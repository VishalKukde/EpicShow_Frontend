export const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export const formatCurrency = (val: number) => currency.format(val || 0);

export const compact = new Intl.NumberFormat("en-IN", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export function formatActiveLabel(item: string) {
  if (!item) return "Overview";
  if (item === "dashboard") return "Overview";
  if (item === "movies") return "Movies Booking";
  if (item === "sports") return "Sports Booking";
  if (item === "gaming") return "Gaming & Esports Booking";
  if (item === "trains") return "Transit & Trains Booking";
  if (item === "add-movie") return "Manage Movie (Catalog & TMDB)";
  if (item === "add-sport") return "Manage Sports Catalog";
  if (item === "add-gaming") return "Manage Gaming Catalog";
  if (item === "add-train") return "Manage Trains & Routes Catalog";
  if (item === "orders") return "Orders & Invoices";
  if (item === "venues") return "Venues & Seat Layouts";
  if (item === "refunds") return "Refunds & Claims";
  if (item === "customers") return "Customer Directory";
  if (item === "coupons") return "Coupons & Promo Offers";
  if (item === "banners") return "Hero Banners & Spotlight";
  if (item === "revenue") return "Revenue Intelligence";
  if (item === "reporting") return "Reports & Data Export";
  if (item === "staff") return "Staff Access Control";
  if (item === "notifications") return "Push Broadcast Center";
  if (item === "settings") return "Portal Settings";
  return item.charAt(0).toUpperCase() + item.slice(1);
}
