"use client";

import { useEffect, useState, useMemo } from "react";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePopularRecentMovies } from "@/lib/hooks/usePopularRecentMovies";
import { useRouter } from "next/navigation";

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w300_and_h450_bestv2";

export default function Banner() {
  const { data: movies } = usePopularRecentMovies();
  const bannerMovies = useMemo(() => movies?.slice(0, 5) || [], [movies]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();

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
      {/* Banner Intro Content */}
      <div className="absolute top-0 left-0 w-full z-30 flex justify-start pt-4 md:pt-8 px-2 md:px-8 pointer-events-none">
        <div className="bg-black/40 rounded-lg w-full p-4 md:p-6 flex items-start gap-4 pointer-events-auto">
          <span className="w-2 h-8 mt-1 bg-red-600 rounded"></span>
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-white mb-1 drop-shadow-lg">
              Welcome to your movie hub!
            </h1>
            <p className="text-sm md:text-base text-gray-200 font-medium leading-relaxed">
              Here, you can rate and review films you’ve watched, share your
              thoughts with friends and the community,
              <br />
              and discover new recommendations tailored to your tastes.
            </p>
          </div>
        </div>
      </div>
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
          <>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white drop-shadow-lg transition-all duration-700">
              {currentMovie?.title}
            </h1>
            <p className="mb-4 text-lg text-white/90 line-clamp-3 max-w-2xl drop-shadow transition-all duration-700">
              {currentMovie?.overview}
            </p>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-white/70 text-sm">
                {currentMovie?.release_date
                  ? new Date(currentMovie.release_date).getFullYear()
                  : ""}
              </span>
            </div>
            <div className="mb-6">
              <Button
                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-lg"
                onClick={() => {
                  if (currentMovie) {
                    router.push(`/movie/${currentMovie.id}`);
                  }
                }}
              >
                Rate this movie
              </Button>
            </div>
          </>
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
