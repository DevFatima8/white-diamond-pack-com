'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Loader2, Search } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { fill } from '@/lib/i18n/translations';
import { unitName } from '@/lib/i18n/units';
import { productHref, searchHref } from '@/lib/routes';
import { cn, formatPrice } from '@/lib/utils';

interface Suggestion {
  id: string;
  slug: string | null;
  name: string;
  nameAr: string | null;
  image: string;
  price: number | null;
  salePrice: number | null;
  unit: string;
}

/**
 * Product search with live suggestions (an accessible "combobox").
 * Typing waits 250 ms, then asks /api/products?q=… for up to 6 matches.
 * ↑/↓ move through suggestions, Enter opens one (or the full results), Esc closes.
 */
export default function SearchBox({
  id,
  variant = 'header',
  onNavigate,
}: {
  /** Stable id prefix for the suggestion list (fixed, not useId, so server and browser agree). */
  id: string;
  variant?: 'header' | 'drawer';
  onNavigate?: () => void;
}) {
  const router = useRouter();
  const { t, isRTL } = useLanguage();
  const listId = `${id}-list`;
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const q = query.trim();

  // Debounced fetch. AbortController cancels the previous request when typing continues.
  useEffect(() => {
    if (q.length < 2) return;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products?q=${encodeURIComponent(q)}&limit=6`, { signal: controller.signal });
        const json = res.ok ? await res.json() : { data: [] };
        setResults(json.data);
        setActive(-1);
      } catch {
        // aborted / offline
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 250);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [q]);

  // Close when clicking outside
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  const go = (href: string) => {
    setOpen(false);
    setQuery('');
    setResults([]);
    onNavigate?.();
    router.push(href);
  };

  const shown = q.length >= 2 ? results : [];
  const showPanel = open && q.length >= 2;

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
      setActive((i) => Math.min(i + 1, shown.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, -1));
    } else if (e.key === 'Escape') {
      setOpen(false);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (active >= 0 && shown[active]) go(productHref(shown[active]));
      else if (q) go(searchHref(q));
    }
  };

  const isHeader = variant === 'header';

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div
        className={cn(
          'flex items-center rounded-full transition-colors',
          isHeader
            ? 'bg-white/10 ps-3.5 pe-2 focus-within:bg-white/20'
            : 'border border-brand-border bg-white ps-4 pe-2 focus-within:border-brand-secondary',
        )}
      >
        <Search className={cn('h-4 w-4 shrink-0', isHeader ? 'text-[#C7D2FE]' : 'text-brand-muted')} aria-hidden />
        <input
          type="search"
          role="combobox"
          aria-label={t.nav.searchLabel}
          aria-expanded={showPanel}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder={t.nav.searchPlaceholder}
          className={cn(
            'w-full bg-transparent py-2 ps-2 text-sm focus:outline-none [&::-webkit-search-cancel-button]:hidden',
            isHeader ? 'text-white placeholder:text-[#C7D2FE]/80' : 'py-2.5 text-brand-ink placeholder:text-slate-400',
          )}
        />
        {loading && <Loader2 className={cn('h-4 w-4 shrink-0 animate-spin', isHeader ? 'text-white/70' : 'text-brand-muted')} aria-hidden />}
      </div>

      {showPanel && (
        <div
          className={cn(
            'absolute z-50 mt-2 overflow-hidden rounded-2xl border border-brand-border bg-white text-brand-ink shadow-level-3',
            isHeader ? 'end-0 w-[min(420px,90vw)]' : 'inset-x-0',
          )}
        >
          <ul id={listId} role="listbox" aria-label={t.nav.searchLabel} className="max-h-[360px] overflow-y-auto py-1">
            {shown.map((p, i) => {
              const name = isRTL && p.nameAr ? p.nameAr : p.name;
              const price = p.salePrice ?? p.price;
              return (
                <li
                  key={p.id}
                  id={`${listId}-${i}`}
                  role="option"
                  aria-selected={i === active}
                  onMouseEnter={() => setActive(i)}
                  onMouseDown={(e) => e.preventDefault()} // keep focus in the input
                  onClick={() => go(productHref(p))}
                  className={cn('flex cursor-pointer items-center gap-3 px-3 py-2', i === active && 'bg-brand-tint')}
                >
                  <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-brand-surface">
                    <Image src={p.image || '/images/product-placeholder.png'} alt="" fill sizes="40px" className="object-cover" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="line-clamp-1 text-sm font-semibold">{name}</span>
                    {price != null && (
                      <span className="text-xs font-semibold text-brand-primary">
                        {formatPrice(price)} <span className="font-normal text-brand-muted">/ {unitName(p.unit, isRTL ? 'ar' : 'en')}</span>
                      </span>
                    )}
                  </span>
                </li>
              );
            })}
            {!loading && shown.length === 0 && (
              <li className="px-4 py-3 text-sm text-brand-muted">{fill(t.nav.searchNoResults, { q })}</li>
            )}
          </ul>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => go(searchHref(q))}
            className="block w-full border-t border-brand-border px-4 py-2.5 text-start text-sm font-semibold text-brand-secondary hover:bg-brand-tint"
          >
            {fill(t.nav.searchViewAll, { q })}
          </button>
        </div>
      )}
    </div>
  );
}
