import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export type ButtonVariant =
  | 'primary'
  | 'accent'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger'
  | 'link';

export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  href?: string;
  target?: string;
  rel?: string;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-[#C1121F] text-white hover:bg-[#9B0F1A] active:bg-[#B0222F] shadow-sm hover:shadow border border-transparent',
  accent:
    'bg-[#8B1414] text-white font-bold hover:bg-[#6E0F0F] active:bg-[#5C0E0E] shadow-sm hover:shadow border border-transparent',
  secondary:
    'bg-[#2B1212] text-white hover:bg-[#1A0B0B] active:bg-[#1A0B0B] border border-white/10 shadow-sm',
  outline:
    'border border-slate-300 dark:border-white/20 bg-transparent text-[#2B1212] dark:text-white hover:bg-[#FDF3F3] dark:hover:bg-white/10 active:bg-slate-200',
  ghost:
    'bg-transparent text-slate-700 dark:text-slate-200 hover:bg-[#FDF3F3] dark:hover:bg-white/10 active:bg-slate-200',
  danger:
    'bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 shadow-sm border border-transparent',
  link: 'text-[#C1121F] dark:text-[#F8C9CD] hover:underline p-0 h-auto font-semibold',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'text-xs px-3.5 py-1.5 h-8 rounded-lg gap-1.5',
  md: 'text-sm px-5 py-2.5 h-10 rounded-xl gap-2',
  lg: 'text-base px-7 py-3.5 h-12 rounded-xl gap-2.5 font-semibold',
  icon: 'h-10 w-10 p-0 rounded-xl flex items-center justify-center',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      href,
      target,
      rel,
      fullWidth = false,
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses = cn(
      'inline-flex items-center justify-center font-medium transition-all duration-200 select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C1121F] focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.98]',
      variantClasses[variant],
      sizeClasses[size],
      fullWidth && 'w-full',
      className
    );

    const content = (
      <>
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-current" />
        ) : (
          leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && (
          <span className="inline-flex shrink-0">{rightIcon}</span>
        )}
      </>
    );

    if (href && !disabled) {
      return (
        <Link
          href={href}
          target={target}
          rel={rel}
          className={baseClasses}
        >
          {content}
        </Link>
      );
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={baseClasses}
        {...props}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
