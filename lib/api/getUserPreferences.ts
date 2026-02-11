import { API_BASE_URL } from "../constants";
import { Movie } from "../types/movie";

export interface PreferenceCategory {
  title: string;
  movies: Movie[];
}

export interface UserPreferencesResponse {
  preferences: PreferenceCategory[];
}

export async function getUserPreferences(
  userId: string
): Promise<PreferenceCategory[]> {
  const res = await fetch(
    `${API_BASE_URL}/user_preferences_movies/${userId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
    }
  );

  if (!res.ok) throw new Error("Failed to fetch user preferences");
  return res.json();
}

export default getUserPreferences;
