import { useThemeStore } from '@/store/themeStore';
import { Seat, SeatRow } from '@/types/Seat';
import { X } from "lucide-react";

type SeatsProps = {
  seats: SeatRow[];   // ✅ NOT Seat[][]
  scale: number;
  toggleSeat: (rowIndex: number, seatIndex: number) => void;
  setHoverSeat: (seat: Seat | null) => void;
  setMousePos: (pos: { x: number; y: number }) => void;
};

const Seats = ({ seats, scale, toggleSeat, setHoverSeat, setMousePos }: SeatsProps) => {
const mode = useThemeStore((s) => s.mode);
const dark  = mode === "dark";
  const hiddenSeatIndexes = [0, 1, 9, 10, 18, 19];
  function isSeatHidden(row: string, seatIndex: number) {
    return (row === "A" || row === "B" || row === "C" || row === "D") && hiddenSeatIndexes.includes(seatIndex);
  }
  return (
    <div
      className="relative mx-auto h-162.5 sm:h-137.25 overflow-x-auto overflow-y-auto border-b border-t border-gray-400 seat-scroll"
      style={{ WebkitOverflowScrolling: "touch" }}
    >
      <div
        className="max-w-152.5 sm:min-w-90 p-3 sm:space-y-2 space-y-3 origin-top-left transition-transform"
        style={{ transform: `scale(${scale})` }}
      >

        {seats.map((rowData, rowIndex) => (
          <div key={rowIndex} className="flex items-center gap-2">

            {/* Left row label */}
            <span className="flex flex-shrink-0 w-2 text-xs text-gray-500 font-mono">
              {rowData.row}
            </span>

            {/* Seats */}
            <div className="flex gap-1.5 sm:gap-2">

              {rowData.seats.map((seat, seatIndex) => {

                if (isSeatHidden(rowData.row, seatIndex)) {
                  return (
                    <div
                      key={seat.id}
                      className="w-5 sm:w-7 h-5 sm:h-7"
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
                    disabled={seat.status === "sold"}
                    className={`
                      w-5 sm:w-7 h-5 sm:h-7 rounded-sm sm:rounded-md
                      flex items-center justify-center text-[8px] font-medium transition
                      ${seat.status === "sold"
                        ? dark ? "bg-gray-900 border border-gray-400 text-red-500": "bg-gray-300 text-red-700 cursor-not-allowed border border-red-400"
                        : seat.status === "selected"
                          ? "bg-green-600 text-white ring-1 ring-green-500"
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
            <span className="flex flex-shrink-0 w-6 text-xs text-gray-500 font-mono">
              {rowData.row}
            </span>
          </div>
        ))}

      </div>
    </div>
  )
}

export default Seats
