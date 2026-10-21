/**
 * Small UI kit for the admin panel, following DESIGN.md:
 * 12px radius on cards/inputs, #E2E8F0 borders, indigo focus ring,
 * pill-shaped primary buttons, brand colours only.
 * No hooks here, so these work in both Server and Client Components.
 */
import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// ── Layout ────────────────────────────────────────────────

export function PageHeader({
  title,
  description,
  actions,
  eyebrow,
}: {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  eyebrow?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow && (
          <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-secondary">{eyebrow}</div>
        )}
        <h1 className="font-heading text-2xl font-bold tracking-tight text-brand-ink sm:text-[28px]">{title}</h1>
        {description && <p className="mt-1 text-sm text-brand-muted">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Card({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('rounded-xl border border-brand-border bg-white shadow-level-1', className)} {...props} />;
}

export function CardHeader({ title, description, actions }: { title: ReactNode; description?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-brand-border px-5 py-4">
      <div>
        <h2 className="font-heading text-base font-semibold text-brand-ink">{title}</h2>
        {description && <p className="mt-0.5 text-xs text-brand-muted">{description}</p>}
      </div>
      {actions}
    </div>
  );
}

export function EmptyState({ icon, title, children }: { icon?: ReactNode; title: string; children?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      {icon && <div className="mb-3 rounded-full bg-brand-tint p-3 text-brand-secondary">{icon}</div>}
      <p className="font-heading font-semibold text-brand-ink">{title}</p>
      {children && <div className="mt-1 max-w-sm text-sm text-brand-muted">{children}</div>}
    </div>
  );
}

// ── Buttons ───────────────────────────────────────────────

const buttonBase =
  'inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition-colors focus-visible:outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-60';

const buttonVariants = {
  primary: 'rounded-full bg-brand-primary text-white hover:bg-brand-primary-hover focus-visible:ring-brand-primary/25',
  secondary:
    'rounded-full border border-brand-border bg-white text-brand-navy hover:border-brand-secondary hover:bg-brand-tint focus-visible:ring-brand-secondary/15',
  navy: 'rounded-xl bg-brand-navy text-white hover:bg-[#2E2A72] focus-visible:ring-brand-secondary/25',
  ghost: 'rounded-lg text-brand-muted hover:bg-brand-tint hover:text-brand-navy focus-visible:ring-brand-secondary/15',
  danger: 'rounded-full border border-brand-primary/30 bg-white text-brand-primary hover:bg-[#FFF1F2] focus-visible:ring-brand-primary/25',
} as const;

const buttonSizes = { sm: 'h-8 px-3 text-xs', md: 'h-10 px-4 text-sm', lg: 'h-11 px-6 text-sm' } as const;

type ButtonStyle = { variant?: keyof typeof buttonVariants; size?: keyof typeof buttonSizes };

export function buttonClass({ variant = 'primary', size = 'md' }: ButtonStyle = {}, className?: string) {
  return cn(buttonBase, buttonVariants[variant], buttonSizes[size], className);
}

export function Button({
  variant,
  size,
  loading,
  className,
  children,
  disabled,
  type = 'button',
  ...props
}: ComponentProps<'button'> & ButtonStyle & { loading?: boolean }) {
  return (
    <button type={type} className={buttonClass({ variant, size }, className)} disabled={disabled || loading} {...props}>
      {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
      {children}
    </button>
  );
}

export function ButtonLink({ variant, size, className, ...props }: ComponentProps<typeof Link> & ButtonStyle) {
  return <Link className={buttonClass({ variant, size }, className)} {...props} />;
}

// ── Form controls ─────────────────────────────────────────

const control =
  'w-full rounded-xl border bg-white px-4 text-sm text-brand-ink placeholder:text-slate-400 transition-shadow focus:border-brand-secondary focus:outline-none focus:ring-[3px] focus:ring-brand-secondary/15 disabled:bg-brand-surface';

export function Field({
  label,
  htmlFor,
  error,
  hint,
  required,
  className,
  children,
}: {
  label: ReactNode;
  htmlFor?: string;
  error?: string;
  hint?: ReactNode;
  required?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-1.5 block text-[13px] font-semibold text-brand-ink">
        {label}
        {required && <span className="ml-0.5 text-brand-primary">*</span>}
      </label>
      {children}
      {error ? (
        <p className="mt-1 text-xs font-medium text-brand-primary" role="alert">
          {error}
        </p>
      ) : (
        hint && <p className="mt-1 text-xs text-brand-muted">{hint}</p>
      )}
    </div>
  );
}

export function Input({ className, invalid, ...props }: ComponentProps<'input'> & { invalid?: boolean }) {
  return (
    <input
      className={cn(control, 'h-11', invalid ? 'border-brand-primary' : 'border-brand-border', className)}
      aria-invalid={invalid || undefined}
      {...props}
    />
  );
}

export function Textarea({ className, invalid, ...props }: ComponentProps<'textarea'> & { invalid?: boolean }) {
  return (
    <textarea
      className={cn(control, 'min-h-[110px] py-3 leading-6', invalid ? 'border-brand-primary' : 'border-brand-border', className)}
      aria-invalid={invalid || undefined}
      {...props}
    />
  );
}

export function Select({ className, invalid, ...props }: ComponentProps<'select'> & { invalid?: boolean }) {
  return (
    <select
      className={cn(control, 'h-11 cursor-pointer pr-9', invalid ? 'border-brand-primary' : 'border-brand-border', className)}
      aria-invalid={invalid || undefined}
      {...props}
    />
  );
}

/** On/off switch. Indigo when on (DESIGN.md: checked = solid #6366F1). */
export function Toggle({
  checked,
  onChange,
  label,
  disabled,
  size = 'md',
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  disabled?: boolean;
  size?: 'sm' | 'md';
}) {
  const track = size === 'sm' ? 'h-5 w-9' : 'h-6 w-11';
  const knob = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';
  const shift = size === 'sm' ? 'translate-x-4' : 'translate-x-5';
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex shrink-0 items-center rounded-full p-0.5 transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-brand-secondary/25 disabled:opacity-50',
        track,
        checked ? 'bg-brand-secondary' : 'bg-slate-300',
      )}
    >
      <span className={cn('rounded-full bg-white shadow transition-transform', knob, checked ? shift : 'translate-x-0')} />
    </button>
  );
}

// ── Misc ──────────────────────────────────────────────────

export function Badge({ className, ...props }: ComponentProps<'span'>) {
  return (
    <span
      className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold', className)}
      {...props}
    />
  );
}
