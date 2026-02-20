import { configureStore, Middleware } from "@reduxjs/toolkit";
import favoritesReducer from "./slices/favoritesSlice";
import themeReducer from "./slices/themeSlice";
import authReducer from "./slices/authSlice";
import categoriesReducer from "./slices/categoriesSlice";
import searchReducer from "./slices/searchSlice";
import cartReducer from "./slices/cartSlice";
import notificationReducer from "./slices/notificationSlice";
import uiReducer from "./slices/uiSlice";
import checkoutReducer from "./slices/checkoutSlice";

let persistenceTimeout: NodeJS.Timeout;

const persistenceMiddleware: Middleware = (store) => (next) => (action) => {
    const previousState = store.getState() as RootState;
    const result = next(action);
    const currentState = store.getState() as RootState;

    // Only persist if specific relevant slices have changed
    if (
        previousState.favorites !== currentState.favorites ||
        previousState.theme !== currentState.theme ||
        previousState.auth !== currentState.auth ||
        previousState.cart !== currentState.cart ||
        previousState.notifications !== currentState.notifications
    ) {
        if (typeof window !== "undefined") {
            // Debounce writes to avoid blocking the main thread during rapid actions
            clearTimeout(persistenceTimeout);
            persistenceTimeout = setTimeout(() => {
                try {
                    localStorage.setItem("favorites", JSON.stringify(currentState.favorites.ids));
                    localStorage.setItem("theme", JSON.stringify(currentState.theme));
                    // Auth uses sessionStorage: persists on refresh but clears when browser is closed
                    sessionStorage.setItem("auth", JSON.stringify(currentState.auth));
                    localStorage.setItem("shophub_cart", JSON.stringify(currentState.cart.items));
                    localStorage.setItem("notifications", JSON.stringify(currentState.notifications.notifications));
                } catch (e) {
                    console.error("Failed to persist state:", e);
                }
            }, 500);
        }
    }

    return result;
};

export const store = configureStore({
    reducer: {
        favorites: favoritesReducer,
        theme: themeReducer,
        auth: authReducer,
        categories: categoriesReducer,
        search: searchReducer,
        cart: cartReducer,
        notifications: notificationReducer,
        ui: uiReducer,
        checkout: checkoutReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(persistenceMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
