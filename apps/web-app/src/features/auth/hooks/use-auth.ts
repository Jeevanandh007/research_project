import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { httpClient } from '../../../lib/http-client';

interface LoginCredentials {
  email: string;
  password: string;
}

interface User {
  id: number;
  email: string;
  role: 'admin' | 'user';
  name: string;
}

interface LoginResponse {
  token: string;
  message: string;
  user: User;
}

const loginUser = async (
  credentials: LoginCredentials
): Promise<LoginResponse> => {
  const response = await httpClient.post('/auth/login', credentials);
  const { token } = response.data;

  // Store the JWT token
  localStorage.setItem('jwt_token', token);
  localStorage.setItem('user', JSON.stringify(response.data.user));

  return response.data;
};

export const useAuth = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      navigate('/dashboard');
    },
  });

  const logout = async () => {
    try {
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('user');
      queryClient.clear();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const user = localStorage.getItem('user')
    ? (JSON.parse(localStorage.getItem('user')!) as User)
    : null;

  return {
    login: loginMutation.mutate,
    logout,
    isLoading: loginMutation.isPending,
    error: loginMutation.error?.message,
    user,
  };
};
