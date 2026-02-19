"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Timer, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Product } from "@/lib/types";
import Link from "next/link";
import { StarRating } from "@/components/shared";

interface FlashSaleProps {
    products: Product[];
}

export default function FlashSale({ products }: FlashSaleProps) {
    const [timeLeft, setTimeLeft] = useState({ h: 2, m: 17, s: 56 });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev.s > 0) return { ...prev, s: prev.s - 1 };
                if (prev.m > 0) return { ...prev, m: prev.m - 1, s: 59 };
                if (prev.h > 0) return { ...prev, h: prev.h - 1, m: 59, s: 59 };
                return prev;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    if (!products.length) return null;

    return (
        <section id="flash-sale" className="mb-24 scroll-mt-28">
            <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-foreground text-background shadow-xl">
                            <Timer className="h-6 w-6" />
                        </div>
                        <h2 className="text-2xl font-black tracking-tight uppercase italic">Flash Sale</h2>
                    </div>

                    <div className="h-10 w-px bg-border hidden sm:block" />

                    <div className="flex items-center gap-2 font-mono font-black text-xl ml-2">
                        <span className="bg-destructive text-destructive-foreground px-3 py-1.5 rounded-xl tabular-nums shadow-lg shadow-destructive/10">{timeLeft.h.toString().padStart(2, '0')}</span>
                        <span className="text-destructive animate-pulse">:</span>
                        <span className="bg-destructive text-destructive-foreground px-3 py-1.5 rounded-xl tabular-nums shadow-lg shadow-destructive/10">{timeLeft.m.toString().padStart(2, '0')}</span>
                        <span className="text-destructive animate-pulse">:</span>
                        <span className="bg-destructive text-destructive-foreground px-3 py-1.5 rounded-xl tabular-nums shadow-lg shadow-destructive/10">{timeLeft.s.toString().padStart(2, '0')}</span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex gap-2 mr-2">
                        <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl bg-card border-border hover:bg-muted transition-all shadow-sm"><ChevronLeft className="h-5 w-5" /></Button>
                        <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl bg-foreground text-background border-none hover:opacity-90 transition-all shadow-md"><ChevronRight className="h-5 w-5" /></Button>
                    </div>
                    <Button variant="ghost" className="text-[11px] font-black tracking-[0.2em] italic hover:bg-primary/5 uppercase pb-0">
                        SEE ALL <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {products.map((product) => {
                    const discountedPrice = product.price * (1 - product.discountPercentage / 100);
                    return (
                        <Link key={product.id} href={`/products/${product.id}`}>
                            <motion.div
                                whileHover={{ y: -8 }}
                                className="group relative bg-card border border-border rounded-2xl p-5 overflow-hidden transition-all duration-300 hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.06)] hover:border-primary/20 cursor-pointer h-full flex flex-col"
                            >
                                <div className="absolute top-4 left-4 z-10 bg-destructive text-white text-[9px] font-black px-2.5 py-1 rounded-lg shadow-lg flex items-center gap-1.5 uppercase italic tracking-tighter">
                                    <div className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                                    FLASH -{Math.round(product.discountPercentage)}%
                                </div>
                                <div className="aspect-square rounded-xl bg-muted/20 overflow-hidden mb-5 relative group-hover:scale-105 transition-transform duration-700">
                                    <img
                                        src={product.thumbnail}
                                        alt={product.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <span className="text-[9px] font-black text-primary uppercase tracking-[0.1em] italic mb-1.5">
                                    {product.category}
                                </span>
                                <h3 className="font-bold text-[14px] leading-[1.2] line-clamp-2 min-h-[2.4rem] mb-2">{product.title}</h3>

                                <div className="flex items-baseline gap-2 mb-4">
                                    <span className="text-foreground font-black text-lg leading-none">${discountedPrice.toFixed(2)}</span>
                                    <span className="text-[10px] text-muted-foreground line-through leading-none">${product.price.toFixed(2)}</span>
                                </div>

                                <div className="mt-auto space-y-4">
                                    <StarRating
                                        rating={product.rating}
                                        reviewsCount={product.reviews.length}
                                    />
                                    <div className="flex flex-col gap-2">
                                        <div className="flex justify-between items-center text-[10px] font-bold tracking-tight">
                                            <span className="text-destructive italic uppercase font-black">Ends in {timeLeft.h}:{timeLeft.m}:{timeLeft.s}</span>
                                            <span className="text-muted-foreground uppercase">{product.stock} left</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                            <motion.div
                                                className="h-full bg-destructive/80 rounded-full"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${Math.min(100, (product.stock / 150) * 100)}%` }}
                                                transition={{ duration: 1 }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}
