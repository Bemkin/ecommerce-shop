"use client";

import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { setStep } from "@/store/slices/checkoutSlice";
import { clearCart } from "@/store/slices/cartSlice";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, CreditCard, ClipboardList, ArrowLeft, ShieldCheck, Truck } from "lucide-react";
import { motion } from "framer-motion";

export default function ReviewStep() {
    const dispatch = useAppDispatch();
    const { shippingData, paymentData } = useAppSelector((state) => state.checkout);
    const { items, totalAmount } = useAppSelector((state) => state.cart);

    const handleCompletePurchase = () => {
        // Here we would typically hit an API
        dispatch(setStep("success"));
        window.scrollTo(0, 0);
    };

    const shippingPrice = totalAmount > 200 ? 0 : 15;
    const tax = totalAmount * 0.08;
    const finalTotal = totalAmount + shippingPrice + tax;

    return (
        <div className="space-y-8">
            <div className="bg-background rounded-[32px] border border-border/50 shadow-2xl shadow-black/5 p-8 md:p-12">
                <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                        <ClipboardList className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black italic tracking-tighter uppercase leading-none">Review Order</h2>
                        <p className="text-sm text-muted-foreground font-medium mt-1">Double check everything before we ship.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Shipping Review */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-border/50">
                            <h3 className="text-[10px] font-black uppercase italic tracking-widest flex items-center gap-2">
                                <MapPin className="w-3.5 h-3.5 text-primary" />
                                Shipping To
                            </h3>
                            <button
                                onClick={() => dispatch(setStep("shipping"))}
                                className="text-[10px] font-black uppercase italic tracking-widest text-primary hover:underline"
                            >
                                Edit
                            </button>
                        </div>
                        <div className="space-y-1">
                            <p className="font-black uppercase italic text-sm">{shippingData.name}</p>
                            <p className="text-sm text-muted-foreground font-medium">{shippingData.address}</p>
                            <p className="text-sm text-muted-foreground font-medium">{shippingData.city}, {shippingData.zip}</p>
                            <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">{shippingData.country}</p>
                        </div>
                    </div>

                    {/* Payment Review */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-border/50">
                            <h3 className="text-[10px] font-black uppercase italic tracking-widest flex items-center gap-2">
                                <CreditCard className="w-3.5 h-3.5 text-primary" />
                                Payment Method
                            </h3>
                            <button
                                onClick={() => dispatch(setStep("payment"))}
                                className="text-[10px] font-black uppercase italic tracking-widest text-primary hover:underline"
                            >
                                Edit
                            </button>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-8 rounded bg-slate-900 flex items-center justify-center text-white text-[8px] font-bold tracking-tighter shadow-sm">
                                VISA
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-black tracking-widest">
                                    **** **** **** {paymentData.cardNumber.slice(-4)}
                                </p>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest italic leading-none">
                                    Expires {paymentData.expiry}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Secure Trust Badges */}
                <div className="mt-12 flex flex-wrap gap-4 pt-8 border-t border-border/10">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/5 border border-green-500/10">
                        <ShieldCheck className="w-4 h-4 text-green-600" />
                        <span className="text-[10px] font-black uppercase italic tracking-widest text-green-700">Buyer Protection Active</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/5 border border-blue-500/10">
                        <Truck className="w-4 h-4 text-blue-600" />
                        <span className="text-[10px] font-black uppercase italic tracking-widest text-blue-700">Express Delivery Confirmed</span>
                    </div>
                </div>
            </div>

            {/* Mobile-visible Total Summary (redundant but good for UX) */}
            <div className="lg:hidden bg-background rounded-[32px] border border-border/50 shadow-2xl p-8 space-y-6">
                <div className="flex justify-between items-baseline">
                    <span className="text-sm font-black italic tracking-tight uppercase text-muted-foreground">Order Total</span>
                    <span className="text-3xl font-black italic tracking-tighter text-primary">
                        ${finalTotal.toFixed(2)}
                    </span>
                </div>
                <Button
                    onClick={handleCompletePurchase}
                    className="w-full h-16 rounded-2xl font-black italic tracking-widest uppercase text-base bg-primary shadow-2xl shadow-primary/20 hover:scale-[1.05] active:scale-95 transition-all group"
                >
                    Complete Purchase
                </Button>
            </div>

            <div className="flex gap-4">
                <Button
                    variant="outline"
                    onClick={() => dispatch(setStep("payment"))}
                    className="h-16 px-10 rounded-[24px] font-black italic tracking-widest uppercase text-xs border-2 transition-all hidden lg:flex"
                >
                    <ArrowLeft className="mr-2 w-4 h-4" />
                    Back
                </Button>
                <Button
                    onClick={handleCompletePurchase}
                    className="flex-1 h-16 rounded-[24px] font-black italic tracking-widest uppercase text-base bg-primary shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all hidden lg:flex"
                >
                    Complete Purchase
                </Button>
            </div>
        </div>
    );
}
