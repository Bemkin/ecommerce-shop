"use client";

import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { setStep, updatePayment } from "@/store/slices/checkoutSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, ArrowRight, CreditCard, Lock } from "lucide-react";
import { motion } from "framer-motion";

const paymentSchema = z.object({
    cardNumber: z.string().min(16, "Invalid card number").max(19),
    expiry: z.string().regex(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, "Use MM/YY format"),
    cvc: z.string().min(3, "Min 3 digits").max(4),
    nameOnCard: z.string().min(2, "Required"),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

export default function PaymentStep() {
    const dispatch = useAppDispatch();
    const { paymentData } = useAppSelector((state) => state.checkout);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<PaymentFormValues>({
        resolver: zodResolver(paymentSchema),
        defaultValues: paymentData,
    });

    const watchedData = watch();

    const onSubmit = (data: PaymentFormValues) => {
        dispatch(updatePayment(data));
        dispatch(setStep("review"));
        window.scrollTo(0, 0);
    };

    return (
        <div className="bg-background rounded-[32px] border border-border/50 shadow-2xl shadow-black/5 p-8 md:p-12">
            <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <CreditCard className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-2xl font-black italic tracking-tighter uppercase leading-none">Payment</h2>
                    <p className="text-sm text-muted-foreground font-medium mt-1">Safe and secure premium checkout.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                {/* Magic Card Visual */}
                <div className="order-2 md:order-1">
                    <motion.div
                        initial={{ opacity: 0, rotateY: 20 }}
                        animate={{ opacity: 1, rotateY: 0 }}
                        className="relative w-full aspect-[1.6/1] rounded-[24px] bg-gradient-to-br from-slate-900 to-slate-800 p-6 md:p-8 text-white shadow-2xl shadow-black/40 overflow-hidden group"
                    >
                        {/* Card Glass Effect */}
                        <div className="absolute inset-0 bg-white/5 backdrop-blur-sm opacity-50" />
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 rounded-full blur-3xl transition-all group-hover:bg-primary/30" />

                        <div className="relative z-10 h-full flex flex-col justify-between">
                            <div className="flex justify-between items-start">
                                <div className="w-12 h-12 rounded-lg bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center">
                                    <div className="w-8 h-6 rounded bg-yellow-500/40" />
                                </div>
                                <div className="flex -space-x-3">
                                    <div className="w-10 h-10 rounded-full bg-red-500/80 backdrop-blur-sm" />
                                    <div className="w-10 h-10 rounded-full bg-orange-500/80 backdrop-blur-sm" />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Card Number</p>
                                <p className="text-xl md:text-2xl font-black tracking-[0.15em] font-mono">
                                    {watchedData.cardNumber
                                        ? watchedData.cardNumber.replace(/(.{4})/g, '$1 ').trim()
                                        : "**** **** **** ****"}
                                </p>
                            </div>

                            <div className="flex justify-between items-end">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Card Holder</p>
                                    <p className="font-black italic uppercase tracking-wider truncate max-w-[150px]">
                                        {watchedData.nameOnCard || "FULL NAME"}
                                    </p>
                                </div>
                                <div className="space-y-1 text-right">
                                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Expiry</p>
                                    <p className="font-black font-mono">
                                        {watchedData.expiry || "MM/YY"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <div className="mt-8 p-6 rounded-2xl bg-muted/30 border-2 border-dashed border-border flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center shrink-0 border border-border shadow-sm">
                            <Lock className="w-4 h-4 text-green-600" />
                        </div>
                        <p className="text-[11px] text-muted-foreground font-medium leading-relaxed italic">
                            Your payment is fully encrypted. We never store your full card details for maximum security.
                        </p>
                    </div>
                </div>

                {/* Form */}
                <div className="order-1 md:order-2">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="nameOnCard" className="text-[10px] font-black uppercase italic tracking-widest ml-1">Cardholder Name</Label>
                            <Input
                                id="nameOnCard"
                                {...register("nameOnCard")}
                                placeholder="JOHN DOE"
                                className={`h-14 rounded-2xl border-2 bg-muted/20 focus:bg-background transition-all uppercase font-bold ${errors.nameOnCard ? 'border-destructive/50' : 'border-border/50'}`}
                            />
                            {errors.nameOnCard && <p className="text-[10px] font-bold text-destructive px-1 italic">{errors.nameOnCard.message?.toUpperCase()}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="cardNumber" className="text-[10px] font-black uppercase italic tracking-widest ml-1">Card Number</Label>
                            <Input
                                id="cardNumber"
                                {...register("cardNumber")}
                                placeholder="0000 0000 0000 0000"
                                maxLength={16}
                                className={`h-14 rounded-2xl border-2 bg-muted/20 focus:bg-background transition-all font-mono tracking-widest ${errors.cardNumber ? 'border-destructive/50' : 'border-border/50'}`}
                            />
                            {errors.cardNumber && <p className="text-[10px] font-bold text-destructive px-1 italic">{errors.cardNumber.message?.toUpperCase()}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="expiry" className="text-[10px] font-black uppercase italic tracking-widest ml-1">Expiry Date</Label>
                                <Input
                                    id="expiry"
                                    {...register("expiry")}
                                    placeholder="MM/YY"
                                    className={`h-14 rounded-2xl border-2 bg-muted/20 focus:bg-background transition-all font-mono ${errors.expiry ? 'border-destructive/50' : 'border-border/50'}`}
                                />
                                {errors.expiry && <p className="text-[10px] font-bold text-destructive px-1 italic">{errors.expiry.message?.toUpperCase()}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="cvc" className="text-[10px] font-black uppercase italic tracking-widest ml-1">CVC</Label>
                                <Input
                                    id="cvc"
                                    type="password"
                                    {...register("cvc")}
                                    placeholder="***"
                                    maxLength={4}
                                    className={`h-14 rounded-2xl border-2 bg-muted/20 focus:bg-background transition-all font-mono ${errors.cvc ? 'border-destructive/50' : 'border-border/50'}`}
                                />
                                {errors.cvc && <p className="text-[10px] font-bold text-destructive px-1 italic">{errors.cvc.message?.toUpperCase()}</p>}
                            </div>
                        </div>

                        <div className="pt-6 flex flex-col sm:flex-row gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => dispatch(setStep("shipping"))}
                                className="h-14 px-8 rounded-2xl font-black italic tracking-widest uppercase text-xs border-2"
                            >
                                <ArrowLeft className="mr-2 w-4 h-4" />
                                Back
                            </Button>
                            <Button
                                type="submit"
                                className="flex-1 h-14 rounded-2xl font-black italic tracking-widest uppercase text-sm bg-primary shadow-2xl shadow-primary/20 hover:scale-[1.05] active:scale-95 transition-all group"
                            >
                                Review Order
                                <ArrowRight className="ml-3 w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
