"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateProductData } from "@/lib/types";
import { useAppSelector } from "@/store/hooks";

interface ProductFormProps {
    initialData?: Partial<CreateProductData>;
    onSubmit: (data: CreateProductData) => void;
    isLoading?: boolean;
    submitLabel?: string;
}

export default function ProductForm({
    initialData,
    onSubmit,
    isLoading = false,
    submitLabel = "Create Product",
}: ProductFormProps) {
    const [title, setTitle] = useState(initialData?.title || "");
    const [description, setDescription] = useState(
        initialData?.description || ""
    );
    const [price, setPrice] = useState(
        initialData?.price?.toString() || ""
    );
    const [stock, setStock] = useState(
        initialData?.stock?.toString() || ""
    );
    const [brand, setBrand] = useState(initialData?.brand || "");
    const [category, setCategory] = useState(initialData?.category || "");
    const [errors, setErrors] = useState<Record<string, string>>({});
    const categories = useAppSelector((state) => state.categories.items);

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!title.trim()) newErrors.title = "Title is required";
        if (!description.trim()) newErrors.description = "Description is required";
        if (!price || parseFloat(price) <= 0)
            newErrors.price = "Price must be a positive number";
        if (!stock || parseInt(stock) < 0)
            newErrors.stock = "Stock must be a non-negative number";
        if (!brand.trim()) newErrors.brand = "Brand is required";
        if (!category) newErrors.category = "Category is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        onSubmit({
            title: title.trim(),
            description: description.trim(),
            price: parseFloat(price),
            stock: parseInt(stock),
            brand: brand.trim(),
            category,
        });
    };

    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>{submitLabel}</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Product title"
                            className={errors.title ? "border-destructive" : ""}
                        />
                        {errors.title && (
                            <p className="text-xs text-destructive">{errors.title}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Product description"
                            rows={4}
                            className={errors.description ? "border-destructive" : ""}
                        />
                        {errors.description && (
                            <p className="text-xs text-destructive">{errors.description}</p>
                        )}
                    </div>

                    {/* Price & Stock */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="price">Price ($)</Label>
                            <Input
                                id="price"
                                type="number"
                                step="0.01"
                                min="0"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                placeholder="0.00"
                                className={errors.price ? "border-destructive" : ""}
                            />
                            {errors.price && (
                                <p className="text-xs text-destructive">{errors.price}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="stock">Stock</Label>
                            <Input
                                id="stock"
                                type="number"
                                min="0"
                                value={stock}
                                onChange={(e) => setStock(e.target.value)}
                                placeholder="0"
                                className={errors.stock ? "border-destructive" : ""}
                            />
                            {errors.stock && (
                                <p className="text-xs text-destructive">{errors.stock}</p>
                            )}
                        </div>
                    </div>

                    {/* Brand */}
                    <div className="space-y-2">
                        <Label htmlFor="brand">Brand</Label>
                        <Input
                            id="brand"
                            value={brand}
                            onChange={(e) => setBrand(e.target.value)}
                            placeholder="Brand name"
                            className={errors.brand ? "border-destructive" : ""}
                        />
                        {errors.brand && (
                            <p className="text-xs text-destructive">{errors.brand}</p>
                        )}
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                        <Label>Category</Label>
                        <Select value={category} onValueChange={setCategory}>
                            <SelectTrigger
                                className={errors.category ? "border-destructive" : ""}
                            >
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((cat) => (
                                    <SelectItem key={cat.slug} value={cat.slug}>
                                        {cat.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.category && (
                            <p className="text-xs text-destructive">{errors.category}</p>
                        )}
                    </div>

                    {/* Submit */}
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
                        size="lg"
                    >
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <svg
                                    className="animate-spin h-4 w-4"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                    />
                                </svg>
                                Saving...
                            </span>
                        ) : (
                            submitLabel
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
