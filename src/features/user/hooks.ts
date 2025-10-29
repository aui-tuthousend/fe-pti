import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserService } from './service';
import { UserResponse, RegisterUserRequest } from './types';

export const userKeys = {
    all: ['user'] as const,
    lists: () => [...userKeys.all, 'list'] as const,
}

export function useGetAllUser() {
  return useQuery({
      queryKey: userKeys.lists(),
      queryFn: () => UserService.getAllUser(),
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: RegisterUserRequest) => UserService.createUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}