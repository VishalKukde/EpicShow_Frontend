"use client";

import { useEffect, useState } from "react";
import { useThemeStore, type ThemeMode } from "@/store/themeStore";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import { toast } from "@/lib/toast";
import {
  getDisabledPaymentMethods,
  persistPaymentPreferences,
  resolvePreferredPaymentMethod,
} from "@/lib/paymentPreferences";
import { AccessibilityCard } from "./components/AccessibilityCard";
import { AppearanceCard } from "./components/AppearanceCard";
import { BookingDefaultsCard } from "./components/BookingDefaultsCard";
import { LanguageCard } from "./components/LanguageCard";
import { NotificationCard } from "./components/NotificationCard";
import { PaymentsBillingCard } from "./components/PaymentsBillingCard";
import type {
  Language,
  PaymentMethod,
  SeatPreferenceCategory,
  SeatPreferences,
} from "./components/PreferenceTypes";
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
  const [seatPreferences, setSeatPreferences] = useState<SeatPreferences>({
    movie: user?.preferences?.seat?.movieSeat ?? "middle",
    sport: user?.preferences?.seat?.sportSeat ?? "center_view",
    train: user?.preferences?.seat?.trainSeat ?? "window",
    flight: user?.preferences?.seat?.flightSeat ?? "window",
  });
  const [defaultTicketCount, setDefaultTicketCount] = useState(2);
  const [autoSelectSeats, setAutoSelectSeats] = useState(true);
  const [instantConfirmOnly, setInstantConfirmOnly] = useState(false);
  const [preferredPaymentMethod, setPreferredPaymentMethod] = useState<PaymentMethod>(
    resolvePreferredPaymentMethod(user, 0)
  );
  const disabledPaymentMethods = getDisabledPaymentMethods(user);
  const [requirePayConfirm, setRequirePayConfirm] = useState(true);
  const [saveBillingDetails, setSaveBillingDetails] = useState(true);
  const [gstInvoice, setGstInvoice] = useState(false);
  const [pushTicketToEmail, setPushTicketToEmail] = useState(true);
  const [refundStatusAlerts, setRefundStatusAlerts] = useState(true);

  useEffect(() => {
    setPreferredPaymentMethod(resolvePreferredPaymentMethod(user, 0));
  }, [user?.preferences?.payment?.preferredMethod, user?.preferences?.payment?.disabledMethods]);

  useEffect(() => {
    setSeatPreferences({
      movie: user?.preferences?.seat?.movieSeat ?? "middle",
      sport: user?.preferences?.seat?.sportSeat ?? "center_view",
      train: user?.preferences?.seat?.trainSeat ?? "window",
      flight: user?.preferences?.seat?.flightSeat ?? "window",
    });
  }, [
    user?.preferences?.seat?.movieSeat,
    user?.preferences?.seat?.sportSeat,
    user?.preferences?.seat?.trainSeat,
    user?.preferences?.seat?.flightSeat,
  ]);

  const seatPreferenceFields: Record<SeatPreferenceCategory, string> = {
    movie: "movieSeat",
    sport: "sportSeat",
    train: "trainSeat",
    flight: "flightSeat",
  };

  const handleSeatPreferenceChange = async (
    category: SeatPreferenceCategory,
    value: SeatPreferences[SeatPreferenceCategory]
  ) => {
    const previousPreferences = seatPreferences;
    const nextPreferences = { ...seatPreferences, [category]: value };
    setSeatPreferences(nextPreferences);

    if (!user) return;

    try {
      const res = await apiFetch("/profile/update-profile", {
        method: "PUT",
        body: JSON.stringify({
          preferences: {
            seat: {
              [seatPreferenceFields[category]]: value,
            },
          },
        }),
      });

      if (res?.user?.preferences) {
        updateUser({ preferences: res.user.preferences });
      }
      toast.success("Seat preference updated.");
    } catch (err) {
      setSeatPreferences(previousPreferences);
      const message =
        err instanceof Error ? err.message : "Failed to update seat preference";
      toast.error(message);
    }
  };

  const handlePreferredPaymentMethod = async (method: PaymentMethod) => {
    setPreferredPaymentMethod(method);

    try {
      await persistPaymentPreferences({
        preferences: { preferredMethod: method },
        updateUser,
      });
      toast.success("Preferred payment method updated.");
    } catch (err) {
      setPreferredPaymentMethod(resolvePreferredPaymentMethod(user, 0));
      const message =
        err instanceof Error ? err.message : "Failed to update preferred payment method";
      toast.error(message);
    }
  };

  return (
    <div className="select-none space-y-4 px-3 py-3 pb-6 sm:space-y-5 sm:px-4 lg:space-y-6 lg:px-0 ">
      <PreferencesIntroCard dark={dark} />

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <AppearanceCard dark={dark} setTheme={handleSetTheme} toggleTheme={handleToggleTheme} />

        <LanguageCard dark={dark} language={language} setLanguage={setLanguage} />

        
{/* 
        <AccessibilityCard
          dark={dark}
          reduceMotion={reduceMotion}
          onToggleReduceMotion={() => setReduceMotion((v) => !v)}
        /> */}

        <BookingDefaultsCard
          dark={dark}
          seatPreferences={seatPreferences}
          setSeatPreferences={handleSeatPreferenceChange}
          defaultTicketCount={defaultTicketCount}
          setDefaultTicketCount={setDefaultTicketCount}
          autoSelectSeats={autoSelectSeats}
          onToggleAutoSelectSeats={() => setAutoSelectSeats((v) => !v)}
          instantConfirmOnly={instantConfirmOnly}
          onToggleInstantConfirmOnly={() => setInstantConfirmOnly((v) => !v)}
        />
<div className="space-y-4">
        <PaymentsBillingCard
          dark={dark}
          preferredPaymentMethod={preferredPaymentMethod}
          setPreferredPaymentMethod={handlePreferredPaymentMethod}
          disabledPaymentMethods={disabledPaymentMethods}
          requirePayConfirm={requirePayConfirm}
          onToggleRequirePayConfirm={() => setRequirePayConfirm((v) => !v)}
          saveBillingDetails={saveBillingDetails}
          onToggleSaveBillingDetails={() => setSaveBillingDetails((v) => !v)}
          gstInvoice={gstInvoice}
          onToggleGstInvoice={() => setGstInvoice((v) => !v)}
          />

       <NotificationCard
          dark={dark}
          bookingReminders={bookingReminders}
          emailUpdates={emailUpdates}
          offerAlerts={offerAlerts}
          onToggleBookingReminders={() => setBookingReminders((v) => !v)}
          onToggleEmailUpdates={() => setEmailUpdates((v) => !v)}
          onToggleOfferAlerts={() => setOfferAlerts((v) => !v)}
        /> 
          </div>

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
