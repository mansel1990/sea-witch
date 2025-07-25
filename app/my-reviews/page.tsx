/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useRef, useState } from "react";
import { useUser } from "@clerk/nextjs";
import getUserRatings, { UserRating } from "@/lib/api/getUserRatings";
import PageSkeleton from "@/components/ui/PageSkeleton";

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w300_and_h450_bestv2";

export default function MyReviewsPage() {
  const { user, isLoaded } = useUser();
  const [allRatings, setAllRatings] = useState<UserRating[]>([]);
  const [filteredRatings, setFilteredRatings] = useState<UserRating[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // ✅ Fetch ratings only once on mount
  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    getUserRatings(user.id)
      .then((data) => {
        setAllRatings(data);
        setFilteredRatings(data);
      })
      .catch(() => {
        setAllRatings([]);
        setFilteredRatings([]);
      })
      .finally(() => setLoading(false));
  }, [user?.id]);

  // ✅ Debounced search inside onChange
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value); // Update visible input immediately

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      const lower = value.trim().toLowerCase();
      if (!lower) {
        setFilteredRatings(allRatings);
      } else {
        setFilteredRatings(
          allRatings.filter((r) => r.movie_title.toLowerCase().includes(lower))
        );
      }
    }, 500);
  };

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
      <div className="mb-6 max-w-md">
        <input
          type="text"
          value={query}
          onChange={handleSearchChange}
          placeholder="Search your reviews..."
          className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
        />
      </div>
      {filteredRatings.length === 0 ? (
        <p className="text-gray-400">You haven&apos;t rated any movies yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredRatings.map((rating) => (
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
