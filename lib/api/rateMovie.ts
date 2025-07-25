import { API_BASE_URL } from "../constants";

export interface RateMovieResponse {
  success?: boolean;
  message?: string;
}

export async function rateMovie(
  clerkUserId: string,
  movieId: number,
  rating: number
): Promise<RateMovieResponse> {
  const res = await fetch(`${API_BASE_URL}/ratings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      clerk_user_id: clerkUserId,
      movie_id: movieId,
      rating,
    }),
  });
  if (!res.ok) throw new Error("Failed to rate movie");
  return res.json();
}

export default rateMovie;
