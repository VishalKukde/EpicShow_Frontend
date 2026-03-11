"use client";

import { useState } from "react";
import { useThemeStore } from "@/store/themeStore";
import { AccessibilityCard } from "./components/AccessibilityCard";
import { AppearanceCard } from "./components/AppearanceCard";
import { BookingDefaultsCard } from "./components/BookingDefaultsCard";
import { LanguageCard } from "./components/LanguageCard";
import { NotificationCard } from "./components/NotificationCard";
import { PaymentsBillingCard } from "./components/PaymentsBillingCard";
import type { Language, PaymentMethod, SeatZone } from "./components/PreferenceTypes";
import { PreferencesIntroCard } from "./components/PreferencesIntroCard";
import { TicketRefundCard } from "./components/TicketRefundCard";

export default function PreferencesPage() {
  const mode = useThemeStore((s) => s.mode);
  const setTheme = useThemeStore((s) => s.setTheme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const dark = mode === "dark";

  const [language, setLanguage] = useState<Language>("english");
  const [bookingReminders, setBookingReminders] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [offerAlerts, setOfferAlerts] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [preferredSeatZone, setPreferredSeatZone] = useState<SeatZone>("middle");
  const [defaultTicketCount, setDefaultTicketCount] = useState(2);
  const [autoSelectSeats, setAutoSelectSeats] = useState(true);
  const [instantConfirmOnly, setInstantConfirmOnly] = useState(false);
  const [preferredPaymentMethod, setPreferredPaymentMethod] = useState<PaymentMethod>("upi");
  const [requirePayConfirm, setRequirePayConfirm] = useState(true);
  const [saveBillingDetails, setSaveBillingDetails] = useState(true);
  const [gstInvoice, setGstInvoice] = useState(false);
  const [pushTicketToEmail, setPushTicketToEmail] = useState(true);
  const [refundStatusAlerts, setRefundStatusAlerts] = useState(true);

  return (
    <div className="select-none space-y-4 px-3 pb-6 sm:px-4 lg:space-y-6 lg:px-0">
      <PreferencesIntroCard dark={dark} />

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <AppearanceCard dark={dark} setTheme={setTheme} toggleTheme={toggleTheme} />

        <LanguageCard dark={dark} language={language} setLanguage={setLanguage} />

        {/* <NotificationCard
          dark={dark}
          bookingReminders={bookingReminders}
          emailUpdates={emailUpdates}
          offerAlerts={offerAlerts}
          onToggleBookingReminders={() => setBookingReminders((v) => !v)}
          onToggleEmailUpdates={() => setEmailUpdates((v) => !v)}
          onToggleOfferAlerts={() => setOfferAlerts((v) => !v)}
        /> */}
{/* 
        <AccessibilityCard
          dark={dark}
          reduceMotion={reduceMotion}
          onToggleReduceMotion={() => setReduceMotion((v) => !v)}
        /> */}

        <BookingDefaultsCard
          dark={dark}
          preferredSeatZone={preferredSeatZone}
          setPreferredSeatZone={setPreferredSeatZone}
          defaultTicketCount={defaultTicketCount}
          setDefaultTicketCount={setDefaultTicketCount}
          autoSelectSeats={autoSelectSeats}
          onToggleAutoSelectSeats={() => setAutoSelectSeats((v) => !v)}
          instantConfirmOnly={instantConfirmOnly}
          onToggleInstantConfirmOnly={() => setInstantConfirmOnly((v) => !v)}
        />

        <PaymentsBillingCard
          dark={dark}
          preferredPaymentMethod={preferredPaymentMethod}
          setPreferredPaymentMethod={setPreferredPaymentMethod}
          requirePayConfirm={requirePayConfirm}
          onToggleRequirePayConfirm={() => setRequirePayConfirm((v) => !v)}
          saveBillingDetails={saveBillingDetails}
          onToggleSaveBillingDetails={() => setSaveBillingDetails((v) => !v)}
          gstInvoice={gstInvoice}
          onToggleGstInvoice={() => setGstInvoice((v) => !v)}
        />

        {/* <TicketRefundCard
          dark={dark}
          pushTicketToEmail={pushTicketToEmail}
          onTogglePushTicketToEmail={() => setPushTicketToEmail((v) => !v)}
          refundStatusAlerts={refundStatusAlerts}
          onToggleRefundStatusAlerts={() => setRefundStatusAlerts((v) => !v)}
        /> */}
      </section>
    </div>
  );
}
