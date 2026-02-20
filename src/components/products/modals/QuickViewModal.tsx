"use client";

import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { closeQuickView } from "@/store/slices/uiSlice";
import { addToCart } from "@/store/slices/cartSlice";
import { getProduct } from "@/lib/api";
import { Product } from "@/lib/types";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Star, ArrowRight, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function QuickViewModal() {
    const dispatch = useAppDispatch();
    const { quickViewProductId } = useAppSelector((state) => state.ui);
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(false);
    const [selectedVariant, setSelectedVariant] = useState<string>("");
    const [activeImage, setActiveImage] = useState(0);

    useEffect(() => {
        if (!quickViewProductId) {
            setProduct(null);
            setSelectedVariant("");
            setActiveImage(0);
            return;
        }

        const fetchProduct = async () => {
            setLoading(true);
            try {
                const data = await getProduct(quickViewProductId);
                setProduct(data);
                if (data.category.includes("apparel") || data.category.includes("shirts")) {
                    setSelectedVariant("M");
                }
            } catch (error) {
                console.error("Failed to fetch product for Quick View:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [quickViewProductId]);

    const handleAddToCart = () => {
        if (!product) return;
        dispatch(addToCart({
            ...product,
            quantity: 1,
            selectedVariant: selectedVariant || undefined
        }));
    };

    const isOpen = quickViewProductId !== null;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && dispatch(closeQuickView())}>
            <DialogContent className="max-w-4xl p-0 overflow-hidden border-none shadow-2xl rounded-[32px]">
                {/* Accessibility: Always render Title and Description */}
                <div className="sr-only">
                    <DialogTitle>{product?.title || "Product Quick View"}</DialogTitle>
                    <DialogDescription>{product?.description || "Preview product details and add to bag."}</DialogDescription>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 h-full min-h-[500px]">
                    {/* Left: Product Gallery (Condensed) */}
                    <div className="relative bg-muted/30 p-6 flex flex-col gap-4">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeImage + (product?.id || 0)}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.1 }}
                                className="relative aspect-square rounded-2xl overflow-hidden bg-white shadow-xl shadow-black/5"
                            >
                                {loading ? (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                                    </div>
                                ) : product ? (
                                    <Image
                                        src={product.images[activeImage]}
                                        alt={product.title}
                                        fill
                                        className="object-contain p-4"
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                    />
                                ) : null}
                            </motion.div>
                        </AnimatePresence>

                        {product && product.images.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                                {product.images.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveImage(i)}
                                        className={`relative w-16 h-16 rounded-xl border-2 transition-all ${activeImage === i ? "border-primary shadow-lg scale-105" : "border-transparent opacity-60 hover:opacity-100"}`}
                                    >
                                        <Image src={img} alt="" fill className="object-cover rounded-lg" sizes="64px" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Content */}
                    <div className="p-8 flex flex-col justify-between bg-background">
                        <div className="space-y-6">
                            {loading ? (
                                <div className="space-y-4 animate-pulse">
                                    <div className="h-4 w-24 bg-muted rounded" />
                                    <div className="h-10 w-full bg-muted rounded" />
                                    <div className="h-6 w-32 bg-muted rounded" />
                                    <div className="space-y-2">
                                        <div className="h-4 w-full bg-muted rounded" />
                                        <div className="h-4 w-full bg-muted rounded" />
                                    </div>
                                </div>
                            ) : product ? (
                                <>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="secondary" className="bg-primary/10 text-primary border-none rounded-lg px-2 py-0.5 text-[10px] font-black uppercase italic tracking-widest">
                                                {product.category}
                                            </Badge>
                                            <div className="flex items-center gap-1 text-orange-500 font-bold text-xs bg-orange-500/5 px-2 py-0.5 rounded-lg border border-orange-500/10">
                                                <Star className="w-3 h-3 fill-current" />
                                                {product.rating}
                                            </div>
                                        </div>
                                        <h2 className="text-3xl font-black italic tracking-tighter leading-none pt-2">
                                            {product.title.toUpperCase()}
                                        </h2>
                                    </div>

                                    <div className="flex items-baseline gap-3">
                                        <span className="text-4xl font-black italic tracking-tighter text-primary">
                                            ${product.price}
                                        </span>
                                        {product.discountPercentage > 0 && (
                                            <span className="text-lg text-muted-foreground/40 line-through font-bold">
                                                ${Math.round(product.price * (1 + product.discountPercentage / 100))}
                                            </span>
                                        )}
                                    </div>

                                    <p className="text-sm text-muted-foreground leading-relaxed font-medium line-clamp-3">
                                        {product.description}
                                    </p>

                                    {/* Variant Selector (Mock) */}
                                    {(product.category.includes("apparel") || product.category.includes("shirts")) && (
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground italic">Select Size</label>
                                            <div className="flex gap-2">
                                                {["S", "M", "L", "XL"].map((size) => (
                                                    <button
                                                        key={size}
                                                        onClick={() => setSelectedVariant(size)}
                                                        className={`w-10 h-10 rounded-xl font-bold flex items-center justify-center transition-all ${selectedVariant === size ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30" : "bg-muted hover:bg-muted/80 text-muted-foreground"}`}
                                                    >
                                                        {size}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : null}
                        </div>

                        <div className="pt-8 space-y-3">
                            <Button
                                disabled={loading || !product}
                                onClick={handleAddToCart}
                                className="w-full h-14 rounded-2xl bg-foreground text-background font-black italic tracking-widest uppercase text-xs shadow-2xl shadow-black/10 hover:scale-[1.02] active:scale-95 transition-all group"
                            >
                                ADD TO BAG
                                <ShoppingBag className="ml-2 w-4 h-4 transition-transform group-hover:scale-110" />
                            </Button>

                            {product && (
                                <Link
                                    href={`/products/${product.id}`}
                                    onClick={() => dispatch(closeQuickView())}
                                    className="flex items-center justify-center gap-2 text-[10px] font-black uppercase italic tracking-widest text-muted-foreground hover:text-primary transition-colors py-2"
                                >
                                    VIEW FULL DETAILS
                                    <ArrowRight className="w-3 h-3" />
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
