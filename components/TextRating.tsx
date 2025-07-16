import { Star } from "lucide-react";

const labels: Record<number, string> = {
  0.5: "Useless",
  1: "Useless+",
  1.5: "Poor",
  2: "Poor+",
  2.5: "Ok",
  3: "Ok+",
  3.5: "Good",
  4: "Good+",
  4.5: "Excellent",
  5: "Excellent+",
};

export default function TextRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  return (
    <div className="flex items-center gap-2">
      <div className="flex">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={i} className="text-yellow-500 fill-yellow-400 w-5 h-5" />
        ))}
        {halfStar && (
          <Star className="text-yellow-500 fill-yellow-400 w-5 h-5 opacity-50" />
        )}
      </div>
      <span className="ml-2 text-sm text-muted-foreground">
        {labels[rating]}
      </span>
    </div>
  );
}
