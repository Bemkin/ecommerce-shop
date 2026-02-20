"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

const slides = [
    {
        id: 1,
        title: "Limited Time Offer!",
        subtitle: "Up to 50% OFF!",
        description: "Redefine Your Everyday Style with our premium collection of Men's Shirts.",
        image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1200&h=600",
        color: "bg-blue-600/10",
        href: "/?category=mens-shirts",
    },
    {
        id: 2,
        title: "Summer Essentials",
        subtitle: "Hot New Arrivals",
        description: "Explore the latest trends in high-end Summer dresses and accessories.",
        image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=1200&h=600",
        color: "bg-purple-600/10",
        href: "/?category=womens-dresses",
    },
];

export default function HeroBanner() {
    const [current, setCurrent] = useState(0);

    const next = () => setCurrent((prev) => (prev + 1) % slides.length);
    const prev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

    useEffect(() => {
        const timer = setInterval(next, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative group overflow-hidden rounded-[32px] md:rounded-[40px] bg-card border border-border aspect-[0.8/1] sm:aspect-[1.8/1] md:aspect-[2.2/1] mb-12 md:mb-16 shadow-sm">
            <AnimatePresence mode="wait">
                <motion.div
                    key={current}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className={`absolute inset-0 flex items-center`}
                >
                    <div className="relative z-10 w-full h-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 items-stretch md:items-center">
                        {/* Content Container (Bottom on mobile, Left on desktop) */}
                        <div className="relative h-[42%] md:h-full flex items-center md:items-center px-6 md:px-16 z-20 order-2 md:order-1 bg-card/40 backdrop-blur-md md:bg-transparent md:backdrop-blur-none">
                            <div className="space-y-4 md:space-y-6 max-w-lg w-full">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <span className="text-muted-foreground font-black tracking-[0.2em] uppercase text-[10px] italic">
                                        # BIG FASHION SALE
                                    </span>
                                </motion.div>

                                <motion.h1
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3, duration: 0.6 }}
                                    className="text-3xl sm:text-4xl md:text-[52px] font-black tracking-tight leading-[0.95] md:leading-[0.9] text-foreground"
                                >
                                    {slides[current].title}
                                    <span className="block text-primary/90 mt-1.5 md:mt-2">{slides[current].subtitle}</span>
                                </motion.h1>

                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="text-muted-foreground text-sm md:text-base font-medium leading-relaxed max-w-sm line-clamp-2 md:line-clamp-none"
                                >
                                    {slides[current].description}
                                </motion.p>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="pt-2 md:pt-6 flex flex-col sm:flex-row gap-3 md:gap-4"
                                >
                                    <Button asChild size="lg" className="h-11 md:h-14 px-8 md:px-10 rounded-xl md:rounded-2xl font-black italic tracking-tight text-xs md:text-base bg-primary shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all w-full sm:w-auto">
                                        <Link href={slides[current].href}>
                                            SHOP NOW
                                            <ChevronRight className="ml-2 h-4 md:h-5 w-4 md:w-5" />
                                        </Link>
                                    </Button>
                                    <Button asChild size="lg" variant="outline" className="h-11 md:h-14 px-8 md:px-10 rounded-xl md:rounded-2xl font-black italic tracking-tight text-xs md:text-base border-2 hover:bg-primary/5 transition-all text-muted-foreground hover:text-primary backdrop-blur-sm w-full sm:w-auto">
                                        <Link href={slides[current].href}>
                                            VIEW DETAILS
                                        </Link>
                                    </Button>
                                </motion.div>
                            </div>
                        </div>

                        {/* Image Container (Top on mobile, Right on desktop) */}
                        <div className="relative h-[58%] md:h-full md:absolute md:right-0 md:top-0 md:bottom-0 md:w-[55%] order-1 md:order-2">
                            <motion.div
                                key={current + "-img"}
                                initial={{ scale: 1.1, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                                className="w-full h-full relative"
                            >
                                <img
                                    src={slides[current].image}
                                    className="w-full h-full object-cover"
                                    alt="Promo"
                                />
                                {/* Mobile Gradient (Bottom to Top) */}
                                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent md:hidden" />
                                {/* Desktop Gradient (Right to Left) */}
                                <div className="absolute inset-0 bg-gradient-to-r from-card/95 via-card/40 to-transparent hidden md:block" />
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Controls - Desktop Only */}
            <Button
                variant="ghost"
                size="icon"
                onClick={prev}
                className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-background/20 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity z-30"
            >
                <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                onClick={next}
                className="absolute hidden md:flex right-4 top-1/2 -translate-y-1/2 rounded-full bg-background/20 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity z-30"
            >
                <ChevronRight className="h-6 w-6" />
            </Button>

            {/* Pagination dots */}
            <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 flex gap-1.5 md:gap-2 z-30">
                {slides.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrent(i)}
                        className={`h-1.5 transition-all rounded-full ${current === i ? "w-8 bg-primary" : "w-1.5 bg-white/40 md:bg-muted-foreground/30 hover:bg-white/60"}`}
                    />
                ))}
            </div>
        </div>
    );
}
