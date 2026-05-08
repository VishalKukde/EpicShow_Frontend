import type { ComponentType } from "react";
import type { PaymentMethod } from "@/types/Auth";

export type PaymentStatus = "Success" | "Refunded" | "Failed";

export type PaymentTransaction = {
  id: string;
  title: string;
  date: string;
  method: string;
  amount: number;
  status: PaymentStatus;
  showType:string
  details?: string | null;
};

export type SavedMethod = {
  method: PaymentMethod;
  label: string;
  detail: string;
};

export type PaymentStat = {
  title: string;
  value: string;
  note: string;
  icon: ComponentType<{ className?: string }>;
};
