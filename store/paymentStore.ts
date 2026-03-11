import { create } from "zustand";

type PaymentState = {
  verifiedAmount: number | null;
  verifiedSeats: string[];

  loading: boolean;
  error: string | null;

  setPaymentData: (amount: number, seats: string[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetPayment: () => void;
};

export const usePaymentStore = create<PaymentState>((set) => ({
  verifiedAmount: null,
  verifiedSeats: [],
  loading: false,
  error: null,

  setPaymentData: (amount, seats) =>
    set({
      verifiedAmount: amount,
      verifiedSeats: seats,
      error: null,
    }),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  resetPayment: () =>
    set({
      verifiedAmount: null,
      verifiedSeats: [],
      loading: false,
      error: null,
    }),
}));
