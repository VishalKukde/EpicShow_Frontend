import { motion } from "framer-motion";
import { useState } from "react";
import { useThemeStore } from "@/store/themeStore";

type Coupon = {
  code: string;
  off: number;
  best?: boolean;
};

type CouponModalProps = {
  onClose: () => void;
  onApply: (code: string, off: number) => void;
  onRemove: () => void;
  appliedCoupon: string | null;
};

const CouponModal = ({
  onClose,
  onApply,
  onRemove,
  appliedCoupon
}: CouponModalProps) => {
  const mode = useThemeStore((s) => s.mode);
  const dark = mode === "dark";
  const coupons: Coupon[] = [
    { code: "SAVE50", off: 50 },
    { code: "MOVIE100", off: 100, best: true },
    { code: "FEST20", off: 20 },
  ];

  const [inputCode, setInputCode] = useState("");
  const [invalid, setInvalid] = useState(false);

  const handleApply = (code: string, off: number) => {
    onApply(code, off);

    setTimeout(() => {
      onClose();
    }, 450);
  };

  const handleManualApply = () => {
    const found = coupons.find(
      c => c.code.toLowerCase() === inputCode.toLowerCase()
    );

    if (!found) {
      setInvalid(true);
      setTimeout(() => setInvalid(false), 400);
      return;
    }

    handleApply(found.code, found.off);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-50 flex items-end justify-center border sm:items-center select-none ${dark ? "bg-black/70 border-zinc-700" : "bg-black/40 border-gray-500 "}`}
    >
      <motion.div
        initial={{ y: 60 }}
        animate={{ y: 0 }}
        exit={{ y: 60 }}
        transition={{ duration: 0.25 }}
        className={`w-full overflow-hidden rounded-t-3xl shadow-xl border sm:max-w-md sm:rounded-3xl ${dark ? "bg-zinc-900 border-zinc-700" : "bg-white border-gray-500 "}`}
      >

        {/* Header */}
        <div className={`border-b px-6 py-4 text-lg font-semibold  ${dark ? "border-zinc-700 text-zinc-100" : "text-gray-900 border-gray-300 "}`}>
          Apply Coupon
        </div>

        {/* Input */}
        <motion.div
          animate={invalid ? { x: [-8, 8, -6, 6, 0] } : {}}
          className={`flex gap-2 border-b px-6 py-4 ${invalid
              ? dark ? "bg-zinc-900 border-red-500/40" : "bg-red-50"
              : dark ? "bg-zinc-900 border-zinc-700" : "bg-white border-gray-300"
            }`}
        >
          <input
            value={inputCode}
            onChange={e => setInputCode(e.target.value)}
            placeholder="Enter coupon code"
            className={`flex-1 rounded-xl px-4 py-2 border text-sm outline-none transition
              ${invalid
                ? "border-red-400"
                : dark
                  ? "border-zinc-600 bg-zinc-900 text-zinc-100 focus:border-zinc-400"
                  : "border-gray-300 focus:border-gray-900"}
            `}
          />

          <button
            onClick={handleManualApply}
            className={`px-4 py-2 rounded-xl text-sm transition cursor-pointer ${dark ? "bg-indigo-600 text-white hover:bg-indigo-500" : "bg-gray-900 text-white hover:opacity-90"}`}
          >
            Apply
          </button>
        </motion.div>

        {/* Coupon List */}
        <div className="px-6 py-5 space-y-3 max-h-[60vh] overflow-y-auto">

          {coupons.map(c => {

            const isApplied = appliedCoupon === c.code;


            return (
              <motion.div
                key={c.code}
                animate={
                  isApplied
                    ? { scale: 1.02 }
                    : { scale: 1 }
                }
                className={`flex items-center justify-between rounded-xl border px-4 py-3 ${
                  isApplied
                    ? dark
                      ? "border-emerald-500/60 bg-zinc-900"
                      : "border-emerald-300 bg-emerald-50"
                    : dark
                      ? "border-zinc-700 bg-zinc-900"
                      : "border-gray-200 bg-white"
                }`}
              >
                <div className="flex items-center justify-between w-full gap-3">

                  <div>
                    <div className="flex items-center gap-2">
                      <p className={`font-medium ${dark ? "text-zinc-100" : "text-gray-900"}`}>
                        {c.code}
                      </p>

                      {c.best && (
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${dark ? "bg-zinc-800 text-emerald-300" : "bg-green-100 text-green-700"}`}>
                          Best Offer
                        </span>
                      )}
                    </div>

                    <p className={`text-xs mt-0.5 ${dark ? "text-zinc-400" : "text-gray-500"}`}>
                      Save ₹{c.off}
                    </p>
                  </div>

                </div>

                {isApplied ? (
                  <button
                    onClick={() => {
                      onRemove();
                    }}
                    className={`text-sm font-medium underline cursor-pointer ${dark ? "text-zinc-300" : "text-gray-700"}`}
                  >
                    Remove
                  </button>
                ) : (
                  <button
                    onClick={() => handleApply(c.code, c.off)}
                    className={`px-4 py-1.5 rounded-full text-sm transition cursor-pointer ${dark ? "bg-indigo-600 text-white hover:bg-indigo-500" : "bg-gray-900 text-white hover:opacity-90"}`}
                  >
                    Apply
                  </button>
                )}

              </motion.div>
            );
          })}

        </div>

        {/* Footer */}
        <div className={`px-6 py-4 border-t ${dark ? "border-zinc-700 bg-zinc-900" : "border-gray-300"}`}>
          <button
            onClick={onClose}
            className={`w-full rounded-xl py-3 transition cursor-pointer ${dark ? "bg-zinc-800 text-zinc-100 hover:bg-zinc-700" : "bg-gray-100 hover:bg-gray-200"}`}
          >
            Close
          </button>
        </div>

      </motion.div>
    </motion.div>
  );
};

export default CouponModal;
