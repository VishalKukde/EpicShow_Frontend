import type { BillingCycle } from "./types";

export const proPrices: Record<BillingCycle, { amount: number; label: string }> = {
  monthly: { amount: 299, label: "per month" },
  quarterly: { amount: 799, label: "every 3 months" },
  yearly: { amount: 2799, label: "per year" },
};

export const freeFeatures = [
  "Standard booking flow",
  "Basic support access",
  "Regular offer eligibility",
  "Manual payment retries",
];

export const proFeatures = [
  "Priority booking windows",
  "Premium support response",
  "Exclusive discounts and coupons",
  "Faster checkout experience",
  "Early access for selected releases",
  "Pro badge and rewards multiplier",
];
