import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";

/**
 * Custom hook that redirects unauthenticated users to the login page.
 * Returns the authentication status so components can conditionally render.
 */
export function useAuthGuard(): boolean {
    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.replace("/login");
        }
    }, [isAuthenticated, router]);

    return isAuthenticated;
}
