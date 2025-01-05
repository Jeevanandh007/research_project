import { useQuery } from '@tanstack/react-query';
import { httpClient } from '../../../lib/http-client';
import type { User } from '../types';

export function useGetUsers() {
  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await httpClient.get<User[]>('/users');
      return response.data;
    },
  });

  return {
    users,
    isLoading,
  };
}
