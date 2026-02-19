import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "@/lib/types";

export interface CartItem extends Product {
    quantity: number;
    selectedVariant?: string;
}

interface CartState {
    items: CartItem[];
    isOpen: boolean;
}

const getInitialState = (): CartState => {
    if (typeof window === "undefined") return { items: [], isOpen: false };

    try {
        const savedCart = localStorage.getItem("shophub_cart");
        return {
            items: savedCart ? JSON.parse(savedCart) : [],
            isOpen: false,
        };
    } catch (error) {
        console.error("Failed to load cart from localStorage:", error);
        return { items: [], isOpen: false };
    }
};

const initialState: CartState = getInitialState();

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<CartItem>) => {
            const existingItem = state.items.find(
                (item) =>
                    item.id === action.payload.id &&
                    item.selectedVariant === action.payload.selectedVariant
            );

            if (existingItem) {
                existingItem.quantity += action.payload.quantity;
            } else {
                state.items.push(action.payload);
            }

            // Optional: Open drawer on add
            state.isOpen = true;
        },
        removeFromCart: (state, action: PayloadAction<{ id: number; selectedVariant?: string }>) => {
            state.items = state.items.filter(
                (item) =>
                    !(item.id === action.payload.id && item.selectedVariant === action.payload.selectedVariant)
            );
        },
        updateQuantity: (
            state,
            action: PayloadAction<{ id: number; selectedVariant?: string; quantity: number }>
        ) => {
            const item = state.items.find(
                (item) =>
                    item.id === action.payload.id &&
                    item.selectedVariant === action.payload.selectedVariant
            );
            if (item) {
                item.quantity = Math.max(1, action.payload.quantity);
            }
        },
        clearCart: (state) => {
            state.items = [];
        },
        toggleCart: (state) => {
            state.isOpen = !state.isOpen;
        },
        setCartOpen: (state, action: PayloadAction<boolean>) => {
            state.isOpen = action.payload;
        },
    },
});

export const {
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleCart,
    setCartOpen
} = cartSlice.actions;

export default cartSlice.reducer;
