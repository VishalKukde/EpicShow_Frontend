export type WalletTransaction = {
  id: string;
  type: "credit" | "debit";
  title: string;
  date: string;
  amount: number;
};

export const PRESET_AMOUNTS = [200, 500, 1000];
export const MAX_TOPUP = 5000;
export const MIN_TOPUP = 1;
