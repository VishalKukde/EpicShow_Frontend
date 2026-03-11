export type SeatStatus = "available" | "selected" | "sold";

export type SeatRow = {
  row: string;
  seats: Seat[];
};

export type Seat = {
  id: string; // Row
  number: number;
  price: number;
  status: string;
};

