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
                    <div className="mb-3 flex justify-center sm:hidden">
                        <LegendPanel dark={dark} compact />
                    </div>
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
                            className={`px-6 py-3 rounded-xl ${
                                dark ? "bg-indigo-600 hover:bg-indigo-500" : "bg-gray-900 hover:bg-gray-800"
                            } text-white font-medium hover:bg-gray-800 transition cursor-pointer`}
                            onClick={goToReviewBooking}
                        >
                            Proceed
                        </button>
                    </div>
                </div>
            ) : (
                <div className="mt-4 flex items-center justify-center">
                    <LegendPanel dark={dark} />
                </div>
            )}
        </div>
    )
}

export default SeatsQuickAction

function LegendPanel({ dark, compact = true }: { dark: boolean; compact?: boolean }) {
    return (
        <div className={`inline-flex flex-wrap items-center justify-center rounded-2xl border text-xs font-medium ${
            compact ? "gap-3.5 px-4 py-2" : "gap-4 px-4 py-2"
        } ${
            dark ? "border-zinc-700 bg-zinc-900 text-zinc-200" : "border-gray-200 bg-white text-gray-700"
        }`}>
            <Legend
                color={dark ? "bg-zinc-850" : "bg-white"}
                border={dark ? "border border-gray-100" : "border border-gray-400"}
                label="Available"
            />
            <Legend color="bg-green-600" label="Selected" />
            <Legend
                color={dark ? "bg-yellow-600/60" : "bg-yellow-200"}
                border={dark ? "border border-yellow-500" : "border border-yellow-500"}
                label="Locked"
            />
            <Legend
                color={dark ? "bg-red-800" : "bg-gray-300"}
                border={dark ? "border border-red-400" : "border border-red-400"}
                label="Sold"
            />
            <Legend
                color={dark ? "bg-indigo-900" : "bg-indigo-100"}
                border={dark ? "border border-indigo-400/40 ring-1 ring-indigo-400" : "border border-indigo-200 ring-1 ring-indigo-500"}
                label="Recommended For You"
            />
        </div>
    );
}

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
        <span className="inline-flex items-center gap-1">
            <span className={`h-3 w-3 rounded-sm ${color} ${border ?? ""}`} />
            <span>{label}</span>
        </span>
    );
}
