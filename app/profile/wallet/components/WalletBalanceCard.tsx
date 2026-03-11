import { Plus, WalletCards } from "lucide-react";

type WalletBalanceCardProps = {
  walletBalance: number;
  onOpenModal: () => void;
};

export default function WalletBalanceCard({
  walletBalance,
  onOpenModal,
}: WalletBalanceCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-card p-5 shadow-sm">
      <p className="text-sm text-muted-foreground">Available Balance</p>
      <p className="mt-2 text-3xl font-semibold text-foreground sm:text-4xl">
        ₹{walletBalance.toFixed(2)}
      </p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <button
          onClick={onOpenModal}
          className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-gray-300 bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:border-gray-400 hover:opacity-90 sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          Add Money
        </button>
        <button className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-gray-300 bg-card px-4 py-2 text-sm font-medium text-foreground transition hover:border-gray-400 hover:bg-muted sm:w-auto">
          <WalletCards className="h-4 w-4" />
          Manage Sources
        </button>
      </div>
    </div>
  );
}
