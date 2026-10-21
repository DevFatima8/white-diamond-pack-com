'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

/**
 * Error boundary for every public page. If a page crashes while rendering, Next.js shows
 * this instead — the header, footer and the rest of the site keep working, and the visitor
 * can retry. (Texts are inline so this page can't itself fail on a missing translation.)
 */
export default function SiteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { isRTL } = useLanguage();

  useEffect(() => {
    console.error('[page error]', error); // shows up in the browser console / server logs
  }, [error]);

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-5 py-24 text-center" role="alert">
      <div className="mb-4 rounded-full bg-[#FFF1F2] p-4 text-brand-primary">
        <AlertTriangle className="h-8 w-8" aria-hidden />
      </div>
      <h1 className="font-heading text-2xl font-bold">{isRTL ? 'حدث خطأ ما' : 'Something went wrong'}</h1>
      <p className="mt-2 text-sm text-brand-muted">
        {isRTL ? 'تعذر عرض هذه الصفحة. حاول مرة أخرى، أو عُد إلى الصفحة الرئيسية.' : 'This page could not be shown. Please try again, or go back to the homepage.'}
      </p>
      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-full bg-brand-primary px-6 py-3 text-sm font-bold text-white hover:bg-brand-primary-hover"
        >
          <RotateCcw className="h-4 w-4" aria-hidden /> {isRTL ? 'حاول مرة أخرى' : 'Try again'}
        </button>
        <Link href="/" className="inline-flex items-center rounded-full border border-brand-border px-6 py-3 text-sm font-semibold text-brand-navy hover:bg-brand-tint">
          {isRTL ? 'الصفحة الرئيسية' : 'Homepage'}
        </Link>
      </div>
    </div>
  );
}
