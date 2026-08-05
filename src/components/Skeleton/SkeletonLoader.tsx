/**
 * Skeleton loading components for smooth UX
 */

export function SkeletonLoader({
  width = "w-full",
  height = "h-4",
  className = "",
}: {
  width?: string;
  height?: string;
  className?: string;
}) {
  return (
    <div
      className={`${width} ${height} ${className} bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse`}
    />
  );
}

export function PriceCardSkeleton() {
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-md space-y-4 animate-pulse">
      <SkeletonLoader width="w-1/2" height="h-6" />
      <div className="space-y-2">
        <SkeletonLoader height="h-8" />
        <SkeletonLoader width="w-2/3" height="h-4" />
      </div>
      <SkeletonLoader height="h-3" width="w-1/3" />
    </div>
  );
}

export function SummaryCardSkeleton() {
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 space-y-4 animate-pulse">
      <div className="grid grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-2">
            <SkeletonLoader height="h-3" width="w-1/2" />
            <SkeletonLoader height="h-6" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ListItemSkeleton() {
  return (
    <div className="p-4 space-y-2 animate-pulse">
      <SkeletonLoader width="w-3/4" height="h-4" />
      <SkeletonLoader width="w-1/2" height="h-3" />
    </div>
  );
}

export function PortfolioSummarySkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-lg animate-pulse"
        >
          <div className="absolute top-0 right-0 h-24 w-24 rounded-full blur-3xl bg-gray-300 dark:bg-gray-600" />
          <div className="relative z-10 space-y-4">
            <SkeletonLoader height="h-4" width="w-2/3" />
            <div className="space-y-2">
              <SkeletonLoader height="h-8" />
              <SkeletonLoader height="h-4" width="w-1/2" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function CollapsibleCardSkeleton({
  assetKey = "gold",
}: { assetKey?: string } = {}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden animate-pulse">
      {/* Header Skeleton */}
      <div className="px-6 py-4 flex flex-row-reverse items-center gap-3">
        <div className="flex shrink-0 items-center gap-2">
          <SkeletonLoader height="h-6" width="w-6" />
        </div>
        <div className="flex-1">
          <SkeletonLoader height="h-6" width="w-1/2" />
        </div>
        <div className="shrink-0">
          <SkeletonLoader height="h-6" width="w-6" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
        <SkeletonLoader height="h-4" width="w-full" />
        <SkeletonLoader height="h-4" width="w-3/4" />
        <SkeletonLoader height="h-8" width="w-1/2" />
        <div className="grid grid-cols-2 gap-3 mt-4">
          <SkeletonLoader height="h-10" />
          <SkeletonLoader height="h-10" />
        </div>
      </div>
    </div>
  );
}
