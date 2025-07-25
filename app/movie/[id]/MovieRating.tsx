import React from "react";
import RatingStars from "@/components/RatingStars";

export default function MovieRating({
  value,
  onChange,
  onDelete,
  clerkUserId,
  movieId,
  loading,
  title,
}: {
  value: number | null;
  onChange: (rating: number) => void;
  onDelete?: () => void;
  clerkUserId?: string;
  movieId?: number;
  loading?: boolean;
  title?: string;
}) {
  return (
    <div className="mb-6">
      <RatingStars
        value={value}
        onChange={onChange}
        onDelete={value !== null ? onDelete : undefined}
        clerkUserId={clerkUserId}
        movieId={movieId}
        title={title}
      />
      {loading ? (
        <span className="ml-3 text-white/80 font-medium text-lg">
          Loading rating...
        </span>
      ) : (
        value && (
          <span className="ml-3 text-white/80 font-medium text-lg">
            Your rating: {value}/5
          </span>
        )
      )}
    </div>
  );
}
