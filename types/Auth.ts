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
