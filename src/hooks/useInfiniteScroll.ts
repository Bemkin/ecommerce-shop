import { useRef, useEffect, useCallback } from "react";

interface UseInfiniteScrollOptions {
    onLoadMore: () => void;
    hasMore: boolean;
    isLoading: boolean;
    threshold?: number;
}

/**
 * A reusable hook for infinite scroll using the Intersection Observer API.
 * @param onLoadMore - Callback function to trigger when the sentinel is visible.
 * @param hasMore - Boolean indicating if there are more items to load.
 * @param isLoading - Boolean indicating if a load operation is already in progress.
 * @param threshold - Intersection threshold (0 to 1). Defaults to 0.1.
 */
export function useInfiniteScroll({
    onLoadMore,
    hasMore,
    isLoading,
    threshold = 0.1,
}: UseInfiniteScrollOptions) {
    const sentinelRef = useRef<HTMLDivElement | null>(null);

    const checkAndLoad = useCallback(() => {
        if (hasMore && !isLoading) {
            onLoadMore();
        }
    }, [hasMore, isLoading, onLoadMore]);

    useEffect(() => {
        const sentinel = sentinelRef.current;
        if (!sentinel) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    checkAndLoad();
                }
            },
            { threshold }
        );

        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [checkAndLoad, threshold]);

    return sentinelRef;
}
