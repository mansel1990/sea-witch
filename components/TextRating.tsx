import { Star } from "lucide-react";

export default function TextRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-2">
      <div className="flex">
        {/* Full stars */}
        {[...Array(fullStars)].map((_, i) => (
          <Star
            key={`full-${i}`}
            className="text-yellow-400 fill-yellow-400 w-5 h-5 transition-all duration-200 hover:scale-110 hover:text-yellow-300"
          />
        ))}

        {/* Half star */}
        {halfStar && (
          <Star
            key="half"
            className="text-yellow-400 fill-yellow-400 w-5 h-5 opacity-75 transition-all duration-200 hover:scale-110 hover:opacity-100"
          />
        )}

        {/* Empty stars */}
        {[...Array(emptyStars)].map((_, i) => (
          <Star
            key={`empty-${i}`}
            className="text-gray-400 w-5 h-5 transition-all duration-200 hover:scale-110 hover:text-gray-300"
          />
        ))}
      </div>
      <span className="ml-2 text-sm text-white/80 font-medium">
        {rating.toFixed(1)}/5
      </span>
    </div>
  );
}
