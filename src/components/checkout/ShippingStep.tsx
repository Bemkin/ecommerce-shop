"use client";

import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { setStep, updateShipping } from "@/store/slices/checkoutSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowRight, MapPin } from "lucide-react";

const shippingSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    address: z.string().min(5, "Address must be at least 5 characters"),
    city: z.string().min(2, "City must be at least 2 characters"),
    zip: z.string().min(4, "Invalid ZIP code"),
    country: z.string().min(2, "Country must be at least 2 characters"),
});

type ShippingFormValues = z.infer<typeof shippingSchema>;

export default function ShippingStep() {
    const dispatch = useAppDispatch();
    const { shippingData } = useAppSelector((state) => state.checkout);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ShippingFormValues>({
        resolver: zodResolver(shippingSchema),
        defaultValues: shippingData,
    });

    const onSubmit = (data: ShippingFormValues) => {
        dispatch(updateShipping(data));
        dispatch(setStep("payment"));
        window.scrollTo(0, 0);
    };

    return (
        <div className="bg-background rounded-[32px] border border-border/50 shadow-2xl shadow-black/5 p-8 md:p-12">
            <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <MapPin className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-2xl font-black italic tracking-tighter uppercase leading-none">Shipping</h2>
                    <p className="text-sm text-muted-foreground font-medium mt-1">Where should we send your premium items?</p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-[10px] font-black uppercase italic tracking-widest ml-1">Full Name</Label>
                        <Input
                            id="name"
                            {...register("name")}
                            placeholder="John Doe"
                            className={`h-14 rounded-2xl border-2 bg-muted/20 focus:bg-background transition-all ${errors.name ? 'border-destructive/50' : 'border-border/50'}`}
                        />
                        {errors.name && <p className="text-[10px] font-bold text-destructive px-1 italic">{errors.name.message?.toUpperCase()}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-[10px] font-black uppercase italic tracking-widest ml-1">Email Address</Label>
                        <Input
                            id="email"
                            type="email"
                            {...register("email")}
                            placeholder="john@example.com"
                            className={`h-14 rounded-2xl border-2 bg-muted/20 focus:bg-background transition-all ${errors.email ? 'border-destructive/50' : 'border-border/50'}`}
                        />
                        {errors.email && <p className="text-[10px] font-bold text-destructive px-1 italic">{errors.email.message?.toUpperCase()}</p>}
                    </div>

                    <div className="md:col-span-2 space-y-2">
                        <Label htmlFor="address" className="text-[10px] font-black uppercase italic tracking-widest ml-1">Shipping Address</Label>
                        <Input
                            id="address"
                            {...register("address")}
                            placeholder="123 Premium St"
                            className={`h-14 rounded-2xl border-2 bg-muted/20 focus:bg-background transition-all ${errors.address ? 'border-destructive/50' : 'border-border/50'}`}
                        />
                        {errors.address && <p className="text-[10px] font-bold text-destructive px-1 italic">{errors.address.message?.toUpperCase()}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="city" className="text-[10px] font-black uppercase italic tracking-widest ml-1">City</Label>
                        <Input
                            id="city"
                            {...register("city")}
                            placeholder="New York"
                            className={`h-14 rounded-2xl border-2 bg-muted/20 focus:bg-background transition-all ${errors.city ? 'border-destructive/50' : 'border-border/50'}`}
                        />
                        {errors.city && <p className="text-[10px] font-bold text-destructive px-1 italic">{errors.city.message?.toUpperCase()}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="zip" className="text-[10px] font-black uppercase italic tracking-widest ml-1">ZIP Code</Label>
                            <Input
                                id="zip"
                                {...register("zip")}
                                placeholder="10001"
                                className={`h-14 rounded-2xl border-2 bg-muted/20 focus:bg-background transition-all ${errors.zip ? 'border-destructive/50' : 'border-border/50'}`}
                            />
                            {errors.zip && <p className="text-[10px] font-bold text-destructive px-1 italic">{errors.zip.message?.toUpperCase()}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="country" className="text-[10px] font-black uppercase italic tracking-widest ml-1">Country</Label>
                            <Input
                                id="country"
                                {...register("country")}
                                defaultValue="United States"
                                className={`h-14 rounded-2xl border-2 bg-muted/20 focus:bg-background transition-all ${errors.country ? 'border-destructive/50' : 'border-border/50'}`}
                            />
                            {errors.country && <p className="text-[10px] font-bold text-destructive px-1 italic">{errors.country.message?.toUpperCase()}</p>}
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t border-border/10 flex justify-end">
                    <Button
                        type="submit"
                        size="lg"
                        className="h-16 px-12 rounded-[24px] font-black italic tracking-widest uppercase text-base bg-primary shadow-2xl shadow-primary/20 hover:scale-[1.05] active:scale-95 transition-all group"
                    >
                        Continue to Payment
                        <ArrowRight className="ml-3 w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                </div>
            </form>
        </div>
    );
}
