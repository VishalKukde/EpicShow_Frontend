import { apiFetch } from "@/lib/api";
import { BookingStats} from "@/types/Booking";
import { useEffect, useState } from "react";


export const useBookingStats = () => {
  const [stats, setStats] = useState<BookingStats>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        const res = await apiFetch("/bookings/stats");

        setStats(res.stats);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Unknown error");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
};