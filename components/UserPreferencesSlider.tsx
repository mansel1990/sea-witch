/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState, useRef } from "react";
import { useGlobalStore } from "@/lib/store";
import { API_BASE_URL } from "@/lib/constants";
import { Movie } from "@/lib/types/movie";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PageSkeleton from "@/components/ui/PageSkeleton";

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w300_and_h450_bestv2";

interface PreferenceCategory {
  title: string;
  movies: Movie[];
}

export default function UserPreferencesSlider() {
  const userId = useGlobalStore((state) => state.userId);
  const [preferences, setPreferences] = useState<PreferenceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserPreferences() {
      if (!userId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `${API_BASE_URL}/user_preferences_movies/${userId}`
        );
        if (!res.ok) throw new Error("Failed to fetch user preferences");
        const data = await res.json();
        setPreferences(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    }

    fetchUserPreferences();
  }, [userId]);

  if (!userId) return null;
  if (loading) return <PageSkeleton />;
  if (error || !preferences.length) return null;

  return (
    <>
      {preferences.map((category, index) => (
        <PreferenceCategorySlider key={index} category={category} />
      ))}
    </>
  );
}

interface PreferenceCategorySliderProps {
  category: PreferenceCategory;
}

function PreferenceCategorySlider({ category }: PreferenceCategorySliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    const container = scrollRef.current;
    if (!container) return;
    const scrollAmount = 320; // width of one card + gap
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  if (!category.movies.length) return null;

  return (
    <section className="mb-8 relative group">
      <h2 className="text-2xl font-bold text-white mb-4 px-4">
        {category.title}
      </h2>
      {/* Left Arrow */}
      <button
        onClick={() => scroll("left")}
        className="hidden md:flex items-center justify-center absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-black/60 hover:bg-black/80 text-white rounded-full w-10 h-10 transition-all duration-200 opacity-0 group-hover:opacity-100"
        aria-label="Scroll left"
        style={{ pointerEvents: category.movies.length > 0 ? "auto" : "none" }}
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      {/* Right Arrow */}
      <button
        onClick={() => scroll("right")}
        className="hidden md:flex items-center justify-center absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-black/60 hover:bg-black/80 text-white rounded-full w-10 h-10 transition-all duration-200 opacity-0 group-hover:opacity-100"
        aria-label="Scroll right"
        style={{ pointerEvents: category.movies.length > 0 ? "auto" : "none" }}
      >
        <ChevronRight className="w-6 h-6" />
      </button>
      <div
        ref={scrollRef}
        className="flex overflow-x-auto gap-4 px-4 pb-2 scrollbar-hide scroll-smooth"
        style={{ scrollBehavior: "smooth" }}
      >
        {category.movies.map((movie) => (
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
