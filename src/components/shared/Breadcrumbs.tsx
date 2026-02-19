"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
    className?: string;
}

export default function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
    return (
        <nav
            aria-label="Breadcrumb"
            className={`flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-10 overflow-x-auto no-scrollbar whitespace-nowrap ${className}`}
        >
            <Link
                href="/"
                className="flex items-center gap-1 hover:text-foreground transition-colors shrink-0"
            >
                <Home className="h-3 w-3" />
                <span>Home</span>
            </Link>

            {items.map((item, index) => (
                <div key={index} className="flex items-center gap-2 shrink-0">
                    <span className="text-muted-foreground/30">/</span>
                    {item.href ? (
                        <Link
                            href={item.href}
                            className="hover:text-foreground transition-colors"
                        >
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-foreground">{item.label}</span>
                    )}
                </div>
            ))}
        </nav>
    );
}
