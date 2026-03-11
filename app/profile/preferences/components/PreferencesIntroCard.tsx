type PreferencesIntroCardProps = {
  dark: boolean;
};

export function PreferencesIntroCard({ dark }: PreferencesIntroCardProps) {
  return (
    <section
      className={`rounded-2xl border p-5 shadow-sm sm:p-6 ${
        dark ? "border-zinc-700 bg-zinc-900" : "border-gray-200 bg-white"
      }`}
    >
      <p className={`text-xs font-semibold uppercase tracking-[0.2em] ${dark ? "text-zinc-400" : "text-gray-500"}`}>
        Preferences
      </p>
      <h1 className={`mt-2 text-2xl font-semibold ${dark ? "text-zinc-100" : "text-gray-900"}`}>
        Personalize your profile experience
      </h1>
      <p className={`mt-2 text-sm ${dark ? "text-zinc-400" : "text-gray-600"}`}>
        Manage appearance, language, notifications, and accessibility settings.
      </p>
    </section>
  );
}
