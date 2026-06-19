export interface Train {
  _id: string;
  trainNumber: string;
  trainName: string;
  description?: string;
  fromStation: string;
  toStation: string;
  imageUrl: string;
  trainType: string; // Express, Superfast, Local, AC, etc.
  totalSeats: number;
  availableSeats: number;
  confirmedSeats?: number;
  waitlistCount?: number;
  availabilityDate?: string | null;
  price: number;
  duration: string; // e.g., "24h 30m"
  departureTime: string;
  arrivalTime: string;
  rating: number;
  avg_rating?: number;
  total_reviews?: number;
  amenities: string[];
  operatingDays: string[]; // Mon, Tue, etc.
  createdAt?: string;
  updatedAt?: string;
}

export interface TrainBooking {
  _id?: string;
  trainId: string;
  userId: string;
  pnr: string;
  seats: string[];
  passengerDetails: PassengerDetail[];
  totalPrice: number;
  bookingDate: string;
  journeyDate: string;
  status: "confirmed" | "cancelled" | "pending";
  showType: "train";
  payment?: {
    transactionId: string;
    amount: number;
    method: string;
  };
}

export interface PassengerDetail {
  name: string;
  age: number;
  gender: "M" | "F" | "Other";
  seatNumber: string;
}

export interface SavedTrainPassenger {
  _id: string;
  name: string;
  age: number;
  gender: "M" | "F" | "Other";
}
