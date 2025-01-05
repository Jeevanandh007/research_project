import { useMutation, useQueryClient } from '@tanstack/react-query';
import { httpClient } from '../../../lib/http-client';
import type { CreateUserForm, User } from '../types';

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation<User, Error, CreateUserForm>({
    mutationFn: async (data: CreateUserForm) => {
      const response = await httpClient.post('/users', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
