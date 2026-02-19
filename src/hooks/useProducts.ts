import { useCallback } from "react";
import { Product } from "@/lib/types";
import { useProductData } from "./useProductData";
import { useProductManagement } from "./useProductManagement";

interface UseProductsOptions {
    searchQuery: string;
    activeCategory: string | null;
    sortValue: string;
    enabled: boolean;
}

interface UseProductsReturn {
    products: Product[];
    loading: boolean;
    loadingMore: boolean;
    error: string | null;
    total: number;
    hasMore: boolean;
    sentinelRef: React.MutableRefObject<HTMLDivElement | null>;
    deleteTarget: Product | null;
    deleting: boolean;
    setDeleteTarget: (product: Product | null) => void;
    handleDeleteConfirm: () => Promise<void>;
}

/**
 * Custom hook encapsulating product fetching, infinite scroll pagination,
 * search, category filter, sorting, and delete logic.
 * Now refactored to compose specialized sub-hooks for better maintainability.
 */
export function useProducts({
    searchQuery,
    activeCategory,
    sortValue,
    enabled,
}: UseProductsOptions): UseProductsReturn {
    // 1. Data fetching and pagination logic
    const {
        products,
        setProducts,
        loading,
        loadingMore,
        error,
        total,
        hasMore,
        sentinelRef,
    } = useProductData({ searchQuery, activeCategory, sortValue, enabled });

    // 2. Local state update for smooth deletion
    const handleProductDeleted = useCallback((id: number) => {
        setProducts((prev) => prev.filter((p) => p.id !== id));
    }, [setProducts]);

    // 3. Product management logic (deletion)
    const {
        deleteTarget,
        deleting,
        setDeleteTarget,
        handleDeleteConfirm,
    } = useProductManagement({ onProductDeleted: handleProductDeleted });

    return {
        products,
        loading,
        loadingMore,
        error,
        total,
        hasMore,
        sentinelRef,
        deleteTarget,
        deleting,
        setDeleteTarget,
        handleDeleteConfirm,
    };
}
