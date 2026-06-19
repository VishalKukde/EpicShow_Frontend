export type PaymentStatus = "success" | "failed" | "refund_initiated" | "refunded";

export type PaymentMethod =
  | "upi"
  | "card"
  | "netbanking"
  | "wallet";

export interface Payment {
  paymentId: string;      // Razorpay payment id
  bookingId: string;      // optional to show in UI

  method: PaymentMethod;

  amount: number;
  currency: string;

  status: PaymentStatus;

  createdAt: string;      // ISO date string
}
