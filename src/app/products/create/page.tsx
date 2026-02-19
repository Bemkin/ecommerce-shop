"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { ProductForm } from "@/components/products";
import { createProduct } from "@/lib/api";
import { CreateProductData } from "@/lib/types";
import { toast } from "sonner";
import Link from "next/link";

export default function CreateProductPage() {
    const router = useRouter();
    const isAuthenticated = useAuthGuard();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (data: CreateProductData) => {
        setIsLoading(true);
        try {
            const newProduct = await createProduct(data);
            toast.success(`"${newProduct.title}" created successfully!`);
            router.push("/");
        } catch {
            toast.error("Failed to create product. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isAuthenticated) return null;

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="m12 19-7-7 7-7" />
                    <path d="M19 12H5" />
                </svg>
                Back to products
            </Link>

            <ProductForm
                onSubmit={handleSubmit}
                isLoading={isLoading}
                submitLabel="Create Product"
            />
        </div>
    );
}
