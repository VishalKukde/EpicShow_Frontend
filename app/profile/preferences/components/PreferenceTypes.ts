export type Language = "english" | "hindi" | "marathi";
export type SeatZone = "front" | "middle" | "back";
export type PaymentMethod = "upi" | "card" | "wallet";

export const languageOptions: Array<{ value: Language; label: string; enabled: boolean }> = [
  { value: "english", label: "English", enabled: true },
  { value: "hindi", label: "Hindi", enabled: false },
  { value: "marathi", label: "Marathi", enabled: false },
];
