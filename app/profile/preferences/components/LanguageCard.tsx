import { Languages } from "lucide-react";
import { languageOptions, type Language } from "./PreferenceTypes";

type LanguageCardProps = {
  dark: boolean;
  language: Language;
  setLanguage: (language: Language) => void;
};

export function LanguageCard({ dark, language, setLanguage }: LanguageCardProps) {
  return (
    <article
      className={`rounded-3xl border p-5 shadow-sm ${
        dark ? "border-zinc-700 bg-zinc-900" : "border-gray-200 bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className={`text-base font-semibold ${dark ? "text-zinc-100" : "text-gray-900"}`}>Language</h2>
          <p className={`mt-1 text-sm ${dark ? "text-zinc-400" : "text-gray-600"}`}>
            English is currently supported.
          </p>
        </div>
        <Languages className={`h-5 w-5 ${dark ? "text-zinc-300" : "text-gray-500"}`} />
      </div>

      <div className="mt-4 space-y-2">
        {languageOptions.map((option) => {
          const selected = language === option.value;
          return (
            <button
              key={option.value}
              type="button"
              disabled={!option.enabled}
              onClick={() => option.enabled && setLanguage(option.value)}
              className={`flex w-full items-center justify-between rounded-xl border px-3 py-2.5 text-sm transition sm:px-4 ${
                selected
                  ? dark
                    ? "border-indigo-400 bg-zinc-800 text-zinc-100"
                    : "border-gray-900 bg-gray-900 text-white"
                  : dark
                    ? "border-zinc-700 bg-zinc-900 text-zinc-300"
                    : "border-gray-200 bg-white text-gray-700"
              } ${!option.enabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
            >
              <span className="font-medium capitalize">{option.label}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                  option.enabled
                    ? dark
                      ? "bg-zinc-800 text-emerald-300"
                      : "bg-emerald-50 text-emerald-700"
                    : dark
                      ? "bg-zinc-800 text-zinc-400"
                      : "bg-gray-100 text-gray-500"
                }`}
              >
                {option.enabled ? "Enabled" : "Disabled"}
              </span>
            </button>
          );
        })}
      </div>
    </article>
  );
}
