import { useThemeStore } from '@/store/themeStore';
import { Bell } from 'lucide-react';
import React from 'react'

const NotificationHero = () => {
      const mode = useThemeStore((s) => s.mode);
      const dark = mode === "dark";
  return (
    <section
        className={`rounded-3xl border p-6 text-white shadow-sm sm:p-8 ${
         dark
          ? "border-zinc-700 bg-zinc-900"
          : "border-gray-200 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900"
     }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em]">
              Notifications
            </p>
            <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">
              Previous notifications
            </h1>
            <p className={`mt-2 max-w-xl text-sm ${dark ? "text-zinc-400" : "text-gray-400"}`}>
              Refund credits and account updates appear here after they are saved.
            </p>
          </div>
          <div className="rounded-2xl bg-indigo-600 p-3 text-white">
            <Bell className="h-6 w-6" />
          </div>
        </div>
      </section>
  )
}

export default NotificationHero