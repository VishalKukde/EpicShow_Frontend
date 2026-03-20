"use client";

import { useEffect } from "react";
import { useEventBookingStore } from "@/store/eventBookingStore";
import { usePaymentStore } from "@/store/paymentStore";

export default function ResetEventStores() {
  useEffect(() => {
    useEventBookingStore.getState().resetBooking();
    usePaymentStore.getState().resetPayment();
  }, []);

  return null;
}
