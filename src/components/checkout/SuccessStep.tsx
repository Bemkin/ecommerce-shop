"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { resetCheckout } from "@/store/slices/checkoutSlice";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ShoppingBag, ArrowRight, Package, Mail } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { clearCart } from "@/store/slices/cartSlice";
import confetti from "canvas-confetti";

export default function SuccessStep() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        // Trigger confetti
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: any = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);

        return () => {
            clearInterval(interval);
            // We don't reset here, we let the user click the button or navigate away
        };
    }, [dispatch]);

    const handleBackToHome = () => {
        dispatch(clearCart());
        dispatch(resetCheckout());
    };

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center py-12 px-4 text-center">
            <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", damping: 10, stiffness: 200, delay: 0.2 }}
                className="w-24 h-24 md:w-32 md:h-32 rounded-[40px] bg-primary flex items-center justify-center text-primary-foreground shadow-2xl shadow-primary/40 mb-10"
            >
                <CheckCircle2 className="w-12 h-12 md:w-16 md:h-16" />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-6 max-w-2xl"
            >
                <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase leading-[0.9]">
                    Order <span className="text-primary/90">Confirmed!</span>
                </h1>
                <p className="text-muted-foreground text-lg md:text-xl font-medium max-w-lg mx-auto leading-relaxed">
                    Thank you for your premium purchase. Your style upgrade is currently being prepared for shipment.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8">
                    <div className="p-6 rounded-3xl bg-background border border-border/50 shadow-xl shadow-black/5 flex flex-col items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                            <Package className="w-5 h-5" />
                        </div>
                        <p className="text-[10px] font-black uppercase italic tracking-widest text-muted-foreground">Order ID</p>
                        <p className="font-mono font-black text-sm">#SHP-{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                    </div>
                    <div className="p-6 rounded-3xl bg-background border border-border/50 shadow-xl shadow-black/5 flex flex-col items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                            <Mail className="w-5 h-5" />
                        </div>
                        <p className="text-[10px] font-black uppercase italic tracking-widest text-muted-foreground">Confirmation</p>
                        <p className="font-bold text-sm">Sent to your email</p>
                    </div>
                </div>

                <div className="pt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button asChild onClick={handleBackToHome} size="lg" className="h-16 px-10 rounded-[28px] font-black italic tracking-widest uppercase text-sm bg-primary shadow-2xl shadow-primary/20 hover:scale-[1.05] active:scale-95 transition-all w-full sm:w-auto">
                        <Link href="/">
                            CONTINUE SHOPPING
                            <ShoppingBag className="ml-3 w-4 h-4" />
                        </Link>
                    </Button>
                    <Button asChild onClick={handleBackToHome} variant="outline" size="lg" className="h-16 px-10 rounded-[28px] font-black italic tracking-widest uppercase text-sm border-2 transition-all w-full sm:w-auto">
                        <Link href="/">
                            VIEW MY ORDERS
                            <ArrowRight className="ml-3 w-4 h-4" />
                        </Link>
                    </Button>
                </div>
            </motion.div>
        </div>
    );
}
