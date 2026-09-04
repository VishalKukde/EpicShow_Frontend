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
  if (item === "add-movie") return "Add Movie (TMDB Explorer)";
  if (item === "add-sport") return "Add Sport Event";
  if (item === "add-gaming") return "Add Gaming Event";
  if (item === "add-train") return "Add Train Route";
  if (item === "orders") return "Orders & Invoices";
  if (item === "venues") return "Venues & Seat Layouts";
  if (item === "refunds") return "Refunds & Claims";
  if (item === "customers") return "Customer Directory";
  if (item === "coupons") return "Coupons & Promo Offers";
  if (item === "loyalty") return "Loyalty & VIP Program";
  if (item === "banners") return "Hero Banners & Spotlight";
  if (item === "revenue") return "Revenue Intelligence";
  if (item === "reporting") return "Reports & Data Export";
  if (item === "staff") return "Staff Access Control";
  if (item === "notifications") return "Push Broadcast Center";
  if (item === "settings") return "Portal Settings";
  return item.charAt(0).toUpperCase() + item.slice(1);
}
