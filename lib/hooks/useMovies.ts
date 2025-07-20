import { useQuery } from "@tanstack/react-query";
import { fetchMovies } from "../api/fetchMovies";

export function useMovies() {
  return useQuery({
    queryKey: ["movies"],
    queryFn: fetchMovies,
  });
}
