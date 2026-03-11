export default function TicketModalSkeleton() {
  return (
    <div className="relative mx-auto flex h-auto w-full max-h-[94dvh] select-none flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl animate-pulse sm:rounded-3xl">
      {/* HEADER */}
      <div className="border-b border-gray-200 bg-white px-4 py-3 sm:px-5 sm:py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <div className="h-6 w-44 rounded-md bg-gray-200" />
            <div className="h-4 w-36 rounded-md bg-gray-200" />
          </div>
          <div className="h-8 w-8 rounded-full bg-gray-200" />
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex-1 overflow-y-auto bg-gray-50/70 p-2.5 sm:p-3 md:p-4">
        <div className="grid h-full grid-cols-1 gap-2.5 sm:gap-3 xl:grid-cols-3">
          {/* BOOKING DETAILS */}
          <div className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm sm:p-4">
            <div className="mb-3 h-3 w-28 rounded bg-gray-200" />
            <div className="grid grid-cols-1 gap-2.5">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="rounded-xl border border-gray-200 bg-gray-50/70 p-2.5 sm:p-3"
                >
                  <div className="mb-2 h-3 w-20 rounded bg-gray-200" />
                  <div className="h-4 w-11/12 rounded bg-gray-200" />
                </div>
              ))}
            </div>
          </div>

          {/* PAYMENT DETAILS */}
          <div className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm sm:p-4">
            <div className="mb-3 h-3 w-28 rounded bg-gray-200" />
            <div className="space-y-2.5">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="rounded-xl border border-gray-200 bg-gray-50/70 p-2.5 sm:p-3"
                >
                  <div className="h-3 w-20 rounded bg-gray-200" />
                  <div
                    className={`mt-2 rounded bg-gray-200 ${
                      i === 1 ? "h-6 w-1/2 sm:h-7" : "h-4 w-9/12"
                    }`}
                  />
                </div>
              ))}
            </div>

            <div className="mt-3 rounded-xl border border-gray-200 bg-gray-50 px-2.5 py-2 sm:px-3">
              <div className="h-3 w-full rounded bg-gray-200" />
            </div>
          </div>

          {/* REFUND DETAILS */}
          <div className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm sm:p-4">
            <div className="mb-3 h-3 w-28 rounded bg-gray-200" />
            <div className="space-y-2.5">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="rounded-xl border border-gray-200 bg-gray-50/70 p-2.5 sm:p-3"
                >
                  <div className="h-3 w-20 rounded bg-gray-200" />
                  <div className="mt-2 h-4 w-8/12 rounded bg-gray-200" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="border-t border-gray-200 bg-white p-2.5 sm:p-3 md:p-4">
        <div className="flex flex-wrap items-center justify-between gap-2.5 rounded-xl border border-gray-200 bg-gray-50/70 p-2.5 sm:gap-3 sm:rounded-2xl sm:p-3">
          <div className="h-9 w-28 rounded-lg bg-gray-200 sm:h-10 sm:w-32 sm:rounded-xl" />

          <div className="flex items-center gap-2">
            <div className="h-9 w-32 rounded-lg bg-gray-200 sm:h-10 sm:w-36 sm:rounded-xl" />
            <div className="h-9 w-9 rounded-lg bg-gray-200 sm:h-10 sm:w-10 sm:rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
