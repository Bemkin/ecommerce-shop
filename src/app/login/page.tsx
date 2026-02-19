"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { login } from "@/store/slices/authSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "sonner";

const FEATURES = [
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7.5 4.27 9 5.15" /><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" /></svg>
        ),
        title: "Product Catalog",
        desc: "Browse, search, and filter hundreds of products",
    },
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>
        ),
        title: "Favorites",
        desc: "Save and manage your favorite products",
    },
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" /></svg>
        ),
        title: "Full CRUD",
        desc: "Create, edit, and delete products seamlessly",
    },
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></svg>
        ),
        title: "Dark Mode",
        desc: "Beautiful light and dark themes",
    },
];

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useAppDispatch();
    const router = useRouter();
    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

    useEffect(() => {
        if (isAuthenticated) {
            router.replace("/");
        }
    }, [isAuthenticated, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username.trim() || !password.trim()) {
            toast.error("Please enter a username and password");
            return;
        }
        setIsLoading(true);
        // Simulate network delay for realism
        await new Promise((resolve) => setTimeout(resolve, 300));
        dispatch(login({ username: username.trim() }));
        toast.success("Welcome back!");
        setIsLoading(false);
    };

    if (isAuthenticated) return null;

    return (
        <div className="min-h-[100dvh] grid lg:grid-cols-2">
            {/* Left — Branding Panel */}
            <div className="hidden lg:flex flex-col justify-between p-10 bg-gradient-to-br from-primary via-primary/90 to-primary/70 animate-gradient text-primary-foreground">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm font-bold text-lg">
                            S
                        </div>
                        <span className="font-bold text-2xl tracking-tight">ShopHub</span>
                    </div>
                    <p className="text-primary-foreground/70 text-sm mt-1">
                        Modern eCommerce Experience
                    </p>
                </div>

                <div className="space-y-6">
                    {FEATURES.map((feat, i) => (
                        <motion.div
                            key={feat.title}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                            className="flex items-start gap-4"
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/15 backdrop-blur-sm flex-shrink-0">
                                {feat.icon}
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm">{feat.title}</h3>
                                <p className="text-primary-foreground/70 text-sm">{feat.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <p className="text-xs text-primary-foreground/50">
                    Built with Next.js 16 · TypeScript · Tailwind CSS · Shadcn UI · Redux Toolkit
                </p>
            </div>

            {/* Right — Login Form */}
            <div className="flex items-center justify-center p-6 sm:p-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-sm"
                >
                    {/* Mobile logo */}
                    <div className="flex items-center gap-2.5 mb-8 lg:hidden">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
                            S
                        </div>
                        <span className="font-bold text-xl tracking-tight">ShopHub</span>
                    </div>

                    <Card className="border-border/50 shadow-xl shadow-primary/5">
                        <CardHeader className="space-y-1 pb-2">
                            <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
                            <p className="text-sm text-muted-foreground">
                                Enter any credentials to sign in
                            </p>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="username">Username</Label>
                                    <Input
                                        id="username"
                                        name="username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder="demo"
                                        autoFocus
                                        className="h-11"
                                        autoComplete="username"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="h-11"
                                        autoComplete="current-password"
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full h-11 font-medium"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <span className="flex items-center gap-2">
                                            <svg
                                                className="animate-spin h-4 w-4"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                />
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                                />
                                            </svg>
                                            Signing in...
                                        </span>
                                    ) : (
                                        "Sign In"
                                    )}
                                </Button>
                            </form>

                            <div className="mt-6 pt-4 border-t">
                                <p className="text-xs text-center text-muted-foreground">
                                    This is a demo app — any username and password will work
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
