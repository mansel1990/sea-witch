"use client";

import { useState, useEffect } from "react";
import { movies } from "../../components/movies";
import { generateImageUrl, ImageSizes } from "../../components/tmdb";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import SearchBar from "../../components/SearchBar";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [filteredMovies, setFilteredMovies] = useState(movies.results);

  useEffect(() => {
    if (!query.trim()) {
      setFilteredMovies(movies.results);
      return;
    }
    const searchTerm = query.toLowerCase();
    setFilteredMovies(
      movies.results.filter((movie) => {
        const title = movie.title || movie.original_title || "";
        const year = movie.release_date
          ? new Date(movie.release_date).getFullYear().toString()
          : "";
        return (
          title.toLowerCase().includes(searchTerm) ||
          year.includes(searchTerm) ||
          title.toLowerCase().startsWith(searchTerm)
        );
      })
    );
  }, [query]);

  return (
    <div className="min-h-screen bg-black pt-24 px-4 pb-8">
      {/* Back Button */}
      <div className="fixed top-20 left-4 z-50">
        <Link href="/">
          <button className="bg-black/50 hover:bg-black/70 text-white border border-gray-600 hover:border-white transition-all duration-200 rounded-lg px-3 py-1 flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </Link>
      </div>
      {/* Search Bar and Results */}
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
      <div className="max-w-6xl mx-auto">
        {filteredMovies.length === 0 ? (
          <div className="text-center text-gray-400 mt-16 text-lg">
            No movies found for "{query}"
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {filteredMovies.map((movie) => (
              <Link
                key={movie.id}
                href={`/movie/${movie.id}`}
                className="group block bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-200"
              >
                <img
                  src={generateImageUrl(movie.poster_path, ImageSizes.poster)}
                  alt={movie.title}
                  className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="p-3">
                  <h3 className="text-white font-semibold text-base truncate mb-1">
                    {movie.title}
                  </h3>
                  <div className="text-gray-400 text-xs flex items-center gap-2">
                    {movie.release_date
                      ? new Date(movie.release_date).getFullYear()
                      : "N/A"}
                    <span>•</span>
                    <span>⭐ {movie.vote_average.toFixed(1)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
