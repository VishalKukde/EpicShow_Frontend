import type { Gaming } from "@/types/Gaming";
import type { AppliedCoupon } from "@/types/Offer";
import { Seat } from "@/types/Seat";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type BookingType = "gaming";

type BookingState = {
  bookingId: string | null;
  type: BookingType;
  item: Gaming | null;
  venueId: string | null;
  venue: string | null;
  date: string | null;
  slot: string | null;
  appliedCoupon: AppliedCoupon | null;
  redeemReward: boolean;
  seats: Seat[];
  totalPrice: number;
  expireAt: string | null;

  setBookingId: (id: string) => void;
  setItem: (type: BookingType, item: Gaming | null) => void;
  setShow: (venueId: string, venue: string, date: string, slot: string) => void;
  setSeats: (seats: Seat[], price: number) => void;
  setExpireAt: (time: string | null) => void;
  applyCoupon: (coupon: AppliedCoupon) => void;
  removeCoupon: () => void;
  setRedeemReward: (enabled: boolean) => void;
  resetBooking: () => void;
};

export const useGamingBookingStore = create<BookingState>()(
  persist(
    (set) => ({
      bookingId: null,
      type: "gaming",
      item: null,
      venueId: null,
      venue: null,
      date: null,
      slot: null,
      seats: [],
      totalPrice: 0,
      appliedCoupon: null,
      redeemReward: false,
      expireAt: null,

      setBookingId: (id) => set({ bookingId: id }),
      setItem: (_type, item) =>
        set({
          type: "gaming",
          item,
        }),

      setShow: (venueId, venue, date, slot) =>
        set({
          venueId,
          venue,
          date,
          slot,
        }),

      setSeats: (seats, price) =>
        set({
          seats,
          totalPrice: price,
          appliedCoupon: null,
        }),

      setExpireAt: (time) =>
        set({
          expireAt: time,
        }),

      applyCoupon: (coupon) =>
        set({
          appliedCoupon: coupon,
        }),

      removeCoupon: () =>
        set({
          appliedCoupon: null,
        }),

      setRedeemReward: (enabled) =>
        set({
          redeemReward: enabled,
        }),

      resetBooking: () =>
        set({
          bookingId: null,
          type: "gaming",
          item: null,
          venueId: null,
          venue: "",
          date: "",
          slot: "",
          seats: [],
          totalPrice: 0,
          appliedCoupon: null,
          redeemReward: false,
          expireAt: null,
        }),
    }),
    {
      name: "gaming-booking-store",
    }
  )
);
