type ComingSoonChipProps = {
  dark: boolean;
};

export function ComingSoonChip({ dark }: ComingSoonChipProps) {
  return (
    <span
      className={`shrink-0 rounded-full border px-2 py-1 text-[10px] font-semibold uppercase tracking-wide ${
        dark ? "border-zinc-700 bg-zinc-800 text-zinc-300" : "border-gray-200 bg-gray-100 text-gray-600"
      }`}
    >
      Coming Soon
    </span>
  );
}
