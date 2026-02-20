"use client";

import { useEffect } from "react";

/**
 * Disables the browser's default scroll restoration.
 * This forces the browser to allow manual scroll management (like our ScrollToTop component)
 * to take precedence, preventing "jump to footer" issues during back navigation.
 */
export default function ScrollRestoration() {
    useEffect(() => {
        if ("scrollRestoration" in window.history) {
            window.history.scrollRestoration = "manual";
        }

        // Cleanup: Reset to auto when unmounting (optional, but good practice if this component is removed)
        return () => {
            if ("scrollRestoration" in window.history) {
                // We keep it manual for this app's lifecycle to ensure consistency
                // window.history.scrollRestoration = "auto"; 
            }
        };
    }, []);

    return null;
}
