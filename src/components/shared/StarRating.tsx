"use client";

import React from "react";

interface StarRatingProps {
    rating: number;
    reviewsCount?: number;
    showRatingValue?: boolean;
    className?: string;
}

export const StarRating = React.memo(function StarRating({
    rating,
    reviewsCount,
    showRatingValue = true,
    className = ""
}: StarRatingProps) {
    const roundedRating = Math.round(rating);

    return (
        <div
            className={`flex items-center gap-1 ${className}`}
            role="img"
            aria-label={`Rating: ${rating.toFixed(1)} out of 5 stars${reviewsCount ? `, ${reviewsCount} reviews` : ""}`}
        >
            <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                        key={star}
                        xmlns="http://www.w3.org/2000/svg"
                        width="10"
                        height="10"
                        viewBox="0 0 24 24"
                        fill={star <= roundedRating ? "currentColor" : "none"}
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={
                            star <= roundedRating
                                ? "text-amber-500"
                                : "text-muted-foreground/30"
                        }
                        aria-hidden="true"
                    >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                ))}
            </div>
            {showRatingValue && (
                <span className="text-[10px] font-bold text-foreground ml-0.5" aria-hidden="true">
                    {rating.toFixed(1)}
                </span>
            )}
            {reviewsCount !== undefined && (
                <span className="text-[10px] text-muted-foreground font-medium" aria-hidden="true">
                    ({reviewsCount})
                </span>
            )}
        </div>
    );
});

export default StarRating;
