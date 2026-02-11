import { API_BASE_URL } from "../constants";

export interface RemoveFromWatchlistResponse {
  success?: boolean;
  message?: string;
}

export interface RemoveFromWatchlistRequest {
  user_id: string;
  movie_id: number;
}

export async function removeFromWatchlist(
  userId: string,
  movieId: number
): Promise<RemoveFromWatchlistResponse> {
  const res = await fetch(`${API_BASE_URL}/remove_from_watchlist`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      user_id: userId,
      movie_id: movieId,
    }),
  });

  if (!res.ok) throw new Error("Failed to remove movie from watchlist");
  return res.json();
}

export default removeFromWatchlist;
