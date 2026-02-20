"use client";

import { useAppSelector } from "@/store/hooks";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export default function OrderSummary() {
    const { items, totalAmount } = useAppSelector((state) => state.cart);
    const shipping = totalAmount > 200 ? 0 : 15;
    const tax = totalAmount * 0.08;
    const finalTotal = totalAmount + shipping + tax;

    return (
        <div className="bg-background rounded-[32px] border border-border/50 shadow-2xl shadow-black/5 overflow-hidden">
            <div className="p-8 border-b border-border/50 bg-muted/20">
                <h2 className="text-xl font-black italic tracking-tight uppercase">Order Summary</h2>
            </div>

            <div className="p-8 space-y-6">
                {/* Items List */}
                <div className="space-y-4 max-h-[300px] overflow-y-auto no-scrollbar pr-2">
                    {items.map((item) => (
                        <div key={item.id} className="flex gap-4 group">
                            <div className="relative w-16 h-16 rounded-xl bg-muted/40 overflow-hidden shrink-0 border border-border/10">
                                <Image
                                    src={item.thumbnail}
                                    alt={item.title}
                                    fill
                                    className="object-contain p-2"
                                    sizes="64px"
                                />
                                <Badge className="absolute -top-1 -right-1 h-5 min-w-[20px] rounded-full px-1 flex items-center justify-center text-[10px] font-black bg-primary border-none text-primary-foreground shadow-lg">
                                    {item.quantity}
                                </Badge>
                            </div>
                            <div className="flex flex-col justify-center gap-0.5">
                                <h4 className="text-xs font-bold leading-tight group-hover:text-primary transition-colors line-clamp-1">
                                    {item.title.toUpperCase()}
                                </h4>
                                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest italic">
                                    ${item.price.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="space-y-3 pt-4 border-t border-border/50">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground font-medium">Subtotal</span>
                        <span className="font-bold">${totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground font-medium">Shipping</span>
                        <span className="font-bold text-green-600">
                            {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground font-medium">Estimated Tax</span>
                        <span className="font-bold">${tax.toFixed(2)}</span>
                    </div>
                </div>

                <div className="pt-6 border-t border-border/50">
                    <div className="flex justify-between items-baseline">
                        <span className="text-lg font-black italic tracking-tight uppercase">Total</span>
                        <span className="text-3xl font-black italic tracking-tighter text-primary">
                            ${finalTotal.toFixed(2)}
                        </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-2 font-medium italic">
                        {shipping === 0
                            ? "✨ You unlocked FREE express shipping!"
                            : `Add $${(200 - totalAmount).toFixed(2)} more for FREE shipping.`}
                    </p>
                </div>
            </div>
        </div>
    );
}
