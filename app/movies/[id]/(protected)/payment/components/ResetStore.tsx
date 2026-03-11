"use client";

import { useEffect } from "react";
import { useBookingStore } from "@/store/bookingStore";
import { usePaymentStore } from "@/store/paymentStore";

export default function ResetStores() {
  useEffect(() => {
    useBookingStore.getState().resetBooking();
    usePaymentStore.getState().resetPayment();
  }, []);

  return null;
}
