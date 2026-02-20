import { useCallback } from "react";

/**
 * A custom hook to trigger a "Fly to Cart" animation.
 * It creates a clone of the product image and animates it towards the #cart-icon anchor.
 */
export function useFlyToCart() {
    const flyToCart = useCallback((sourceImage: string, event: React.MouseEvent | MouseEvent) => {
        const cartIcon = document.getElementById("cart-icon");
        if (!cartIcon) return;

        // 1. Get positions
        const cartRect = cartIcon.getBoundingClientRect();

        // Use the event target or currentTarget to find the source image container if possible
        // But for simplicity and reliability, we'll create the flying element at the click coordinates
        const startX = event.clientX;
        const startY = event.clientY;

        // 2. Create the flying element
        const flyer = document.createElement("img");
        flyer.src = sourceImage;
        flyer.style.position = "fixed";
        flyer.style.left = `${startX - 25}px`;
        flyer.style.top = `${startY - 25}px`;
        flyer.style.width = "50px";
        flyer.style.height = "50px";
        flyer.style.objectFit = "cover";
        flyer.style.borderRadius = "50%";
        flyer.style.zIndex = "1000";
        flyer.style.pointerEvents = "none";
        flyer.style.boxShadow = "0 10px 25px rgba(0,0,0,0.2)";
        flyer.style.border = "2px solid white";
        flyer.style.transition = "all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
        flyer.style.transform = "scale(1)";
        flyer.style.opacity = "1";

        document.body.appendChild(flyer);

        // 3. Trigger animation after a tiny delay for CSS to catch up
        requestAnimationFrame(() => {
            flyer.style.left = `${cartRect.left + cartRect.width / 2 - 10}px`;
            flyer.style.top = `${cartRect.top + cartRect.height / 2 - 10}px`;
            flyer.style.width = "20px";
            flyer.style.height = "20px";
            flyer.style.opacity = "0.5";
            flyer.style.transform = "scale(0.5) rotate(45deg)";
        });

        // 4. Cleanup
        setTimeout(() => {
            flyer.remove();

            // Add a little "bounce" to the cart icon
            cartIcon.classList.add("animate-bounce");
            setTimeout(() => cartIcon.classList.remove("animate-bounce"), 1000);
        }, 800);
    }, []);

    return { flyToCart };
}
