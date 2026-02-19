"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, ChevronDown, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductGalleryProps {
    images: string[];
    title: string;
}

export default function ProductGallery({ images, title }: ProductGalleryProps) {
    const [selectedImage, setSelectedImage] = useState(0);

    const nextImage = () => setSelectedImage((prev) => (prev + 1) % images.length);
    const prevImage = () => setSelectedImage((prev) => (prev - 1 + images.length) % images.length);

    return (
        <div className="flex flex-col-reverse lg:flex-row gap-4 h-full">
            {/* Thumbnails - Vertical on Desktop, Horizontal on Mobile */}
            <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto no-scrollbar lg:h-[500px] shrink-0">
                {images.map((img, idx) => (
                    <button
                        key={idx}
                        onClick={() => setSelectedImage(idx)}
                        className={`relative h-20 w-20 lg:h-24 lg:w-24 shrink-0 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${selectedImage === idx ? "border-primary shadow-lg scale-105" : "border-transparent hover:border-border"
                            }`}
                    >
                        <Image src={img} alt={`${title} thumbnail ${idx}`} fill className="object-cover" />
                    </button>
                ))}
            </div>

            {/* Main Image View */}
            <div className="relative flex-1 aspect-square rounded-[32px] bg-muted/20 border border-border/50 overflow-hidden group">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={selectedImage}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="relative w-full h-full"
                    >
                        <Image
                            src={images[selectedImage]}
                            alt={title}
                            fill
                            className="object-contain p-8"
                            priority
                        />
                    </motion.div>
                </AnimatePresence>

                {/* Floating Controls */}
                <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button variant="outline" size="icon" className="h-10 w-10 rounded-full bg-background/80 backdrop-blur-md">
                        <Maximize2 className="h-4 w-4" />
                    </Button>
                </div>

                {/* Navigation Arrows (Optional for UX) */}
                {images.length > 1 && (
                    <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-12 w-12 rounded-full bg-background/40 backdrop-blur-sm pointer-events-auto opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => { e.stopPropagation(); prevImage(); }}
                        >
                            <ChevronUp className="-rotate-90 h-6 w-6" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-12 w-12 rounded-full bg-background/40 backdrop-blur-sm pointer-events-auto opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => { e.stopPropagation(); nextImage(); }}
                        >
                            <ChevronDown className="-rotate-90 h-6 w-6" />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
