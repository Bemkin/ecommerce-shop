"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * A global utility component that resets window scroll to (0,0) on route changes.
 * This ensures a consistent user experience and prevents "jump to footer" issues
 * during page transitions.
 */
export default function ScrollToTop() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        // Reset scroll position on route change
        window.scrollTo(0, 0);
    }, [pathname, searchParams]);

    return null;
}
