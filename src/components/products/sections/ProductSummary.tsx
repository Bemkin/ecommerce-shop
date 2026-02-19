"use client";

import { useState } from "react";
import { Star, Heart, Share2, Ruler, MessageCircle } from "lucide-react";
import { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAppDispatch } from "@/store/hooks";
import { toggleFavorite } from "@/store/slices/favoritesSlice";
import { addToCart } from "@/store/slices/cartSlice";
import { toast } from "sonner";

interface ProductSummaryProps {
    product: Product;
    isFavorited: boolean;
}

export default function ProductSummary({ product, isFavorited }: ProductSummaryProps) {
    const dispatch = useAppDispatch();
    const [selectedOption, setSelectedOption] = useState<string>("");

    // Dynamic Variant Configuration
    const getVariantConfig = (category: string) => {
        const cat = category.toLowerCase();

        if (["laptops", "smartphones", "tablets", "mobile-accessories"].includes(cat)) {
            return { label: "Select Storage", options: ["128GB", "256GB", "512GB", "1TB"], icon: "storage" };
        }
        if (["mens-shoes", "womens-shoes"].includes(cat)) {
            return { label: "Select US Size", options: ["US 7", "US 8", "US 9", "US 10", "US 11"], icon: "ruler" };
        }
        if (["mens-shirts", "womens-dresses", "tops", "womens-jewellery"].includes(cat)) {
            return { label: "Select Size", options: ["XS", "S", "M", "L", "XL"], icon: "ruler" };
        }
        if (["beauty", "skincare", "fragrances", "groceries"].includes(cat)) {
            return { label: "Select Pack", options: ["1 Unit", "Pack of 2", "Pack of 3"], icon: "package" };
        }
        if (["furniture", "home-decoration", "lighting"].includes(cat)) {
            return { label: "Select Finish", options: ["Standard", "Premium", "Wood", "Metal"], icon: "palette" };
        }

        return null; // No variants for other categories
    };

    const variantConfig = getVariantConfig(product.category);

    // Initialize selection on load or category change
    if (variantConfig && !selectedOption) {
        setSelectedOption(variantConfig.options[1]); // Default to 2nd option (e.g., 256GB or M)
    }

    const discountedPrice = product.price * (1 - product.discountPercentage / 100);

    const handleAddToCart = () => {
        dispatch(addToCart({
            ...product,
            quantity: 1,
            selectedVariant: selectedOption || undefined
        }));
        toast.success(`Added ${product.title} to bag`, {
            description: selectedOption ? `Variant: ${selectedOption}` : undefined
        });
    };

    return (
        <div className="space-y-8">
            <div>
                <div className="flex items-center gap-2 text-muted-foreground text-xs font-bold uppercase tracking-widest mb-4">
                    <span>100+ Sold</span>
                    <span>•</span>
                    <div className="flex items-center gap-1 text-orange-500">
                        <Star className="h-3 w-3 fill-current" />
                        <span>4.8</span>
                    </div>
                    <span>•</span>
                    <span>168 Reviews</span>
                </div>

                <h1 className="text-3xl lg:text-4xl font-black tracking-tight mb-2 leading-tight">
                    {product.title}
                </h1>

                <div className="flex items-center gap-4 mt-6">
                    <span className="text-4xl font-black text-foreground">
                        ${discountedPrice.toFixed(2)}
                    </span>
                    <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground line-through font-bold">
                            ${product.price.toFixed(2)}
                        </span>
                        <Badge className="bg-destructive/10 text-destructive border-none font-black text-[10px] w-fit">
                            {Math.round(product.discountPercentage)}% OFF
                        </Badge>
                    </div>
                </div>
            </div>

            {/* Dynamic Variant Selector */}
            {variantConfig && (
                <div className="space-y-6">
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">{variantConfig.label}</label>
                            <button className="text-[10px] font-bold text-primary flex items-center gap-1 hover:underline">
                                <Ruler className="h-3 w-3" /> Guide
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {variantConfig.options.map((opt) => (
                                <Button
                                    key={opt}
                                    variant={selectedOption === opt ? "default" : "outline"}
                                    className={`h-11 min-w-[3.5rem] rounded-xl font-bold border-2 transition-all ${selectedOption === opt ? "bg-foreground text-background scale-105 shadow-lg" : "hover:border-primary/50"
                                        }`}
                                    onClick={() => setSelectedOption(opt)}
                                >
                                    {opt}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="space-y-4 pt-4">
                <div className="flex gap-3">
                    <Button
                        onClick={handleAddToCart}
                        className="flex-1 h-14 rounded-2xl bg-foreground text-background hover:bg-foreground/90 font-black text-lg shadow-xl shadow-foreground/10 transition-transform active:scale-95"
                    >
                        Buy this item
                    </Button>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        onClick={handleAddToCart}
                        className="flex-1 h-14 rounded-2xl border-2 font-black text-lg hover:bg-primary/5 hover:border-primary/50 transition-all"
                    >
                        Add to Bag
                    </Button>
                </div>

                <div className="flex items-center justify-center gap-8 pt-4">
                    <button className="flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors group">
                        <MessageCircle className="h-4 w-4 group-hover:scale-110 transition-transform" /> Chat
                    </button>
                    <button
                        onClick={() => dispatch(toggleFavorite(product.id))}
                        className={`flex items-center gap-2 text-xs font-bold transition-colors group ${isFavorited ? "text-red-500" : "text-muted-foreground hover:text-foreground"}`}
                    >
                        <Heart className={`h-4 w-4 group-hover:scale-110 transition-transform ${isFavorited ? "fill-current" : ""}`} /> Wishlist
                    </button>
                    <button className="flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors group">
                        <Share2 className="h-4 w-4 group-hover:scale-110 transition-transform" /> Share
                    </button>
                </div>
            </div>
        </div>
    );
}
