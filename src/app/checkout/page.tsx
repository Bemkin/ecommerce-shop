"use client";

import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { setStep } from "@/store/slices/checkoutSlice";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, CreditCard, MapPin, ClipboardList, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import OrderSummary from "@/components/checkout/OrderSummary";
import ShippingStep from "@/components/checkout/ShippingStep";
import PaymentStep from "@/components/checkout/PaymentStep";
import ReviewStep from "@/components/checkout/ReviewStep";
import SuccessStep from "@/components/checkout/SuccessStep";

const STEPS = [
    { id: "shipping", label: "Shipping", icon: MapPin },
    { id: "payment", label: "Payment", icon: CreditCard },
    { id: "review", label: "Review", icon: ClipboardList },
    { id: "success", label: "Done", icon: CheckCircle2 },
];

export default function CheckoutPage() {
    const { step } = useAppSelector((state) => state.checkout);
    const { items, totalAmount } = useAppSelector((state) => state.cart);

    if (items.length === 0 && step === "shipping") {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
                    <ClipboardList className="w-10 h-10 text-muted-foreground/40" />
                </div>
                <h1 className="text-3xl font-black italic tracking-tighter mb-4">YOUR BAG IS EMPTY</h1>
                <p className="text-muted-foreground mb-8 max-w-xs font-medium">Add some items to your bag to proceed with checkout.</p>
                <Button asChild className="h-14 px-10 rounded-2xl font-black italic tracking-widest uppercase text-xs shadow-2xl shadow-foreground/5">
                    <Link href="/">START SHOPPING</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-muted/30 pt-24 pb-20 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header & Breadcrumbs */}
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter mb-6 uppercase">
                        Checkout
                    </h1>

                    {/* Progress Bar */}
                    <div className="flex items-center gap-2 md:gap-4 overflow-x-auto no-scrollbar pb-2">
                        {STEPS.map((s, idx) => {
                            const Icon = s.icon;
                            const isActive = step === s.id;
                            const isCompleted = STEPS.findIndex(x => x.id === step) > idx || step === "success";

                            return (
                                <div key={s.id} className="flex items-center gap-2 md:gap-4 shrink-0">
                                    <div className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border-2 transition-all ${isActive ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105" :
                                        isCompleted ? "bg-background border-primary/20 text-primary" :
                                            "bg-background border-border text-muted-foreground/60"
                                        }`}>
                                        <Icon className="w-4 h-4" />
                                        <span className="text-[10px] font-black uppercase italic tracking-widest">
                                            {s.label}
                                        </span>
                                        {isCompleted && <CheckCircle2 className="w-3 h-3 ml-1" />}
                                    </div>
                                    {idx < STEPS.length - 1 && (
                                        <ChevronRight className={`w-4 h-4 ${isCompleted ? "text-primary/40" : "text-muted-foreground/20"}`} />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    {/* Main Content */}
                    <div className={step === "success" ? "lg:col-span-12" : "lg:col-span-8"}>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={step}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                            >
                                {step === "shipping" && <ShippingStep />}
                                {step === "payment" && <PaymentStep />}
                                {step === "review" && <ReviewStep />}
                                {step === "success" && <SuccessStep />}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Order Summary Sidebar */}
                    {step !== "success" && (
                        <div className="lg:col-span-4 lg:sticky lg:top-32">
                            <OrderSummary />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Simple internal Button component if needed or import from UI
import { Button } from "@/components/ui/button";
