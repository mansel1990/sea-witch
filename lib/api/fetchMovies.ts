import { API_BASE_URL } from "../constants";

export async function fetchMovies() {
  const res = await fetch(`${API_BASE_URL}/movies`);
  if (!res.ok) {
    throw new Error("Failed to fetch movies");
  }
  return res.json();
}
