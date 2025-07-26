import { API_BASE_URL } from "../constants";

export interface AddToWatchlistResponse {
  success?: boolean;
  message?: string;
}

export interface AddToWatchlistRequest {
  clerk_user_id: string;
  movie_id: number;
}

export async function addToWatchlist(
  clerkUserId: string,
  movieId: number
): Promise<AddToWatchlistResponse> {
  const res = await fetch(`${API_BASE_URL}/watchlist`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      clerk_user_id: clerkUserId,
      movie_id: movieId,
    }),
  });

  if (!res.ok) throw new Error("Failed to add movie to watchlist");
  return res.json();
}

export default addToWatchlist;
