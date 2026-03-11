import { KeyRound } from "lucide-react";

type PasswordCardProps = {
  onChangePassword: () => void;
};

export default function PasswordCard({ onChangePassword }: PasswordCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Password</h2>
          <p className="text-sm text-gray-500">Keep your account credentials updated</p>
        </div>
        <KeyRound className="h-5 w-5 text-indigo-600" />
      </div>
      <button
        type="button"
        onClick={onChangePassword}
        className="mt-4 cursor-pointer rounded-xl border border-gray-300 bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
      >
        Change Password
      </button>
    </div>
  );
}
