import type { ComponentType } from "react";

export type PaymentStatus = "Success" | "Refunded" | "Failed";

export type PaymentTransaction = {
  id: string;
  title: string;
  date: string;
  method: string;
  amount: number;
  status: PaymentStatus;
  showType:string
};

export type SavedMethod = {
  label: string;
  detail: string;
};

export type PaymentStat = {
  title: string;
  value: string;
  note: string;
  icon: ComponentType<{ className?: string }>;
};
