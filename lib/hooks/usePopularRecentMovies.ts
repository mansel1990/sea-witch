import { useQuery } from "@tanstack/react-query";
import { fetchPopularRecentMovies } from "../api/fetchPopularRecentMovies";

export function usePopularRecentMovies() {
  return useQuery({
    queryKey: ["movies", "popular", "recent"],
    queryFn: fetchPopularRecentMovies,
  });
}
