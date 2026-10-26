'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Slide-in panel (cart, mobile menu, mobile filters). `side="end"` = right in English, left in
 * Arabic; `side="bottom"` = a bottom sheet (slides up from the bottom edge).
 * Accessibility: dialog role, Escape closes, focus moves into the panel when it opens
 * and back to the opener when it closes, page behind doesn't scroll.
 */
export default function Drawer({
  open,
  onClose,
  side,
  title,
  label,
  closeLabel,
  children,
  footer,
  className,
}: {
  open: boolean;
  onClose: () => void;
  side: 'start' | 'end' | 'bottom';
  title: ReactNode;
  /** Accessible name when `title` isn't plain text (screen readers announce it). */
  label?: string;
  closeLabel: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKey);
      opener?.focus?.();
    };
  }, [open, onClose]);

  // Off-screen position: start side = left in LTR / right in RTL, and the reverse for end.
  const hidden =
    side === 'bottom'
      ? 'translate-y-full'
      : side === 'start'
        ? 'ltr:-translate-x-full rtl:translate-x-full'
        : 'ltr:translate-x-full rtl:-translate-x-full';
  const position =
    side === 'bottom'
      ? 'inset-x-0 bottom-0 max-h-[88vh] w-full rounded-t-2xl'
      : cn('inset-y-0 w-[min(420px,88vw)]', side === 'start' ? 'start-0' : 'end-0');

  return (
    <div className={cn('fixed inset-0 z-[60]', open ? 'visible' : 'invisible')} aria-hidden={!open}>
      <div
        className={cn('absolute inset-0 bg-brand-navy-dark/40 transition-opacity duration-300', open ? 'opacity-100' : 'opacity-0')}
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={label ?? (typeof title === 'string' ? title : undefined)}
        tabIndex={-1}
        className={cn(
          'absolute flex flex-col bg-white shadow-level-3 outline-none transition-transform duration-300 ease-out',
          position,
          open ? 'translate-x-0 translate-y-0' : hidden,
          className,
        )}
      >
        <div className="flex items-center justify-between gap-3 border-b border-brand-border px-5 py-4">
          <div className="min-w-0 font-heading text-lg font-bold text-brand-ink">{title}</div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-brand-muted transition-colors hover:bg-brand-tint hover:text-brand-navy"
            aria-label={closeLabel}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">{children}</div>
        {footer && <div className="border-t border-brand-border p-5">{footer}</div>}
      </div>
    </div>
  );
}
