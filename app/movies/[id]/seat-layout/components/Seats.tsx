import { useThemeStore } from '@/store/themeStore';
import { Seat, SeatRow } from '@/types/Seat';
import type { MovieSeatPreference } from '@/types/Auth';
import { X } from "lucide-react";

type SeatsProps = {
  seats: SeatRow[];   // ✅ NOT Seat[][]
  scale: number;
  recommendedSeatZone?: MovieSeatPreference;
  toggleSeat: (rowIndex: number, seatIndex: number) => void;
  setHoverSeat: (seat: Seat | null) => void;
  setMousePos: (pos: { x: number; y: number }) => void;
};

const rowZoneMap: Record<MovieSeatPreference, string[]> = {
  front: ["A", "B", "C", "D"],
  middle: ["E", "F", "G"],
  back: ["H", "I", "J"],
};

const Seats = ({
  seats,
  recommendedSeatZone = "middle",
  toggleSeat,
  setHoverSeat,
  setMousePos,
}: SeatsProps) => {
const mode = useThemeStore((s) => s.mode);
const dark  = mode === "dark";
  const hiddenSeatIndexes = [0, 1, 9, 10, 18, 19];
  function isSeatHidden(row: string, seatIndex: number) {
    return (row === "A" || row === "B" || row === "C" || row === "D") && hiddenSeatIndexes.includes(seatIndex);
  }
  function isRecommendedRow(row: string) {
    return rowZoneMap[recommendedSeatZone].includes(row);
  }
  const getRowPrice = (row: SeatRow) =>
    row.seats.find((seat, seatIndex) => !isSeatHidden(row.row, seatIndex))?.price ??
    row.seats[0]?.price;
  return (
    <div className="relative w-full">
      <div
        className={`pointer-events-none absolute bottom-0 left-0 top-0 z-20 w-14 -r sm:hidden ${
          dark ? "border border-zinc-800 bg-zinc-950" : "shadow-sm border border-gray-300"
        }`}
      />
      <div
        className="relative w-full overflow-x-auto overflow-y-auto border-b border-t border-gray-400 seat-scroll"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
      <div
        className="mx-auto flex w-max min-w-full flex-col items-start space-y-3 p-2 sm:items-center sm:space-y-2.5"
      >

        {seats.map((rowData, rowIndex) => {
          const currentPrice = getRowPrice(rowData);
          const prevPrice = rowIndex > 0 ? getRowPrice(seats[rowIndex - 1]) : null;
          const hasPriceGap = rowIndex > 0 && currentPrice !== prevPrice;
          const recommendedRow = isRecommendedRow(rowData.row);
          return (
            <div
              key={rowIndex}
              className={`relative grid min-w-full grid-cols-[3.75rem_max-content] items-center gap-4 rounded-lg py-0.5 pr-1.5 sm:w-max sm:min-w-0 sm:grid-cols-[2rem_max-content_2rem] sm:gap-8 sm:px-1.5 ${
                hasPriceGap ? "mt-3 sm:mt-6" : ""
              }`}
            >
            {/* Left row label */}
            <span className={`sticky left-1 z-30 flex h-9 w-10 items-center justify-center rounded-xl border text-xs font-mono shadow-lg sm:left-0 sm:h-8 sm:w-8 sm:rounded-md ${
              recommendedRow
                ? dark
                  ? "border-indigo-400/40 bg-indigo-950 text-indigo-100 ring-1 ring-indigo-400"
                  : "border-indigo-200 bg-indigo-100 text-indigo-700 ring-1 ring-indigo-300"
                : dark
                  ? "border-zinc-800 bg-zinc-950 text-gray-200 ring-1 ring-zinc-700"
                  : "border-gray-300 bg-white text-gray-600 ring-1 ring-gray-300"
            }`}>
              {rowData.row}
            </span>

            {/* Seats */}
            <div className="flex gap-2 sm:gap-2.5">

              {rowData.seats.map((seat, seatIndex) => {

                if (isSeatHidden(rowData.row, seatIndex)) {
                  return (
                    <div
                      key={seat.id}
                      className="h-6 w-6 sm:h-8 sm:w-8"
                    />
                  );
                }

                return (
                  <button
                    key={seat.id}
                    onClick={() => toggleSeat(rowIndex, seatIndex)}
                    onMouseEnter={() => setHoverSeat(seat)}
                    onMouseLeave={() => setHoverSeat(null)}
                    onMouseMove={(e) =>
                      setMousePos({
                        x: e.clientX + 12,
                        y: e.clientY + 12
                      })
                    }
                    disabled={seat.status === "sold" || seat.status === "locked"}
                    className={`
                      h-6 w-6 sm:h-8 sm:w-8 rounded-sm sm:rounded-md
                      flex items-center justify-center text-[10px] font-medium transition
                      ${seat.status === "sold"
                        ? dark ? "bg-gray-900 border border-gray-400 text-red-500 cursor-not-allowed": "bg-gray-300 text-red-700 cursor-not-allowed border border-red-400"
                        : seat.status === "locked"
                          ? dark ? "bg-yellow-900/50 border border-yellow-500 text-yellow-300 cursor-not-allowed" : "bg-yellow-200 border border-yellow-500 text-yellow-800 cursor-not-allowed"
                          : seat.status === "selected"
                            ? "bg-green-600 text-white ring-1 ring-green-500 cursor-pointer"
                            : recommendedRow
                              ? dark
                                ? "bg-indigo-950 border border-indigo-300 text-indigo-100 ring-1 ring-indigo-400 hover:bg-indigo-900 cursor-pointer"
                                : "bg-white border border-indigo-500 text-indigo-700 ring-1 ring-indigo-200 hover:bg-indigo-100 cursor-pointer"
                              : "bg-white border border-gray-500 hover:bg-gray-200 text-gray-800 cursor-pointer"
                      }
                      ${seatIndex === 4 || seatIndex === 14 ? "mr-6" : ""}
                    `}
                  >
                    {seat.status === "sold" ? <X className="h-3.5 w-3.5 stroke-[3]" /> : seat.number}
                  </button>
                );
              })}
            </div>

            {/* Right row label */}
            {/* <span className={`sticky right-0 z-20 hidden sm:flex h-8 w-8 items-center justify-center rounded-md text-xs font-mono shadow-sm ${
              recommendedRow
                ? dark
                  ? "bg-indigo-950 text-indigo-100 ring-1 ring-indigo-400"
                  : "bg-indigo-100 text-indigo-700 ring-1 ring-indigo-300"
                : dark
                  ? "bg-zinc-950 text-gray-400 ring-1 ring-zinc-700"
                  : "bg-white text-gray-500 ring-1 ring-gray-200"
            }`}>
              {rowData.row}
            </span> */}
          </div>
          );
        })}

      </div>
      </div>
    </div>
  )
}

export default Seats
