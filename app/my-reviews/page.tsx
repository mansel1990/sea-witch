"use client";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import getUserRatings, { UserRating } from "@/lib/api/getUserRatings";
import PageSkeleton from "@/components/ui/PageSkeleton";

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w300_and_h450_bestv2";

export default function MyReviewsPage() {
  const { user, isLoaded } = useUser();
  const [ratings, setRatings] = useState<UserRating[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRatings() {
      if (!user?.id) return;
      setLoading(true);
      try {
        const data = await getUserRatings(user.id);
        setRatings(data);
      } catch {
        setRatings([]);
      } finally {
        setLoading(false);
      }
    }
    if (user?.id) fetchRatings();
  }, [user?.id]);

  if (!isLoaded || loading) {
    return (
      <div className="max-w-3xl mx-auto mt-8">
        <PageSkeleton />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Reviews</h1>
      {ratings.length === 0 ? (
        <p className="text-gray-400">You haven&apos;t rated any movies yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {ratings.map((rating) => (
            <div
              key={rating.movie_id}
              className="bg-gray-900 rounded-lg shadow p-3 flex flex-col items-center"
            >
              <img
                src={
                  rating.movie_poster_path
                    ? `${TMDB_IMAGE_BASE}${rating.movie_poster_path}`
                    : "/placeholder-poster.jpg"
                }
                alt={rating.movie_title}
                className="w-32 h-48 object-cover rounded mb-3"
              />
              <h3 className="text-white font-semibold text-center mb-2 truncate w-full">
                {rating.movie_title}
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-yellow-400 text-lg font-bold">
                  {rating.rating}/5
                </span>
                <span className="text-gray-400 text-xs">Your rating</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
