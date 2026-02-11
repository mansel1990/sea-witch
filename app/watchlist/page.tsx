/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { generateImageUrl, ImageSizes } from "@/components/tmdb";
import getUserWatchlist, { WatchlistMovie } from "@/lib/api/getUserWatchlist";
import { removeFromWatchlist } from "@/lib/api/removeFromWatchlist";
import { ArrowLeft, Bookmark, Calendar, Star, Trash2 } from "lucide-react";

export default function WatchlistPage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const { showToast } = useToast();
  const [watchlist, setWatchlist] = useState<WatchlistMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingMovieId, setRemovingMovieId] = useState<number | null>(null);

  const handleRemoveFromWatchlist = async (movieId: number) => {
    if (!user?.id) {
      showToast("Please log in to remove movies from your watchlist.");
      return;
    }

    setRemovingMovieId(movieId);
    try {
      await removeFromWatchlist(user.id, movieId);
      setWatchlist((prev) =>
        prev.filter((movie) => movie.movie_id !== movieId)
      );
      showToast("Movie removed from watchlist successfully!");
    } catch {
      showToast("Failed to remove movie from watchlist.");
    } finally {
      setRemovingMovieId(null);
    }
  };

  useEffect(() => {
    async function fetchWatchlist() {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await getUserWatchlist(user.id);
        setWatchlist(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
        showToast("Failed to load watchlist");
      } finally {
        setLoading(false);
      }
    }

    fetchWatchlist();
  }, [user?.id, showToast]);

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            Sign In Required
          </h1>
          <p className="text-gray-400 mb-6">
            Please sign in to view your watchlist.
          </p>
          <Link href="/">
            <Button className="bg-red-600 hover:bg-red-700">Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-gray-800"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Bookmark className="w-6 h-6 text-red-500" />
              <h1 className="text-3xl font-bold text-white">My Watchlist</h1>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-800 rounded-lg h-48 mb-2"></div>
                <div className="bg-gray-800 rounded h-4 mb-1"></div>
                <div className="bg-gray-800 rounded h-3 w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            Error Loading Watchlist
          </h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <Link href="/">
            <Button className="bg-red-600 hover:bg-red-700">Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-gray-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Bookmark className="w-6 h-6 text-red-500" />
            <h1 className="text-3xl font-bold text-white">My Watchlist</h1>
            <span className="text-gray-400 text-lg">({watchlist.length})</span>
          </div>
        </div>

        {/* Watchlist Grid */}
        {watchlist.length === 0 ? (
          <div className="text-center py-16">
            <Bookmark className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">
              Your watchlist is empty
            </h2>
            <p className="text-gray-400 mb-6">
              Start adding movies to your watchlist to see them here.
            </p>
            <Link href="/">
              <Button className="bg-red-600 hover:bg-red-700">
                Browse Movies
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {watchlist.map((movie) => (
              <div key={movie.id} className="relative group">
                {/* Delete Button */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleRemoveFromWatchlist(movie.movie_id);
                  }}
                  disabled={removingMovieId === movie.movie_id}
                  className="absolute top-2 right-2 z-10 bg-red-600 hover:bg-red-700 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Remove from watchlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <Link href={`/movie/${movie.movie_id}`}>
                  <div className="group relative rounded-lg overflow-hidden shadow-lg bg-gray-900 hover:scale-105 transition-all duration-300 cursor-pointer">
                    {/* Movie Poster */}
                    <div className="relative">
                      <img
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                        src={generateImageUrl(
                          movie.movie_poster_path,
                          ImageSizes.poster
                        )}
                        alt={movie.movie_title}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/placeholder-movie.jpg";
                        }}
                      />

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Rating Badge */}
                      {movie.movie_vote_average > 0 && (
                        <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span className="text-xs text-white font-medium">
                            {movie.movie_vote_average.toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Movie Info */}
                    <div className="p-3">
                      <h3 className="font-semibold text-sm text-white truncate mb-1 group-hover:text-red-400 transition-colors">
                        {movie.movie_title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {movie.movie_release_date
                            ? new Date(movie.movie_release_date).getFullYear()
                            : "N/A"}
                        </span>
                      </div>
                      <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed">
                        {movie.movie_overview}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
