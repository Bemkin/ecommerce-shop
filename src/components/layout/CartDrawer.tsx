"use client";

import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
    removeFromCart,
    updateQuantity,
    clearCart,
    setCartOpen,
} from "@/store/slices/cartSlice";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function CartDrawer() {
    const dispatch = useAppDispatch();
    const { items, isOpen } = useAppSelector((state) => state.cart);
    const [mounted, setMounted] = useState(false);

    const [checkoutState, setCheckoutState] = useState<"idle" | "processing" | "success">("idle");

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleCheckout = () => {
        dispatch(setCartOpen(false));
        // Navigation will be handled by Link or useRouter if needed, 
        // but since we are using a Link in the button below, we just close the drawer.
    };

    if (!mounted) return null;

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <Sheet open={isOpen} onOpenChange={(open) => {
            dispatch(setCartOpen(open));
            if (!open) setTimeout(() => setCheckoutState("idle"), 500);
        }}>
            <SheetContent className="flex w-full flex-col pr-0 sm:max-w-md border-l bg-background shadow-2xl p-0 overflow-hidden">
                <SheetHeader className="px-4 sm:px-6 py-5 border-b">
                    <SheetTitle className="flex items-center gap-3 text-2xl font-black italic tracking-tight">
                        <ShoppingBag className="w-6 h-6 text-primary" />
                        MY BAG
                        {totalItems > 0 && (
                            <div className="ml-auto flex items-center gap-3">
                                <span className="text-xs font-black bg-primary/10 text-primary px-2 py-1 rounded-full not-italic tracking-normal">
                                    {totalItems} {totalItems === 1 ? 'UNIT' : 'UNITS'}
                                </span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => dispatch(clearCart())}
                                    className="h-8 px-2 text-[10px] font-black italic tracking-widest uppercase text-muted-foreground/50 hover:text-destructive hover:bg-destructive/5 transition-all rounded-lg gap-1.5"
                                >
                                    <Trash2 className="w-3 h-3" />
                                    CLEAR ALL
                                </Button>
                            </div>
                        )}
                    </SheetTitle>
                </SheetHeader>

                <div className="flex flex-1 flex-col overflow-hidden relative">
                    <AnimatePresence mode="wait">
                        {checkoutState === "idle" ? (
                            <motion.div
                                key="idle"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-1 flex-col overflow-hidden px-6"
                            >
                                {items.length === 0 ? (
                                    <div className="flex flex-1 flex-col items-center justify-center space-y-6 text-center py-12">
                                        <motion.div
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            className="w-24 h-24 rounded-full bg-muted/30 flex items-center justify-center relative"
                                        >
                                            <ShoppingBag className="w-10 h-10 text-muted-foreground/30" />
                                            <div className="absolute inset-0 rounded-full border-2 border-dashed border-muted-foreground/20 animate-[spin_10s_linear_infinite]" />
                                        </motion.div>
                                        <div className="space-y-2">
                                            <h3 className="text-xl font-black italic tracking-tight">YOUR BAG IS EMPTY</h3>
                                            <p className="text-sm text-muted-foreground max-w-[240px] mx-auto font-medium">
                                                Time to find some treasures. Let&apos;s get you started!
                                            </p>
                                        </div>
                                        <Button
                                            onClick={() => dispatch(setCartOpen(false))}
                                            className="h-12 px-8 rounded-xl font-black italic tracking-widest text-[11px] uppercase bg-foreground text-background hover:scale-105 transition-all shadow-xl shadow-foreground/10"
                                        >
                                            CONTINUE SHOPPING
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex-1 overflow-y-auto -mr-6 pr-6 py-6 space-y-8 no-scrollbar">
                                        <AnimatePresence initial={false}>
                                            {items.map((item, i) => (
                                                <motion.div
                                                    key={`${item.id}-${item.selectedVariant}`}
                                                    layout
                                                    initial={{ opacity: 0, x: 20 }}
                                                    animate={{ opacity: 1, x: 0, transition: { delay: i * 0.05 } }}
                                                    exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                                                    className="flex gap-5 group"
                                                >
                                                    <div className="relative h-28 w-28 flex-shrink-0 overflow-hidden rounded-2xl border bg-muted/30 shadow-sm transition-all group-hover:shadow-md group-hover:border-primary/20">
                                                        <Image
                                                            src={item.thumbnail}
                                                            alt={item.title}
                                                            fill
                                                            className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                                                        />
                                                    </div>

                                                    <div className="flex flex-1 flex-col justify-between py-1">
                                                        <div>
                                                            <div className="flex justify-between items-start">
                                                                <h3 className="text-[13px] font-black leading-tight group-hover:text-primary transition-colors pr-2">
                                                                    <Link
                                                                        href={`/products/${item.id}`}
                                                                        onClick={() => dispatch(setCartOpen(false))}
                                                                    >
                                                                        {item.title.toUpperCase()}
                                                                    </Link>
                                                                </h3>
                                                                <p className="text-[14px] font-black italic tracking-tight">${item.price}</p>
                                                            </div>
                                                            {item.selectedVariant && (
                                                                <span className="inline-block mt-2 px-2 py-0.5 rounded-md bg-muted text-[10px] font-black uppercase italic tracking-widest text-muted-foreground">
                                                                    {item.selectedVariant}
                                                                </span>
                                                            )}
                                                        </div>

                                                        <div className="flex items-center justify-between mt-auto">
                                                            <div className="flex items-center border border-border/50 bg-background rounded-xl overflow-hidden shadow-sm h-8">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-full w-8 rounded-none hover:bg-muted"
                                                                    onClick={() => dispatch(updateQuantity({
                                                                        id: item.id,
                                                                        selectedVariant: item.selectedVariant,
                                                                        quantity: item.quantity - 1
                                                                    }))}
                                                                >
                                                                    <Minus className="h-3 w-3" />
                                                                </Button>
                                                                <span className="w-8 text-center text-[13px] font-black tabular-nums">
                                                                    {item.quantity}
                                                                </span>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-full w-8 rounded-none hover:bg-muted"
                                                                    onClick={() => dispatch(updateQuantity({
                                                                        id: item.id,
                                                                        selectedVariant: item.selectedVariant,
                                                                        quantity: item.quantity + 1
                                                                    }))}
                                                                >
                                                                    <Plus className="h-3 w-3" />
                                                                </Button>
                                                            </div>

                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-muted-foreground/40 hover:text-destructive hover:bg-destructive/5 transition-all opacity-0 group-hover:opacity-100 rounded-lg"
                                                                onClick={() => dispatch(removeFromCart({
                                                                    id: item.id,
                                                                    selectedVariant: item.selectedVariant
                                                                }))}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </div>
                                )}
                            </motion.div>
                        ) : checkoutState === "processing" ? (
                            <motion.div
                                key="processing"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.05 }}
                                className="flex flex-1 flex-col items-center justify-center p-8 text-center space-y-6"
                            >
                                <div className="relative w-20 h-20">
                                    <div className="absolute inset-0 rounded-full border-4 border-muted/20" />
                                    <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black italic tracking-tight">SECURE CHECKOUT</h3>
                                    <p className="text-muted-foreground font-medium animate-pulse text-sm">Processing your premium order...</p>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-1 flex-col items-center justify-center p-8 text-center space-y-6"
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", damping: 12, stiffness: 200 }}
                                    className="w-24 h-24 rounded-full bg-green-500/10 flex items-center justify-center text-green-500"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                </motion.div>
                                <div className="space-y-2">
                                    <h3 className="text-3xl font-black italic tracking-tight">THANK YOU!</h3>
                                    <p className="text-muted-foreground font-medium">Your order has been placed successfully.</p>
                                </div>
                                <p className="text-xs text-muted-foreground/60 pt-4">Closing drawer in a moment...</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {items.length > 0 && checkoutState === "idle" && (
                    <div className="px-6 py-8 border-t bg-muted/20 space-y-6">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-muted-foreground text-sm font-medium">
                                <span>Estimated Shipping</span>
                                <span className="text-foreground italic font-black">FREE</span>
                            </div>
                            <div className="flex items-center justify-between border-t border-border/10 pt-3">
                                <span className="text-lg font-black italic tracking-tight">TOTAL</span>
                                <span className="text-2xl tabular-nums font-black">${subtotal.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="grid gap-3">
                            <Button
                                asChild
                                onClick={handleCheckout}
                                className="w-full h-14 text-sm font-black italic tracking-widest uppercase rounded-2xl bg-primary shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all group cursor-pointer"
                            >
                                <Link href="/checkout">
                                    PROCEED TO CHECKOUT
                                    <ShoppingBag className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </Button>
                            <p className="text-[10px] text-center text-muted-foreground/60 font-medium px-4">
                                Secure payment powered by standard demo processing. No real charges will be applied.
                            </p>
                        </div>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}
