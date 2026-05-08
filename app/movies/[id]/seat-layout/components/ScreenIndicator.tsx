import React from 'react'

const ScreenIndicator = () => {
    return (
        <div className="max-w-4xl mx-auto mb-6 sm:mb-8 text-center relative pt-2">
            <div className="mx-auto w-3/4 sm:w-4/5 h-2 sm:h-3 overflow-hidden">
                <div
                    className="relative h-6 w-full rounded-[100%] border-t border-white/80 bg-gradient-to-b from-zinc-50 via-zinc-200 to-zinc-500 shadow-[0_10px_26px_rgba(99,102,241,0.20)] dark:border-white/20 dark:from-zinc-600 dark:via-zinc-800 dark:to-zinc-950 dark:shadow-[0_10px_26px_rgba(129,140,248,0.18)] sm:h-8"
                    style={{ transform: "translateY(-40%)" }}
                >
                    <div className="absolute inset-x-[8%] top-1 h-px bg-gradient-to-r from-transparent via-white/90 to-transparent dark:via-indigo-200/50" />
                </div>
            </div>
            <p className="mt-2 text-[9px] font-semibold uppercase tracking-[0.3em] text-gray-400 dark:text-zinc-500 sm:text-[10px]">
                Screen this way
            </p>
        </div>
    )
}

export default ScreenIndicator
