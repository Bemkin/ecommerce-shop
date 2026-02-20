"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useParams as getParams } from "next/navigation";
import { Product } from "@/lib/types";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { useProductDetail } from "@/hooks/useProductDetail";
import { useProductManagement } from "@/hooks/useProductManagement";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Breadcrumbs, ConfirmDialog } from "@/components/shared";
import ProductGallery from "@/components/products/sections/ProductGallery";
import ProductSummary from "@/components/products/sections/ProductSummary";
import SellerSection from "@/components/products/sections/SellerSection";
import ProductTabs from "@/components/products/sections/ProductTabs";
import ProductGrid from "@/components/products/ui/ProductGrid";
import ProductCard from "@/components/products/ui/ProductCard";
import { useAppSelector } from "@/store/hooks";
import Link from "next/link";

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isAuthenticated = useAuthGuard();
    const productId = Number(params.id);

    const favoriteIds = useAppSelector((state) => state.favorites.ids);
    const isFavorited = favoriteIds.includes(productId);

    // 1. Unified product and recommendations fetching
    const { product, recommendedProducts, loading, error } = useProductDetail({
        productId,
        enabled: isAuthenticated
    });

    // 2. Standardized management logic
    const [deleteOpen, setDeleteOpen] = useState(false);
    const { deleting, handleDeleteConfirm } = useProductManagement({
        onProductDeleted: () => router.push("/")
    });

    // Note: Render structure even if not mounted/authenticated to prevent height collapse
    if (mounted && !isAuthenticated) return null;

    if (!mounted || loading) {
        return (
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-12">
                <Skeleton className="h-4 w-64 mb-8" />
                <div className="grid lg:grid-cols-2 gap-16">
                    <Skeleton className="aspect-square rounded-[40px]" />
                    <div className="space-y-8">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-12 w-3/4" />
                        <Skeleton className="h-10 w-48" />
                        <Skeleton className="h-32 w-full" />
                        <Skeleton className="h-16 w-full rounded-2xl" />
                    </div>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center justify-center py-24 text-center bg-destructive/5 rounded-[40px] border border-destructive/10">
                    <div className="h-20 w-20 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-destructive"><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" /></svg>
                    </div>
                    <p className="text-2xl font-black text-destructive tracking-tight mb-2">{error || "Product not found"}</p>
                    <Link href="/" className="mt-6 text-sm font-black text-primary hover:underline uppercase tracking-widest">
                        ← Return to Marketplace
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-background min-h-screen">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Reusable Breadcrumbs */}
                <Breadcrumbs
                    items={[
                        { label: product.category, href: `/?category=${product.category}` },
                        { label: product.title }
                    ]}
                />

                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
                    {/* Gallery Section */}
                    <div className="lg:sticky lg:top-24">
                        <ProductGallery
                            images={product.images.length > 0 ? product.images : [product.thumbnail]}
                            title={product.title}
                        />

                        {/* Hidden on Tablet/Desktop Summary for Mobile context */}
                        <div className="lg:hidden mt-8">
                            <ProductSummary product={product} isFavorited={isFavorited} />
                        </div>

                        <SellerSection brand={product.brand || "ShopHub Merchant"} />
                    </div>

                    {/* Summary Section - Visible only on Desktop/Large Tablet */}
                    <div className="hidden lg:block">
                        <ProductSummary product={product} isFavorited={isFavorited} />

                        <div className="mt-12 flex items-center gap-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                            <div className="flex items-center gap-2">
                                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></svg>
                                <span>Verified Authentic</span>
                            </div>
                            <div className="h-4 w-px bg-border/40" />
                            <div className="flex items-center gap-2">
                                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                                <span>Buyer Protection</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabbed Info System */}
                <ProductTabs product={product} recommendedProducts={recommendedProducts} />

                {/* Recommendation / Best Sellers */}
                <div className="mt-24 pb-12">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-3xl font-black italic tracking-tight uppercase">Best Seller</h2>
                        <div className="flex gap-2">
                            <Button variant="outline" size="icon" className="h-10 w-10 rounded-full border-2"><ChevronUp className="-rotate-90 h-5 w-5" /></Button>
                            <Button variant="outline" size="icon" className="h-10 w-10 rounded-full border-2 bg-foreground text-background"><ChevronDown className="-rotate-90 h-5 w-5" /></Button>
                        </div>
                    </div>

                    <ProductGrid>
                        {recommendedProducts.map((p, i) => (
                            <ProductCard key={i} product={p} index={i} />
                        ))}
                    </ProductGrid>
                </div>
            </div>

            {/* Management Actions */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-background/80 backdrop-blur-xl border-2 border-border/50 p-2 rounded-2.5xl shadow-2xl opacity-0 hover:opacity-100 transition-opacity duration-300">
                <Button
                    variant="ghost"
                    className="h-10 rounded-xl font-bold px-6 hover:bg-primary/10 hover:text-primary transition-all"
                    onClick={() => router.push(`/products/${product.id}/edit`)}
                >
                    Edit Product
                </Button>
                <div className="h-6 w-px bg-border/60 mx-1" />
                <Button
                    variant="ghost"
                    className="h-10 rounded-xl font-bold px-6 text-destructive hover:bg-destructive/10 transition-all"
                    onClick={() => setDeleteOpen(true)}
                >
                    Delete Product
                </Button>
            </div>

            {/* Global Delete Dialog */}
            <ConfirmDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                title="Delete Product"
                description={`Are you sure you want to delete "${product.title}"? This action cannot be undone.`}
                onConfirm={handleDeleteConfirm}
                loading={deleting}
            />
        </div>
    );
}
