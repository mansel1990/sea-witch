import { AddUserRequest, AddUserResponse } from "../types/user";
import { API_BASE_URL } from "../constants";

export async function addUser(data: AddUserRequest): Promise<AddUserResponse> {
  const res = await fetch(`${API_BASE_URL}/add_user`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Failed to add user");
  }

  return res.json();
}
