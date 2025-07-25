import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import { useToast } from "./ui/toast";
import deleteUserRating from "@/lib/api/deleteUserRating";

interface RatingStarsProps {
  value: number | null;
  onChange: (rating: number) => void;
  title?: string;
  className?: string;
  onDelete?: () => void;
  clerkUserId?: string;
  movieId?: number;
}

const STAR_COUNT = 5;

export default function RatingStars({
  value,
  onChange,
  title,
  className = "",
  onDelete,
  clerkUserId,
  movieId,
}: RatingStarsProps) {
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const { showToast } = useToast();

  const handleDelete = async () => {
    if (!clerkUserId || !movieId) {
      showToast("Missing user or movie info");
      return;
    }
    try {
      await deleteUserRating(clerkUserId, movieId);
      showToast("Your rating was removed.");
      if (onDelete) onDelete();
    } catch {
      showToast("Failed to delete rating.");
    }
  };

  return (
    <div className={className}>
      {title && (
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-5 bg-red-600 rounded mr-1" />
          <span className="text-base md:text-lg font-semibold text-white">
            {title}
          </span>
        </div>
      )}
      <div className="flex items-center gap-2">
        {Array.from({ length: STAR_COUNT }, (_, i) => i + 1).map((star) => (
          <div key={star} className="relative w-7 h-7 group">
            {/* Half star (left side) */}
            <button
              type="button"
              onClick={() => onChange(star - 0.5)}
              onMouseEnter={() => setHoverRating(star - 0.5)}
              onMouseLeave={() => setHoverRating(null)}
              className="absolute left-0 top-0 w-3.5 h-7 z-10 hover:bg-yellow-400/20 rounded-l-full"
              aria-label={`Rate ${star - 0.5} stars`}
            />
            {/* Full star (right side) */}
            <button
              type="button"
              onClick={() => onChange(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(null)}
              className="absolute right-0 top-0 w-3.5 h-7 z-10 hover:bg-yellow-400/20 rounded-r-full"
              aria-label={`Rate ${star} stars`}
            />
            {/* Visual star with proper half-star display */}
            <div className="w-7 h-7 flex items-center justify-center relative">
              {/* Background star (always gray) */}
              <div className="w-7 h-7 text-gray-400 absolute flex items-center justify-center text-xl">
                ★
              </div>
              {/* Foreground star (colored based on rating) */}
              <div className="w-7 h-7 relative overflow-hidden flex items-center justify-center">
                <div
                  className={`w-7 h-7 transition-all duration-200 flex items-center justify-center text-xl ${
                    (hoverRating ?? value ?? 0) >= star
                      ? "text-yellow-400 fill-yellow-400"
                      : (hoverRating ?? value ?? 0) >= star - 0.5
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-transparent"
                  }`}
                  style={{
                    clipPath:
                      (hoverRating ?? value ?? 0) >= star
                        ? "inset(0 0 0 0)"
                        : (hoverRating ?? value ?? 0) >= star - 0.5
                        ? "inset(0 50% 0 0)"
                        : "inset(0 100% 0 0)",
                  }}
                >
                  ★
                </div>
              </div>
            </div>
          </div>
        ))}
        {onDelete && value !== null && (
          <button
            type="button"
            onClick={handleDelete}
            className="ml-2 p-1 rounded-full border border-transparent hover:border-red-600 hover:bg-red-600/10 text-red-600 transition flex items-center justify-center"
            title="Delete rating"
            aria-label="Delete rating"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
