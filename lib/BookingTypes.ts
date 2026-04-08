export const bookingTypeConfig = {
  movies: {
    title: "Movie Bookings",
    api: "/bookings/movies",
  },
  games: {
    title: "Gaming Bookings",
    api: "/bookings/gaming",
  },
  gaming: {
    title: "Gaming Bookings",
    api: "/bookings/gaming",
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
