import { motion } from "framer-motion";
import { LayoutGrid } from "lucide-react";
import { Category } from "@/lib/types";

interface QuickCategoriesProps {
    categories: Category[];
    activeCategory: string | null;
    onCategoryClick: (slug: string | null) => void;
}

const CATEGORY_IMAGES: Record<string, string> = {
    "beauty": "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&q=80&w=200",
    "fragrances": "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=200",
    "furniture": "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=200",
    "groceries": "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=200",
    "home-decoration": "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=200",
    "laptops": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=200",
    "mens-shirts": "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=200",
    "mens-shoes": "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=200",
    "mens-watches": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=200",
    "mobile-accessories": "https://images.unsplash.com/photo-1584006682522-dc17d6c0d9ac?auto=format&fit=crop&q=80&w=200",
    "smartphones": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=200",
    "sports-accessories": "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=200",
    "sunglasses": "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=200",
    "tops": "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=200",
    "womens-bags": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=200",
    "womens-dresses": "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&q=80&w=200",
    "womens-jewellery": "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=200",
    "womens-shoes": "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=200",
    "womens-watches": "https://images.unsplash.com/photo-1508685096489-775b3400a94e?auto=format&fit=crop&q=80&w=200",
};

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=200";

export default function QuickCategories({ categories, activeCategory, onCategoryClick }: QuickCategoriesProps) {
    // Curate a breathable set of top categories (Top 7)
    const FEATURED_SLUGS = ["beauty", "smartphones", "laptops", "home-decoration", "mens-shirts", "womens-dresses", "groceries"];
    const displayCategories = categories
        .filter(c => FEATURED_SLUGS.includes(c.slug))
        .sort((a, b) => FEATURED_SLUGS.indexOf(a.slug) - FEATURED_SLUGS.indexOf(b.slug));

    return (
        <div className="flex items-center justify-center gap-6 md:gap-14 overflow-x-auto py-6 no-scrollbar mb-12 scroll-mt-28 min-h-[140px]">
            {displayCategories.map((cat, i) => (
                <motion.button
                    key={cat.slug}
                    onClick={() => onCategoryClick(cat.slug)}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.5 }}
                    whileHover={{ y: -5 }}
                    className="flex flex-col items-center gap-4 shrink-0 group focus:outline-none"
                >
                    <div className={`h-[72px] w-[72px] md:h-[80px] md:w-[80px] rounded-full flex items-center justify-center p-1 border-2 transition-all duration-300 ${activeCategory === cat.slug ? "border-primary scale-110 shadow-xl shadow-primary/20" : "border-transparent group-hover:border-border"
                        }`}>
                        <div className="h-full w-full rounded-full overflow-hidden bg-muted flex items-center justify-center shadow-inner relative">
                            <img
                                src={CATEGORY_IMAGES[cat.slug] || DEFAULT_IMAGE}
                                alt={cat.name}
                                className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                            />
                            <div className={`absolute inset-0 bg-primary/10 transition-opacity duration-300 ${activeCategory === cat.slug ? "opacity-100" : "opacity-0 group-hover:opacity-10"}`} />
                        </div>
                    </div>
                    <span className={`text-[9px] font-black tracking-[0.15em] transition-all uppercase italic ${activeCategory === cat.slug ? "text-primary translate-y-1" : "text-muted-foreground group-hover:text-foreground"
                        }`}>
                        {cat.name}
                    </span>
                </motion.button>
            ))}

            <div className="h-10 w-px bg-border/40 mx-2 self-center hidden md:block" />

            <motion.button
                onClick={() => onCategoryClick(null)}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: displayCategories.length * 0.05 }}
                whileHover={{ x: 5 }}
                className="flex flex-col items-center gap-4 shrink-0 group focus:outline-none ml-2"
            >
                <div className={`h-[72px] w-[72px] md:h-[80px] md:w-[80px] rounded-full flex items-center justify-center p-1 border-2 transition-all duration-300 ${activeCategory === null ? "border-foreground scale-110 shadow-xl" : "border-transparent group-hover:border-border"
                    }`}>
                    <div className={`h-full w-full rounded-full flex items-center justify-center transition-all duration-300 ${activeCategory === null ? "bg-foreground text-background" : "bg-card text-foreground group-hover:bg-muted"
                        }`}>
                        <LayoutGrid className="h-6 w-6" />
                    </div>
                </div>
                <span className={`text-[9px] font-black tracking-[0.15em] transition-all uppercase italic ${activeCategory === null ? "text-foreground translate-y-1" : "text-muted-foreground group-hover:text-foreground"
                    }`}>
                    EXPLORE ALL
                </span>
            </motion.button>
        </div>
    );
}
