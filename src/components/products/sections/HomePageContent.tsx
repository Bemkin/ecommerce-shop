"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import { SORT_OPTIONS, PRODUCTS_PER_PAGE } from "@/lib/constants";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { useProducts } from "@/hooks/useProducts";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { RootState } from "@/store";
import { setSearchQuery } from "@/store/slices/searchSlice";

import ProductCard from "../ui/ProductCard";
import ProductGrid, { ProductGridSkeleton } from "../ui/ProductGrid";
import HeroBanner from "./HeroBanner";
import QuickCategories from "../ui/QuickCategories";
import FlashSale from "./FlashSale";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import BackToTop from "@/components/shared/BackToTop";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export default function HomePageContent() {
    const isAuthenticated = useAuthGuard();
    const router = useRouter();
    const searchParams = useSearchParams();
    const categoryParam = searchParams.get("category");
    const dispatch = useAppDispatch();

    // Global search state
    const searchQuery = useAppSelector((state: RootState) => state.search.query);

    // Filter state
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [sortValue, setSortValue] = useState("default");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Access global categories state
    const categories = useAppSelector((state) => state.categories.items);

    // Synchronize category state with URL parameter
    useEffect(() => {
        if (categoryParam !== activeCategory) {
            setActiveCategory(categoryParam);
            if (categoryParam) {
                dispatch(setSearchQuery(""));
            }
        }
    }, [categoryParam]);

    // Product data from custom hook
    const {
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
    } = useProducts({
        searchQuery,
        activeCategory,
        sortValue,
        enabled: isAuthenticated,
    });

    // Search handler
    const handleSearch = useCallback((query: string) => {
        dispatch(setSearchQuery(query));
        setActiveCategory(null);
        setSortValue("default");
    }, [dispatch]);

    // Category handler
    const handleCategoryClick = useCallback((slug: string | null) => {
        setActiveCategory(slug);
        dispatch(setSearchQuery(""));

        // Update URL for consistency
        const params = new URLSearchParams(window.location.search);
        if (slug) {
            params.set("category", slug);
        } else {
            params.delete("category");
        }
        router.push(`?${params.toString()}`, { scroll: false });
    }, [router, dispatch]);

    // Edit handler
    const handleEdit = useCallback((product: { id: number }) => {
        router.push(`/products/${product.id}/edit`);
    }, [router]);

    // Pre-calculate favorite IDs for O(1) lookup in child components
    const favoriteIds = useAppSelector((state: RootState) => state.favorites.ids);
    const favoriteIdSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);

    const flashSaleProducts = useMemo(
        () => [...products].sort((a, b) => b.discountPercentage - a.discountPercentage).slice(0, 5),
        [products]
    );

    if (!mounted || !isAuthenticated) return null;

    return (
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-24">
            {/* Hero Section */}
            <HeroBanner />

            {/* Quick Category Nav */}
            <QuickCategories
                categories={categories}
                activeCategory={activeCategory}
                onCategoryClick={handleCategoryClick}
            />

            {/* Featured / Flash Sale */}
            {!searchQuery && !activeCategory && (
                <FlashSale products={flashSaleProducts} />
            )}

            {/* Main Grid Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-12 mt-16 px-2">
                <div>
                    <h2 className="text-3xl font-black tracking-tight mb-1">Today’s For You!</h2>
                    <p className="text-muted-foreground text-sm font-medium">
                        {loading ? "Discovering deals..." : activeCategory || searchQuery ? `Showing ${total} premium findings` : "Today's premium picks"}
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {/* Category Tabs (Refined) */}
                    <div className="flex gap-1.5 p-1.5 bg-muted/40 rounded-2xl overflow-x-auto no-scrollbar max-w-[400px]">
                        <Button
                            variant={activeCategory === null && !searchQuery ? "secondary" : "ghost"}
                            size="sm"
                            className={`h-9 rounded-xl text-xs font-bold px-5 transition-all ${activeCategory === null ? "bg-background shadow-sm" : ""}`}
                            onClick={() => handleCategoryClick(null)}
                        >
                            All
                        </Button>
                        {categories.slice(0, 4).map((cat) => (
                            <Button
                                key={cat.slug}
                                variant={activeCategory === cat.slug ? "secondary" : "ghost"}
                                size="sm"
                                className={`h-9 rounded-xl text-xs font-bold px-5 capitalize transition-all ${activeCategory === cat.slug ? "bg-background shadow-sm" : ""}`}
                                onClick={() => handleCategoryClick(cat.slug)}
                            >
                                {cat.name}
                            </Button>
                        ))}
                    </div>

                    <div className="h-8 w-px bg-border/60 mx-1 hidden lg:block" />

                    {/* Sort Select */}
                    <Select value={sortValue} onValueChange={setSortValue}>
                        <SelectTrigger className="w-[180px] h-11 rounded-2xl border-none bg-muted/40 font-bold text-xs ring-0 focus:ring-2 focus:ring-primary/10">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-none shadow-2xl">
                            {SORT_OPTIONS.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value} className="rounded-xl mx-1 my-0.5 font-medium text-xs">
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Active filters */}
            <AnimatePresence>
                {(searchQuery || activeCategory) && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mb-8 flex items-center gap-2 flex-wrap"
                    >
                        {searchQuery && (
                            <Badge variant="secondary" className="gap-2 pl-3 pr-2 py-1.5 rounded-xl border-none bg-primary/10 text-primary font-bold">
                                Search: &quot;{searchQuery}&quot;
                                <button
                                    onClick={() => handleSearch("")}
                                    className="rounded-full hover:bg-primary/20 p-1 transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                                </button>
                            </Badge>
                        )}
                        {activeCategory && (
                            <Badge variant="secondary" className="gap-2 pl-3 pr-2 py-1.5 rounded-xl border-none bg-primary/10 text-primary font-bold capitalize">
                                {activeCategory.split("-").join(" ")}
                                <button
                                    onClick={() => handleCategoryClick(null)}
                                    className="rounded-full hover:bg-primary/20 p-1 transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                                </button>
                            </Badge>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Error State */}
            {error && (
                <div className="flex flex-col items-center justify-center py-24 text-center bg-destructive/5 rounded-[40px] border border-destructive/10 px-6">
                    <div className="h-16 w-16 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-destructive">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" x2="12" y1="8" y2="12" />
                            <line x1="12" x2="12.01" y1="16" y2="16" />
                        </svg>
                    </div>
                    <p className="text-xl font-black text-destructive tracking-tight mb-2">Oops! Something went wrong</p>
                    <p className="text-muted-foreground text-sm max-w-sm mb-8">{error}</p>
                    <Button onClick={() => window.location.reload()} className="rounded-2xl h-11 px-8 font-bold shadow-lg shadow-primary/20">
                        Refresh Products
                    </Button>
                </div>
            )}

            {/* Loading State */}
            {loading && !error && <ProductGridSkeleton count={PRODUCTS_PER_PAGE} />}

            {/* Product Grid */}
            {!loading && !error && (
                <AnimatePresence initial={false} mode="popLayout">
                    {products.length === 0 ? (
                        <motion.div
                            key="no-results"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="flex flex-col items-center justify-center py-24 text-center bg-muted/20 rounded-[40px] border border-border/50"
                        >
                            <div className="h-20 w-20 bg-muted flex items-center justify-center rounded-3xl mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground/50">
                                    <circle cx="11" cy="11" r="8" />
                                    <path d="m21 21-4.3-4.3" />
                                </svg>
                            </div>
                            <p className="text-2xl font-black tracking-tight mb-2">No matching products</p>
                            <p className="text-muted-foreground text-sm max-w-xs">Try adjusting your filters or search terms to find what you&apos;re looking for.</p>
                            <Button variant="outline" className="mt-8 rounded-2xl font-bold border-2" onClick={() => { handleSearch(""); handleCategoryClick(null); }}>
                                Clear All Filters
                            </Button>
                        </motion.div>
                    ) : (
                        <ProductGrid key="results-grid">
                            {products.map((product, idx) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    isFavorited={favoriteIdSet.has(product.id)}
                                    index={idx}
                                    onEdit={handleEdit}
                                    onDelete={setDeleteTarget}
                                />
                            ))}
                        </ProductGrid>
                    )}
                </AnimatePresence>
            )}

            {/* Loading More */}
            {loadingMore && (
                <div className="flex justify-center py-12">
                    <div className="flex items-center gap-3 bg-muted/50 px-6 py-3 rounded-2xl border border-border/40 shadow-sm animate-pulse">
                        <svg className="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        <span className="text-sm font-black tracking-tight text-foreground">LOADING MORE DEALS...</span>
                    </div>
                </div>
            )}

            {/* Infinite Scroll Sentinel */}
            {hasMore && <div ref={sentinelRef} className="h-10" />}

            {/* End of list */}
            {!hasMore && products.length > 0 && (
                <div className="relative py-16 flex justify-center items-center">
                    <div className="absolute inset-x-0 h-px bg-border/40" />
                    <div className="relative z-10 bg-background px-6 text-xs font-black tracking-widest text-muted-foreground uppercase flex items-center gap-4">
                        <div className="h-1 w-1 rounded-full bg-primary" />
                        END OF COLLECTION
                        <div className="h-1 w-1 rounded-full bg-primary" />
                    </div>
                </div>
            )}

            {/* Slogan Section (Premium Polish) */}
            <div className="mt-24 mb-12 py-24 rounded-[60px] bg-foreground text-background text-center relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
                <div className="relative z-10 space-y-4 px-6">
                    <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter leading-none mb-8">
                        &quot;Let&apos;s Shop Beyond Boundaries&quot;
                    </h2>
                    <p className="text-muted-foreground/60 text-sm font-bold uppercase tracking-[0.2em]">Established 2024 • Global Experience</p>
                </div>
            </div>

            {/* Delete Confirmation */}
            <ConfirmDialog
                open={!!deleteTarget}
                onOpenChange={(open) => !open && setDeleteTarget(null)}
                title="Delete Product"
                description={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
                onConfirm={handleDeleteConfirm}
                loading={deleting}
            />

            <BackToTop />
        </div>
    );
}
