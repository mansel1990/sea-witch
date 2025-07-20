"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useMovies } from "@/lib/hooks/useMovies";
import { Movie } from "@/lib/types/movie";
import Image from "next/image";

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w300_and_h450_bestv2";

function MovieCard({ movie }: { movie: Movie }) {
  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-200">
      <Image
        src={`${TMDB_IMAGE_BASE}${movie.poster_path}`}
        alt={movie.title}
        width={300}
        height={450}
        className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-200"
        priority={true}
      />
      <div className="p-3">
        <h3 className="text-white font-semibold text-base truncate mb-1">
          {movie.title}
        </h3>
      </div>
    </div>
  );
}

export default function SearchPage() {
  const { data, isLoading, isError } = useMovies();
  const [query, setQuery] = useState("");
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);

  useEffect(() => {
    if (!data) return;
    if (!query.trim()) {
      setFilteredMovies(data);
      return;
    }
    const searchTerm = query.toLowerCase();
    setFilteredMovies(
      data.filter((movie: Movie) => {
        const title = movie.title || "";
        return title.toLowerCase().includes(searchTerm);
      })
    );
  }, [query, data]);

  if (isLoading)
    return <div className="text-center text-white mt-16">Loading...</div>;
  if (isError)
    return (
      <div className="text-center text-red-500 mt-16">
        Failed to load movies.
      </div>
    );

  return (
    <div className="min-h-screen bg-black pt-24 px-4 pb-8">
      {/* Back Button */}
      <div className="fixed top-20 left-4 z-50">
        <Link href="/">
          <button className="bg-black/50 hover:bg-black/70 text-white border border-gray-600 hover:border-white transition-all duration-200 rounded-lg px-3 py-1 flex items-center gap-2">
            Back
          </button>
        </Link>
      </div>
      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="w-full">
          <input
            type="text"
            placeholder="Search movies..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors text-lg"
            autoFocus
          />
        </div>
      </div>
      {/* Movie Grid */}
      <div className="max-w-6xl mx-auto">
        {filteredMovies.length === 0 && query.trim() ? (
          <div className="text-center text-gray-400 mt-16 text-lg">
            No movies found for &quot;{query}&quot;
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {filteredMovies.map((movie) => (
              <Link
                key={movie.id}
                href={`/movie/${movie.id}`}
                className="group block"
              >
                <MovieCard movie={movie} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
