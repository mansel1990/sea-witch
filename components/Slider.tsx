"use client";
import { useEffect, useRef, useState } from "react";
import { API_BASE_URL } from "@/lib/constants";
import { Movie } from "@/lib/types/movie";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Loader from "@/components/ui/Loader";
import PageSkeleton from "@/components/ui/PageSkeleton";

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w300_and_h450_bestv2";

interface SliderProps {
  title: string;
  url: string;
}

export default function Slider({ title, url }: SliderProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchMovies() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE_URL}${url}`);
        if (!res.ok) throw new Error("Failed to fetch movies");
        const data = await res.json();
        setMovies(data.movies || data); // support both {movies: Movie[]} and Movie[]
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    }
    fetchMovies();
  }, [url]);

  const scroll = (direction: "left" | "right") => {
    const container = scrollRef.current;
    if (!container) return;
    const scrollAmount = 320; // width of one card + gap
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  if (loading || error)
    return (
      <div className="px-4">
        <PageSkeleton />
      </div>
    );
  if (!movies.length) return null;

  return (
    <section className="mb-8 relative group">
      <h2 className="text-2xl font-bold text-white mb-4 px-4">{title}</h2>
      {/* Left Arrow */}
      <button
        onClick={() => scroll("left")}
        className="hidden md:flex items-center justify-center absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-black/60 hover:bg-black/80 text-white rounded-full w-10 h-10 transition-all duration-200 opacity-0 group-hover:opacity-100"
        aria-label="Scroll left"
        style={{ pointerEvents: movies.length > 0 ? "auto" : "none" }}
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      {/* Right Arrow */}
      <button
        onClick={() => scroll("right")}
        className="hidden md:flex items-center justify-center absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-black/60 hover:bg-black/80 text-white rounded-full w-10 h-10 transition-all duration-200 opacity-0 group-hover:opacity-100"
        aria-label="Scroll right"
        style={{ pointerEvents: movies.length > 0 ? "auto" : "none" }}
      >
        <ChevronRight className="w-6 h-6" />
      </button>
      <div
        ref={scrollRef}
        className="flex overflow-x-auto gap-4 px-4 pb-2 scrollbar-hide scroll-smooth"
        style={{ scrollBehavior: "smooth" }}
      >
        {movies.map((movie) => (
          <Link
            key={movie.id}
            href={`/movie/${movie.id}`}
            className="flex-shrink-0 w-40"
          >
            <div className="bg-gray-900 rounded-lg overflow-hidden shadow hover:shadow-xl transition-shadow duration-200">
              <img
                src={`${TMDB_IMAGE_BASE}${movie.poster_path}`}
                alt={movie.title}
                className="w-full h-60 object-cover"
              />
              <div className="p-2">
                <h3 className="text-white text-sm font-semibold truncate">
                  {movie.title}
                </h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
