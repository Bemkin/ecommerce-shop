import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import Providers from "@/components/layout/Providers";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/shared/ScrollToTop";
import ScrollRestoration from "@/components/shared/ScrollRestoration";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | ShopHub",
    default: "ShopHub — Modern eCommerce Experience",
  },
  description:
    "Explore ShopHub for the latest products in electronics, fashion, home grooming, and more. Manage your favorites and browse a curated catalog.",
  keywords: ["ecommerce", "shopping", "nextjs", "react", "products"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <Providers>
          <Suspense fallback={<div className="h-16 border-b bg-background/95 backdrop-blur py-1 flex items-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" />}>
            <Header />
          </Suspense>
          <ScrollToTop />
          <ScrollRestoration />
          <main className="min-h-[calc(100vh-4rem)]">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}

