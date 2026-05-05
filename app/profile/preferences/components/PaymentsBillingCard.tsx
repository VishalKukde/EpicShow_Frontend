import { CreditCard, Receipt } from "lucide-react";
import type { PaymentMethod } from "./PreferenceTypes";
import { ComingSoonChip } from "./ComingSoonChip";
import { ToggleRow } from "./ToggleRow";

type PaymentsBillingCardProps = {
  dark: boolean;
  preferredPaymentMethod: PaymentMethod;
  setPreferredPaymentMethod: (method: PaymentMethod) => void;
  requirePayConfirm: boolean;
  onToggleRequirePayConfirm: () => void;
  saveBillingDetails: boolean;
  onToggleSaveBillingDetails: () => void;
  gstInvoice: boolean;
  onToggleGstInvoice: () => void;
};

export function PaymentsBillingCard({
  dark,
  preferredPaymentMethod,
  setPreferredPaymentMethod,
  requirePayConfirm,
  onToggleRequirePayConfirm,
  saveBillingDetails,
  onToggleSaveBillingDetails,
  gstInvoice,
  onToggleGstInvoice,
}: PaymentsBillingCardProps) {
  return (
    <article
      className={`rounded-3xl border p-5 shadow-sm ${dark ? "border-zinc-700 bg-zinc-900" : "border-gray-200 bg-white"}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className={`text-base font-semibold ${dark ? "text-zinc-100" : "text-gray-900"}`}>Payments & Billing</h2>
          <p className={`mt-1 text-sm ${dark ? "text-zinc-400" : "text-gray-600"}`}>
            Keep checkout preferences ready for faster payments.
          </p>
        </div>
        <ComingSoonChip dark={dark} />
      </div>

      <div className="mt-4 space-y-3">
        <div
          className={`rounded-xl border px-3 py-2.5 sm:px-4 ${
            dark ? "border-zinc-700 bg-zinc-900" : "border-gray-200 bg-white"
          }`}
        >
          <p className={`text-sm font-medium ${dark ? "text-zinc-100" : "text-gray-900"}`}>
            Preferred Payment Method
          </p>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {(["upi", "card", "wallet"] as const).map((method) => (
              <button
                key={method}
                type="button"
                onClick={() => setPreferredPaymentMethod(method)}
                className={`rounded-lg border px-2 py-2 text-xs font-medium uppercase transition cursor-pointer ${
                  preferredPaymentMethod === method
                    ? dark
                      ? "border-indigo-400 bg-zinc-900 text-zinc-100"
                      : "border-gray-900 bg-gray-900 text-white"
                    : dark
                      ? "border-zinc-700 bg-zinc-700 text-zinc-300 hover:bg-zinc-800"
                      : "border-gray-200 bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {method}
              </button>
            ))}
          </div>
        </div>

        <ToggleRow
          dark={dark}
          title="Ask confirmation before payment"
          subtitle="Show final payment confirmation popup"
          checked={requirePayConfirm}
          onToggle={onToggleRequirePayConfirm}
          icon={<CreditCard className="h-4 w-4" />}
        />
        <ToggleRow
          dark={dark}
          title="Save billing details"
          subtitle="Reuse billing info in future bookings"
          checked={saveBillingDetails}
          onToggle={onToggleSaveBillingDetails}
          icon={<Receipt className="h-4 w-4" />}
        />
        <ToggleRow
          dark={dark}
          title="Enable GST invoice by default"
          subtitle="Generate invoice details at checkout"
          checked={gstInvoice}
          onToggle={onToggleGstInvoice}
          icon={<Receipt className="h-4 w-4" />}
        />
      </div>
    </article>
  );
}
