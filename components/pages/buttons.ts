import { cn } from '@/lib/utils';

/** Pill buttons used on the content pages. */
export const pillClass = (variant: 'primary' | 'secondary' | 'ghost-dark' | 'outline' = 'primary', className?: string) =>
  cn(
    'inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-brand-secondary/40',
    variant === 'primary' && 'bg-brand-primary text-white hover:bg-brand-primary-hover',
    variant === 'secondary' && 'bg-brand-secondary text-white hover:bg-brand-secondary-hover',
    variant === 'ghost-dark' && 'bg-white text-brand-ink ring-1 ring-brand-border hover:text-brand-secondary hover:ring-brand-secondary', // secondary button (name kept)
    variant === 'outline' && 'border border-brand-border bg-white text-brand-navy hover:border-brand-secondary hover:text-brand-secondary',
    className,
  );
