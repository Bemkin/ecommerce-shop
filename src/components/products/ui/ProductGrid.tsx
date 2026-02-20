"use client";

import { ShimmerSkeleton } from "@/components/shared/ShimmerSkeleton";
import { Card } from "@/components/ui/card";

interface ProductGridProps {
    children: React.ReactNode;
}

export default function ProductGrid({ children }: ProductGridProps) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {children}
        </div>
    );
}

export function ProductCardSkeleton() {
    return (
        <Card className="overflow-hidden border-border/50 bg-card/50 flex flex-col gap-3 rounded-2xl shadow-none">
            <ShimmerSkeleton className="aspect-square w-full rounded-none" />
            <div className="p-4 pt-0 space-y-3 flex flex-col flex-1">
                <ShimmerSkeleton className="h-3 w-16 rounded-full" />
                <div className="space-y-1.5">
                    <ShimmerSkeleton className="h-4 w-full rounded-md" />
                    <ShimmerSkeleton className="h-4 w-2/3 rounded-md" />
                </div>
                <div className="flex items-center gap-1 py-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <ShimmerSkeleton key={i} className="h-2.5 w-2.5 rounded-full" />
                    ))}
                </div>
                <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/50">
                    <ShimmerSkeleton className="h-5 w-20 rounded-lg" />
                    <ShimmerSkeleton className="h-8 w-8 rounded-xl" />
                </div>
            </div>
            <span className="sr-only">Loading product information...</span>
        </Card>
    );
}

export function ProductGridSkeleton({ count = 10 }: { count?: number }) {
    return (
        <div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5"
            aria-busy="true"
            aria-label="Loading products grid"
        >
            {Array.from({ length: count }).map((_, i) => (
                <ProductCardSkeleton key={i} />
            ))}
        </div>
    );
}

