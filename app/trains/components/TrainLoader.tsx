type TrainLoaderProps = {
  label?: string;
  compact?: boolean;
  fullScreen?: boolean;
};

export default function TrainLoader({
  label = "Loading trains...",
  compact = false,
  fullScreen = true,
}: TrainLoaderProps) {
  const sizeClass = compact ? "h-24 w-48" : "h-28 w-56";
  const layoutClass = fullScreen
    ? "fixed inset-0 z-30 min-h-screen bg-inherit px-4"
    : compact
      ? "min-h-32 py-5"
      : "min-h-60 py-10";

  return (
    <div
      className={`flex w-full flex-col items-center justify-center text-center ${layoutClass}`}
      role="status"
      aria-live="polite"
    >
      <div className={`relative overflow-hidden ${sizeClass}`}>
        <svg
          viewBox="0 0 288 144"
          className="h-full w-full"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="trainBody" x1="60" x2="220" y1="58" y2="104">
              <stop stopColor="#2563eb" />
              <stop offset="1" stopColor="#0891b2" />
            </linearGradient>
          </defs>

          <g className="train-loader-smoke" opacity="0.7">
            <circle cx="92" cy="34" r="8" fill="#cbd5e1" />
            <circle cx="78" cy="25" r="6" fill="#e2e8f0" />
            <circle cx="62" cy="19" r="4" fill="#f1f5f9" />
          </g>

          <g className="train-loader-train">
            <rect x="54" y="58" width="150" height="48" rx="10" fill="url(#trainBody)" />
            <path d="M204 72h28c8 0 16 7 16 16v18h-44V72Z" fill="#0f172a" />
            <rect x="70" y="70" width="28" height="18" rx="4" fill="#dbeafe" />
            <rect x="110" y="70" width="28" height="18" rx="4" fill="#dbeafe" />
            <rect x="150" y="70" width="28" height="18" rx="4" fill="#dbeafe" />
            <rect x="214" y="80" width="20" height="14" rx="3" fill="#bae6fd" />
            <rect x="78" y="44" width="20" height="18" rx="4" fill="#0f172a" />
            <rect x="48" y="100" width="204" height="8" rx="4" fill="#1e293b" />
            <circle className="train-loader-wheel" cx="88" cy="112" r="13" fill="#0f172a" />
            <circle className="train-loader-wheel" cx="88" cy="112" r="5" fill="#94a3b8" />
            <circle className="train-loader-wheel" cx="156" cy="112" r="13" fill="#0f172a" />
            <circle className="train-loader-wheel" cx="156" cy="112" r="5" fill="#94a3b8" />
            <circle className="train-loader-wheel" cx="220" cy="112" r="13" fill="#0f172a" />
            <circle className="train-loader-wheel" cx="220" cy="112" r="5" fill="#94a3b8" />
          </g>

          <g className="train-loader-track" stroke="#64748b" strokeWidth="4" strokeLinecap="round">
            <path d="M16 128h256" />
            <path d="M28 136h34M86 136h34M144 136h34M202 136h34" />
          </g>
        </svg>
      </div>
      <p className="mt-3 text-sm font-semibold text-gray-700">{label}</p>

      <style jsx>{`
        .train-loader-train {
          animation: train-glide 1.4s ease-in-out infinite;
          transform-origin: center;
        }

        .train-loader-wheel {
          animation: wheel-spin 0.7s linear infinite;
          transform-box: fill-box;
          transform-origin: center;
        }

        .train-loader-smoke {
          animation: smoke-float 1.8s ease-out infinite;
          transform-origin: center;
        }

        .train-loader-track {
          animation: track-slide 0.75s linear infinite;
        }

        @keyframes train-glide {
          0%,
          100% {
            transform: translateX(-5px) translateY(0);
          }
          50% {
            transform: translateX(5px) translateY(-2px);
          }
        }

        @keyframes wheel-spin {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes smoke-float {
          0% {
            opacity: 0.85;
            transform: translate(0, 8px) scale(0.78);
          }
          60% {
            opacity: 0.55;
          }
          100% {
            opacity: 0;
            transform: translate(-22px, -18px) scale(1.2);
          }
        }

        @keyframes track-slide {
          to {
            transform: translateX(-58px);
          }
        }
      `}</style>
    </div>
  );
}
