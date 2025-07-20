export interface AddUserRequest {
  clerkUserId: string;
  email: string;
  firstName: string;
  lastName: string;
  imageUrl: string;
  username: string;
}

export interface AddUserResponse {
  message: string;
  clerk_user_id: string;
  username: string;
  status: string;
}
