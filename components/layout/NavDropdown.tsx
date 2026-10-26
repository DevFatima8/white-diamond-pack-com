'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * A header menu item with a dropdown panel.
 * Opens on hover (with a short close delay so the pointer can travel to the panel),
 * on click/Enter, and closes on Escape, outside click, or when focus leaves it.
 */
export default function NavDropdown({
  id,
  label,
  children,
  panelClassName,
  align = 'start',
}: {
  /** Stable id for the panel (aria-controls). Fixed instead of useId(), so server and browser always agree. */
  id: string;
  label: string;
  children: (close: () => void) => ReactNode;
  panelClassName?: string;
  align?: 'start' | 'center';
}) {
  const [open, setOpen] = useState(false);
  const panelId = `nav-panel-${id}`;
  const rootRef = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = () => {
    if (timer.current) clearTimeout(timer.current);
    setOpen(true);
  };
  const hideSoon = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(false), 150);
  };
  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    const onDown = (e: MouseEvent) => !rootRef.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onDown);
    };
  }, [open]);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  return (
    <div
      ref={rootRef}
      className={cn(align === 'start' && 'relative')}
      onMouseEnter={show}
      onMouseLeave={hideSoon}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node) && setOpen(false)}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'flex items-center gap-1 whitespace-nowrap py-2 text-xs font-semibold uppercase tracking-wide transition-colors 2xl:text-[13px]',
          open ? 'text-brand-secondary' : 'text-brand-ink hover:text-brand-secondary',
        )}
      >
        {label}
        <ChevronDown className={cn('h-4 w-4 transition-transform', open && 'rotate-180')} aria-hidden />
      </button>
      <div
        id={panelId}
        hidden={!open}
        className={cn(
          'absolute top-full z-50 pt-3',
          align === 'start' ? 'start-0' : 'inset-x-0 mx-auto w-full max-w-5xl px-6',
          panelClassName,
        )}
      >
        <div className="rounded-2xl border border-brand-border bg-white p-4 text-brand-ink shadow-level-3">{children(close)}</div>
      </div>
    </div>
  );
}
