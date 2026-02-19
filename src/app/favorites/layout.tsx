import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Favorites",
    description: "Your saved and favorited products on ShopHub.",
};

export default function FavoritesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
