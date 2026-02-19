"use client";

import { useEffect, useState } from "react";
import { getProduct, getProducts, getProductsByCategory } from "@/lib/api";
import { Product } from "@/lib/types";

interface UseProductDetailProps {
    productId: number;
    enabled: boolean;
}

export function useProductDetail({ productId, enabled }: UseProductDetailProps) {
    const [product, setProduct] = useState<Product | null>(null);
    const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!enabled || !productId) return;

        const controller = new AbortController();

        const fetchProduct = async () => {
            setLoading(true);
            setProduct(null);
            setError(null);
            try {
                const data = await getProduct(productId, controller.signal);
                setProduct(data);

                // Fetch real recommendations from the same category
                try {
                    const categoryData = await getProductsByCategory(
                        data.category,
                        5,
                        0,
                        controller.signal
                    );

                    // Filter out current product and limit to 4
                    const recommendations = categoryData.products
                        .filter((p: Product) => p.id !== productId)
                        .slice(0, 4);

                    // If we have enough recommendations, use them
                    if (recommendations.length >= 4) {
                        setRecommendedProducts(recommendations);
                    } else {
                        // If not enough in category, fetch general top products as fallback
                        const fallbackData = await getProducts(10, 0, undefined, undefined, controller.signal);
                        const fallbackRecommendations = fallbackData.products
                            .filter((p: Product) => p.id !== productId && !recommendations.some((rp: Product) => rp.id === p.id))
                            .slice(0, 4 - recommendations.length);

                        setRecommendedProducts([...recommendations, ...fallbackRecommendations]);
                    }
                } catch (recErr) {
                    console.error("Failed to fetch recommendations:", recErr);
                    // Fallback to general products on error
                    const generalData = await getProducts(4, 0, undefined, undefined, controller.signal);
                    setRecommendedProducts(generalData.products);
                }
            } catch (err) {
                if (err instanceof Error && err.name === "CanceledError") return;
                setError("Product not found or failed to load.");
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        fetchProduct();

        return () => controller.abort();
    }, [productId, enabled]);

    return {
        product,
        recommendedProducts,
        loading,
        error,
    };
}
