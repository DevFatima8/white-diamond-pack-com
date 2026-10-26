'use client';

import { useEffect } from 'react';
// This page replaces the root layout, so it must load the site styles itself
// (otherwise links fall back to the browser's default blue).
import './globals.css';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[global error]', error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center bg-white px-5 text-center font-sans text-brand-ink">
        <div className="max-w-md rounded-3xl border border-gray-100 p-8 shadow-xl">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 font-bold text-2xl">
            !
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Application Error</h1>
          <p className="mt-2 text-sm text-gray-600">
            A critical error occurred while loading this page. Please try reloading.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              type="button"
              onClick={reset}
              className="rounded-full bg-rose-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-rose-700"
            >
              Try again
            </button>
            {/* Plain <a> on purpose: after a root crash, a full page reload is the safest recovery. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/"
              className="rounded-full border border-gray-300 px-6 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
