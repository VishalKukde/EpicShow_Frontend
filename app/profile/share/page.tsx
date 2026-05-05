"use client"
import { useState } from 'react'
import { useThemeStore } from '@/store/themeStore';
import ShareHero from './components/ShareHero';

const sharePage = () => {
const dark = useThemeStore((s) => s.mode === "dark");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [reviews, setReviews] = useState([]);
  return (
     <div className="space-y-6 px-3 py-3 pb-6 select-none sm:px-4 lg:px-0">
      <ShareHero />

      <section
        className={`rounded-3xl border p-5 shadow-sm ${
          dark ? "border-zinc-700 bg-zinc-900" : "border-gray-200 bg-white"
        }`}
      >
          <p className={`py-10 text-center text-sm ${dark ? "text-zinc-400" : "text-gray-500"}`}>
             This feature is coming soon. Check back shortly or explore other sections in the meantime.
          </p>
      </section>
    </div>
  )
}

export default sharePage