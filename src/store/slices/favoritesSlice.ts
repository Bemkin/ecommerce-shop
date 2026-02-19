import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FavoritesState {
    ids: number[];
}

// Hydrate from localStorage — now storing only IDs instead of full Product objects.
// This significantly reduces the localStorage footprint and memory usage.
const getInitialState = (): FavoritesState => {
    if (typeof window === "undefined") return { ids: [] };
    try {
        const saved = localStorage.getItem("favorites");
        if (!saved) return { ids: [] };
        const parsed = JSON.parse(saved);
        // Handle migration from old format (array of Product objects) to new format (array of IDs)
        if (Array.isArray(parsed)) {
            if (parsed.length === 0) return { ids: [] };
            // Old format: [{id: 1, title: "...", ...}] → extract just the IDs
            if (typeof parsed[0] === "object" && "id" in parsed[0]) {
                return { ids: parsed.map((p: { id: number }) => p.id) };
            }
            // New format: [1, 2, 3]
            if (typeof parsed[0] === "number") {
                return { ids: parsed };
            }
        }
    } catch {
        // ignore parse errors
    }
    return { ids: [] };
};

const favoritesSlice = createSlice({
    name: "favorites",
    initialState: getInitialState(),
    reducers: {
        toggleFavorite: (state, action: PayloadAction<number>) => {
            const index = state.ids.indexOf(action.payload);
            if (index >= 0) {
                state.ids.splice(index, 1);
            } else {
                state.ids.push(action.payload);
            }
        },
        removeFavorite: (state, action: PayloadAction<number>) => {
            state.ids = state.ids.filter((id) => id !== action.payload);
        },
    },
});

export const { toggleFavorite, removeFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;
