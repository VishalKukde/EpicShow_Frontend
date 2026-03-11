import { ShieldCheck } from "lucide-react";

export default function SecurePaymentCard() {
  return (
    <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <ShieldCheck className="mt-0.5 h-5 w-5 text-indigo-600" />
        <div>
          <h3 className="font-semibold text-gray-900">Secure Payment Shield</h3>
          <p className="mt-1 text-sm text-gray-700">
            End-to-end encrypted checkout with verified signatures and fraud
            monitoring.
          </p>
        </div>
      </div>
    </div>
  );
}
