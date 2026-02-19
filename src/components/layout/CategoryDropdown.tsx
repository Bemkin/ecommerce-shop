"use client";

import { useAppDispatch } from "@/store/hooks";
import { useRouter } from "next/navigation";
import { setSearchQuery } from "@/store/slices/searchSlice";
import { Category } from "@/lib/types";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

interface CategoryDropdownProps {
    categories: Category[];
}

export default function CategoryDropdown({ categories }: CategoryDropdownProps) {
    const dispatch = useAppDispatch();
    const router = useRouter();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="hidden lg:flex items-center gap-2 text-muted-foreground font-bold hover:text-foreground transition-colors">
                    Categories <ChevronDown className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 rounded-xl shadow-xl p-2 max-h-[400px] overflow-y-auto no-scrollbar">
                <DropdownMenuLabel className="px-2 py-1.5 text-xs font-black text-muted-foreground uppercase tracking-wider">
                    Shop By Category
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="-mx-1 my-1" />
                <DropdownMenuItem
                    onClick={() => {
                        dispatch(setSearchQuery(""));
                        router.push("/");
                    }}
                    className="rounded-lg font-bold cursor-pointer"
                >
                    All Products
                </DropdownMenuItem>
                {categories.map((cat) => (
                    <DropdownMenuItem
                        key={cat.slug}
                        onClick={() => {
                            dispatch(setSearchQuery(""));
                            router.push(`/?category=${cat.slug}`);
                        }}
                        className="rounded-lg font-medium cursor-pointer capitalize"
                    >
                        {cat.name}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
