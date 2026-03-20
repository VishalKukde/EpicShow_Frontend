import type { Movie } from "@/types/Movie";

export type SportMatch = {
  _id: string;
  league: string;
  matchNo: string;
  teamA: string;
  teamB: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. 07:30 PM
  venue: string;
  venueId: string;
  city: string;
  imageUrl: string;
  description: string;
  durationMinutes: number;
  rating: number;
  language: string;
  genres: string[];
  prices: {
    standard: number;
    premium: number;
    vip: number;
  };
};

export const toSportBookingItem = (match: SportMatch): Movie => ({
  _id: match._id,
  name: `${match.teamA} vs ${match.teamB}`,
  description: match.description,
  genre: match.genres,
  imageUrl: match.imageUrl,
  language: match.language,
  runtimeMinutes: match.durationMinutes,
  rating: match.rating,
  releaseDate: match.date,
});
