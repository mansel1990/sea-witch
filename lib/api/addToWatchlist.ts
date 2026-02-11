import { API_BASE_URL } from "../constants";

export interface AddToWatchlistResponse {
  success?: boolean;
  message?: string;
}

export interface AddToWatchlistRequest {
  user_id: string;
  movie_id: number;
}

export async function addToWatchlist(
  userId: string,
  movieId: number
): Promise<AddToWatchlistResponse> {
  const res = await fetch(`${API_BASE_URL}/watchlist`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      user_id: userId,
      movie_id: movieId,
    }),
  });

  if (!res.ok) throw new Error("Failed to add movie to watchlist");
  return res.json();
}

export default addToWatchlist;
