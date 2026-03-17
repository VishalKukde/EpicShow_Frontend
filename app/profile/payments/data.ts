import { BadgeCheck, Banknote, WalletCards } from "lucide-react";
import type { PaymentStat, SavedMethod } from "./types";

export function buildPaymentStats({
  totalSpent,
  successfulBookings,
  savedMethodsCount,
}: {
  totalSpent: number;
  successfulBookings: number;
  savedMethodsCount: number;
}): PaymentStat[] {
  return [
    {
      title: "Total Spent",
      value: `₹${Number(totalSpent || 0).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      note: "Across all successful bookings",
      icon: Banknote,
    },
    {
      title: "Successful Bookings",
      value: String(successfulBookings || 0),
      note: "Bookings paid successfully",
      icon: BadgeCheck,
    },
    {
      title: "Saved Methods",
      value: String(savedMethodsCount || 0),
      note: "UPI, Card, Wallet",
      icon: WalletCards,
    },
  ];
}

export const savedMethods: SavedMethod[] = [
  { label: "UPI", detail: "vishal@okaxis" },
  { label: "Card", detail: "Visa •••• 4381" },
  { label: "Wallet", detail: "EpicShow Wallet" },
];
