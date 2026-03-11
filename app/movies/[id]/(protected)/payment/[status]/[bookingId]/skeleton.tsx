
export const PaymentSkeleton = () => (
    <div className="h-screen bg-background flex items-center justify-center px-4 overflow-hidden">
        <div className="w-full max-w-4xl relative animate-pulse">

            <div className="bg-white rounded-2xl border border-gray-200 shadow-lg relative overflow-hidden">

                {/* Perforation circles */}
                <div className="absolute top-1/2 -left-4 transform -translate-y-1/2 w-8 h-8 bg-background rounded-full"></div>
                <div className="absolute top-1/2 -right-4 transform -translate-y-1/2 w-8 h-8 bg-background rounded-full"></div>

                {/* Top Section */}
                <div className="p-6 border-b border-dashed">
                    <div className="flex items-center gap-4">
                        {/* Icon placeholder */}
                        <div className="w-14 h-14 bg-gray-200 rounded-full"></div>

                        <div className="space-y-2 w-full">
                            <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="grid grid-cols-2 gap-6 p-6 text-sm">

                    {/* Left Column */}
                    <div className="space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>

                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex justify-between">
                                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                            </div>
                        ))}

                        <div className="h-4 bg-gray-200 rounded w-full mt-2"></div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>

                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="flex justify-between">
                                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>

            {/* Footer button placeholder */}
            <div className="mt-4 text-right">
                <div className="h-9 w-28 bg-gray-200 rounded-xl ml-auto"></div>
            </div>

        </div>
    </div>
);
