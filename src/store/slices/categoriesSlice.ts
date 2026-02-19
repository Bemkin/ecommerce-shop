import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Category } from "@/lib/types";
import { getCategories } from "@/lib/api";

interface CategoriesState {
    items: Category[];
    loading: boolean;
    error: string | null;
    lastFetched: number | null;
}

const initialState: CategoriesState = {
    items: [],
    loading: false,
    error: null,
    lastFetched: null,
};

export const fetchCategories = createAsyncThunk(
    "categories/fetchCategories",
    async (_, { getState }) => {
        const { categories } = getState() as { categories: CategoriesState };

        // Simple cache: if we have items, don't refetch
        if (categories.items.length > 0) {
            return categories.items;
        }

        const response = await getCategories();
        return response;
    }
);

const categoriesSlice = createSlice({
    name: "categories",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategories.pending, (state) => {
                if (state.items.length === 0) {
                    state.loading = true;
                }
                state.error = null;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
                state.lastFetched = Date.now();
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to load categories";
            });
    },
});

export default categoriesSlice.reducer;
