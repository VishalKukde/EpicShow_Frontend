"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";

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
    void _booking;
    void _payment;

    const downloadPDF = async () => {
        try {
            setLoading(true);

            // Simulate slight delay for UX polish
            await new Promise((resolve) => setTimeout(resolve, 600));
            // generateStyledTicket(booking, payment);
        } catch {
            //   toast.error("Failed to generate ticket");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={downloadPDF}
            disabled={true}
            className={`
      inline-flex items-center gap-2
    px-6 py-2.5
    rounded-xl
    border border-gray-300
    text-gray-900
    text-sm font-semibold
    hover:bg-gray-100
    transition-all duration-200 cursor-not-allowed
        ${loading
                    ? "opacity-70 cursor-not-allowed"
                    : "hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"}
      `}
        >
            {loading ? (
                <Loader2 size={16} className="animate-spin" />
            ) : (
                <Download size={16} strokeWidth={2} />
            )}

            {loading ? "Generating..." : "Download Ticket"}
        </button>
    );
}
