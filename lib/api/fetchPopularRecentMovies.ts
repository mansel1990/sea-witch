import { API_BASE_URL } from "@/lib/constants";
import { Movie } from "@/lib/types/movie";

export async function fetchPopularRecentMovies(): Promise<Movie[]> {
  const res = await fetch(`${API_BASE_URL}/movies/popular/recent`);
  if (!res.ok) throw new Error("Failed to fetch movies");
  const data = await res.json();
  return data.movies || data;
}
