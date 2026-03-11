"use client";

import { useState } from "react";
import { Lock, ShieldCheck } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { setToken } from "@/lib/tokenStore";
import { useThemeStore } from "@/store/themeStore";
import ActiveSessionsCard from "./components/ActiveSessionsCard";
import ChangePasswordModal from "./components/ChangePasswordModal";
import PasswordCard from "./components/PasswordCard";
import SecurityHero from "./components/SecurityHero";
import SecurityTipsGrid from "./components/SecurityTipsGrid";
import SecurityToggleCard from "./components/SecurityToggleCard";
import { activeSessions, securityTips } from "./data";

export default function SecurityPage() {
  const mode = useThemeStore((state) => state.mode);
  const dark = mode === "dark";
  const [twoFactor, setTwoFactor] = useState(true);
  const [alerts, setAlerts] = useState(true);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [changePasswordError, setChangePasswordError] = useState("");
  const [showLoginAgainPrompt, setShowLoginAgainPrompt] = useState(false);

  const handleChangePassword = async (payload: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    setChangingPassword(true);
    setChangePasswordError("");

    try {
      await apiFetch("/api/auth/change-password", {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      try {
        await apiFetch("/auth/logout", { method: "POST" });
      } catch {
        // Logout can fail if refresh token already invalidated.
      }

      setToken(null);
      setChangePasswordOpen(false);
      setShowLoginAgainPrompt(true);
    } catch (error) {
      setChangePasswordError(
        error instanceof Error ? error.message : "Failed to change password"
      );
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="space-y-6 px-3 py-3 pb-6 select-none sm:px-4 lg:px-0">
      <SecurityHero />

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <PasswordCard onChangePassword={() => setChangePasswordOpen(true)} />
        <SecurityToggleCard
          title="Two-Factor Authentication"
          note="Add an extra layer of login protection"
          enabledLabel="Enabled"
          disabledLabel="Enable 2FA"
          enabled={twoFactor}
          onToggle={() => setTwoFactor((prev) => !prev)}
          icon={ShieldCheck}
          color="emerald"
          dark={dark}
        />
      </section>

      <SecurityToggleCard
        title="Login Alerts"
        note="Receive notifications for suspicious activity"
        enabledLabel="Alerts On"
        disabledLabel="Turn On Alerts"
        enabled={alerts}
        onToggle={() => setAlerts((prev) => !prev)}
        icon={Lock}
        color="indigo"
        dark={dark}
      />

      <ActiveSessionsCard sessions={activeSessions} dark={dark} />
      <SecurityTipsGrid tips={securityTips} />

      <ChangePasswordModal
        open={changePasswordOpen}
        loading={changingPassword}
        error={changePasswordError}
        onClose={() => {
          if (!changingPassword) {
            setChangePasswordOpen(false);
            setChangePasswordError("");
          }
        }}
        onSubmit={handleChangePassword}
      />

      {showLoginAgainPrompt && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/45 px-4">
          <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900">
              Password updated successfully
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              For security, please login again to continue.
            </p>
            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowLoginAgainPrompt(false)}
                className="cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Later
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLoginAgainPrompt(false);
                  window.location.href = "/login";
                }}
                className="cursor-pointer rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
              >
                Login again
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
