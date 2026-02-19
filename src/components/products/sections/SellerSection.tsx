"use client";

import { ShieldCheck, MapPin, MessageSquare, Info, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface SellerSectionProps {
    brand: string;
}

export default function SellerSection({ brand }: SellerSectionProps) {
    return (
        <div className="bg-muted/10 border border-border/50 rounded-[32px] p-6 lg:p-8 space-y-8 mt-12 bg-gradient-to-br from-background to-muted/20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                    <div className="relative">
                        <Avatar className="h-16 w-16 border-2 border-background shadow-xl">
                            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${brand}`} />
                            <AvatarFallback>{brand.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground p-1 rounded-full shadow-lg border-2 border-background">
                            <ShieldCheck className="h-3 w-3" />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-black text-lg tracking-tight uppercase">{brand}</h3>
                            <Badge variant="secondary" className="bg-primary/10 text-primary text-[10px] font-black border-none px-2 h-5">Online</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                                <Star className="h-3.5 w-3.5 text-orange-500 fill-current" />
                                <span>4.9 (1.2k Ratings)</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button variant="outline" className="rounded-xl font-bold h-10 px-6 border-2">Follow</Button>
                    <Button variant="secondary" className="rounded-xl font-bold h-10 px-6">Visit Store</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
                {[
                    { icon: Star, label: "Rolling Store", value: "88%", color: "text-orange-500" },
                    { icon: MapPin, label: "Location", value: "Tulungagung", color: "text-blue-500" },
                    { icon: MessageSquare, label: "Chat Reply", value: "92%", color: "text-green-500" },
                ].map((stat) => (
                    <div key={stat.label} className="flex items-center gap-3 bg-background/50 p-4 rounded-2xl border border-border/40">
                        <div className={`h-10 w-10 rounded-xl bg-background flex items-center justify-center shadow-sm ${stat.color}`}>
                            <stat.icon className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                            <p className="text-sm font-black text-foreground uppercase">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
