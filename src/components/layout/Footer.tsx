"use client";

import Link from "next/link";
import { Heart, Facebook, Instagram, Twitter, Youtube, Send, ShieldCheck, Truck, Headphones, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Logo from "./Logo";
import { useAppSelector } from "@/store/hooks";

import { usePathname } from "next/navigation";

export default function Footer() {
    const pathname = usePathname();
    const currentYear = new Date().getFullYear();
    const categories = useAppSelector((state) => state.categories.items);

    if (pathname === "/login") return null;

    return (
        <footer className="mt-32">
            {/* Top Band: Large Slogan Banner */}
            <div className="relative overflow-hidden bg-foreground py-32 text-center text-background">
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <img
                        src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1920"
                        alt="Retail background"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="relative z-10 space-y-8 px-6 max-w-4xl mx-auto">
                    <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter leading-[0.9]">
                        &quot;LET&apos;S SHOP BEYOND BOUNDARIES&quot;
                    </h2>
                    <div className="flex flex-col items-center gap-2">
                        <p className="text-muted-foreground/80 text-sm font-black uppercase tracking-[0.3em] italic">Established 2024 • Future of Retail</p>
                        <div className="h-1 w-20 bg-primary mt-4" />
                    </div>
                </div>
            </div>

            {/* Middle Band: Trust & Features */}
            <div className="bg-muted/30 border-y border-border">
                <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    <div className="flex flex-col items-center text-center space-y-4 p-8 bg-card rounded-3xl border border-border shadow-sm hover:shadow-xl transition-all group">
                        <div className="h-16 w-16 flex items-center justify-center rounded-full bg-primary/5 text-primary group-hover:bg-primary group-hover:text-background transition-colors shadow-inner">
                            <Truck className="h-7 w-7" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-base font-black italic uppercase tracking-tight">Fast Shipping</h3>
                            <p className="text-xs text-muted-foreground font-medium">On all orders over $99. International delivery available.</p>
                        </div>
                    </div>

                    <div className="flex flex-col items-center text-center space-y-4 p-8 bg-card rounded-3xl border border-border shadow-sm hover:shadow-xl transition-all group">
                        <div className="h-16 w-16 flex items-center justify-center rounded-full bg-primary/5 text-primary group-hover:bg-primary group-hover:text-background transition-colors shadow-inner">
                            <Headphones className="h-7 w-7" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-base font-black italic uppercase tracking-tight">24/7 Support</h3>
                            <p className="text-xs text-muted-foreground font-medium">Expert help anytime. Dedicated regional support teams.</p>
                        </div>
                    </div>

                    <div className="flex flex-col items-center text-center space-y-4 p-8 bg-card rounded-3xl border border-border shadow-sm hover:shadow-xl transition-all group">
                        <div className="h-16 w-16 flex items-center justify-center rounded-full bg-primary/5 text-primary group-hover:bg-primary group-hover:text-background transition-colors shadow-inner">
                            <RotateCcw className="h-7 w-7" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-base font-black italic uppercase tracking-tight">Easy Returns</h3>
                            <p className="text-xs text-muted-foreground font-medium">30 days money back guarantee. Hassle-free pickups.</p>
                        </div>
                    </div>

                    <div className="flex flex-col items-center text-center space-y-4 p-8 bg-card rounded-3xl border border-border shadow-sm hover:shadow-xl transition-all group">
                        <div className="h-16 w-16 flex items-center justify-center rounded-full bg-primary/5 text-primary group-hover:bg-primary group-hover:text-background transition-colors shadow-inner">
                            <ShieldCheck className="h-7 w-7" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-base font-black italic uppercase tracking-tight">Secure Checkout</h3>
                            <p className="text-xs text-muted-foreground font-medium">100% secure payment systems. SSL encrypted processing.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Footer Links */}
            <div className="bg-background">
                <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
                        {/* Brand Column */}
                        <div className="space-y-8">
                            <Logo />
                            <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                                Redefining the modern shopping experience through premium curation and global accessibility. Join the future of fashion and retail today.
                            </p>
                            <div className="flex items-center gap-5">
                                <Link href="#" className="h-9 w-9 flex items-center justify-center rounded-xl bg-card border border-border hover:bg-primary hover:text-white transition-all shadow-sm">
                                    <Facebook className="h-4 w-4" />
                                </Link>
                                <Link href="#" className="h-9 w-9 flex items-center justify-center rounded-xl bg-card border border-border hover:bg-primary hover:text-white transition-all shadow-sm">
                                    <Instagram className="h-4 w-4" />
                                </Link>
                                <Link href="#" className="h-9 w-9 flex items-center justify-center rounded-xl bg-card border border-border hover:bg-primary hover:text-white transition-all shadow-sm">
                                    <Twitter className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>

                        {/* Nav Columns */}
                        <div>
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] italic mb-8">Navigation</h3>
                            <ul className="space-y-5">
                                {categories.slice(0, 4).map((cat) => (
                                    <li key={cat.slug}>
                                        <Link
                                            href={`/?category=${cat.slug}`}
                                            className="text-[13px] font-bold text-muted-foreground hover:text-primary transition-colors capitalize"
                                        >
                                            {cat.name}
                                        </Link>
                                    </li>
                                ))}
                                {categories.length === 0 && (
                                    <>
                                        <li><Link href="#" className="text-[13px] font-bold text-muted-foreground hover:text-primary transition-colors">Men Collection</Link></li>
                                        <li><Link href="#" className="text-[13px] font-bold text-muted-foreground hover:text-primary transition-colors">Women Shoes</Link></li>
                                        <li><Link href="#" className="text-[13px] font-bold text-muted-foreground hover:text-primary transition-colors">Beauty Picks</Link></li>
                                        <li><Link href="#" className="text-[13px] font-bold text-muted-foreground hover:text-primary transition-colors">Fragrances</Link></li>
                                    </>
                                )}
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] italic mb-8">Management</h3>
                            <ul className="space-y-5">
                                <li><Link href="#" className="text-[13px] font-bold text-muted-foreground hover:text-primary transition-colors">My Account</Link></li>
                                <li><Link href="#" className="text-[13px] font-bold text-muted-foreground hover:text-primary transition-colors">Order Status</Link></li>
                                <li><Link href="#" className="text-[13px] font-bold text-muted-foreground hover:text-primary transition-colors">Wishlist</Link></li>
                                <li><Link href="#" className="text-[13px] font-bold text-muted-foreground hover:text-primary transition-colors">ShopHub Coins</Link></li>
                            </ul>
                        </div>

                        {/* Newsletter Column */}
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] italic mb-4">Newsletter</h3>
                                <p className="text-[13px] text-muted-foreground font-medium leading-relaxed">
                                    Be the first to know about new arrivals and exclusive flash sale collections.
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <div className="relative flex-1 group">
                                    <Input placeholder="Enter your email" className="bg-card border-border h-14 rounded-2xl pr-12 focus:ring-primary/20 transition-all font-medium text-xs" suppressHydrationWarning={true} />
                                    <Button size="icon" variant="ghost" className="absolute right-1 top-1 h-12 w-12 rounded-xl group-hover:text-primary">
                                        <Send className="h-5 w-5" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Band: Signature Dark Bar (Constant across themes for emphasis) */}
                <div className="bg-[#0a0a0a] py-10">
                    <div className="mx-auto max-w-7xl px-4 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <span className="text-[11px] font-black italic text-white/40 tracking-widest uppercase" suppressHydrationWarning>
                                © {currentYear} SHOPHUB GLOBAL • ALL RIGHTS RESERVED
                            </span>
                            <div className="h-1 w-1 bg-white/20 rounded-full hidden md:block" />
                            <div className="flex items-center gap-4">
                                <Link href="#" className="text-[11px] font-bold text-white/60 hover:text-primary transition-colors uppercase tracking-tight">Terms</Link>
                                <Link href="#" className="text-[11px] font-bold text-white/60 hover:text-primary transition-colors uppercase tracking-tight">Privacy</Link>
                                <Link href="#" className="text-[11px] font-bold text-white/60 hover:text-primary transition-colors uppercase tracking-tight">Cookies</Link>
                            </div>
                        </div>
                        <div className="flex items-center gap-8">
                            <span className="text-[10px] font-black text-white/30 tracking-[0.3em] uppercase italic">Beyond Boundaries</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
