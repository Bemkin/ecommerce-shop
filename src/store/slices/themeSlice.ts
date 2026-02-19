import { createSlice } from "@reduxjs/toolkit";

interface ThemeState {
    darkMode: boolean;
}

const getInitialState = (): ThemeState => {
    if (typeof window === "undefined") return { darkMode: false };
    try {
        const saved = localStorage.getItem("theme");
        return saved ? JSON.parse(saved) : { darkMode: false };
    } catch {
        return { darkMode: false };
    }
};

const themeSlice = createSlice({
    name: "theme",
    initialState: getInitialState(),
    reducers: {
        toggleDarkMode: (state) => {
            state.darkMode = !state.darkMode;
        },
    },
});

export const { toggleDarkMode } = themeSlice.actions;
export default themeSlice.reducer;
