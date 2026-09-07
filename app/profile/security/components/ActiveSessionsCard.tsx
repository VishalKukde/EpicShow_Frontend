import type { SessionItem } from "../data";

type ActiveSessionsCardProps = {
  sessions: SessionItem[];
  dark: boolean;
};

export default function ActiveSessionsCard({ sessions, dark }: ActiveSessionsCardProps) {
  return (
    <section
      className={`rounded-2xl border p-5 shadow-sm ${dark ? "border-zinc-800 bg-[#18181b]" : "border-gray-200 bg-white"
        } dark:bg-[#18181b] dark:border-zinc-800`}
    >
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className={`text-lg font-bold ${dark ? "text-white" : "text-gray-900"} dark:text-white`}>Active Sessions</h2>
          <p
            className={`mt-1 rounded-md border px-2 py-1 text-xs font-medium ${dark
                ? "border-amber-900/60 bg-amber-950/40 text-amber-200"
                : "border-amber-200 bg-amber-50 text-amber-800"
              }`}
          >
            This is currently unavailable and will be available soon.
          </p>
        </div>
        <button
          type="button"
          disabled
          className="cursor-pointer rounded-lg px-2 py-1 text-sm font-semibold text-rose-500 hover:bg-rose-500/10 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Log out all devices
        </button>
      </div>

      <div className="space-y-3">
        {sessions.map((session) => (
          <article
            key={session.device}
            className={`rounded-xl border p-4 ${dark ? "border-zinc-800 bg-zinc-900/60" : "border-gray-200 bg-gray-50/70"
              } dark:bg-zinc-900/60 dark:border-zinc-800`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <session.icon className={`mt-0.5 h-5 w-5 ${dark ? "text-zinc-400" : "text-gray-600"} dark:text-zinc-400`} />
                <div>
                  <p className={`font-semibold ${dark ? "text-white" : "text-gray-900"} dark:text-white`}>{session.device}</p>
                  <p className={`text-xs ${dark ? "text-zinc-400" : "text-gray-500"} dark:text-zinc-400`}>{session.location}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-xs ${dark ? "text-zinc-400" : "text-gray-500"} dark:text-zinc-400`}>{session.lastSeen}</p>
                <button
                  type="button"
                  disabled
                  className="mt-1 cursor-pointer rounded-md px-2 py-1 text-xs font-semibold text-rose-500 hover:bg-rose-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Revoke
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
