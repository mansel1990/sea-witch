"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchMovieById } from "@/lib/api/fetchMovieById";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Movie } from "@/lib/types/movie";
import MovieHero from "./MovieHero";
import MovieActions from "./MovieActions";
import MovieRating from "./MovieRating";
import { authClient } from "@/lib/auth-client";
import rateMovie from "@/lib/api/rateMovie";
import { useToast } from "@/components/ui/toast";
import getUserRatings, { UserRating } from "@/lib/api/getUserRatings";
import { addToWatchlist } from "@/lib/api/addToWatchlist";

export default function MoviePage() {
  const params = useParams();
  const movieId = params.id;
  const [movie, setMovie] = useState<Movie | null>(null);
  const [movieState, setMovieState] = useState({
    viewed: false,
    userRating: null as number | null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const { showToast } = useToast();
  const [ratingLoading, setRatingLoading] = useState(false);

  useEffect(() => {
    async function fetchMovie() {
      setLoading(true);
      setError(null);
      try {
        if (typeof movieId === "string") {
          const data = await fetchMovieById(movieId);
          setMovie(data);
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    }
    if (movieId) fetchMovie();
  }, [movieId]);

  // Fetch user rating for this movie
  useEffect(() => {
    async function fetchUserRating() {
      if (!user?.id || !movieId) return;
      setRatingLoading(true);
      try {
        const ratings: UserRating[] = await getUserRatings(user.id);
        const found = ratings.find(
          (r) => String(r.movie_id) === String(movieId)
        );
        if (found) {
          setMovieState((prev) => ({
            ...prev,
            userRating: found.rating,
            viewed: true,
          }));
        }
      } catch {
        // Optionally handle error
      } finally {
        setRatingLoading(false);
      }
    }
    fetchUserRating();
  }, [user?.id, movieId]);

  const toggleViewed = () => {
    setMovieState((prev) => ({ ...prev, viewed: !prev.viewed }));
  };

  const handleRating = async (rating: number) => {
    setMovieState((prev) => ({
      ...prev,
      userRating: rating,
      viewed: true, // Automatically mark as watched when rated
    }));
    if (user && movie) {
      try {
        await rateMovie(user.id, movie.id, rating);
        showToast("Thank you for your rating");
      } catch {
        showToast("Failed to submit rating.");
      }
    }
  };

  const handleDeleteRating = () => {
    setMovieState((prev) => ({ ...prev, userRating: null }));
    showToast("Your rating was removed.");
  };

  const handleAddToWatchlist = async () => {
    if (!user?.id || !movie) {
      showToast("Please log in to add movies to your watchlist.");
      return;
    }

    try {
      await addToWatchlist(user.id, movie.id);
      showToast("Movie added to watchlist successfully!");
    } catch {
      showToast("Failed to add movie to watchlist.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }
  if (error || !movie) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            Movie Not Found
          </h1>
          <p className="text-gray-400">
            The movie you&apos;re looking for doesn&apos;t exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Back Button */}
      <div className="fixed top-20 left-4 z-50">
        <Link href="/">
          <Button
            variant="ghost"
            size="sm"
            className="bg-black/50 hover:bg-black/70 text-white border border-gray-600 hover:border-white transition-all duration-200"
          >
            Back
          </Button>
        </Link>
      </div>
      {/* Hero Section */}
      <MovieHero movie={movie} />
      {/* Actions Section */}
      <div className="relative z-20 container mx-auto px-6 pb-0">
        <div className="flex flex-col md:flex-row gap-8 items-end">
          <div className="flex-1">
            <MovieActions
              viewed={movieState.viewed}
              toggleViewed={toggleViewed}
              onAddToWatchlist={handleAddToWatchlist}
            />
          </div>
        </div>
      </div>
      {/* Rating Section */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-2xl">
          <MovieRating
            value={movieState.userRating}
            onChange={handleRating}
            onDelete={
              movieState.userRating !== null ? handleDeleteRating : undefined
            }
            userId={user?.id}
            movieId={movie?.id}
            loading={ratingLoading}
            title="Rate this movie"
          />
        </div>
      </div>
    </div>
  );
}
