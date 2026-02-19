"use client";

import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
    removeFromCart,
    updateQuantity,
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

export default function CartDrawer() {
    const dispatch = useAppDispatch();
    const { items, isOpen } = useAppSelector((state) => state.cart);

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <Sheet open={isOpen} onOpenChange={(open) => dispatch(setCartOpen(open))}>
            <SheetContent className="flex w-full flex-col pr-0 sm:max-w-md border-l bg-background/95 backdrop-blur-xl">
                <SheetHeader className="px-6">
                    <SheetTitle className="flex items-center gap-2 text-2xl font-bold tracking-tight">
                        <ShoppingBag className="w-6 h-6 text-primary" />
                        My Bag
                        {totalItems > 0 && (
                            <span className="ml-2 text-sm font-normal text-muted-foreground">
                                ({totalItems} {totalItems === 1 ? 'item' : 'items'})
                            </span>
                        )}
                    </SheetTitle>
                </SheetHeader>

                <div className="flex flex-1 flex-col overflow-hidden px-6 pt-4">
                    <Separator className="mb-4" />

                    {items.length === 0 ? (
                        <div className="flex flex-1 flex-col items-center justify-center space-y-4 text-center">
                            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                                <ShoppingBag className="w-10 h-10 text-muted-foreground/50" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-xl font-semibold">Your bag is empty</p>
                                <p className="text-sm text-muted-foreground">
                                    Looks like you haven&apos;t added anything yet.
                                </p>
                            </div>
                            <Button
                                variant="outline"
                                onClick={() => dispatch(setCartOpen(false))}
                                className="mt-4"
                            >
                                Start Shopping
                            </Button>
                        </div>
                    ) : (
                        <div className="flex-1 overflow-y-auto -mr-6 pr-6 py-2 scrollbar-thin scrollbar-thumb-muted-foreground/20">
                            <AnimatePresence initial={false}>
                                <div className="space-y-6 pb-20">
                                    {items.map((item) => (
                                        <motion.div
                                            key={`${item.id}-${item.selectedVariant}`}
                                            layout
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="flex gap-4 group"
                                        >
                                            <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl border bg-muted">
                                                <Image
                                                    src={item.thumbnail}
                                                    alt={item.title}
                                                    fill
                                                    className="h-full w-full object-cover object-center transition-transform hover:scale-110"
                                                />
                                            </div>

                                            <div className="flex flex-1 flex-col justify-between py-0.5">
                                                <div>
                                                    <div className="flex justify-between text-base font-medium">
                                                        <h3 className="line-clamp-1">
                                                            <Link
                                                                href={`/products/${item.id}`}
                                                                onClick={() => dispatch(setCartOpen(false))}
                                                                className="hover:text-primary transition-colors"
                                                            >
                                                                {item.title}
                                                            </Link>
                                                        </h3>
                                                        <p className="ml-4 tabular-nums font-semibold">${item.price}</p>
                                                    </div>
                                                    {item.selectedVariant && (
                                                        <p className="mt-1 text-sm text-muted-foreground">
                                                            Variant: <span className="text-foreground">{item.selectedVariant}</span>
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="flex items-center justify-between mt-2">
                                                    <div className="flex items-center rounded-lg border bg-muted/50 p-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-7 w-7 rounded-md hover:bg-background shadow-none"
                                                            onClick={() => dispatch(updateQuantity({
                                                                id: item.id,
                                                                selectedVariant: item.selectedVariant,
                                                                quantity: item.quantity - 1
                                                            }))}
                                                        >
                                                            <Minus className="h-3 w-3" />
                                                        </Button>
                                                        <span className="w-8 text-center text-sm font-medium tabular-nums">
                                                            {item.quantity}
                                                        </span>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-7 w-7 rounded-md hover:bg-background shadow-none"
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
                                                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all opacity-0 group-hover:opacity-100"
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
                                </div>
                            </AnimatePresence>
                        </div>
                    )}
                </div>

                {items.length > 0 && (
                    <SheetFooter className="mt-auto px-6 py-8 border-t bg-muted/20">
                        <div className="w-full space-y-4">
                            <div className="flex items-center justify-between text-base font-semibold">
                                <span>Subtotal</span>
                                <span className="text-xl tabular-nums font-bold">${subtotal.toFixed(2)}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Shipping and taxes calculated at checkout.
                            </p>
                            <div className="grid gap-3 pt-2">
                                <Button className="w-full h-12 text-base font-semibold shadow-premium-hover hover:scale-[1.02] active:scale-95 transition-all">
                                    Checkout
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full h-11"
                                    onClick={() => dispatch(setCartOpen(false))}
                                >
                                    Continue Shopping
                                </Button>
                            </div>
                        </div>
                    </SheetFooter>
                )}
            </SheetContent>
        </Sheet>
    );
}
