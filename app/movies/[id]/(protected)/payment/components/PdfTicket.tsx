import { jsPDF } from "jspdf";
import QRCode from "qrcode";

type PdfTicketBooking = {
  _id: string;
  cinemaId: string;
  date: string;
  slot: string;
  seatIds: string[];
  amount: number;
};

type PdfTicketPayment = {
  status: "success" | "failed";
  paymentId: string;
  method: string;
};

export const generateStyledTicket = async (
  booking: PdfTicketBooking,
  payment: PdfTicketPayment
) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  const isSuccess = payment.status === "success";

  /* ---------------- BIG STATUS HEADER ---------------- */

  doc.setFont("helvetica", "bold");
  doc.setFontSize(26);
  doc.setTextColor(isSuccess ? 0 : 200, isSuccess ? 150 : 0, 0);

  doc.text(
    isSuccess ? "BOOKING CONFIRMED" : "PAYMENT FAILED",
    pageWidth / 2,
    20,
    { align: "center" }
  );

  /* ---------------- DARK HEADER BAR ---------------- */

  doc.setFillColor(0, 0, 0);
  doc.rect(0, 30, pageWidth, 15, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.text("🎬 MOVIE TICKET", pageWidth / 2, 40, {
    align: "center",
  });

  /* ---------------- BOOKING DETAILS ---------------- */

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);

  let y = 55;

  const line = (label: string, value: string) => {
    doc.setFont("helvetica", "bold");
    doc.text(label, 20, y);
    doc.setFont("helvetica", "normal");
    doc.text(value, 70, y);
    y += 8;
  };

  line("Booking ID:", booking._id);
  line("Cinema:", booking.cinemaId);
  line("Date:", booking.date);
  line("Time:", booking.slot);
  line("Seats:", booking.seatIds.join(", "));
  line("Payment ID:", payment.paymentId);
  line("Method:", payment.method);
  line("Amount:", `₹${booking.amount}`);

  /* ---------------- PERFORATED DIVIDER ---------------- */

  y += 5;

for (let i = 15; i < pageWidth - 15; i += 6) {
  doc.circle(i, y, 0.5, "F");
}


  y += 15;

  /* ---------------- QR CODE ---------------- */

  const qrData = JSON.stringify({
    bookingId: booking._id,
    seats: booking.seatIds,
    cinema: booking.cinemaId,
  });

  const qrImage = await QRCode.toDataURL(qrData);

  doc.addImage(qrImage, "PNG", pageWidth / 2 - 25, y, 50, 50);

  y += 65;

  /* ---------------- FOOTER ---------------- */

  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);

  doc.line(15, y, pageWidth - 15, y);
  y += 6;

  doc.text(
    "This is a dummy ticket generated for demonstration purposes only.",
    pageWidth / 2,
    y,
    { align: "center" }
  );

  doc.save(`ticket-${booking._id}.pdf`);
};
