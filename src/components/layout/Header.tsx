"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { toggleDarkMode } from "@/store/slices/themeSlice";
import { logout } from "@/store/slices/authSlice";
import SearchBar from "@/components/products/ui/SearchBar";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import Logo from "./Logo";
import CategoryDropdown from "./CategoryDropdown";
import MobileNav from "./MobileNav";
import UserActions from "./UserActions";

import { setSearchQuery } from "@/store/slices/searchSlice";

export default function Header() {
    const { isAuthenticated, user } = useAppSelector((state) => state.auth);
    const searchQuery = useAppSelector((state) => state.search.query);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Access global categories state
    const categories = useAppSelector((state) => state.categories.items);

    const handleSearchChange = (query: string) => {
        dispatch(setSearchQuery(query));
        if (pathname !== "/" && query) {
            router.push("/");
        }
    };

    // Change header appearance on scroll
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    if (!mounted || !isAuthenticated) return null;

    return (
        <header className={`sticky top-0 z-50 w-full border-b-2 py-1 transition-all duration-200 ${scrolled
            ? "border-border bg-card/98 shadow-lg shadow-black/5 backdrop-blur supports-[backdrop-filter]:bg-card/80"
            : "border-border/50 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60"
            }`}>
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 gap-4">

                {/* Left: Logo & Desktop Nav */}
                <div className="flex items-center gap-6">
                    <Logo />
                    <CategoryDropdown categories={categories} />
                </div>

                {/* Center: Search Bar */}
                <div className="flex-1 max-w-xl hidden sm:block">
                    <SearchBar
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Search product or brand here..."
                        className="bg-muted/40 border-none shadow-none focus-within:ring-2 focus-within:ring-primary/20 focus-within:bg-background transition-all"
                    />
                </div>

                {/* Right: Actions & Mobile Menu */}
                <div className="flex items-center gap-1.5 sm:gap-3">
                    <UserActions />

                    <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                        <SheetTrigger asChild className="md:hidden">
                            <Button variant="ghost" size="icon" className="rounded-full">
                                <Menu className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>
                        <MobileNav
                            isOpen={mobileOpen}
                            onOpenChange={setMobileOpen}
                            user={user}
                            searchQuery={searchQuery}
                            onSearchChange={handleSearchChange}
                            categories={categories}
                        />
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
