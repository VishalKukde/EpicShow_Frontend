import { ChevronDown } from "lucide-react";

type SectionHeaderProps = {
  title: string;
  open: boolean;
  setOpen: (open: boolean) => void;
};

export default function SectionHeader({ title, open, setOpen }: SectionHeaderProps) {
  return (
    <button
      onClick={() => setOpen(!open)}
      className="w-full flex items-center justify-between px-6 py-4"
    >
      <h2 className="font-semibold text-gray-900">{title}</h2>
      <ChevronDown
        className={`w-4 h-4 transition ${open ? "rotate-180" : ""}`}
      />
    </button>
  );
}
