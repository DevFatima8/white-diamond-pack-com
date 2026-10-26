import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'accent' | 'white' | 'current';
  label?: string;
  fullScreen?: boolean;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-10 h-10',
  xl: 'w-14 h-14',
};

const colorClasses = {
  primary: 'text-[#C1121F]',
  accent: 'text-[#8B1414]',
  white: 'text-white',
  current: 'text-current',
};

export const Loader: React.FC<LoaderProps> = ({
  size = 'md',
  color = 'primary',
  label,
  fullScreen = false,
  className,
  ...props
}) => {
  const content = (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3',
        className
      )}
      {...props}
    >
      <Loader2
        className={cn('animate-spin', sizeClasses[size], colorClasses[color])}
      />
      {label && (
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 animate-pulse">
          {label}
        </span>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="p-6 rounded-2xl bg-white dark:bg-[#141815] shadow-2xl border border-white/10">
          {content}
        </div>
      </div>
    );
  }

  return content;
};

export default Loader;
