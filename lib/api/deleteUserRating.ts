import { API_BASE_URL } from "../constants";

export async function deleteUserRating(
  clerkUserId: string,
  movieId: number
): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/ratings/delete`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      clerk_user_id: clerkUserId,
      movie_id: movieId,
      rating: 0,
    }),
  });
  if (!res.ok) throw new Error("Failed to delete rating");
  return res.json();
}

export default deleteUserRating;
