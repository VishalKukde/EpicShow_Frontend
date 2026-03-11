import { Sparkles } from "lucide-react";
import { ComingSoonChip } from "./ComingSoonChip";
import { ToggleRow } from "./ToggleRow";

type AccessibilityCardProps = {
  dark: boolean;
  reduceMotion: boolean;
  onToggleReduceMotion: () => void;
};

export function AccessibilityCard({ dark, reduceMotion, onToggleReduceMotion }: AccessibilityCardProps) {
  return (
    <article
      className={`rounded-2xl border p-5 shadow-sm ${dark ? "border-zinc-700 bg-zinc-900" : "border-gray-200 bg-white"}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className={`text-base font-semibold ${dark ? "text-zinc-100" : "text-gray-900"}`}>
            Accessibility & Playback
          </h2>
          <p className={`mt-1 text-sm ${dark ? "text-zinc-400" : "text-gray-600"}`}>
            Tune motion and media behavior for better usability.
          </p>
        </div>
        <ComingSoonChip dark={dark} />
      </div>

      <div className="mt-4 space-y-2">
        <ToggleRow
          dark={dark}
          title="Reduce motion"
          subtitle="Minimize animation and transitions"
          checked={reduceMotion}
          onToggle={onToggleReduceMotion}
          icon={<Sparkles className="h-4 w-4" />}
        />
        <div
          className={`rounded-xl border px-3 py-2.5 text-sm sm:px-4 ${
            dark ? "border-zinc-700 bg-zinc-900" : "border-gray-200 bg-white"
          }`}
        >
          <p className={`font-medium ${dark ? "text-zinc-100" : "text-gray-900"}`}>Trailer autoplay</p>
          <p className={`mt-0.5 text-xs ${dark ? "text-zinc-400" : "text-gray-600"}`}>
            Autoplay is currently locked to app defaults.
          </p>
          <span
            className={`mt-2 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
              dark ? "bg-zinc-800 text-zinc-400" : "bg-gray-100 text-gray-500"
            }`}
          >
            Disabled
          </span>
        </div>
      </div>
    </article>
  );
}
