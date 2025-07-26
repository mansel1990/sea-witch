import { API_BASE_URL } from "../constants";

export interface RemoveFromWatchlistResponse {
  success?: boolean;
  message?: string;
}

export interface RemoveFromWatchlistRequest {
  clerk_user_id: string;
  movie_id: number;
}

export async function removeFromWatchlist(
  clerkUserId: string,
  movieId: number
): Promise<RemoveFromWatchlistResponse> {
  const res = await fetch(`${API_BASE_URL}/remove_from_watchlist`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      clerk_user_id: clerkUserId,
      movie_id: movieId,
    }),
  });

  if (!res.ok) throw new Error("Failed to remove movie from watchlist");
  return res.json();
}

export default removeFromWatchlist;
