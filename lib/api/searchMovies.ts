import { API_BASE_URL } from "../constants";

export interface SearchMovieResult {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  original_language: string;
  popularity: number;
  vote_count: number;
  vote_average: number;
  predicted_score: number;
  predicted_star_rating: number;
  user_rating: number;
  watched: boolean;
  is_watchlisted: boolean;
}

export async function searchMovies(
  query: string,
  clerkUserId: string,
  signal?: AbortSignal
): Promise<SearchMovieResult[]> {
  if (!query.trim()) return [];
  const url = `${API_BASE_URL}/search?q=${encodeURIComponent(
    query
  )}&clerk_user_id=${clerkUserId}`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      accept: "application/json",
    },
    signal,
  });
  if (!res.ok) throw new Error("Failed to fetch results");
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export default searchMovies;
