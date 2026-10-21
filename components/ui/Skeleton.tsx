import React from 'react';
import { cn } from '@/lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'rectangular' | 'circular' | 'text';
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'rectangular',
  width,
  height,
  className,
  style,
  ...props
}) => {
  const variantClasses = {
    rectangular: 'rounded-xl',
    circular: 'rounded-full',
    text: 'rounded-md h-4 my-1',
  };

  return (
    <div
      className={cn(
        'animate-pulse bg-slate-200 dark:bg-white/10',
        variantClasses[variant],
        className
      )}
      style={{
        width,
        height,
        ...style,
      }}
      {...props}
    />
  );
};

export const ProductCardSkeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={cn(
        'flex flex-col bg-white dark:bg-[#141815] rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden p-4 space-y-4',
        className
      )}
    >
      <Skeleton className="aspect-square w-full rounded-xl" />
      <div className="space-y-2">
        <Skeleton variant="text" className="w-1/3 h-3" />
        <Skeleton variant="text" className="w-4/5 h-5" />
      </div>
      <div className="flex gap-2">
        <Skeleton variant="text" className="w-16 h-4" />
        <Skeleton variant="text" className="w-20 h-4" />
      </div>
      <div className="flex items-center justify-between pt-2">
        <Skeleton variant="text" className="w-24 h-6" />
        <Skeleton className="w-24 h-9 rounded-xl" />
      </div>
    </div>
  );
};

export default Skeleton;
