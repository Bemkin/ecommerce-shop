import axios from "axios";
import { Product, ProductsResponse, Category, CreateProductData } from "./types";
import { toast } from "sonner";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "https://dummyjson.com",
    headers: {
        "Content-Type": "application/json",
    },
});

// Response interceptor for global error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Ignore cancelled requests (avoid showing "canceled" toasts)
        if (axios.isCancel(error)) {
            return Promise.reject(error);
        }

        // Only show global toast for non-401 errors (auth handles those)
        if (error.response?.status !== 401) {
            const message = error.response?.data?.message || error.message || "An unexpected error occurred";
            toast.error(message);
        }
        return Promise.reject(error);
    }
);

export async function getProducts(
    limit: number = 10,
    skip: number = 0,
    sortBy?: string,
    order?: "asc" | "desc",
    signal?: AbortSignal
): Promise<ProductsResponse> {
    const { data } = await api.get<ProductsResponse>("/products", {
        params: { limit, skip, ...(sortBy && { sortBy, order: order || "asc" }) },
        signal,
    });
    return data;
}

export async function searchProducts(
    query: string,
    limit: number = 10,
    skip: number = 0,
    signal?: AbortSignal
): Promise<ProductsResponse> {
    const { data } = await api.get<ProductsResponse>("/products/search", {
        params: { q: query, limit, skip },
        signal,
    });
    return data;
}

export async function getProduct(id: number, signal?: AbortSignal): Promise<Product> {
    const { data } = await api.get<Product>(`/products/${id}`, { signal });
    return data;
}

export async function getCategories(signal?: AbortSignal): Promise<Category[]> {
    const { data } = await api.get<Category[]>("/products/categories", { signal });
    return data;
}

export async function getProductsByCategory(
    category: string,
    limit: number = 10,
    skip: number = 0,
    signal?: AbortSignal
): Promise<ProductsResponse> {
    const { data } = await api.get<ProductsResponse>(
        `/products/category/${category}`,
        { params: { limit, skip }, signal }
    );
    return data;
}

export async function createProduct(
    productData: CreateProductData,
    signal?: AbortSignal
): Promise<Product> {
    const { data } = await api.post<Product>("/products/add", productData, {
        signal,
    });
    return data;
}

export async function updateProduct(
    id: number,
    productData: Partial<CreateProductData>,
    signal?: AbortSignal
): Promise<Product> {
    const { data } = await api.put<Product>(`/products/${id}`, productData, {
        signal,
    });
    return data;
}

export async function deleteProduct(
    id: number,
    signal?: AbortSignal
): Promise<Product & { isDeleted: boolean; deletedOn: string }> {
    const { data } = await api.delete(`/products/${id}`, { signal });
    return data;
}

export default api;

