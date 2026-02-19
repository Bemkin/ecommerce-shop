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
        description: "Redefine Your Everyday Style with our premium collection.",
        image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1200&h=600",
        color: "bg-blue-600/10",
    },
    {
        id: 2,
        title: "Summer Collection",
        subtitle: "New Arrivals",
        description: "Explore the latest trends in high-end fashion and accessories.",
        image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=1200&h=600",
        color: "bg-purple-600/10",
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
        <div className="relative group overflow-hidden rounded-[40px] bg-card border border-border aspect-[2.4/1] md:aspect-[2.8/1] mb-16 shadow-sm">
            <AnimatePresence mode="wait">
                <motion.div
                    key={current}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className={`absolute inset-0 flex items-center`}
                >
                    <div className="relative z-10 w-full h-full max-w-7xl mx-auto px-8 md:px-16 grid md:grid-cols-2 gap-8 items-center">
                        <div className="space-y-6 max-w-lg">
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
                                className="text-4xl md:text-[52px] font-black tracking-tighter leading-[0.9] text-foreground"
                            >
                                {slides[current].title}
                                <span className="block text-primary/90 mt-2">{slides[current].subtitle}</span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="text-muted-foreground text-sm md:text-base font-medium leading-relaxed max-w-sm"
                            >
                                {slides[current].description}
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="pt-6 flex flex-wrap gap-4"
                            >
                                <Button size="lg" className="h-14 px-10 rounded-2xl font-black italic tracking-tight text-base bg-primary shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                                    SHOP NOW
                                    <ChevronRight className="ml-2 h-5 w-5" />
                                </Button>
                                <Link href="#flash-sale">
                                    <Button size="lg" variant="ghost" className="h-14 px-10 rounded-2xl font-black italic tracking-tight text-base border-2 hover:bg-primary/5 transition-all text-muted-foreground hover:text-primary">
                                        VIEW DEALS
                                    </Button>
                                </Link>
                            </motion.div>
                        </div>

                        <div className="hidden md:block absolute right-0 top-0 bottom-0 w-[55%] pointer-events-none">
                            <motion.div
                                key={current + "-img"}
                                initial={{ scale: 1.1, opacity: 0, x: 50 }}
                                animate={{ scale: 1, opacity: 1, x: 0 }}
                                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                                className="w-full h-full relative"
                            >
                                <img
                                    src={slides[current].image}
                                    className="w-full h-full object-cover"
                                    alt="Promo"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-card via-card/40 to-transparent" />
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Controls */}
            <Button
                variant="ghost"
                size="icon"
                onClick={prev}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-background/20 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
            >
                <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                onClick={next}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-background/20 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
            >
                <ChevronRight className="h-6 w-6" />
            </Button>

            {/* Pagination dots */}
            <div className="absolute bottom-6 left-8 md:left-16 flex gap-2">
                {slides.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrent(i)}
                        className={`h-1.5 transition-all rounded-full ${current === i ? "w-8 bg-primary" : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"}`}
                    />
                ))}
            </div>
        </div>
    );
}
