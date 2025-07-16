"use client";

import { useEffect, useState } from "react";
import { generateImageUrl, ImageSizes } from "./tmdb";
import { movies } from "./movies";
import TextRating from "./TextRating";
import { Button } from "./ui/button";

interface Movie {
  id: number;
  title?: string;
  name?: string;
  original_name?: string;
  overview?: string;
  backdrop_path?: string;
}

export default function Banner() {
  const [movie, setMovie] = useState<Movie | null>(null);

  useEffect(() => {
    const results = movies.results;
    setMovie(results[Math.floor(Math.random() * results.length)]);
  }, []);

  return (
    <div
      className="relative rounded-lg overflow-hidden min-h-[240px] flex items-end bg-cover bg-center mb-4"
      style={{
        backgroundImage: movie?.backdrop_path
          ? `url(${generateImageUrl(movie.backdrop_path, ImageSizes.backdrop)})`
          : undefined,
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-0" />
      <div className="relative z-10 p-6 w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-2 text-white drop-shadow">
          {movie?.title || movie?.name || movie?.original_name}
        </h1>
        <p className="mb-2 text-white/90 line-clamp-3">{movie?.overview}</p>
        <TextRating rating={3.5} />
        <div className="flex gap-2 mt-4">
          <Button variant="secondary">Reviews</Button>
          <Button variant="outline">Add to Watchlist</Button>
        </div>
      </div>
    </div>
  );
}
