export type BillingCycle = "monthly" | "quarterly" | "yearly";

export type SubscriptionStatus = "active" | "cancelled" | "expired" | "past_due";

export type SubscriptionRecord = {
  _id: string;
  plan: "free" | "pro";
  status: SubscriptionStatus;
  startDate: string;
  endDate: string;
  paymentProvider: "razorpay";
  externalSubscriptionId?: string;
};

export type SubscriptionStatusResponse = {
  membership: "free" | "pro";
  isPro: boolean;
  planPrice: number;
  subscription: SubscriptionRecord | null;
};
