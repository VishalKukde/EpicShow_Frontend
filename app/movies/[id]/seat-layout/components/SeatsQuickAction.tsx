import { Seat } from '@/types/Seat';

type SeatsQuickActionProps = {
    selectedSeats: Seat[];
    totalPrice: number;
    goToReviewBooking: () => void
}

const SeatsQuickAction = ({ selectedSeats, totalPrice,goToReviewBooking }: SeatsQuickActionProps) => {
    return (
        <div>
            {selectedSeats.length > 0 && (
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-800 px-5 py-4 z-50">
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


                        {/* 🎟 Legend */}
                        {/* <div className="flex gap-6 justify-center mt-12 text-xs text-gray-600">
                <Legend color="bg-white border" label="Available" />
                <Legend color="bg-green-600" label="Selected" />
                <Legend color="bg-gray-300" label="Sold" />
            </div> */}
                    </div>
                </div>
            )}
        </div>
    )
}

export default SeatsQuickAction
