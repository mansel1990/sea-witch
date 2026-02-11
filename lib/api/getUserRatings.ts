import { API_BASE_URL } from "../constants";

export interface UserRating {
  id: number;
  user_id: string;
  movie_id: number;
  rating: number;
  created_at: string;
  updated_at: string;
  movie_title: string;
  movie_poster_path: string;
  movie_overview: string;
  movie_release_date: string;
  movie_original_language: string;
  movie_popularity: number;
  movie_vote_count: number;
  movie_vote_average: number;
  is_watchlisted: boolean;
}

export async function getUserRatings(
  userId: string
): Promise<UserRating[]> {
  const res = await fetch(`${API_BASE_URL}/ratings/${userId}`, {
    method: "GET",
    headers: {
      accept: "application/json",
    },
  });
  if (!res.ok) throw new Error("Failed to fetch user ratings");
  return res.json();
}

export default getUserRatings;
