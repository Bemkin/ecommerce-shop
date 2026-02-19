"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { toggleFavorite } from "@/store/slices/favoritesSlice";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { ProductCard, ProductGrid, ProductGridSkeleton } from "@/components/products";
import { Product } from "@/lib/types";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { deleteProduct, getProduct } from "@/lib/api";
import { toast } from "sonner";

export default function FavoritesPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const isAuthenticated = useAuthGuard();

    // Store now holds only IDs
    const favoriteIds = useAppSelector((state) => state.favorites.ids);
    const favoriteIdSet = new Set(favoriteIds);

    // We fetch the full product data for display
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
    const [deleting, setDeleting] = useState(false);

    // Fetch products whenever the saved IDs change
    useEffect(() => {
        if (!isAuthenticated) return;
        if (favoriteIds.length === 0) {
            setProducts([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        Promise.all(favoriteIds.map((id) => getProduct(id)))
            .then(setProducts)
            .catch(() => toast.error("Failed to load some favorites"))
            .finally(() => setLoading(false));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated, favoriteIds.length]);

    const handleEdit = useCallback((product: Product) => {
        router.push(`/products/${product.id}/edit`);
    }, [router]);

    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            await deleteProduct(deleteTarget.id);
            dispatch(toggleFavorite(deleteTarget.id));
            setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
            toast.success(`"${deleteTarget.title}" deleted successfully`);
            setDeleteTarget(null);
        } catch {
            toast.error("Failed to delete product");
        } finally {
            setDeleting(false);
        }
    };

    if (!isAuthenticated) return null;

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Favorites</h1>
                <p className="text-muted-foreground mt-1">
                    {favoriteIds.length === 0
                        ? "No favorites yet"
                        : `${favoriteIds.length} product${favoriteIds.length > 1 ? "s" : ""} saved`}
                </p>
            </div>

            {loading ? (
                <ProductGridSkeleton count={favoriteIds.length || 4} />
            ) : favoriteIds.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="56"
                        height="56"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-muted-foreground/40 mb-4"
                    >
                        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                    </svg>
                    <p className="text-xl font-semibold">No favorites yet</p>
                    <p className="text-sm text-muted-foreground mt-2">
                        Click the heart icon on any product to save it here
                    </p>
                    <button
                        onClick={() => router.push("/")}
                        className="mt-6 text-sm text-primary hover:underline font-medium"
                    >
                        Browse Products →
                    </button>
                </div>
            ) : (
                <ProductGrid>
                    {products.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            isFavorited={favoriteIdSet.has(product.id)}
                            onEdit={handleEdit}
                            onDelete={setDeleteTarget}
                        />
                    ))}
                </ProductGrid>
            )}

            <ConfirmDialog
                open={!!deleteTarget}
                onOpenChange={(open) => !open && setDeleteTarget(null)}
                title="Delete Product"
                description={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
                onConfirm={handleDeleteConfirm}
                loading={deleting}
            />
        </div>
    );
}
