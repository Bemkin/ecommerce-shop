"use client";

import Link from "next/link";

export default function Logo() {
    return (
        <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-black text-lg shadow-lg shadow-primary/20 transition-transform group-hover:scale-105 active:scale-95">
                S
            </div>
            <span className="font-black text-2xl tracking-tighter hidden lg:inline-block">
                ShopHub
            </span>
        </Link>
    );
}
