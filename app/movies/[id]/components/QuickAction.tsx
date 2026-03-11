import { Heart, Info, Play } from 'lucide-react'
import React from 'react'

const QuickAction = () => {
  return (
    <>
                            {/* ⚡ Quick Actions */}
                            <div
                                className="
 flex flex-wrap items-center gap-3
  "
                            >
                                <button
                                    className="
      flex items-center gap-2
      px-4 py-2
      rounded-xl
      bg-gray-900 text-white
      text-sm font-medium
      hover:bg-gray-800
      transition cursor-pointer
    "
                                >
                                    <Play size={16} />
                                    <span className="inline">Trailer</span>
                                </button>

                                <button
                                    className="flex items-center gap-2
      px-4 py-2
      rounded-xl
      bg-gray-100 text-gray-700
      text-sm font-medium
      hover:bg-gray-200
      transition cursor-pointer
    "
                                >
                                    <Heart size={16} />
                                    <span className="inline">Wishlist</span>
                                </button>

                                <button
                                    className="
      flex items-center gap-2
      px-4 py-2
      rounded-xl
      bg-gray-100 text-gray-700
      text-sm font-medium
      hover:bg-gray-200
      transition cursor-pointer
    "
                                >
                                    <Info size={16} />
                                    <span className="inline">Ask AI</span>
                                </button>
                            </div>
    </>

  )
}

export default QuickAction