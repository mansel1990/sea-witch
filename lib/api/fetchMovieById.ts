import { API_BASE_URL } from "@/lib/constants";
import { Movie } from "@/lib/types/movie";

export async function fetchMovieById(id: string | number): Promise<Movie> {
  const res = await fetch(`${API_BASE_URL}/movie/${id}`);
  if (!res.ok) throw new Error("Failed to fetch movie");
  return res.json();
}
