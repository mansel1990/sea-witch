export interface AddUserRequest {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  imageUrl: string;
  username: string;
}

export interface AddUserResponse {
  message: string;
  user_id: string;
  username: string;
  status: string;
}
