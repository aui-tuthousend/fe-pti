export function SkeletonLoader({ className = '' }: { className?: string }) {
    return (
        <div className={`animate-pulse ${className}`}>
            <div className="bg-muted rounded-lg w-full h-full"></div>
        </div>
    )
}

export function ProductCardSkeleton() {
    return (
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
            {/* Image Skeleton */}
            <SkeletonLoader className="h-64 w-full" />

            {/* Content Skeleton */}
            <div className="p-6 space-y-3">
                <SkeletonLoader className="h-6 w-3/4" />
                <SkeletonLoader className="h-4 w-1/2" />
                <SkeletonLoader className="h-8 w-full" />
            </div>
        </div>
    )
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: count }).map((_, i) => (
                <ProductCardSkeleton key={i} />
            ))}
        </div>
    )
}
