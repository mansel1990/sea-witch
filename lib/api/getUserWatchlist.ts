import { API_BASE_URL } from "../constants";

export interface WatchlistMovie {
  id: number;
  user_id: string;
  movie_id: number;
  created_at: string;
  movie_title: string;
  movie_poster_path: string;
  movie_overview: string;
  movie_release_date: string;
  movie_original_language: string;
  movie_popularity: number;
  movie_vote_count: number;
  movie_vote_average: number;
}

export async function getUserWatchlist(
  userId: string
): Promise<WatchlistMovie[]> {
  const res = await fetch(`${API_BASE_URL}/watchlist/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
    },
  });

  if (!res.ok) throw new Error("Failed to fetch watchlist");
  return res.json();
}

export default getUserWatchlist;
