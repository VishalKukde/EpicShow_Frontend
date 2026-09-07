"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";

interface Props {
    booking: {
        _id: string;
    };
    payment: {
        paymentId?: string;
    };
}

export default function DownloadTicketButton({
    booking: _booking,
    payment: _payment,
}: Props) {
    const [loading, setLoading] = useState(false);
    const mode = useThemeStore((s) => s.mode);
    void _booking;
    void _payment;

    const downloadPDF = async () => {
        try {
            setLoading(true);
            await new Promise((resolve) => setTimeout(resolve, 600));
        } catch {
            // toast error
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={downloadPDF}
            disabled={true}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold transition-all duration-200 cursor-not-allowed ${mode === "dark"
                    ? "border-zinc-700 bg-zinc-800/60 text-zinc-400"
                    : "border-slate-300 bg-slate-100 text-slate-500"
                } ${loading ? "opacity-70" : "hover:shadow-xs"
                }`}
        >
            {loading ? (
                <Loader2 size={14} className="animate-spin" />
            ) : (
                <Download size={14} strokeWidth={2} />
            )}

            {loading ? "Generating..." : "Download Ticket"}
        </button>
    );
}
