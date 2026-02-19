import React, { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleFavorite } from "@/store/slices/favoritesSlice";
import { addToCart } from "@/store/slices/cartSlice";
import { addNotification } from "@/store/slices/notificationSlice";
import { toast } from "sonner";
import { StarRating } from "@/components/shared";
import { Product } from "@/lib/types";

interface ProductCardProps {
    product: Product;
    isFavorited?: boolean;
    onEdit?: (product: Product) => void;
    onDelete?: (product: Product) => void;
    index?: number;
}

const ProductCard = React.memo(function ProductCard({
    product,
    isFavorited = false,
    onEdit,
    onDelete,
    index = 0,
}: ProductCardProps) {
    const dispatch = useAppDispatch();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.4,
                delay: Math.min(index * 0.05, 0.5),
                ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="h-full"
        >
            <Card className="group relative overflow-hidden border-border bg-card transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-full flex flex-col rounded-2xl shadow-none hover:border-primary/20">
                {/* Image */}
                <Link href={`/products/${product.id}`} className="block relative aspect-square overflow-hidden bg-muted/20" aria-label={`View details for ${product.title}`}>
                    <Image
                        src={product.thumbnail}
                        alt={product.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />

                    {/* Quick View Overlay (Subtle) */}
                    <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-all duration-300 opacity-0 group-hover:opacity-100">
                        <Button className="w-full h-11 rounded-xl font-black italic tracking-tight bg-background text-foreground hover:bg-foreground hover:text-background transition-all shadow-xl">
                            QUICK VIEW
                        </Button>
                    </div>
                </Link>

                {/* Favorite Button */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 h-9 w-9 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background shadow-sm text-foreground/40 hover:text-red-500 transition-all z-20 group/fav border border-border"
                    onClick={(e) => {
                        e.preventDefault();
                        dispatch(toggleFavorite(product.id));
                    }}
                    aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
                >
                    <Heart className={`h-4 w-4 transition-transform group-hover/fav:scale-110 ${isFavorited ? "fill-red-500 text-red-500" : ""}`} />
                </Button>

                <CardContent className="p-5 flex flex-col flex-1 gap-2">
                    {/* 1. Category */}
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.15em] italic">
                        {product.category}
                    </span>

                    {/* 2. Product Name */}
                    <h3 className="font-bold text-[14px] leading-[1.2] line-clamp-2 min-h-[2.4rem] group-hover:text-primary transition-colors">
                        {product.title}
                    </h3>

                    {/* 3. Rating & Pricing Section */}
                    <div className="flex flex-col gap-3 mt-auto pt-2">
                        <StarRating
                            rating={product.rating}
                            reviewsCount={product.reviews.length}
                        />

                        <div className="flex items-center justify-between border-t border-border pt-3">
                            <div className="flex flex-col">
                                {product.discountPercentage > 0 && (
                                    <span className="text-[10px] text-muted-foreground line-through leading-none mb-1">
                                        ${product.price.toFixed(2)}
                                    </span>
                                )}
                                <span className="text-base font-black text-foreground leading-none">
                                    ${(product.price * (1 - product.discountPercentage / 100)).toFixed(2)}
                                </span>
                            </div>

                            <Badge variant="destructive" className="h-5 px-2 text-[9px] font-black rounded-lg border-none shadow-none bg-destructive italic uppercase tracking-tighter">
                                -{Math.round(product.discountPercentage)}%
                            </Badge>

                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 rounded-xl hover:bg-primary/10 hover:text-primary transition-all ml-2 border border-border group/cart"
                                onClick={(e) => {
                                    e.preventDefault();
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


