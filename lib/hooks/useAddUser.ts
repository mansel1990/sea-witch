import { useMutation } from "@tanstack/react-query";
import { addUser } from "../api/addUser";
import { AddUserRequest, AddUserResponse } from "../types/user";

export function useAddUser() {
  return useMutation<AddUserResponse, Error, AddUserRequest>({
    mutationFn: addUser,
  });
}
