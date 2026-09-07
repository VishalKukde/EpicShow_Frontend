import { KeyRound } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";

type PasswordCardProps = {
  onChangePassword: () => void;
};

export default function PasswordCard({ onChangePassword }: PasswordCardProps) {
  const mode = useThemeStore((state) => state.mode);
  const dark = mode === "dark";

  return (
    <div
      className={`rounded-2xl border p-5 shadow-sm ${dark ? "border-zinc-800 bg-[#18181b]" : "border-gray-200 bg-white"
        } dark:bg-[#18181b] dark:border-zinc-800`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className={`text-lg font-bold ${dark ? "text-white" : "text-gray-900"} dark:text-white`}>Password</h2>
          <p className={`text-sm ${dark ? "text-zinc-400" : "text-gray-500"} dark:text-zinc-400`}>Keep your account credentials updated</p>
        </div>
        <KeyRound className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
      </div>
      <button
        type="button"
        onClick={onChangePassword}
        className={`mt-4 cursor-pointer rounded-xl border px-4 py-2 text-sm font-semibold transition ${dark
            ? "border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700"
            : "border-gray-300 bg-gray-900 text-white hover:bg-gray-800"
          }`}
      >
        Change Password
      </button>
    </div>
  );
}
