import { API_BASE_URL } from "../constants";

export async function getUserRatings(clerkUserId: string): Promise<any[]> {
  const res = await fetch(`${API_BASE_URL}/ratings/${clerkUserId}`, {
    method: "GET",
    headers: {
      accept: "application/json",
    },
  });
  if (!res.ok) throw new Error("Failed to fetch user ratings");
  return res.json();
}

export default getUserRatings;
