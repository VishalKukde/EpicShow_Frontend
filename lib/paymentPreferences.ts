import { apiFetch } from "@/lib/api";
import type { PaymentMethod, User } from "@/types/Auth";

export const PAYMENT_METHODS: PaymentMethod[] = ["upi", "card", "wallet"];

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  upi: "UPI",
  card: "Card",
  wallet: "Wallet",
};

export function isPaymentMethod(method: unknown): method is PaymentMethod {
  return method === "upi" || method === "card" || method === "wallet";
}

export function getDisabledPaymentMethods(user?: User | null) {
  return {
    upi: Boolean(user?.preferences?.payment?.disabledMethods?.upi),
    card: Boolean(user?.preferences?.payment?.disabledMethods?.card),
    wallet: Boolean(user?.preferences?.payment?.disabledMethods?.wallet),
  };
}

export function getEnabledPaymentMethods(user?: User | null) {
  const disabledMethods = getDisabledPaymentMethods(user);
  return PAYMENT_METHODS.filter((method) => !disabledMethods[method]);
}

export function canUsePaymentMethod(
  method: PaymentMethod,
  user: User | null | undefined,
  payableAmount: number
) {
  const disabledMethods = getDisabledPaymentMethods(user);
  if (disabledMethods[method]) return false;
  if (method === "wallet") return Number(user?.walletBalance ?? 0) >= payableAmount;
  return true;
}

export function resolvePreferredPaymentMethod(
  user: User | null | undefined,
  payableAmount: number
): PaymentMethod {
  const preferredMethod = user?.preferences?.payment?.preferredMethod;
  const lastUsedMethod = user?.preferences?.payment?.lastUsedMethod;
  const candidates = [preferredMethod, lastUsedMethod, ...PAYMENT_METHODS].filter(
    isPaymentMethod
  );

  return candidates.find((method) => canUsePaymentMethod(method, user, payableAmount)) || "upi";
}

export function resolveWalletFallbackMethod(
  user: User | null | undefined,
  payableAmount: number
): PaymentMethod {
  const lastUsedMethod = user?.preferences?.payment?.lastUsedMethod;
  const candidates = [lastUsedMethod, user?.preferences?.payment?.preferredMethod, "upi", "card"].filter(
    isPaymentMethod
  );

  return candidates.find((method) => method !== "wallet" && canUsePaymentMethod(method, user, payableAmount)) || "upi";
}

export async function persistPaymentPreferences({
  preferences,
  updateUser,
}: {
  preferences: {
    preferredMethod?: PaymentMethod;
    lastUsedMethod?: PaymentMethod;
    disabledMethods?: Partial<Record<PaymentMethod, boolean>>;
  };
  updateUser: (data: Partial<User>) => void;
}) {
  const res = await apiFetch("/profile/update-profile", {
    method: "PUT",
    body: JSON.stringify({
      preferences: {
        payment: preferences,
      },
    }),
  });

  if (res?.user?.preferences) {
    updateUser({ preferences: res.user.preferences });
  }

  return res;
}
