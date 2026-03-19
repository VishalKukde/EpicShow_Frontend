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

export const sportMatches: SportMatch[] = [
  {
    _id: "ipl-001",
    league: "IPL 2026",
    matchNo: "Match 1",
    teamA: "Chennai Super Kings",
    teamB: "Mumbai Indians",
    date: "2026-04-05",
    time: "07:30 PM",
    venue: "MA Chidambaram Stadium",
    venueId: "stadium_maa",
    city: "Chennai",
    imageUrl: "/dummy.webp",
    description:
      "Season opener under lights with two heavyweight lineups and a buzzing Chennai crowd.",
    durationMinutes: 210,
    rating: 4.6,
    language: "Hindi",
    genres: ["Cricket", "IPL", "Night Match"],
    prices: {
      standard: 320,
      premium: 420,
      vip: 520,
    },
  },
  {
    _id: "ipl-002",
    league: "IPL 2026",
    matchNo: "Match 2",
    teamA: "Royal Challengers Bengaluru",
    teamB: "Kolkata Knight Riders",
    date: "2026-04-06",
    time: "07:30 PM",
    venue: "M. Chinnaswamy Stadium",
    venueId: "stadium_blr",
    city: "Bengaluru",
    imageUrl: "/dummy.webp",
    description:
      "High-octane clash with power hitters on a fast outfield. Expect plenty of boundaries.",
    durationMinutes: 205,
    rating: 4.4,
    language: "Hindi",
    genres: ["Cricket", "IPL", "Prime Time"],
    prices: {
      standard: 320,
      premium: 420,
      vip: 520,
    },
  },
  {
    _id: "ipl-003",
    league: "IPL 2026",
    matchNo: "Match 3",
    teamA: "Delhi Capitals",
    teamB: "Rajasthan Royals",
    date: "2026-04-07",
    time: "03:30 PM",
    venue: "Arun Jaitley Stadium",
    venueId: "stadium_del",
    city: "Delhi",
    imageUrl: "/dummy.webp",
    description:
      "Afternoon fixture with strategic bowling matchups and a packed lower bowl.",
    durationMinutes: 200,
    rating: 4.2,
    language: "Hindi",
    genres: ["Cricket", "IPL", "Day Game"],
    prices: {
      standard: 320,
      premium: 420,
      vip: 520,
    },
  },
  {
    _id: "ipl-004",
    league: "IPL 2026",
    matchNo: "Match 4",
    teamA: "Sunrisers Hyderabad",
    teamB: "Gujarat Titans",
    date: "2026-04-08",
    time: "07:30 PM",
    venue: "Rajiv Gandhi Intl. Stadium",
    venueId: "stadium_hyd",
    city: "Hyderabad",
    imageUrl: "/dummy.webp",
    description:
      "A tactical battle between elite pace attacks with a strong home advantage in Hyderabad.",
    durationMinutes: 205,
    rating: 4.3,
    language: "Hindi",
    genres: ["Cricket", "IPL", "Night Match"],
    prices: {
      standard: 320,
      premium: 420,
      vip: 520,
    },
  },
];

export const getSportMatchById = (id: string) =>
  sportMatches.find((match) => match._id === id);

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
