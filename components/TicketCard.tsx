import ReviewSeatTimer from '@/app/components/ReviewSeatTimer';
import { unlockAllSeatsForCurrentShow } from '@/hooks/useSeatActions';
import { useSeatLayout } from '@/hooks/useSeatLayout';
// import { useSeatSession } from '@/hooks/useSeatSession';
import { useBookingStore } from '@/store/bookingStore';
import { useThemeStore } from '@/store/themeStore';
import { useAuth } from '@/context/AuthContext';
import { Movie } from '@/types/Movie';
import type { Event } from '@/types/Event';
import { Seat } from '@/types/Seat';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

type ITicketCardProps = {
    item: Movie | Event | null;
    seats: Seat[];
    venue: string | null;
    date: string | null;
    slot: string | null;
    bookingState?: {
        type?: string | null;
        item?: { _id?: string } | null;
        venueId?: string | null;
        date?: string | null;
        slot?: string | null;
    };
    bookingStore?: BookingStoreApi;

}
type BookingStoreApi = {
    getState: () => {
        item?: { _id?: string } | null;
        venueId?: string | null;
        date?: string | null;
        slot?: string | null;
        seats?: { id: string }[];
        setExpireAt?: (time: string | null) => void;
        type?: string | null;
    };
    setState: (partial: Record<string, unknown>) => void;
};
const TicketCard = ({
    item,
    date: _date,
    seats,
    slot: _slot,
    venue,
    bookingState,
    bookingStore,
}: ITicketCardProps) => {
    const router = useRouter();
    const { user } = useAuth();
    const storeApi = (bookingStore || useBookingStore) as BookingStoreApi;
    const booking = bookingState || useBookingStore();
    const normalizedBooking = {
        type: booking.type ?? null,
        venueId: booking.venueId ?? null,
        item: booking.item && booking.item._id ? { _id: booking.item._id } : null,
        date: booking.date ?? null,
        slot: booking.slot ?? null,
    };
    const mode = useThemeStore((s) => s.mode);
    const { setSeats } = useSeatLayout(normalizedBooking);
    void _date;
    void _slot;

    const handleUnlockSeats = () => {
        unlockAllSeatsForCurrentShow(setSeats, user?.id, storeApi);
        const basePath = booking.type === "event" ? "/events" : "/movies";
        router.replace(`${basePath}/${item?._id}`);
    }

    return (
        <div>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-3xl shadow-lg border overflow-hidden relative ${mode === "dark" ? "bg-zinc-900 border-zinc-700/10" : "bg-white border border-gray-100"}`}
            >

                {/* Tear edge */}
                <div className="absolute -left-2 -right-2 top-[45%] flex justify-between pointer-events-none z-99">
                    <div className="w-4 h-4 bg-background rounded-full" />
                    <div className="w-4 h-4 bg-background rounded-full" />
                </div>

                {/* Header */}
                <div className={`flex items-center justify-between px-4 py-5 sm:px-6 border-b border-dashed ${mode === "dark" ? "border-zinc-700" : "border-gray-200"}`}>
                    {/* Left Section */}
                    <div className="flex flex-col">
                        <h2 className={`text-xl sm:text-2xl font-semibold ${mode === "dark" ? "text-zinc-100" : "text-gray-900"}`}>
                            {"name" in (item || {}) ? item?.name : (item as Event | null)?.title}
                        </h2>
                        <p className={`mt-1 ${mode === "dark" ? "text-zinc-400" : "text-gray-500"}`}>
                            {venue}
                        </p>
                    </div>

                    {/* Right Section */}
                    <div className="flex">
                        <ReviewSeatTimer />
                    </div>

                </div>

                {/* Details */}
                <div className="px-4 py-6 sm:px-6 space-y-4 text-sm">

                    {/* <Detail label="Date" value={formatDate(date!)} mode={mode} />
                    <Detail label="Time" value={slot} mode={mode} /> */}

                    <div className="flex justify-between items-start">
                        <span className={mode === "dark" ? "text-zinc-400" : "text-gray-500"}>Seats</span>
                        <div className="flex gap-2 flex-wrap justify-end">
                            {seats.map((s: Seat) => (
                                <span
                                    key={s.id}
                                    className={`px-3 py-1 rounded-full text-xs font-medium ${mode === "dark" ? "bg-zinc-800 text-zinc-200" : "bg-gray-100 text-gray-800"}`}
                                >
                                    {/*row number */}
                                    {s.id}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Change slot */}
                    <button
                        onClick={handleUnlockSeats}
                        className={`text-sm font-medium underline underline-offset-4 transition cursor-pointer ${mode === "dark" ? "text-zinc-100 hover:text-zinc-300" : "text-gray-900 hover:text-gray-700"}`}
                    >
                        Change date / time
                    </button>

                </div>
            </motion.div>
        </div>
    )
}
export default TicketCard
