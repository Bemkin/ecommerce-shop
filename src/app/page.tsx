"use client";

import { Suspense } from "react";
import { PRODUCTS_PER_PAGE } from "@/lib/constants";
import { ProductGridSkeleton } from "@/components/products/ui/ProductGrid";
import HomePageContent from "@/components/products/sections/HomePageContent";

export default function HomePage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"><ProductGridSkeleton count={PRODUCTS_PER_PAGE} /></div>}>
      <HomePageContent />
    </Suspense>
  );
}
