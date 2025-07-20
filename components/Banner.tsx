"use client";

import { useEffect, useState } from "react";
import { Movie } from "@/lib/types/movie";
import TextRating from "./TextRating";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight, BookmarkPlus } from "lucide-react";
import { usePopularRecentMovies } from "@/lib/hooks/usePopularRecentMovies";

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w300_and_h450_bestv2";

export default function Banner() {
  const { data: movies, isLoading, isError } = usePopularRecentMovies();
  const bannerMovies = movies?.slice(0, 5) || [];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!bannerMovies.length) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % bannerMovies.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [bannerMovies]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % bannerMovies.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + bannerMovies.length) % bannerMovies.length
    );
  };

  const currentMovie = bannerMovies[currentIndex];
  if (!currentMovie) return null;

  return (
    <div className="relative h-[70vh] min-h-[500px] overflow-hidden group">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-in-out"
        style={{
          backgroundImage: currentMovie?.poster_path
            ? `url(${TMDB_IMAGE_BASE}${currentMovie.poster_path})`
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
            {currentMovie?.title}
          </h1>
          <p className="mb-4 text-lg text-white/90 line-clamp-3 max-w-2xl drop-shadow transition-all duration-700">
            {currentMovie?.overview}
          </p>
          <div className="flex items-center gap-4 mb-6">
            <TextRating rating={3.5} />
            <span className="text-white/70 text-sm">• 2h 15m</span>
            <span className="text-white/70 text-sm">• 2019</span>
          </div>
          <div className="flex gap-3">
            <Button
              variant="default"
              className="bg-red-600 text-white hover:bg-red-700 font-semibold px-8 py-3 text-lg transition-all duration-200 cursor-pointer"
            >
              <BookmarkPlus className="w-5 h-5 mr-2" />
              Add to Watchlist
            </Button>
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-black font-semibold px-8 py-3 text-lg transition-all duration-200"
            >
              ⭐ Review
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
