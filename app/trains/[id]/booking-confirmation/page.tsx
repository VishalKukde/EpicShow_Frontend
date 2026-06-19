"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import PageTransition from "@/app/components/PageTransition";
import { Check, Download, Share2, Home } from "lucide-react";
import { jsPDF } from "jspdf";

export default function BookingConfirmationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pnr = searchParams.get("pnr") || "PNR12345678";
  const trainName = searchParams.get("trainName") || "Rajdhani Express";
  const trainNumber = searchParams.get("trainNumber") || "12001";
  const fromStation = searchParams.get("from") || "Mumbai";
  const toStation = searchParams.get("to") || "Delhi";
  const journeyDate = searchParams.get("journeyDate") || "May 15, 2026";

  const ticketDetails = [
    ["PNR", pnr],
    ["Train", trainName],
    ["Train Number", `#${trainNumber}`],
    ["Route", `${fromStation} to ${toStation}`],
    ["Journey Date", journeyDate],
    ["Status", "Confirmed"],
  ];

  const handleDownload = () => {
    const doc = new jsPDF();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("EpicShow Train Ticket", 20, 24);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Please carry a valid government ID proof while travelling.", 20, 34);

    doc.setDrawColor(37, 99, 235);
    doc.line(20, 42, 190, 42);

    ticketDetails.forEach(([label, value], index) => {
      const y = 56 + index * 14;
      doc.setFont("helvetica", "bold");
      doc.text(`${label}:`, 20, y);
      doc.setFont("helvetica", "normal");
      doc.text(value, 62, y);
    });

    doc.setFont("helvetica", "bold");
    doc.text("Booking Status: CONFIRMED", 20, 152);
    doc.save(`EpicShow-Train-Ticket-${pnr}.pdf`);
  };

  const handleShare = async () => {
    const shareData = {
      title: "Train Booking Confirmation",
      text: `My train booking PNR: ${pnr}. ${trainName} #${trainNumber}, ${fromStation} to ${toStation}.`,
      url: window.location.href,
    };

    if (navigator.share) {
      await navigator.share(shareData);
      return;
    }

    await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
    alert("Ticket details copied to clipboard.");
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-green-50">
        {/* Animated background decorations */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 1 }}
          className="fixed inset-0 overflow-hidden pointer-events-none"
        >
          <div className="absolute top-20 right-20 w-72 h-72 bg-blue-400 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-cyan-400 rounded-full blur-3xl" />
        </motion.div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-5 py-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl w-full space-y-8"
          >
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="flex justify-center"
            >
              <div className="inline-flex items-center justify-center w-28 h-28 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full shadow-2xl">
                <Check size={56} className="text-white" />
              </div>
            </motion.div>

            {/* Main Content Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-2xl p-8 sm:p-12 space-y-8"
            >
              {/* Header */}
              <div className="text-center space-y-2">
                <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">
                  Booking Confirmed! 🎉
                </h1>
                <p className="text-lg text-gray-600">
                  Your train journey is all set
                </p>
              </div>

              {/* PNR Box */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="p-8 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl text-center space-y-3"
              >
                <p className="text-sm text-gray-600 uppercase tracking-wider font-semibold">
                  Your PNR Number
                </p>
                <p className="text-5xl font-bold text-blue-600 font-mono tracking-wider">
                  {pnr}
                </p>
                <p className="text-sm text-gray-600">
                  Save this number for check-in and future reference
                </p>
              </motion.div>

              {/* Details Grid */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="grid sm:grid-cols-2 gap-6"
              >
                <div className="p-6 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-600 uppercase font-semibold mb-2">
                    Train Name
                  </p>
                  <p className="text-xl font-bold text-gray-900">{trainName}</p>
                </div>
                <div className="p-6 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-600 uppercase font-semibold mb-2">
                    Train Number
                  </p>
                  <p className="text-xl font-bold text-gray-900">#{trainNumber}</p>
                </div>
                <div className="p-6 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-600 uppercase font-semibold mb-2">
                    Journey Date
                  </p>
                  <p className="text-xl font-bold text-gray-900">{journeyDate}</p>
                </div>
                <div className="p-6 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-600 uppercase font-semibold mb-2">
                    Booking Status
                  </p>
                  <p className="text-xl font-bold text-green-600 flex items-center gap-2">
                    <Check size={20} /> Confirmed
                  </p>
                </div>
              </motion.div>

              {/* Route Info */}
              <div className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600 uppercase mb-1">From</p>
                    <p className="text-2xl font-bold text-gray-900">{fromStation}</p>
                  </div>
                  <div className="text-3xl text-blue-600">→</div>
                  <div className="text-right">
                    <p className="text-xs text-gray-600 uppercase mb-1">To</p>
                    <p className="text-2xl font-bold text-gray-900">{toStation}</p>
                  </div>
                </div>
              </div>

              {/* Info Box */}
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-900">
                  📧 A confirmation email with all details has been sent to your registered email address. Please arrive at the station 30 minutes before departure.
                </p>
              </div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <motion.button
                  onClick={handleDownload}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Download size={20} />
                  Download Ticket
                </motion.button>
                <motion.button
                  onClick={handleShare}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                >
                  <Share2 size={20} />
                  Share
                </motion.button>
              </motion.div>

              {/* Home Button */}
              <motion.button
                onClick={() => router.push("/")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
              >
                <Home size={20} />
                Back to Home
              </motion.button>
            </motion.div>

            {/* Footer */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-center text-gray-600 text-sm"
            >
              Thank you for booking with EpicShow. Have a safe and comfortable journey! 🚂
            </motion.p>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
