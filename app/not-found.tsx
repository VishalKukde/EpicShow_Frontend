"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[100dvh] items-center justify-center px-6 py-16">
      <div className="mx-auto flex w-full max-w-xl flex-col items-center text-center">
        <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
          404
        </span>
        <h1 className="mt-4 text-3xl font-semibold text-slate-900 sm:text-4xl">
          Page not found
        </h1>
        <p className="mt-3 text-sm text-slate-600 sm:text-base">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center justify-center rounded-xl border border-slate-200 bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
