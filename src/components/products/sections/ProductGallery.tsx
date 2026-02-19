"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, ChevronDown, Maximize2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

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
            <Dialog>
                <div className="relative flex-1 aspect-square rounded-[32px] bg-muted/20 border border-border/50 overflow-hidden group">
                    <DialogTrigger asChild>
                        <button className="w-full h-full cursor-zoom-in relative">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={selectedImage}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.05 }}
                                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                    className="relative w-full h-full text-center flex items-center justify-center p-8"
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
                                <Button variant="outline" size="icon" className="h-10 w-10 rounded-full bg-background/80 backdrop-blur-md pointer-events-none">
                                    <Maximize2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </button>
                    </DialogTrigger>

                    {/* Navigation Arrows for Main View */}
                    {images.length > 1 && (
                        <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none z-10">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-12 w-12 rounded-full bg-background/40 backdrop-blur-sm pointer-events-auto opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); prevImage(); }}
                            >
                                <ChevronLeft className="h-6 w-6" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-12 w-12 rounded-full bg-background/40 backdrop-blur-sm pointer-events-auto opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); nextImage(); }}
                            >
                                <ChevronRight className="h-6 w-6" />
                            </Button>
                        </div>
                    )}
                </div>

                <DialogContent className="max-w-[95vw] h-[90vh] p-0 border-none bg-transparent shadow-none flex flex-col items-center justify-center gap-4 outline-none sm:rounded-[40px]">
                    <DialogTitle className="sr-only">Product Image Gallery - {title}</DialogTitle>
                    <DialogDescription className="sr-only">
                        Full screen view of {title}. Use left and right arrows to navigate.
                    </DialogDescription>
                    <div className="relative w-full h-full flex items-center justify-center bg-black/50 backdrop-blur-3xl rounded-[40px] overflow-hidden group/lightbox">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`lightbox-${selectedImage}`}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="relative w-full h-full flex items-center justify-center"
                            >
                                <Image
                                    src={images[selectedImage]}
                                    alt={title}
                                    fill
                                    className="object-contain p-4 lg:p-12 select-none"
                                />
                            </motion.div>
                        </AnimatePresence>

                        {/* Lightbox Navigation */}
                        {images.length > 1 && (
                            <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none z-50">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-16 w-16 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md pointer-events-auto transition-all active:scale-90"
                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); prevImage(); }}
                                >
                                    <ChevronLeft className="h-10 w-10" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-16 w-16 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md pointer-events-auto transition-all active:scale-90"
                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); nextImage(); }}
                                >
                                    <ChevronRight className="h-10 w-10" />
                                </Button>
                            </div>
                        )}

                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-6 py-2 bg-black/40 backdrop-blur-md rounded-full text-white text-xs font-black tracking-widest uppercase flex gap-4 z-50">
                            {images.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setSelectedImage(i)}
                                    className={`h-1.5 w-1.5 rounded-full transition-all ${i === selectedImage ? "bg-white w-6" : "bg-white/30"}`}
                                />
                            ))}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
