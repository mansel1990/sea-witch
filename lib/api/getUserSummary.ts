import { API_BASE_URL } from "../constants";

export interface UserSummary {
  user_id: string;
  summary: string;
}

export async function getUserSummary(
  clerkUserId: string
): Promise<UserSummary> {
  const res = await fetch(`${API_BASE_URL}/user_summary/${clerkUserId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
    },
  });

  if (!res.ok) throw new Error("Failed to fetch user summary");
  return res.json();
}

export default getUserSummary;
