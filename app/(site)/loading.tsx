import { Skeleton } from '@/components/ui/Skeleton';

export default function SiteLoading() {
  return (
    <div className="mx-auto w-full max-w-site px-5 py-12 sm:px-6 lg:px-12">
      <div className="space-y-4">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-12 w-3/4 max-w-lg" />
        <Skeleton className="h-6 w-full max-w-xl" />
      </div>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-3xl border border-brand-border bg-white p-6 space-y-4">
            <Skeleton className="aspect-video w-full rounded-2xl" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ))}
      </div>
    </div>
  );
}
