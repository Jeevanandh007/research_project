import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { Login } from '../features/auth/pages/login';
import { DashboardLayout } from '../shared/layouts/dashboard.layout';
import { Users } from '../features/users/pages/users';
import { Realtime } from '../features/machines/pages/realtime';
import { ProtectedRoute } from '../shared/components/protected-route';

export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="realtime" element={<Realtime />} />
          <Route path="users" element={<Users />} />
        </Route>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
