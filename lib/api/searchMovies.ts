export async function searchMovies(
  query: string,
  clerkUserId: string,
  signal?: AbortSignal
): Promise<any[]> {
  if (!query.trim()) return [];
  const url = `https://trailer-production.up.railway.app/search?q=${encodeURIComponent(
    query
  )}&clerk_user_id=${clerkUserId}`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      accept: "application/json",
    },
    signal,
  });
  if (!res.ok) throw new Error("Failed to fetch results");
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export default searchMovies;
