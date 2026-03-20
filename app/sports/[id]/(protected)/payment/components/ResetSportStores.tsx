"use client";

import { useEffect } from "react";
import { useSportBookingStore } from "@/store/sportBookingStore";
import { usePaymentStore } from "@/store/paymentStore";

export default function ResetSportStores() {
  useEffect(() => {
    useSportBookingStore.getState().resetBooking();
    usePaymentStore.getState().resetPayment();
  }, []);

  return null;
}
