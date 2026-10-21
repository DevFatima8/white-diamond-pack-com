import { ProductCardSkeleton, Skeleton } from '@/components/ui/Skeleton';

export default function ShopLoading() {
  return (
    <div className="mx-auto w-full max-w-site px-5 py-8 sm:px-6 lg:px-12">
      <div className="mb-8 space-y-3">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-5 w-96" />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
