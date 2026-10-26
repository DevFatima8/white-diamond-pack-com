import React from 'react';
import { cn } from '@/lib/utils';
import { Sparkles } from 'lucide-react';

export interface SectionTitleProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  badge?: string;
  badgeIcon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: 'left' | 'center' | 'right';
  theme?: 'light' | 'dark';
  titleClassName?: string;
  badgeClassName?: string;
  descriptionClassName?: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  badge,
  badgeIcon = <Sparkles className="w-3.5 h-3.5" />,
  title,
  description,
  align = 'center',
  theme = 'light',
  className,
  titleClassName,
  badgeClassName,
  descriptionClassName,
  ...props
}) => {
  const isDark = theme === 'dark';

  const alignClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  };

  return (
    <div
      className={cn('flex flex-col mb-12 sm:mb-16', alignClasses[align], className)}
      {...props}
    >
      {badge && (
        <div
          className={cn(
            'inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase mb-3.5 transition-all',
            isDark
              ? 'bg-[#2B1212]/80 border border-[#FBD5D8]/30 text-[#F8C9CD]'
              : 'bg-[#FDF3F3] border border-[#FBD5D8]/20 text-[#8B1414]',
            badgeClassName
          )}
        >
          {badgeIcon}
          <span>{badge}</span>
        </div>
      )}

      <h2
        className={cn(
          'text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-heading leading-tight',
          isDark ? 'text-white' : 'text-[#2B1212]',
          titleClassName
        )}
      >
        {title}
      </h2>

      {description && (
        <p
          className={cn(
            'mt-4 text-base sm:text-lg max-w-2xl leading-relaxed',
            isDark ? 'text-slate-300' : 'text-[#64748B]',
            descriptionClassName
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
};

export default SectionTitle;
