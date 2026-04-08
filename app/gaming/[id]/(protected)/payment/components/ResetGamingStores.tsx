"use client";

import { useEffect } from "react";
import { useGamingBookingStore } from "@/store/gamingBookingStore";
import { usePaymentStore } from "@/store/paymentStore";

export default function ResetGamingStores() {
  useEffect(() => {
    useGamingBookingStore.getState().resetBooking();
    usePaymentStore.getState().resetPayment();
  }, []);

  return null;
}
