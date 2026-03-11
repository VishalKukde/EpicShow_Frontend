"use client"
import { useState } from 'react'
import { useThemeStore } from '@/store/themeStore';

type IPaymentSummaryCardProps = {
    totalPrice: number;
    discount: number;
    total: number
}


const PaymentSummaryCard = ({ discount, total, totalPrice }: IPaymentSummaryCardProps) => {
    const [openSummary, setOpenSummary] = useState(false);
    const mode = useThemeStore((s) => s.mode);

    return (
        <div className={`rounded-2xl border shadow-md overflow-hidden text-sm ${mode === "dark" ? "bg-slate-900 border-slate-700" : "bg-white border-gray-100"}`}>

            {/* Hidden content (slides smoothly) */}
            <div
                className={`transition-all duration-500 ease-in-out overflow-hidden ${openSummary ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                    }`}
            >
                <div className={`px-6 pt-4 pb-3 space-y-3 border-b text-center ${mode === "dark" ? "border-slate-700" : "border-gray-100"}`}>
                    <Summary mode={mode} label="Ticket Price" value={`₹${totalPrice}`} />
                    <Summary mode={mode} label="Discount" value={`- ₹${discount}`} />
                </div>
            </div>

            {/* Always visible TOTAL row */}
            <button
                onClick={() => setOpenSummary(prev => !prev)}
                className={`w-full px-6 py-4 flex justify-between items-center font-semibold text-base transition ${mode === "dark" ? "text-slate-100 hover:bg-slate-800" : "text-gray-900 hover:bg-gray-50"}`}
            >
                <span>Total</span>
                <div className="flex items-center justify-center gap-2">
                    <span>₹{total}</span>
                </div>
            </button>
        </div>
    )
}

export default PaymentSummaryCard;

function Summary({
    label,
    value,
    mode,
}: {
    label: string;
    value: string;
    mode: "light" | "dark";
}) {
    return (
        <div className={`flex justify-between ${mode === "dark" ? "text-slate-300" : "text-gray-700"}`}>
            <span>{label}</span>
            <span>{value}</span>
        </div>
    );
}
