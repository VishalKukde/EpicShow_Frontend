export type Language = "english" | "hindi" | "marathi";
export type MovieSeatZone = "front" | "middle" | "back";
export type SportSeatPreference = "field_side" | "center_view" | "covered_upper";
export type TrainSeatPreference = "window" | "lower_berth" | "aisle";
export type FlightSeatPreference = "window" | "aisle" | "extra_legroom";
export type SeatPreferences = {
  movie: MovieSeatZone;
  sport: SportSeatPreference;
  train: TrainSeatPreference;
  flight: FlightSeatPreference;
};
export type SeatPreferenceCategory = keyof SeatPreferences;
export type PaymentMethod = "upi" | "card" | "wallet";

export const languageOptions: Array<{ value: Language; label: string; enabled: boolean }> = [
  { value: "english", label: "English", enabled: true },
  { value: "hindi", label: "Hindi", enabled: false },
  { value: "marathi", label: "Marathi", enabled: false },
];
