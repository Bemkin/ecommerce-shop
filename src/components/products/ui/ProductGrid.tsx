"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

interface ProductGridProps {
    children: React.ReactNode;
}

export default function ProductGrid({ children }: ProductGridProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {children}
        </div>
    );
}

export function ProductCardSkeleton() {
    return (
        <Card className="overflow-hidden pt-0 gap-3 border-border/50 bg-card/50">
            <Skeleton className="aspect-square w-full rounded-none" />
            <div className="p-4 pt-3 space-y-3">
                <Skeleton className="h-4 w-16 rounded-full" />
                <div className="space-y-1.5">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-2/3" />
                </div>
                <div className="flex items-center gap-1 py-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Skeleton key={i} className="h-3 w-3 rounded-full" />
                    ))}
                    <Skeleton className="h-3 w-6 ml-1" />
                </div>
                <Skeleton className="h-7 w-20" />
                <div className="flex gap-2 pt-1">
                    <Skeleton className="h-8 flex-1 rounded-md" />
                    <Skeleton className="h-8 flex-1 rounded-md" />
                </div>
            </div>
            <span className="sr-only">Loading product information...</span>
        </Card>
    );
}

export function ProductGridSkeleton({ count = 10 }: { count?: number }) {
    return (
        <div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5"
            aria-busy="true"
            aria-label="Loading products grid"
        >
            {Array.from({ length: count }).map((_, i) => (
                <ProductCardSkeleton key={i} />
            ))}
        </div>
    );
}

