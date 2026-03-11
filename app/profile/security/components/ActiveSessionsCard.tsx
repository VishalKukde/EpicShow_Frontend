import type { SessionItem } from "../data";

type ActiveSessionsCardProps = {
  sessions: SessionItem[];
  dark: boolean;
};

export default function ActiveSessionsCard({ sessions, dark }: ActiveSessionsCardProps) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Active Sessions</h2>
          <p
            className={`mt-1 rounded-md border px-2 py-1 text-xs font-medium ${
              dark
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
          className="cursor-pointer rounded-lg px-2 py-1 text-sm font-medium text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Log out all devices
        </button>
      </div>

      <div className="space-y-3">
        {sessions.map((session) => (
          <article
            key={session.device}
            className="rounded-xl border border-gray-200 bg-gray-50/70 p-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <session.icon className="mt-0.5 h-5 w-5 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-900">{session.device}</p>
                  <p className="text-xs text-gray-500">{session.location}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">{session.lastSeen}</p>
                <button
                  type="button"
                  disabled
                  className="mt-1 cursor-pointer rounded-md px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
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
