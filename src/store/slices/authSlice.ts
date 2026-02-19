import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
    isAuthenticated: boolean;
    user: { username: string } | null;
}

// Hydrate from sessionStorage so a page refresh within the same tab keeps the user logged in.
// sessionStorage is deliberately used over localStorage here so that closing the browser
// (or opening a new tab) requires a fresh login — appropriate for a demo app.
const getInitialState = (): AuthState => {
    if (typeof window === "undefined") return { isAuthenticated: false, user: null };
    try {
        const saved = sessionStorage.getItem("auth");
        if (saved) return JSON.parse(saved);
    } catch {
        // ignore parse errors
    }
    return { isAuthenticated: false, user: null };
};

const authSlice = createSlice({
    name: "auth",
    initialState: getInitialState(),
    reducers: {
        login: (state, action: PayloadAction<{ username: string }>) => {
            state.isAuthenticated = true;
            state.user = action.payload;
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
        },
    },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
