import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from '../features/auth/pages/login';
import { Dashboard } from '../pages/Dashboard';
import { useQuery } from '@tanstack/react-query';
import { httpClient } from '../lib/http-client';

interface User {
  id: number;
  email: string;
}

const fetchCurrentUser = async (): Promise<User> => {
  const response = await httpClient.get('/auth/me');
  return response.data;
};

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: fetchCurrentUser,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
