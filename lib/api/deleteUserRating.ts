import { API_BASE_URL } from "../constants";

export interface DeleteUserRatingResponse {
  success?: boolean;
  message?: string;
}

export async function deleteUserRating(
  userId: string,
  movieId: number
): Promise<DeleteUserRatingResponse> {
  const res = await fetch(`${API_BASE_URL}/ratings/delete`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      user_id: userId,
      movie_id: movieId,
      rating: 0,
    }),
  });
  if (!res.ok) throw new Error("Failed to delete rating");
  return res.json();
}

export default deleteUserRating;
