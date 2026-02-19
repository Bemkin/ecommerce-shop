"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { ProductForm } from "@/components/products";
import { getProduct, updateProduct } from "@/lib/api";
import { CreateProductData, Product } from "@/lib/types";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

export default function EditProductPage() {
    const params = useParams();
    const router = useRouter();
    const isAuthenticated = useAuthGuard();

    const productId = Number(params.id);
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isAuthenticated || !productId) return;

        const controller = new AbortController();

        const fetchProduct = async () => {
            setLoading(true);
            try {
                const data = await getProduct(productId);
                if (!controller.signal.aborted) {
                    setProduct(data);
                }
            } catch (err: unknown) {
                if (controller.signal.aborted) return;
                setError("Failed to load product");
                console.error(err);
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        fetchProduct();

        return () => controller.abort();
    }, [productId, isAuthenticated]);

    const handleSubmit = async (data: CreateProductData) => {
        setIsSubmitting(true);
        try {
            await updateProduct(productId, data);
            toast.success(`"${data.title}" updated successfully!`);
            router.push(`/products/${productId}`);
        } catch {
            toast.error("Failed to update product. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isAuthenticated) return null;

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <Link
                href={product ? `/products/${product.id}` : "/"}
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="m12 19-7-7 7-7" />
                    <path d="M19 12H5" />
                </svg>
                Back
            </Link>

            {loading ? (
                <div className="max-w-2xl mx-auto space-y-4">
                    <Skeleton className="h-10 w-48" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <div className="grid grid-cols-2 gap-4">
                        <Skeleton className="h-10" />
                        <Skeleton className="h-10" />
                    </div>
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-12 w-full" />
                </div>
            ) : error ? (
                <div className="text-center py-20">
                    <p className="text-lg font-medium text-destructive">{error}</p>
                    <Link
                        href="/"
                        className="mt-4 text-sm text-primary hover:underline inline-block"
                    >
                        ← Back to products
                    </Link>
                </div>
            ) : product ? (
                <ProductForm
                    key={product.id}
                    initialData={{
                        title: product.title,
                        description: product.description,
                        price: product.price,
                        stock: product.stock,
                        brand: product.brand,
                        category: product.category,
                    }}
                    onSubmit={handleSubmit}
                    isLoading={isSubmitting}
                    submitLabel="Update Product"
                />
            ) : null}
        </div>
    );
}
