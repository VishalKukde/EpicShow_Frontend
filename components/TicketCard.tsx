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
        const basePath =
            booking.type === "event"
                ? "/events"
                : booking.type === "gaming"
                    ? "/gaming"
                    : "/movies";
        router.replace(`${basePath}/${item?._id}`);
    }

    return (
        <div>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`relative overflow-hidden rounded-2xl border shadow-lg transition-all ${mode === "dark"
                    ? "border-zinc-800 bg-zinc-900/90 shadow-[0_15px_35px_rgba(0,0,0,0.35)] backdrop-blur-xl"
                    : "border-white/80 bg-white/90 shadow-[0_15px_35px_rgba(15,23,42,0.05)] backdrop-blur-xl"
                    }`}
            >
                {/* Tear edge cutouts */}
                <div className="absolute -left-2.5 -right-2.5 top-[50%] flex justify-between pointer-events-none z-20">
                    <div className={`w-5 h-5 rounded-full border ${mode === "dark" ? "bg-zinc-950 border-zinc-800" : "bg-slate-50 border-slate-200"}`} />
                    <div className={`w-5 h-5 rounded-full border ${mode === "dark" ? "bg-zinc-950 border-zinc-800" : "bg-slate-50 border-slate-200"}`} />
                </div>

                {/* Header */}
                <div className={`flex items-center justify-between p-4 sm:p-5 border-b border-dashed ${mode === "dark" ? "border-zinc-800" : "border-slate-200"}`}>
                    <div className="flex flex-col min-w-0 pr-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">Selected Show & Cinema</span>
                        <h2 className={`truncate text-lg sm:text-xl font-black tracking-tight mt-0.5 ${mode === "dark" ? "text-white" : "text-slate-900"}`}>
                            {"name" in (item || {}) ? item?.name : (item as Event | null)?.title}
                        </h2>
                        <p className={`mt-0.5 truncate text-xs font-medium ${mode === "dark" ? "text-zinc-400" : "text-slate-500"}`}>
                            {venue || "Cinema Location"}
                        </p>
                    </div>

                    <div className="flex shrink-0">
                        <ReviewSeatTimer />
                    </div>
                </div>

                {/* Details Body */}
                <div className="p-4 sm:p-5 space-y-3.5 text-xs">
                    <div className="flex justify-between items-center">
                        <span className={`font-semibold uppercase tracking-wider text-[11px] ${mode === "dark" ? "text-zinc-400" : "text-slate-500"}`}>Seats Selected</span>
                        <div className="flex gap-1.5 flex-wrap justify-end">
                            {seats.map((s: Seat, idx: number) => (
                                <span
                                    key={`${s.id}-${s.number || idx}`}
                                    className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-xs font-bold text-amber-500"
                                >
                                    {s.id}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                        <button
                            onClick={handleUnlockSeats}
                            className={`text-xs font-bold underline underline-offset-4 transition cursor-pointer ${mode === "dark" ? "text-indigo-400 hover:text-indigo-300" : "text-indigo-600 hover:text-indigo-700"
                                }`}
                        >
                            Change date / time
                        </button>
                        <span className={`text-[11px] ${mode === "dark" ? "text-zinc-500" : "text-slate-400"}`}>
                            {seats.length} Seat{seats.length > 1 ? "s" : ""} Reserved
                        </span>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
export default TicketCard;
