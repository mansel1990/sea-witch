"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { Button } from "./ui/button";
import { generateImageUrl, ImageSizes } from "./tmdb";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import searchMovies from "@/lib/api/searchMovies";

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

export default function SearchBar() {
  const { user } = useUser();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const abortController = useRef<AbortController | null>(null);

  // Debounced API search
  useEffect(() => {
    if (!user || query.trim().length === 0) {
      setFilteredMovies([]);
      setError(null);
      setLoading(false);
      if (abortController.current) {
        abortController.current.abort();
        abortController.current = null;
      }
      return;
    }
    setLoading(true);
    setError(null);
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    if (abortController.current) {
      abortController.current.abort();
      abortController.current = null;
    }
    debounceTimeout.current = setTimeout(() => {
      const controller = new AbortController();
      abortController.current = controller;
      searchMovies(query, user.id, controller.signal)
        .then((data) => {
          setFilteredMovies(data.slice(0, 8));
          setLoading(false);
        })
        .catch((err) => {
          if (err.name !== "AbortError") {
            setError("Failed to fetch results");
            setLoading(false);
          }
        });
    }, 500);
    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
      if (abortController.current) abortController.current.abort();
    };
  }, [query, user]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < filteredMovies.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && filteredMovies[selectedIndex]) {
        handleMovieSelect(filteredMovies[selectedIndex]);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setQuery("");
      setSelectedIndex(-1);
    }
  };

  // Handle movie selection
  const handleMovieSelect = (movie: Movie) => {
    setIsOpen(false);
    setQuery("");
    setSelectedIndex(-1);
    // Navigate to movie page
    window.location.href = `/movie/${movie.id}`;
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Determine if desktop (lg and up) using a media query
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <div ref={searchRef} className="relative">
      {/* Search Input */}
      <div className="relative">
        <button
          type="button"
          className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-8 h-8 flex items-center justify-center focus:outline-none text-gray-400 transition-all duration-150
            rounded-full
            ${
              isDesktop
                ? "cursor-pointer bg-gray-700 hover:bg-red-600 focus:ring-2 focus:ring-red-500 hover:text-white scale-100 hover:scale-110"
                : "cursor-default"
            }
          `}
          onClick={isDesktop ? () => router.push("/search") : undefined}
          aria-disabled={!isDesktop}
          tabIndex={-1}
        >
          <Search className="w-4 h-4" />
        </button>
        <input
          type="text"
          placeholder="Search movies..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setSelectedIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          className="w-full lg:w-64 pl-15 pr-10 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setFilteredMovies([]);
              setSelectedIndex(-1);
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Dropdown Results */}
      {isOpen && (
        <>
          {loading && query.trim() && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50 p-4 text-center text-white">
              Searching...
            </div>
          )}
          {error && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50 p-4 text-center text-red-500">
              {error}
            </div>
          )}
          {!loading && !error && filteredMovies.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
              {filteredMovies.map((movie, index) => (
                <div
                  key={movie.id}
                  onClick={() => handleMovieSelect(movie)}
                  className={`flex items-center gap-3 p-3 cursor-pointer transition-colors ${
                    index === selectedIndex
                      ? "bg-gray-700"
                      : "hover:bg-gray-800"
                  }`}
                >
                  {/* Movie Poster */}
                  <div className="flex-shrink-0">
                    <img
                      src={
                        movie.poster_path
                          ? generateImageUrl(
                              movie.poster_path,
                              ImageSizes.poster
                            )
                          : "/placeholder-poster.jpg"
                      }
                      alt={movie.title || movie.original_title || ""}
                      className="w-12 h-18 object-cover rounded"
                    />
                  </div>

                  {/* Movie Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-medium truncate">
                      {movie.title || movie.original_title}
                    </h4>
                    <p className="text-gray-400 text-sm">
                      {movie.release_date
                        ? new Date(movie.release_date).getFullYear()
                        : "N/A"}
                      {movie.vote_average && (
                        <span className="ml-2">
                          • ⭐ {movie.vote_average.toFixed(1)}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
          {!loading &&
            !error &&
            query.trim().length > 0 &&
            filteredMovies.length === 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50 p-4">
                <p className="text-gray-400 text-center">
                  No movies found for {query}
                </p>
              </div>
            )}
        </>
      )}
    </div>
  );
}
