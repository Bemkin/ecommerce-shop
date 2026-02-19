"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info, MessageSquare, LayoutGrid, Sparkles, Flag, Heart } from "lucide-react";
import { Product } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/shared";

interface ProductTabsProps {
    product: Product;
    recommendedProducts: Product[];
}

const tabs = [
    { id: "description", label: "Description", icon: Info },
    { id: "styling", label: "Styling Ideas", icon: Sparkles },
    { id: "review", label: "Review", icon: MessageSquare },
    { id: "bestseller", label: "Best Seller", icon: LayoutGrid },
];

export default function ProductTabs({ product, recommendedProducts }: ProductTabsProps) {
    const [activeTab, setActiveTab] = useState("description");

    return (
        <div className="mt-16 space-y-8">
            {/* Tabs Header */}
            <div className="flex items-center justify-between border-b pb-1">
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`relative px-6 py-3 text-sm font-black transition-all flex items-center gap-2 shrink-0 ${activeTab === tab.id ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            {tab.label}
                            {activeTab === tab.id && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute bottom-0 left-0 right-0 h-1 bg-foreground rounded-full"
                                />
                            )}
                        </button>
                    ))}
                </div>
                <button className="hidden md:flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-destructive transition-colors">
                    <Flag className="h-3 w-3" /> Report Product
                </button>
            </div>

            {/* Content Area */}
            <div className="min-h-[400px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        {activeTab === "description" && <DescriptionContent product={product} />}
                        {activeTab === "styling" && <StylingIdeas currentProduct={product} recommendations={recommendedProducts.slice(0, 3)} />}
                        {activeTab === "review" && <ReviewContent product={product} />}
                        {activeTab === "bestseller" && <div className="text-center py-20 text-muted-foreground font-black uppercase tracking-widest italic">Coming Soon</div>}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}

function DescriptionContent({ product }: { product: Product }) {
    return (
        <div className="space-y-8 max-w-4xl">
            <div className="space-y-4 text-muted-foreground leading-relaxed font-medium">
                <h3 className="text-foreground font-black text-xl mb-4">Product Details</h3>
                <p>{product.description}</p>
                <p>Experience the perfect blend of style and comfort. This performance-driven equipment is designed to meet the highest standards of durability and functionality, ensuring you stay at the top of your game.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 pt-4">
                {[
                    { label: "Package Dimensions", value: `${product.dimensions.width} x ${product.dimensions.height} x ${product.dimensions.depth} cm; ${product.weight} g` },
                    { label: "Specification", value: product.warrantyInformation },
                    { label: "Date First Available", value: product.meta.createdAt.split('T')[0] },
                    { label: "Department", value: product.category },
                    { label: "SKU", value: product.sku },
                    { label: "Minimum Order", value: `${product.minimumOrderQuantity} units` },
                ].map((item) => (
                    <div key={item.label} className="flex gap-4 border-b border-border/40 pb-3 text-sm">
                        <span className="text-muted-foreground font-bold w-40 shrink-0 uppercase tracking-wider text-[11px]">{item.label}</span>
                        <span className="text-foreground font-black uppercase text-[11px]">: {item.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function StylingIdeas({ currentProduct, recommendations }: { currentProduct: Product, recommendations: Product[] }) {
    const bundleProducts = recommendations.slice(0, 3);
    const totalOriginal = currentProduct.price + bundleProducts.reduce((sum, p) => sum + p.price, 0);
    const totalDiscounted = (currentProduct.price * (1 - currentProduct.discountPercentage / 100)) +
        bundleProducts.reduce((sum, p) => sum + (p.price * (1 - p.discountPercentage / 100)), 0);
    const totalSavings = totalOriginal - totalDiscounted;

    return (
        <div className="bg-muted/10 rounded-[40px] p-8 mt-4 border border-border/50">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black italic tracking-tight">Styling Ideas</h3>
                <button className="text-xs font-black text-primary hover:underline uppercase tracking-widest">See more</button>
            </div>

            <div className="flex flex-col lg:flex-row items-center gap-8">
                <div className="flex items-center gap-4">
                    <div className="w-32 h-32 rounded-3xl bg-background border flex items-center justify-center p-4">
                        <img src={currentProduct.thumbnail} alt={currentProduct.title} className="object-cover" />
                    </div>
                    <div className="h-10 w-10 rounded-full bg-foreground text-background flex items-center justify-center font-black shadow-xl">+</div>
                    <div className="grid grid-cols-3 gap-3">
                        {bundleProducts.map((p, i) => (
                            <Link key={p.id} href={`/products/${p.id}`}>
                                <div className="w-32 h-32 rounded-3xl bg-background border p-4 group cursor-pointer hover:border-primary transition-all">
                                    <img src={p.thumbnail} alt={p.title} className="h-16 w-full object-cover mb-2 group-hover:scale-110 transition-transform" />
                                    <div className="text-[10px] font-black truncate uppercase">{p.title}</div>
                                    <div className="text-[10px] font-bold text-muted-foreground">${(p.price * (1 - p.discountPercentage / 100)).toFixed(2)}</div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="hidden lg:block h-32 w-px bg-border/40" />

                <div className="flex-1 w-full lg:w-auto p-4 space-y-4">
                    <div className="flex justify-between items-center text-sm font-black">
                        <span className="text-muted-foreground uppercase">Total Bundle</span>
                        <span className="text-2xl">${totalDiscounted.toFixed(2)}</span>
                    </div>
                    <div className="text-xs font-bold text-green-600 bg-green-500/10 px-3 py-1.5 rounded-lg w-fit">Save ${totalSavings.toFixed(2)}</div>
                    <Button className="w-full h-12 rounded-xl bg-foreground text-background font-black shadow-xl">Add Bundle to Bag</Button>
                </div>
            </div>
        </div>
    )
}

import Link from "next/link";

function ReviewContent({ product }: { product: Product }) {
    return (
        <div className="space-y-12">
            <div className="flex flex-col lg:flex-row gap-8 items-center bg-muted/10 p-10 rounded-[40px] border border-border/50">
                <div className="flex flex-col items-center gap-2 shrink-0">
                    <div className="h-24 w-24 rounded-full border-8 border-foreground flex items-center justify-center text-3xl font-black italic">
                        {product.rating}
                    </div>
                    <div className="text-center">
                        <p className="text-xs font-black uppercase tracking-widest mt-2">{product.reviews.length} Reviews</p>
                    </div>
                </div>

                <div className="flex-1 w-full space-y-4 px-4 border-x border-border/40">
                    <div className="text-lg font-black tracking-tighter uppercase italic leading-none">
                        95% of buyers are satisfied
                    </div>
                    <div className="space-y-2 pt-2">
                        {[5, 4, 3, 2, 1].map(star => (
                            <div key={star} className="flex items-center gap-4 text-[10px] font-bold text-muted-foreground">
                                <span className="w-2">{star}</span>
                                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                                    <div className="h-full bg-foreground" style={{ width: star === 5 ? '80%' : star === 4 ? '15%' : '2%' }} />
                                </div>
                                <span className="w-10 text-right">{star === 5 ? '155' : star === 4 ? '33' : '2'}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 max-w-xs shrink-0">
                    {["All (168)", "Pic/Review (112)", "Fast Shipping (45)", "Good Quality (12)", "5 Stars (136)"].map(tag => (
                        <Badge key={tag} variant="outline" className="rounded-xl font-bold border-2 h-8 px-4 text-[10px] hover:bg-primary/10 transition-colors cursor-pointer">{tag}</Badge>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {product.reviews.map((review, i) => (
                    <Card key={i} className="border-none bg-transparent shadow-none hover:bg-muted/5 transition-colors p-2 rounded-[32px]">
                        <CardContent className="p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <StarRating rating={review.rating} />
                                <span className="text-[10px] font-black text-muted-foreground uppercase">{new Date(review.date).toLocaleDateString()}</span>
                            </div>
                            <div>
                                <h4 className="font-black text-sm uppercase mb-1 tracking-tight">Best experience ever!</h4>
                                <p className="text-xs font-bold text-muted-foreground mb-4">Color: Black • Size: XL</p>
                                <p className="text-xs font-medium leading-relaxed text-muted-foreground line-clamp-4">{review.comment}</p>
                            </div>
                            <div className="flex items-center gap-6 pt-2">
                                <button className="flex items-center gap-2 text-[10px] font-black text-muted-foreground hover:text-foreground"><Heart className="h-3 w-3" /> {Math.floor(Math.random() * 50)}</button>
                                <button className="flex items-center gap-2 text-[10px] font-black text-muted-foreground hover:text-foreground"><MessageSquare className="h-3 w-3" /> 0</button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
