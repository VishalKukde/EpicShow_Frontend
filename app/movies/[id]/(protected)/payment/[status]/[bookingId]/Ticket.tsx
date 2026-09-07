import { Booking } from "@/types/Booking";
import { Payment } from "@/types/Payment";
import { serverFetch } from "@/lib/serverFetch";
import type { Movie } from "@/types/Movie";
import TicketClient from "./TicketClient";

interface Props {
    id: string;
    status: string;
    bookingId: string;
}

export default async function Ticket({ id, status, bookingId }: Props) {
    console.log("Fetching booking details for ID:", bookingId);
    const data = await serverFetch(`/booking/${bookingId}`, {
        authRedirectPath: `/movies/${id}/payment/${status}/${bookingId}`,
    }).catch(() => null);

    const booking = (data?.booking ?? null) as Booking | null;
    const payment = (data?.payment ?? null) as Payment | null;
    const movie = (await serverFetch(`/movies/${id}`, {
        skipAuthRedirect: true,
    }).catch(() => null)) as Movie | null;

    return (
        <TicketClient
            id={id}
            status={status}
            bookingId={bookingId}
            booking={booking}
            payment={payment}
            movie={movie}
        />
    );
}
