"use client";

import { useEffect, useState } from "react";
import { generateImageUrl, ImageSizes } from "./tmdb";
import { movies } from "./movies";
import TextRating from "./TextRating";
import { Button } from "./ui/button";
import {
  ChevronLeft,
  ChevronRight,
  BookmarkPlus,
  Eye,
  EyeOff,
} from "lucide-react";

interface Movie {
  id: number;
  title?: string;
  name?: string;
  original_name?: string;
  overview?: string;
  backdrop_path?: string;
  vote_average?: number;
  release_date?: string;
}

interface MovieState {
  viewed: boolean;
  userRating: number | null;
}

export default function Banner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [bannerMovies, setBannerMovies] = useState<Movie[]>([]);
  const [movieStates, setMovieStates] = useState<Record<number, MovieState>>(
    {}
  );
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  useEffect(() => {
    const results = movies.results;
    // Get 5 random movies for the banner
    const shuffled = [...results].sort(() => 0.5 - Math.random());
    setBannerMovies(shuffled.slice(0, 5));
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (bannerMovies.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % bannerMovies.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [bannerMovies.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % bannerMovies.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + bannerMovies.length) % bannerMovies.length
    );
  };

  const currentMovie = bannerMovies[currentIndex];
  const currentMovieState = currentMovie
    ? movieStates[currentMovie.id] || { viewed: false, userRating: null }
    : null;

  const toggleViewed = () => {
    if (!currentMovie) return;
    setMovieStates((prev) => ({
      ...prev,
      [currentMovie.id]: {
        ...prev[currentMovie.id],
        viewed: !(prev[currentMovie.id]?.viewed || false),
      },
    }));
  };

  const handleRating = (rating: number) => {
    if (!currentMovie) return;
    setMovieStates((prev) => ({
      ...prev,
      [currentMovie.id]: {
        ...prev[currentMovie.id],
        userRating: rating,
        viewed: true, // Automatically mark as watched when rated
      },
    }));
  };

  const handleStarHover = (rating: number) => {
    setHoverRating(rating);
  };

  const handleStarLeave = () => {
    setHoverRating(null);
  };

  if (!currentMovie) return null;

  return (
    <div className="relative h-[70vh] min-h-[500px] overflow-hidden group">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-in-out"
        style={{
          backgroundImage: currentMovie?.backdrop_path
            ? `url(${generateImageUrl(
                currentMovie.backdrop_path,
                ImageSizes.backdrop
              )})`
            : undefined,
        }}
      />

      {/* Netflix-style gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-0" />

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
        aria-label="Previous movie"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
        aria-label="Next movie"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Content */}
      <div className="relative z-10 px-4 md:px-8 lg:px-16 pb-16 w-full max-w-4xl h-full flex items-end">
        <div className="w-full">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white drop-shadow-lg transition-all duration-700">
            {currentMovie?.title ||
              currentMovie?.name ||
              currentMovie?.original_name}
          </h1>
          <p className="mb-4 text-lg text-white/90 line-clamp-3 max-w-2xl drop-shadow transition-all duration-700">
            {currentMovie?.overview}
          </p>
          <div className="flex items-center gap-4 mb-6">
            <TextRating
              rating={
                currentMovie?.vote_average ? currentMovie.vote_average / 2 : 3.5
              }
            />
            <span className="text-white/70 text-sm">• 2h 15m</span>
            <span className="text-white/70 text-sm">
              •{" "}
              {currentMovie?.release_date
                ? new Date(currentMovie.release_date).getFullYear()
                : "2023"}
            </span>
            {currentMovieState?.viewed && (
              <span className="text-green-400 text-sm font-medium">
                ✓ Viewed
              </span>
            )}
          </div>

          {/* Interactive Rating Stars */}
          <div className="mb-6">
            <p className="text-white/90 mb-2 font-medium">Rate this movie:</p>
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
                          (hoverRating || currentMovieState?.userRating || 0) >=
                          star
                            ? "text-yellow-400 fill-yellow-400"
                            : (hoverRating ||
                                currentMovieState?.userRating ||
                                0) >=
                              star - 0.5
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-transparent"
                        }`}
                        style={{
                          clipPath:
                            (hoverRating ||
                              currentMovieState?.userRating ||
                              0) >= star
                              ? "inset(0 0 0 0)"
                              : (hoverRating ||
                                  currentMovieState?.userRating ||
                                  0) >=
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
              {currentMovieState?.userRating && (
                <span className="ml-3 text-white/80 font-medium text-lg">
                  Your rating: {currentMovieState.userRating}/5
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="default"
              className="group relative bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3 text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer"
            >
              <BookmarkPlus className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:scale-110" />
              Add to Watchlist
            </Button>
            <Button
              variant="outline"
              onClick={toggleViewed}
              className={`border-2 font-semibold px-8 py-3 text-lg transition-all duration-300 hover:scale-105 cursor-pointer ${
                currentMovieState?.viewed
                  ? "border-green-500 text-green-400 hover:bg-green-500 hover:text-white"
                  : "border-white text-white hover:bg-white hover:text-black"
              }`}
            >
              {currentMovieState?.viewed ? (
                <>
                  <EyeOff className="w-5 h-5 mr-2" />
                  Mark as Unwatched
                </>
              ) : (
                <>
                  <Eye className="w-5 h-5 mr-2" />
                  Mark as Watched
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {bannerMovies.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-200 ${
              index === currentIndex
                ? "bg-white"
                : "bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Auto-play indicator */}
      <div className="absolute top-4 right-4 z-20 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
        {currentIndex + 1} / {bannerMovies.length}
      </div>
    </div>
  );
}
