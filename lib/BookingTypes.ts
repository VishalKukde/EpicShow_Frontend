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
  concerts: {
    title: "Concert Bookings",
    api: "/bookings/concerts",
  },
  sports: {
    title: "Sports Bookings",
    api: "/bookings/sports",
  },
  events: {
    title: "Event Bookings",
    api: "/bookings/events",
  },
  trains: {
    title: "Train Bookings",
    api: "/trains/bookings/profile",
  },
} as const;
