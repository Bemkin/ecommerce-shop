import { memo, useMemo, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleFavorite } from "@/store/slices/favoritesSlice";
import { addToCart } from "@/store/slices/cartSlice";
import { openQuickView } from "@/store/slices/uiSlice";
import { addNotification } from "@/store/slices/notificationSlice";
import { toast } from "sonner";
import { StarRating } from "@/components/shared";
import { useFlyToCart } from "@/hooks/useFlyToCart";
import { Product } from "@/lib/types";

interface ProductCardProps {
    product: Product;
    isFavorited?: boolean;
    onEdit?: (product: Product) => void;
    onDelete?: (product: Product) => void;
    index?: number;
}

const ProductCard = memo(function ProductCard({
    product,
    isFavorited = false,
    onEdit,
    onDelete,
    index = 0,
}: ProductCardProps) {
    const dispatch = useAppDispatch();
    const { flyToCart } = useFlyToCart();

    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    const triggerHaptic = (pattern: number | number[] = 10) => {
        if (typeof window !== "undefined" && navigator.vibrate) {
            navigator.vibrate(pattern);
        }
    };

    return (
        <motion.div
            initial={mounted ? { opacity: 0, y: 20 } : false}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
            transition={{
                duration: 0.4,
                delay: Math.min(index * 0.05, 0.5),
                ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="h-full"
        >
            <Card className="group relative overflow-hidden border-border bg-card transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] h-full flex flex-col rounded-2xl shadow-none hover:border-primary/20">
                {/* Image */}
                <Link href={`/products/${product.id}`} className="block relative aspect-square overflow-hidden bg-muted/20" aria-label={`View details for ${product.title}`}>
                    <Image
                        src={product.thumbnail}
                        alt={product.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />

                    {/* Mobile View Label / Quick View Overlay */}
                    <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 translate-y-0 sm:translate-y-full group-hover:translate-y-0 transition-all duration-300 opacity-100 sm:opacity-0 group-hover:opacity-100 flex gap-2">
                        <div className="flex-1 h-9 sm:h-11 rounded-lg sm:rounded-xl font-black italic tracking-tight text-[10px] sm:text-xs flex items-center justify-center bg-background/90 backdrop-blur-sm sm:bg-background text-foreground shadow-xl border border-border/50">
                            VIEW DETAILS
                        </div>
                        <Button
                            variant="secondary"
                            size="icon"
                            className="h-9 w-9 sm:h-11 sm:w-11 rounded-lg sm:rounded-xl bg-primary text-primary-foreground shadow-xl border-none hover:scale-105 transition-transform hidden sm:flex"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                dispatch(openQuickView(product.id));
                            }}
                        >
                            <Eye className="w-4 h-4" />
                        </Button>
                    </div>
                </Link>

                {/* Favorite Button */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 sm:top-4 sm:right-4 h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background shadow-sm text-foreground/40 hover:text-red-500 transition-all z-20 group/fav border border-border"
                    onClick={(e) => {
                        e.preventDefault();
                        triggerHaptic([10, 30, 10]); // Premium pulse
                        dispatch(toggleFavorite(product.id));
                        const isNowFavorited = !isFavorited;
                        dispatch(addNotification({
                            title: isNowFavorited ? "Added to Favorites" : "Removed from Favorites",
                            message: isNowFavorited ? `${product.title} is now in your wishlist.` : `${product.title} has been removed from your wishlist.`,
                            type: "info"
                        }));
                    }}
                    aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
                >
                    <Heart className={`h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform group-hover/fav:scale-110 ${isFavorited ? "fill-red-500 text-red-500" : ""}`} />
                </Button>

                <CardContent className="p-3 sm:p-5 flex flex-col flex-1 gap-1.5 sm:gap-2">
                    {/* 1. Category */}
                    <span className="text-[8px] sm:text-[10px] font-black text-primary uppercase tracking-[0.12em] sm:tracking-[0.15em] italic">
                        {product.category}
                    </span>

                    {/* 2. Product Name */}
                    <h3 className="font-bold text-[12px] sm:text-[14px] leading-tight sm:leading-[1.2] line-clamp-2 min-h-[2rem] sm:min-h-[2.4rem] group-hover:text-primary transition-colors">
                        {product.title}
                    </h3>

                    {/* 3. Rating & Pricing Section */}
                    <div className="flex flex-col gap-3 mt-auto pt-2">
                        <StarRating
                            rating={product.rating}
                            reviewsCount={product.reviews.length}
                        />

                        <div className="flex items-center justify-between border-t border-border pt-2 sm:pt-3">
                            <div className="flex flex-col">
                                {product.discountPercentage > 0 && (
                                    <span className="text-[9px] sm:text-[10px] text-muted-foreground line-through leading-none mb-0.5 sm:mb-1">
                                        ${product.price.toFixed(2)}
                                    </span>
                                )}
                                <span className="text-sm sm:text-base font-black text-foreground leading-none">
                                    ${(product.price * (1 - product.discountPercentage / 100)).toFixed(2)}
                                </span>
                            </div>

                            <Badge variant="destructive" className="h-4 sm:h-5 px-1.5 sm:px-2 text-[8px] sm:text-[9px] font-black rounded-md sm:rounded-lg border-none shadow-none bg-destructive italic uppercase tracking-tighter">
                                -{Math.round(product.discountPercentage)}%
                            </Badge>

                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg sm:rounded-xl hover:bg-primary/10 hover:text-primary transition-all ml-1 sm:ml-2 border border-border group/cart"
                                onClick={(e) => {
                                    e.preventDefault();
                                    triggerHaptic(20); // Quick tap
                                    flyToCart(product.thumbnail, e);
                                    dispatch(addToCart({ ...product, quantity: 1 }));
                                    dispatch(addNotification({
                                        title: "Added to Bag",
                                        message: `${product.title} added to your shopping bag.`,
                                        type: "success"
                                    }));
                                    toast.success(`Added ${product.title} to bag`);
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover/cart:scale-110 transition-transform">
                                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                                    <path d="M3 6h18" />
                                    <path d="M16 10a4 4 0 0 1-8 0" />
                                </svg>
                            </Button>
                        </div>
                    </div>

                    {/* Optional CRUD Admin Actions */}
                    {(onEdit || onDelete) && (
                        <div className="flex items-center gap-2 pt-3 border-t border-border mt-2">
                            {onEdit && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-9 flex-1 rounded-xl text-xs font-bold bg-muted/30 hover:bg-primary/10 hover:text-primary transition-all"
                                    onClick={() => onEdit(product)}
                                >
                                    EDIT
                                </Button>
                            )}
                            {onDelete && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-9 flex-1 rounded-xl text-xs font-bold bg-muted/30 hover:bg-destructive/10 hover:text-destructive transition-all"
                                    onClick={() => onDelete(product)}
                                >
                                    DELETE
                                </Button>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
});

export default ProductCard;


