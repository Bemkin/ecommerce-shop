"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { toggleDarkMode } from "@/store/slices/themeSlice";
import { logout } from "@/store/slices/authSlice";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Heart, Moon, Sun, LogOut, User, Bell, ShoppingBag, PlusCircle } from "lucide-react";
import { toggleCart } from "@/store/slices/cartSlice";
import { useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NotificationDropdown from "./NotificationDropdown";
import { useEffect, useState } from "react";

export default function UserActions() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const darkMode = useAppSelector((state) => state.theme.darkMode);
    const { user } = useAppSelector((state) => state.auth);
    const favoritesCount = useAppSelector(
        (state) => state.favorites.ids.length
    );
    const itemsCount = useAppSelector((state) =>
        state.cart.items.reduce((sum, item) => sum + item.quantity, 0)
    );

    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    const handleLogout = useCallback(() => {
        dispatch(logout());
        router.push("/login");
    }, [dispatch, router]);

    return (
        <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Add Product Shortcut */}
            <Link href="/products/create" className="hidden sm:block">
                <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors" title="Add Product">
                    <PlusCircle className="h-[22px] w-[22px]" />
                </Button>
            </Link>

            {/* Favorites */}
            <Link href="/favorites" className="relative">
                <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors">
                    <Heart className="h-[22px] w-[22px]" />
                    {mounted && favoritesCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground text-[9px] font-black border-2 border-background animate-in zoom-in">
                            {favoritesCount}
                        </span>
                    )}
                </Button>
            </Link>

            {/* Cart */}
            <Button
                id="cart-icon"
                variant="ghost"
                size="icon"
                onClick={() => dispatch(toggleCart())}
                className="relative rounded-full text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
            >
                <ShoppingBag className="h-[22px] w-[22px]" />
                <AnimatePresence>
                    {mounted && itemsCount > 0 && (
                        <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground text-[9px] font-black border-2 border-background shadow-sm"
                        >
                            {itemsCount}
                        </motion.span>
                    )}
                </AnimatePresence>
            </Button>

            <NotificationDropdown />

            <div className="h-6 w-px bg-border/60 mx-1 hidden sm:block" />

            {/* Theme Toggle */}
            <Button
                variant="ghost"
                size="icon"
                onClick={() => dispatch(toggleDarkMode())}
                className="rounded-full text-muted-foreground hover:bg-muted/50 hidden md:flex"
                aria-label="Toggle dark mode"
            >
                {!mounted ? <div className="h-5 w-5" /> : darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {/* Profile Dropdown */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2 py-1 px-1.5 rounded-full hover:bg-muted/50">
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center border border-border/50">
                            <User className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <span className="text-sm font-semibold hidden lg:inline-block pr-1">
                            {mounted ? user?.username : ""}
                        </span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 mt-1">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push("/favorites")}>
                        <Heart className="mr-2 h-4 w-4" /> Favorites
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/products/create")}>
                        <span className="mr-2 font-bold">+</span> Add Product
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => dispatch(toggleDarkMode())} className="md:hidden">
                        {mounted ? (darkMode ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />) : <div className="mr-2 h-4 w-4" />}
                        Appearance
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                        <LogOut className="mr-2 h-4 w-4" /> Logout
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
