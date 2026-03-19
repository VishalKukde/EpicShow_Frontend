import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PaymentMethod, PaymentStatus } from "@/types/Payment";

export type MockTicket = {
  type: "sport";
  bookingId: string;
  status: PaymentStatus;
  matchTitle: string;
  venue: string;
  date: string;
  slot: string;
  seatIds: string[];
  amount: number;
  paymentId?: string;
  method?: PaymentMethod;
  createdAt: string;
  posterUrl?: string | null;
};

type PaymentState = {
  verifiedAmount: number | null;
  verifiedSeats: string[];

  loading: boolean;
  error: string | null;
  mockTicket: MockTicket | null;

  setPaymentData: (amount: number, seats: string[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setMockTicket: (ticket: MockTicket | null) => void;
  resetPayment: () => void;
};

export const usePaymentStore = create<PaymentState>()(
  persist(
    (set) => ({
      verifiedAmount: null,
      verifiedSeats: [],
      loading: false,
      error: null,
      mockTicket: null,

      setPaymentData: (amount, seats) =>
        set({
          verifiedAmount: amount,
          verifiedSeats: seats,
          error: null,
        }),

      setLoading: (loading) => set({ loading }),

      setError: (error) => set({ error }),

      setMockTicket: (ticket) => set({ mockTicket: ticket }),

      resetPayment: () =>
        set({
          verifiedAmount: null,
          verifiedSeats: [],
          loading: false,
          error: null,
          mockTicket: null,
        }),
    }),
    {
      name: "payment-store",
      partialize: (state) => ({
        mockTicket: state.mockTicket,
      }),
    }
  )
);
