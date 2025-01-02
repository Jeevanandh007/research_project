import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const httpClient = axios.create({
  baseURL: API_URL,
});

httpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt_token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export { httpClient };
