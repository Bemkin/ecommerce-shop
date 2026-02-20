import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UIState {
    quickViewProductId: number | null;
}

const initialState: UIState = {
    quickViewProductId: null,
};

const uiSlice = createSlice({
    name: "ui",
    initialState,
    reducers: {
        openQuickView: (state, action: PayloadAction<number>) => {
            state.quickViewProductId = action.payload;
        },
        closeQuickView: (state) => {
            state.quickViewProductId = null;
        },
    },
});

export const { openQuickView, closeQuickView } = uiSlice.actions;
export default uiSlice.reducer;
