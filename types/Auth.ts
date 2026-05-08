export type PaymentMethod = "card" | "upi" | "wallet";
export type MovieSeatPreference = "front" | "middle" | "back";
export type SportSeatPreference = "field_side" | "center_view" | "covered_upper";
export type TrainSeatPreference = "window" | "lower_berth" | "aisle";
export type FlightSeatPreference = "window" | "aisle" | "extra_legroom";

export interface User {
  id: string;

  name: string;
  email: string;

  phone?: string;
  avatar?: string;

  role: "user" | "admin";
  membership: "free" | "pro";

  walletBalance: number;

  preferences: {
    darkMode: boolean;
    notifications: boolean;

    seat?: {
      movieSeat: MovieSeatPreference;
      sportSeat: SportSeatPreference;
      trainSeat: TrainSeatPreference;
      flightSeat: FlightSeatPreference;
    };

    payment: {
      preferredMethod: PaymentMethod;
      lastUsedMethod: PaymentMethod;

      disabledMethods: {
        card: boolean;
        upi: boolean;
        wallet: boolean;
      };
    };
  };

  rewardPoints: number;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}
