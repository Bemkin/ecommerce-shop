import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Category } from "@/lib/types";

interface NavLinksProps {
    isMobile?: boolean;
    onItemClick?: () => void;
    categories?: Category[];
}

export default function NavLinks({ isMobile, onItemClick, categories = [] }: NavLinksProps) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    if (isMobile) {
        return (
            <>
                <Link href="/" onClick={onItemClick}>
                    <Button variant="ghost" className="w-full justify-start text-base h-12 rounded-xl border-b border-border/40 mb-2">Home</Button>
                </Link>
                {categories.length > 0 ? (
                    <>
                        <div className="px-4 py-2 text-xs font-black text-muted-foreground uppercase tracking-widest bg-muted/20 mb-1">
                            Shop By Category
                        </div>
                        {categories.map((cat) => (
                            <Link key={cat.slug} href={`/?category=${cat.slug}`} onClick={onItemClick}>
                                <Button
                                    variant="ghost"
                                    className={`w-full justify-start text-base h-11 rounded-xl capitalize ${pathname === "/" && searchParams.get("category") === cat.slug ? "text-primary bg-primary/10 font-bold" : "text-muted-foreground"}`}
                                >
                                    {cat.name}
                                </Button>
                            </Link>
                        ))}
                    </>
                ) : (
                    <div className="p-4 text-center text-muted-foreground text-sm">Loading categories...</div>
                )}
            </>
        );
    }

    return null;
}
