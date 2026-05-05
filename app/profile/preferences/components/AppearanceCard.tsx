import { Moon, Sun } from "lucide-react";
import type { ThemeMode } from "@/store/themeStore";

type AppearanceCardProps = {
  dark: boolean;
  setTheme: (mode: ThemeMode) => void;
  toggleTheme: () => void;
};

export function AppearanceCard({ dark, setTheme, toggleTheme }: AppearanceCardProps) {
  return (
    <article
      className={`rounded-3xl border p-5 shadow-sm ${
        dark ? "border-zinc-700 bg-zinc-900" : "border-gray-200 bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className={`text-base font-semibold ${dark ? "text-zinc-100" : "text-gray-900"}`}>Appearance</h2>
          <p className={`mt-1 text-sm ${dark ? "text-zinc-400" : "text-gray-600"}`}>
            Choose light or dark theme for your profile.
          </p>
        </div>
        <span
          className={`rounded-full px-2 py-1 text-[10px] font-semibold ${
            dark ? "bg-zinc-800 text-zinc-200" : "bg-gray-100 text-gray-700"
          }`}
        >
          Active: {dark ? "Dark" : "Light"}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setTheme("light")}
          className={`inline-flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition cursor-pointer ${
            !dark
              ? "border-gray-900 bg-gray-900 text-white"
              : "border-zinc-700 bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
          }`}
        >
          <Sun className="h-4 w-4" />
          Light
        </button>
        <button
          type="button"
          onClick={() => setTheme("dark")}
          className={`inline-flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition cursor-pointer ${
            dark ? "border-indigo-400 bg-zinc-950 text-zinc-50" : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          <Moon className="h-4 w-4" />
          Dark
        </button>
      </div>

      <div
        className={`mt-4 flex items-center justify-between rounded-xl border px-3 py-2.5 sm:px-4 ${
          dark ? "border-zinc-700 bg-zinc-900" : "border-gray-200 bg-gray-50"
        }`}
      >
        <div>
          <p className={`text-sm font-medium ${dark ? "text-zinc-100" : "text-gray-900"}`}>Toggle theme</p>
          <p className={`text-xs ${dark ? "text-zinc-400" : "text-gray-600"}`}>
            Quick switch between light and dark mode
          </p>
        </div>
        <button
          type="button"
          onClick={toggleTheme}
          role="switch"
          aria-checked={dark}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition focus-visible:outline-none focus-visible:ring-2 cursor-pointer ${
            dark ? "bg-indigo-500 focus-visible:ring-indigo-300" : "bg-zinc-400 focus-visible:ring-gray-400"
          }`}
        >
          <span
            className={`inline-block h-5 w-5 rounded-full shadow-sm transition-transform ${
              dark ? "bg-zinc-950" : "bg-white"
            } ${dark ? "translate-x-5" : "translate-x-0.5"}`}
          />
        </button>
      </div>
    </article>
  );
}
