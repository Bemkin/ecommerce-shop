"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { toggleFavorite } from "@/store/slices/favoritesSlice";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
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
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-24 h-24 rounded-full bg-muted/30 flex items-center justify-center relative mb-8"
                    >
                        <Heart className="w-10 h-10 text-muted-foreground/30" />
                        <div className="absolute inset-0 rounded-full border-2 border-dashed border-muted-foreground/20 animate-[spin_12s_linear_infinite]" />
                    </motion.div>
                    <div className="space-y-3 mb-10">
                        <h3 className="text-2xl font-black italic tracking-tight">YOUR WISHLIST IS EMPTY</h3>
                        <p className="text-sm text-muted-foreground max-w-[280px] mx-auto font-medium leading-relaxed">
                            Don&apos;t let your favorites get away. Save the items you love and they&apos;ll appear right here.
                        </p>
                    </div>
                    <button
                        onClick={() => router.push("/")}
                        className="h-14 px-10 rounded-2xl font-black italic tracking-widest text-[11px] uppercase bg-foreground text-background hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-foreground/10"
                    >
                        START DISCOVERING
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
