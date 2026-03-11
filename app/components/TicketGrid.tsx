import { Movie } from "@/types/Movie";
import TicketCard from "./TicketCard";
import TicketSkeleton from "./TicketSkeleton";

interface TicketGridProps {
    items: Movie[];
    loading: boolean;
}

export default function TicketGrid({ items, loading }: TicketGridProps) {
    return (
        <section className="max-w-7xl mx-auto px-5 pb-24">
            <div className="grid gap-8 sm:gap-8 lg:gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">

                {loading
                    ? Array.from({ length: 5 }).map((_, i) => (
                        <TicketSkeleton key={i} />
                    ))
                    : items.map((item) => (
                        <TicketCard key={item._id} movie={item} />
                    ))}
            </div>
        </section>
    );
}
