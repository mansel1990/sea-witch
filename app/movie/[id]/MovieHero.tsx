import React from "react";
import { Movie } from "@/lib/types/movie";

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w300_and_h450_bestv2";

export default function MovieHero({ movie }: { movie: Movie }) {
  return (
    <div className="relative h-[70vh] w-full flex items-end overflow-hidden">
      {/* Background Image */}
      {movie.poster_path && (
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-in-out"
          style={{
            backgroundImage: `url(${TMDB_IMAGE_BASE}${movie.poster_path})`,
          }}
        />
      )}
      {/* Netflix-style gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-0" />
      {/* Content */}
      <div className="relative z-20 container mx-auto px-6 pb-16">
        <div className="flex flex-col md:flex-row gap-8 items-end">
          {/* Movie Poster (small) */}
          <div className="flex-shrink-0">
            <img
              src={
                movie.poster_path
                  ? `${TMDB_IMAGE_BASE}${movie.poster_path}`
                  : undefined
              }
              alt={movie.title}
              className="w-32 h-48 md:w-48 md:h-72 object-cover rounded-lg shadow-2xl"
            />
          </div>
          {/* Movie Info */}
          <div className="flex-1">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 mt-8">
              {movie.title}
            </h1>
            <p className="text-lg text-white/90 max-w-3xl mb-6">
              {movie.overview}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
