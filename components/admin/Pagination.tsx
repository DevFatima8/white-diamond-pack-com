import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Server-rendered pagination. Builds links that keep the current filters
 * (e.g. ?q=foil&category=x) and only change ?page=.
 */
export default function Pagination({
  basePath,
  params,
  page,
  pageCount,
  total,
  pageSize,
}: {
  basePath: string;
  params: Record<string, string | undefined>;
  page: number;
  pageCount: number;
  total: number;
  pageSize: number;
}) {
  if (total === 0) return null;

  const href = (p: number) => {
    const sp = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) if (v) sp.set(k, v);
    if (p > 1) sp.set('page', String(p));
    const qs = sp.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  // Show first, last, and two pages around the current one: 1 … 4 5 [6] 7 8 … 20
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === pageCount || Math.abs(p - page) <= 2,
  );

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);
  const linkClass = 'inline-flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-sm font-medium';

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-brand-border px-5 py-3 sm:flex-row">
      <p className="text-xs text-brand-muted">
        Showing <span className="font-semibold text-brand-ink">{from}–{to}</span> of{' '}
        <span className="font-semibold text-brand-ink">{total}</span>
      </p>
      {pageCount > 1 && (
        <nav className="flex items-center gap-1" aria-label="Pagination">
          {page > 1 ? (
            <Link href={href(page - 1)} className={cn(linkClass, 'text-brand-muted hover:bg-brand-tint')} aria-label="Previous page">
              <ChevronLeft className="h-4 w-4" />
            </Link>
          ) : (
            <span className={cn(linkClass, 'text-slate-300')} aria-hidden>
              <ChevronLeft className="h-4 w-4" />
            </span>
          )}
          {pages.map((p, i) => (
            <span key={p} className="flex items-center">
              {i > 0 && p - pages[i - 1] > 1 && <span className="px-1 text-brand-muted">…</span>}
              <Link
                href={href(p)}
                aria-current={p === page ? 'page' : undefined}
                className={cn(linkClass, p === page ? 'bg-brand-secondary text-white' : 'text-brand-ink hover:bg-brand-tint')}
              >
                {p}
              </Link>
            </span>
          ))}
          {page < pageCount ? (
            <Link href={href(page + 1)} className={cn(linkClass, 'text-brand-muted hover:bg-brand-tint')} aria-label="Next page">
              <ChevronRight className="h-4 w-4" />
            </Link>
          ) : (
            <span className={cn(linkClass, 'text-slate-300')} aria-hidden>
              <ChevronRight className="h-4 w-4" />
            </span>
          )}
        </nav>
      )}
    </div>
  );
}

/** Read ?page= safely: a positive whole number, at most `max`. */
export function parsePage(value: string | undefined, max = 10_000): number {
  const n = Number(value);
  return Number.isInteger(n) && n >= 1 ? Math.min(n, max) : 1;
}
