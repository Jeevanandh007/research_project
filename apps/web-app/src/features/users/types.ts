export interface User {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'user';
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserForm {
  email: string;
  password: string;
  name: string;
  role?: 'admin' | 'user';
}
