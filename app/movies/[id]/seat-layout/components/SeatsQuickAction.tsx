import { useEffect, useRef } from "react";
import { useThemeStore } from "@/store/themeStore";
import { Seat } from '@/types/Seat';

type SeatsQuickActionProps = {
    selectedSeats: Seat[];
    totalPrice: number;
    goToReviewBooking: () => void
}

const SeatsQuickAction = ({ selectedSeats, totalPrice,goToReviewBooking }: SeatsQuickActionProps) => {
    const mode = useThemeStore((s) => s.mode);
    const dark = mode === "dark";
    const barRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const root = document.documentElement;
        if (selectedSeats.length === 0) {
            root.style.removeProperty("--app-toast-bottom");
            return;
        }

        const updateOffset = () => {
            const height = barRef.current?.getBoundingClientRect().height ?? 0;
            const offsetPx = Math.ceil(height + 12);
            root.style.setProperty(
                "--app-toast-bottom",
                `calc(env(safe-area-inset-bottom) + ${offsetPx}px)`
            );
        };

        updateOffset();
        window.addEventListener("resize", updateOffset);

        return () => {
            window.removeEventListener("resize", updateOffset);
            root.style.removeProperty("--app-toast-bottom");
        };
    }, [selectedSeats.length]);

    return (
        <div>
            {selectedSeats.length > 0 ? (
                <div ref={barRef} className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-800 px-5 py-4 z-50">
                    <div className="max-w-6xl mx-auto flex justify-between items-center">
                        <div className="text-md">
                            <p className="font-medium text-gray-900">
                                {selectedSeats.length} seat(s) selected
                            </p>
                            <p className="text-gray-600">
                                ₹ {totalPrice}
                            </p>
                        </div>

                        <button
                            className="px-6 py-3 rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-800 transition cursor-pointer" onClick={goToReviewBooking}>
                            Proceed
                        </button>
                    </div>
                </div>
            ) : (
                <div className="mt-6 flex items-center justify-center">
                    <div className={`inline-flex flex-wrap items-center gap-4 rounded-2xl border px-4 py-2 text-xs font-medium ${
                        dark ? "border-zinc-700 bg-zinc-900 text-zinc-200" : "border-gray-200 bg-white text-gray-700"
                    }`}>
                        <Legend
                            color={dark ? "bg-white/90" : "bg-white"}
                            border={dark ? "border border-zinc-500" : "border border-gray-400"}
                            label="Available"
                        />
                        <Legend color="bg-green-600" label="Selected" />
                        <Legend
                            color={dark ? "bg-yellow-900/60" : "bg-yellow-200"}
                            border={dark ? "border border-yellow-500" : "border border-yellow-500"}
                            label="Locked"
                        />
                        <Legend
                            color={dark ? "bg-gray-900" : "bg-gray-300"}
                            border={dark ? "border border-gray-400" : "border border-red-400"}
                            label="Sold"
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

export default SeatsQuickAction

function Legend({
    color,
    label,
    border,
}: {
    color: string;
    label: string;
    border?: string;
}) {
    return (
        <span className="inline-flex items-center gap-2">
            <span className={`h-3 w-3 rounded-sm ${color} ${border ?? ""}`} />
            <span>{label}</span>
        </span>
    );
}
