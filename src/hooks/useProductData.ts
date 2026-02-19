"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import axios from "axios";
import {
    getProducts,
    searchProducts,
    getProductsByCategory,
} from "@/lib/api";
import { Product } from "@/lib/types";
import { PRODUCTS_PER_PAGE } from "@/lib/constants";
import { useInfiniteScroll } from "./useInfiniteScroll";

interface UseProductDataOptions {
    searchQuery: string;
    activeCategory: string | null;
    sortValue: string;
    enabled: boolean;
}

export function useProductData({
    searchQuery,
    activeCategory,
    sortValue,
    enabled,
}: UseProductDataOptions) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [skip, setSkip] = useState(0);
    const [total, setTotal] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const requestSeq = useRef(0);

    const getSortParams = useCallback(() => {
        if (sortValue === "default") return null;
        const [sortBy, order] = sortValue.split("-");
        return { sortBy, order: order as "asc" | "desc" };
    }, [sortValue]);

    const fetchInitial = useCallback(
        async (signal?: AbortSignal) => {
            const currentSeq = ++requestSeq.current;
            setLoading(true);
            setError(null);

            const sort = getSortParams();

            try {
                let data;
                if (searchQuery) {
                    data = await searchProducts(searchQuery, PRODUCTS_PER_PAGE, 0, signal);
                } else if (activeCategory) {
                    data = await getProductsByCategory(activeCategory, PRODUCTS_PER_PAGE, 0, signal);
                } else {
                    data = await getProducts(
                        PRODUCTS_PER_PAGE,
                        0,
                        sort?.sortBy,
                        sort?.order,
                        signal
                    );
                }

                if (currentSeq === requestSeq.current) {
                    setProducts(data.products);
                    setTotal(data.total);
                    setSkip(PRODUCTS_PER_PAGE);
                }
            } catch (err) {
                if (axios.isCancel(err)) return;
                setError("Failed to load products.");
            } finally {
                if (currentSeq === requestSeq.current) {
                    setLoading(false);
                }
            }
        },
        [searchQuery, activeCategory, getSortParams]
    );

    useEffect(() => {
        if (!enabled) return;
        const controller = new AbortController();
        fetchInitial(controller.signal);
        return () => controller.abort();
    }, [fetchInitial, enabled]);

    const loadMore = useCallback(async () => {
        if (loadingMore || skip >= total) return;
        const currentSeq = requestSeq.current;
        setLoadingMore(true);

        const sort = getSortParams();

        try {
            let data;
            if (searchQuery) {
                data = await searchProducts(searchQuery, PRODUCTS_PER_PAGE, skip);
            } else if (activeCategory) {
                data = await getProductsByCategory(activeCategory, PRODUCTS_PER_PAGE, skip);
            } else {
                data = await getProducts(
                    PRODUCTS_PER_PAGE,
                    skip,
                    sort?.sortBy,
                    sort?.order
                );
            }

            if (currentSeq === requestSeq.current) {
                setProducts((prev) => [...prev, ...data.products]);
                setSkip((prev) => prev + PRODUCTS_PER_PAGE);
            }
        } catch {
            // Error handling via global interceptor
        } finally {
            if (currentSeq === requestSeq.current) {
                setLoadingMore(false);
            }
        }
    }, [loadingMore, skip, total, searchQuery, activeCategory, getSortParams]);

    const sentinelRef = useInfiniteScroll({
        onLoadMore: loadMore,
        hasMore: skip < total,
        isLoading: loading || loadingMore,
    });

    return {
        products,
        setProducts,
        loading,
        loadingMore,
        error,
        total,
        hasMore: skip < total,
        sentinelRef,
    };
}
