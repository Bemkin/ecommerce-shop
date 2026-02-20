import { cn } from "@/lib/utils";

interface ShimmerSkeletonProps {
    className?: string;
}

/**
 * A premium shimmering skeleton component for high-end loading states.
 * Uses a smooth, animated gradient to represent content that is being loaded.
 */
export function ShimmerSkeleton({ className }: ShimmerSkeletonProps) {
    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-md bg-muted/40",
                "before:absolute before:inset-0 before:-translate-x-full",
                "before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent",
                "before:animate-[shimmer_1.5s_infinite]",
                className
            )}
        />
    );
}

/**
 * Standard card skeleton layout using ShimmerSkeleton.
 */
export function ProductCardSkeleton() {
    return (
        <div className="flex flex-col gap-4">
            <ShimmerSkeleton className="aspect-square rounded-2xl w-full" />
            <div className="space-y-2 px-1">
                <ShimmerSkeleton className="h-4 w-1/3 rounded-full" />
                <ShimmerSkeleton className="h-6 w-full rounded-lg" />
                <div className="flex justify-between items-center pt-2">
                    <ShimmerSkeleton className="h-5 w-24 rounded-full" />
                    <ShimmerSkeleton className="h-8 w-8 rounded-xl" />
                </div>
            </div>
        </div>
    );
}
