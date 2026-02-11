"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import searchMovies, {
  SearchMovieResult,
  semanticSearchMovies,
} from "@/lib/api/searchMovies";
import Loader from "@/components/ui/Loader";

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w300_and_h450_bestv2";

type SearchMode = "regular" | "semantic";

export default function SearchPage() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const isLoaded = !isPending;
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchMovieResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchMode, setSearchMode] = useState<SearchMode>("regular");
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced search API call
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setError(null);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!user || !value.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }
    debounceRef.current = setTimeout(() => {
      setLoading(true);
      const searchFunction =
        searchMode === "semantic" ? semanticSearchMovies : searchMovies;
      searchFunction(value, user.id)
        .then((data) => {
          setResults(data);
          setLoading(false);
        })
        .catch(() => {
          setError("Failed to fetch results");
          setLoading(false);
        });
    }, 500);
  };

  const handleSearchModeChange = (mode: SearchMode) => {
    setSearchMode(mode);
    setQuery("");
    setResults([]);
    setError(null);
  };

  if (!isLoaded) {
    return <div className="text-center text-white mt-16">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black">
        <div className="bg-gray-900 p-8 rounded-lg shadow-lg flex flex-col items-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Sign in to search movies
          </h2>
          <Link href="/sign-in" className="bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-2 rounded-lg">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

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

      {/* Search Mode Tabs */}
      <div className="max-w-2xl mx-auto mb-6">
        <div className="flex bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => handleSearchModeChange("regular")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              searchMode === "regular"
                ? "bg-red-600 text-white"
                : "text-gray-300 hover:text-white"
            }`}
          >
            Regular Search
          </button>
          <button
            onClick={() => handleSearchModeChange("semantic")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              searchMode === "semantic"
                ? "bg-red-600 text-white"
                : "text-gray-300 hover:text-white"
            }`}
          >
            Free Word Search
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="w-full">
          <input
            type="text"
            placeholder={
              searchMode === "semantic"
                ? "Describe the movie you're looking for..."
                : "Search movies..."
            }
            value={query}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors text-lg"
            autoFocus
          />
        </div>
        {searchMode === "semantic" && (
          <p className="text-gray-400 text-sm mt-2 text-center">
            Try describing movies like: &quot;A thrilling action movie with car
            chases and explosions&quot;
          </p>
        )}
      </div>

      {/* Movie Grid */}
      <div className="max-w-6xl mx-auto relative">
        {loading && query.trim() && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-30">
            <Loader overlay={false} />
          </div>
        )}
        {error && (
          <div className="text-center text-red-500 mt-16 text-lg">{error}</div>
        )}
        {!loading && !error && results.length === 0 && query.trim() && (
          <div className="text-center text-gray-400 mt-16 text-lg">
            No movies found for &quot;{query}&quot;
          </div>
        )}
        <div
          className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 ${
            loading && query.trim() ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          {results.map((movie) => (
            <Link
              key={movie.id}
              href={`/movie/${movie.id}`}
              className="group block"
            >
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
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
