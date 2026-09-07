import { ShieldCheck } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";

export default function SecurePaymentCard() {
  const mode = useThemeStore((state) => state.mode);
  const dark = mode === "dark";

  return (
    <div
      className={`rounded-2xl border p-5 shadow-sm ${dark
          ? "border-indigo-900/60 bg-indigo-950/30"
          : "border-indigo-100 bg-indigo-50"
        } dark:bg-indigo-950/30 dark:border-indigo-900/60`}
    >
      <div className="flex items-start gap-3">
        <ShieldCheck className="mt-0.5 h-5 w-5 text-indigo-600 dark:text-indigo-400" />
        <div>
          <h3 className={`font-bold ${dark ? "text-indigo-100" : "text-gray-900"} dark:text-white`}>
            Secure Payment Shield
          </h3>
          <p className={`mt-1 text-sm ${dark ? "text-indigo-300/80" : "text-gray-700"} dark:text-indigo-200/80`}>
            End-to-end encrypted checkout with verified signatures and fraud
            monitoring.
          </p>
        </div>
      </div>
    </div>
  );
}
