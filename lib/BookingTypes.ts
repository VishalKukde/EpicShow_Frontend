export const bookingTypeConfig = {
  movies: {
    title: "Movie Bookings",
    api: "/bookings/movies",
  },
  games: {
    title: "Game Bookings",
    api: "/bookings/games",
  },
  sports: {
    title: "Sports Bookings",
    api: "/bookings/sports",
  },
  events: {
    title: "Event Bookings",
    api: "/bookings/events",
  },
} as const;
