import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Section layout with the vertical rotated label on the left (DESIGN.md
 * "Vertical Section Indicators"): icon, uppercase label rotated 90°, short rail.
 * Desktop only (lg+); on smaller screens the content simply takes the full width.
 * In Arabic (RTL) the rail automatically moves to the right side.
 */
export default function SectionRail({
  label,
  icon: Icon,
  tone = 'light',
  children,
  className,
}: {
  label: string;
  icon: LucideIcon;
  tone?: 'light' | 'dark';
  children: ReactNode;
  className?: string;
}) {
  const dark = tone === 'dark';
  return (
    <div className={cn('flex flex-col gap-8 lg:flex-row', className)}>
      <div
        className={cn(
          'hidden shrink-0 flex-col items-center pt-3 lg:flex lg:border-e lg:pe-6',
          dark ? 'border-white/10' : 'border-brand-border',
        )}
        aria-hidden
      >
        <Icon className={cn('mb-6 h-6 w-6', dark ? 'text-[#FBD5D8]' : 'text-brand-secondary')} />
        {/* writing-mode turns the text vertical; rotate-180 makes it read bottom-to-top */}
        <span
          className={cn(
            'rotate-180 whitespace-nowrap font-heading text-[11px] font-bold uppercase tracking-[0.25em] [writing-mode:vertical-rl]',
            dark ? 'text-[#FBD5D8]' : 'text-brand-secondary',
          )}
        >
          {label}
        </span>
        <span className={cn('mt-6 h-24 w-0.5 rounded-full', dark ? 'bg-white/20' : 'bg-brand-secondary/30')} />
      </div>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

/** Small uppercase line above a section title. */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn('mb-1 block text-xs font-bold uppercase tracking-[0.14em] text-brand-secondary', className)}>{children}</span>
  );
}

/** Section title, DESIGN.md headline-lg (40px desktop / 28px mobile). */
export function SectionTitle({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h2 className={cn('font-heading text-[28px] font-bold leading-9 tracking-tight text-brand-ink sm:text-[40px] sm:leading-[48px]', className)}>
      {children}
    </h2>
  );
}
