import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { CreditCard } from "lucide-react";
import type { SavedMethod } from "../types";
import { useThemeStore } from "@/store/themeStore";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/lib/toast";
import { getDisabledPaymentMethods, persistPaymentPreferences } from "@/lib/paymentPreferences";

type PaymentMethodsCardProps = {
  methods: SavedMethod[];
};

export default function PaymentMethodsCard({ methods }: PaymentMethodsCardProps) {
  const { user, updateUser } = useAuth();
  const mode = useThemeStore((state) => state.mode);
  const dark = mode === "dark";
  const [open, setOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<SavedMethod | null>(null);
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState("");
  const disabledMethods = getDisabledPaymentMethods(user);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    if (open) {
      window.addEventListener("keydown", onKeyDown);
    }

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const openManageModal = (method: SavedMethod) => {
    setSelectedMethod(method);
    setModalError("");
    setOpen(true);
  };

  const handleToggleMethod = async () => {
    if (!selectedMethod) return;

    const nextDisabled = !disabledMethods[selectedMethod.method];
    if (nextDisabled && user?.preferences?.payment?.preferredMethod === selectedMethod.method) {
      const message =
        "You cannot disable your preferred payment method. Choose another preferred method first.";
      setModalError(message);
      return;
    }

    setSaving(true);
    setModalError("");
    try {
      await persistPaymentPreferences({
        preferences: {
          disabledMethods: {
            [selectedMethod.method]: nextDisabled,
          },
        },
        updateUser,
      });
      toast.success(`${selectedMethod.label} ${nextDisabled ? "disabled" : "enabled"}.`);
      if (nextDisabled) {
        setOpen(false);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update payment method";
      setModalError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={`rounded-2xl border p-5 shadow-sm border-gray-200 bg-white`}>
      <h2 className={`text-lg font-semibold ${dark ? "text-white" : "text-gray-900"}`}>Payment Methods</h2>
      <div className="mt-4 space-y-3">
        {methods.map((method) => {
          const isDisabled = disabledMethods[method.method];

          return (
            <div
              key={method.label}
              className={`flex items-center justify-between rounded-xl border p-3 ${
                isDisabled
                  ? dark
                    ? "border-zinc-700 bg-zinc-800/60 opacity-80"
                    : "border-gray-200 bg-gray-50 opacity-80"
                  : "border-gray-200"
              }`}
            >
              <div className="flex items-center gap-2">
                <CreditCard className={`h-4 w-4 ${dark ? "text-zinc-300" : "text-gray-600"}`} />
                <div>
                  <div className="flex items-center gap-2">
                    <p className={`text-sm font-medium ${dark ? "text-white" : "text-gray-800"}`}>{method.label}</p>
                    {isDisabled && (
                      <span className={`rounded-full px-2 py-0.5 text-[8px] font-semibold border uppercase ${dark ? "bg-zinc-700 text-zinc-300 border-zinc-500" : "bg-gray-200 text-gray-600 border-gray-300"}`}>
                        Disabled
                      </span>
                    )}
                  </div>
                  <p className={`text-xs ${dark ? "text-zinc-400" : "text-gray-500"}`}>{method.detail}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => openManageModal(method)}
                className={`cursor-pointer rounded-md px-2 py-1 text-xs font-medium text-indigo-600 border ${dark ? "hover:bg-indigo-800 border-indigo-500" : "hover:bg-indigo-50 border-indigo-300"}`}
              >
                Manage
              </button>
            </div>
          );
        })}
      </div>

      {open &&
        typeof window !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4"
            onClick={() => setOpen(false)}
          >
            <div
              className={`w-full max-w-md rounded-2xl border shadow-xl ${dark ? "border-zinc-700 bg-zinc-900 text-white" : "border-gray-200 bg-white text-gray-900"}`}
              onClick={(event) => event.stopPropagation()}
            >
              <div className={`flex items-center justify-between border-b px-5 py-4 ${dark ? "border-zinc-700" : "border-gray-200"}`}>
                <h3 className="text-base font-semibold">Manage Payment Method</h3>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className={`cursor-pointer rounded-md px-2 py-1 text-xs ${dark ? "hover:bg-zinc-800" : "hover:bg-gray-100"}`}
                >
                  Close
                </button>
              </div>

              <div className="space-y-4 px-5 py-4">
                <p className={`text-sm ${dark ? "text-zinc-300" : "text-gray-600"}`}>
                  {selectedMethod?.label || "Payment method"}
                </p>
                <div className={`rounded-xl border p-3 ${dark ? "border-zinc-700 bg-zinc-800/60" : "border-gray-200 bg-gray-50"}`}>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className={`text-sm font-medium ${dark ? "text-white" : "text-gray-900"}`}>
                        Enable this payment method
                      </p>
                      <p className={`mt-1 text-xs ${dark ? "text-zinc-400" : "text-gray-500"}`}>
                        {selectedMethod?.method === user?.preferences?.payment?.preferredMethod
                          ? "Preferred methods must stay enabled."
                          : "Turn this method on or off for checkout."}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleToggleMethod}
                      disabled={saving}
                      className={`border cursor-pointer rounded-full px-3 py-1 text-xs font-medium disabled:cursor-not-allowed disabled:opacity-60 ${
                        disabledMethods[selectedMethod?.method || "upi"]
                          ? dark
                            ? "bg-emerald-500/15 text-emerald-300 border-emerald-600"
                            : "bg-emerald-100 text-emerald-700 border-emerald-300"
                          : dark
                            ? "bg-zinc-700 text-zinc-300"
                            : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {saving
                        ? "Saving..."
                        : disabledMethods[selectedMethod?.method || "upi"]
                          ? "Enable"
                          : "Disable"}
                    </button>
                  </div>
                </div>
                {modalError && (
                  <div className={`rounded-xl border px-3 py-2 text-xs ${dark ? "border-red-700 bg-red-500/15 text-red-300" : "border-red-200 bg-red-50 text-red-700"}`}>
                    {modalError}
                  </div>
                )}
              </div>

              <div className={`flex justify-end border-t px-5 py-4 ${dark ? "border-zinc-700" : "border-gray-200"}`}>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className={`cursor-pointer rounded-lg px-4 py-2 text-sm font-medium ${dark ? "bg-zinc-800 text-zinc-100 hover:bg-zinc-700" : "bg-gray-100 text-gray-800 hover:bg-gray-200"}`}
                >
                  Done
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
