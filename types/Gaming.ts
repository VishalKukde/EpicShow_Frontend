export interface Gaming {
  _id: string;
  title: string;
  description: string;
  showType?: string;
  city: string;
  venue: string;
  venueId?: string | null;
  startDateTime: string;
  endDateTime?: string | null;
  price: number;
  totalSeats: number;
  availableSeats: number;
  organizer: string;
  imageUrl?: string;
  name?: string;
}
