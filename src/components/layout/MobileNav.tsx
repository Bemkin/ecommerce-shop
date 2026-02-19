"use client";

import { User } from "lucide-react";
import { SheetContent, SheetTitle } from "@/components/ui/sheet";
import { SearchBar } from "@/components/products";
import NavLinks from "./NavLinks";
import { Category } from "@/lib/types";

interface MobileNavProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    user: { username: string } | null;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    categories: Category[];
}

export default function MobileNav({
    isOpen,
    onOpenChange,
    user,
    searchQuery,
    onSearchChange,
    categories,
}: MobileNavProps) {
    return (
        <SheetContent side="right" className="w-80 p-0">
            <div className="flex flex-col h-full bg-background border-l">
                <div className="p-6 border-b flex items-center justify-between">
                    <SheetTitle className="text-2xl font-black tracking-tight">Menu</SheetTitle>
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-4 w-4 text-primary" />
                        </div>
                        <span className="font-bold">{user?.username}</span>
                    </div>
                </div>

                <nav className="flex flex-col p-4 gap-1">
                    <div className="sm:hidden mb-4 p-2 bg-muted/30 rounded-xl">
                        <SearchBar
                            value={searchQuery}
                            onChange={onSearchChange}
                            placeholder="Search products..."
                            className="h-10 border-none shadow-none"
                        />
                    </div>
                    <NavLinks
                        isMobile
                        categories={categories}
                        onItemClick={() => onOpenChange(false)}
                    />
                </nav>
            </div>
        </SheetContent>
    );
}
