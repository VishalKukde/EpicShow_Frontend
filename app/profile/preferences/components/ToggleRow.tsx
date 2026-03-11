type ToggleRowProps = {
  dark: boolean;
  title: string;
  subtitle: string;
  checked: boolean;
  onToggle: () => void;
  icon: React.ReactNode;
};

export function ToggleRow({ dark, title, subtitle, checked, onToggle, icon }: ToggleRowProps) {
  return (
    <div
      className={`flex items-center justify-between gap-3 rounded-xl border px-3 py-2.5 sm:px-4 ${
        dark ? "border-zinc-700 bg-zinc-900" : "border-gray-200 bg-white"
      }`}
    >
      <div className="min-w-0">
        <p className={`inline-flex items-center gap-2 text-sm font-medium ${dark ? "text-zinc-100" : "text-gray-900"}`}>
          {icon}
          {title}
        </p>
        <p className={`mt-0.5 text-xs ${dark ? "text-zinc-400" : "text-gray-600"}`}>{subtitle}</p>
      </div>
      <button
        type="button"
        onClick={onToggle}
        role="switch"
        aria-checked={checked}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition ${
          checked ? "bg-indigo-600" : dark ? "bg-zinc-700" : "bg-gray-300"
        }`}
      >
        <span
          className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
            checked ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}
