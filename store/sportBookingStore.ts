import { Movie } from "@/types/Movie";
import { Seat } from "@/types/Seat";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type BookingType = "movie" | "sport" | "event" | "gaming";

type Coupon = {
  code: string;
  off: number;
  best?: boolean;
};


type BookingState = {
  bookingId: string | null;

  // what user is booking
  type: BookingType | null;

  // full object for UI (movie/event/sport data)
  item: Movie | null;

  // show details
  venueId: string | null;
  venue: string | null;
  date: string | null;
  slot: string | null;

  // coupon
  appliedCoupon: Coupon | null;
  redeemReward: boolean;

  // seats + pricing
  seats: Seat[];
  totalPrice: number;
  expireAt: string | null;

  // ===== actions =====
  setBookingId: (id: string) => void;
  setItem: (type: BookingType, item: Movie | null) => void;
  setShow: (venueId: string, venue: string, date: string, slot: string) => void;
  setSeats: (seats: Seat[], price: number) => void;
  setExpireAt: (time: string | null) => void;

  applyCoupon: (coupon: Coupon) => void;
  removeCoupon: () => void;
  setRedeemReward: (enabled: boolean) => void;

  resetBooking: () => void;
};

export const useSportBookingStore = create<BookingState>()(
  persist(
    (set) => ({
      bookingId: null,
      type: "sport",
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
      setItem: (type, item) =>
        set({
          type,
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
          appliedCoupon: null, // reset coupon if seats change
        }),

      setExpireAt: (time) => set({
        expireAt: time
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
          type: "sport",
          item: null,
          venueId: null,
          venue: "",
          date: "",
          slot: "",
          seats: [],
          totalPrice: 0,
          appliedCoupon: null,
          redeemReward: false,
          expireAt: null
        }),
    }),
    {
      name: "sport-booking-store", // stored in localStorage
    }
  )
);
