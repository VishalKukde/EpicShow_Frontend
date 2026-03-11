import { apiFetch } from "@/lib/api";
import { LatestBooking } from "@/types/Booking";
import { useEffect, useState } from "react";

export const useLatestBookings = () => {
  const [data, setData] = useState<LatestBooking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLatestBookings = async () => {
      try {
        setLoading(true);

        const res = await apiFetch(
          "/bookings/latest"
        );

        setData(res.bookings);
      } catch (err) {
        if (err instanceof Error) setError(err.message);
        else setError("Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchLatestBookings();
  }, []);

  return { data, loading, error };
};