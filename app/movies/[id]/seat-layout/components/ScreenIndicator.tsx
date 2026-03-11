import React from 'react'

const ScreenIndicator = () => {
    return (
        <div className="max-w-4xl mx-auto mb-6 sm:mb-8 text-center relative pt-2">
            <div className="mx-auto w-3/4 sm:w-4/5 h-2 sm:h-3 overflow-hidden">
                <div className="w-full h-6 sm:h-8 bg-gradient-to-b from-gray-200 to-gray-400 rounded-[100%]"
                    style={{ transform: "translateY(-40%)" }}/>
            </div>
            <p className="text-[9px] sm:text-[10px] text-gray-400 mt-2 tracking-[0.3em] font-medium uppercase">
                Screen this way
            </p>
        </div>
    )
}

export default ScreenIndicator