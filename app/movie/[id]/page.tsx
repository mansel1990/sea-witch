"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { movies } from "../../../components/movies";
import { generateImageUrl, ImageSizes } from "../../../components/tmdb";
import TextRating from "../../../components/TextRating";
import { Button } from "../../../components/ui/button";
import { BookmarkPlus, Eye, EyeOff, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Movie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  backdrop_path: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
}

interface MovieState {
  viewed: boolean;
  userRating: number | null;
}

export default function MoviePage() {
  const params = useParams();
  const movieId = parseInt(params.id as string);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [movieState, setMovieState] = useState<MovieState>({
    viewed: false,
    userRating: null,
  });
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  useEffect(() => {
    const foundMovie = movies.results.find((m) => m.id === movieId);
    if (foundMovie) {
      setMovie(foundMovie);
    }
  }, [movieId]);

  const toggleViewed = () => {
    setMovieState((prev) => ({ ...prev, viewed: !prev.viewed }));
  };

  const handleRating = (rating: number) => {
    setMovieState((prev) => ({
      ...prev,
      userRating: rating,
      viewed: true, // Automatically mark as watched when rated
    }));
  };

  const handleStarHover = (rating: number) => {
    setHoverRating(rating);
  };

  const handleStarLeave = () => {
    setHoverRating(null);
  };

  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            Movie Not Found
          </h1>
          <p className="text-gray-400">
            The movie you're looking for doesn't exist.
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
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
      </div>

      {/* Hero Section with Backdrop */}
      <div
        className="relative h-[60vh] bg-cover bg-center"
        style={{
          backgroundImage: `url(${generateImageUrl(
            movie.backdrop_path,
            ImageSizes.backdrop
          )})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

        <div className="relative z-10 h-full flex items-end">
          <div className="container mx-auto px-6 pb-16">
            <div className="flex flex-col md:flex-row gap-8 items-end">
              {/* Movie Poster */}
              <div className="flex-shrink-0">
                <img
                  src={generateImageUrl(movie.poster_path, ImageSizes.poster)}
                  alt={movie.title}
                  className="w-32 h-48 md:w-48 md:h-72 object-cover rounded-lg shadow-2xl"
                />
              </div>

              {/* Movie Info */}
              <div className="flex-1">
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 mt-8">
                  {movie.title}
                </h1>
                <div className="flex items-center gap-4 mb-4">
                  <TextRating rating={movie.vote_average / 2} />
                  <span className="text-white/70">
                    • {new Date(movie.release_date).getFullYear()}
                  </span>
                  {movieState.viewed && (
                    <span className="text-green-400 font-medium">✓ Viewed</span>
                  )}
                </div>
                <p className="text-lg text-white/90 max-w-3xl mb-6">
                  {movie.overview}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 text-sm sm:text-base">
                    <BookmarkPlus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Add to Watchlist
                  </Button>
                  <Button
                    variant="outline"
                    onClick={toggleViewed}
                    className={`border-2 font-semibold px-6 py-3 text-sm sm:text-base ${
                      movieState.viewed
                        ? "border-green-500 text-green-400 hover:bg-green-500 hover:text-white"
                        : "border-white text-white hover:bg-white hover:text-black"
                    }`}
                  >
                    {movieState.viewed ? (
                      <>
                        <EyeOff className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        Mark as Unwatched
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        Mark as Watched
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rating Section */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold text-white mb-6">
            Rate this movie
          </h2>

          {/* Interactive Rating Stars */}
          <div className="mb-6">
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <div key={star} className="relative w-8 h-8 group">
                  {/* Half star (left side) */}
                  <button
                    onClick={() => handleRating(star - 0.5)}
                    onMouseEnter={() => handleStarHover(star - 0.5)}
                    onMouseLeave={handleStarLeave}
                    className="absolute left-0 top-0 w-4 h-8 z-10 hover:bg-yellow-400/20 rounded-l-full"
                    aria-label={`Rate ${star - 0.5} stars`}
                  />

                  {/* Full star (right side) */}
                  <button
                    onClick={() => handleRating(star)}
                    onMouseEnter={() => handleStarHover(star)}
                    onMouseLeave={handleStarLeave}
                    className="absolute right-0 top-0 w-4 h-8 z-10 hover:bg-yellow-400/20 rounded-r-full"
                    aria-label={`Rate ${star} stars`}
                  />

                  {/* Visual star with proper half-star display */}
                  <div className="w-8 h-8 flex items-center justify-center relative">
                    {/* Background star (always gray) */}
                    <div className="w-8 h-8 text-gray-400 absolute flex items-center justify-center text-2xl">
                      ★
                    </div>

                    {/* Foreground star (colored based on rating) */}
                    <div className="w-8 h-8 relative overflow-hidden flex items-center justify-center">
                      <div
                        className={`w-8 h-8 transition-all duration-200 flex items-center justify-center text-2xl ${
                          (hoverRating || movieState.userRating || 0) >= star
                            ? "text-yellow-400 fill-yellow-400"
                            : (hoverRating || movieState.userRating || 0) >=
                              star - 0.5
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-transparent"
                        }`}
                        style={{
                          clipPath:
                            (hoverRating || movieState.userRating || 0) >= star
                              ? "inset(0 0 0 0)"
                              : (hoverRating || movieState.userRating || 0) >=
                                star - 0.5
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
              {movieState.userRating && (
                <span className="ml-3 text-white/80 font-medium text-lg">
                  Your rating: {movieState.userRating}/5
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
