"use client";

import { useState } from "react";
import { useThemeStore, type ThemeMode } from "@/store/themeStore";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import { toast } from "@/lib/toast";
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
  const setThemeForUser = useThemeStore((s) => s.setThemeForUser);
  const initializeForUser = useThemeStore((s) => s.initializeForUser);
  const { user, updateUser } = useAuth();
  const dark = mode === "dark";

  const persistThemePreference = async (nextMode: ThemeMode) => {
    if (user?.id) {
      initializeForUser(user.id);
    } else {
      initializeForUser(null);
    }
    setTheme(nextMode);
    setThemeForUser(null, nextMode);
    if (user?.id) {
      setThemeForUser(user.id, nextMode);
    }

    if (!user) return;

    try {
      const res = await apiFetch("/profile/update-profile", {
        method: "PUT",
        body: JSON.stringify({
          preferences: { darkMode: nextMode === "dark" },
        }),
      });

      if (res?.user?.preferences) {
        updateUser({ preferences: res.user.preferences });
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to sync theme preference";
      toast.warning(message);
    }
  };

  const handleSetTheme = (nextMode: ThemeMode) => {
    void persistThemePreference(nextMode);
  };

  const handleToggleTheme = () => {
    const nextMode: ThemeMode = mode === "dark" ? "light" : "dark";
    void persistThemePreference(nextMode);
  };

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
        <AppearanceCard dark={dark} setTheme={handleSetTheme} toggleTheme={handleToggleTheme} />

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
