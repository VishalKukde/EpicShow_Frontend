"use client";

import { motion } from "framer-motion";
import { Film, Gamepad2, Trophy, Calendar } from "lucide-react";

const categories = [
  {
    title: "Movies",
    icon: Film,
    bg: "bg-indigo-50",
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-600",
  },
  {
    title: "Sports",
    icon: Trophy,
    bg: "bg-emerald-50",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
  },
  {
    title: "Events",
    icon: Calendar,
    bg: "bg-pink-50",
    iconBg: "bg-pink-100",
    iconColor: "text-pink-600",
  },
  {
    title: "Gaming",
    icon: Gamepad2,
    bg: "bg-yellow-50",
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-600",
  },
];

export default function BookingCategories() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {categories.map((c) => (
        <motion.div
          key={c.title}
          whileHover={{ y: -4, scale: 1.015 }}
          transition={{ type: "spring", stiffness: 280, damping: 20 }}
          className={`relative overflow-hidden rounded-xl border border-gray-200 p-3.5 cursor-pointer transition shadow-xs hover:shadow-sm ${c.bg}`}
        >
          {/* Soft overlay highlight */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />

          <div className="relative flex items-center gap-3">
            {/* Icon */}
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center ring-1 ring-black/5 ${c.iconBg}`}
            >
              <c.icon className={`w-4.5 h-4.5 ${c.iconColor}`} />
            </div>

            {/* Text */}
            <div>
              <p className="font-semibold text-sm text-gray-900 tracking-tight">
                {c.title}
              </p>
              <p className="text-[11px] text-gray-500">Browse bookings</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
