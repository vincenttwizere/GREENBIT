import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RestaurantDashboard from './pages/dashboard/RestaurantDashboard';
import CollectorDashboard from './pages/dashboard/CollectorDashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import ProtectedRoute from './routes/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/dashboard/restaurant"
        element={
          <ProtectedRoute allowedRoles={['restaurant']}>
            <RestaurantDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/collector"
        element={
          <ProtectedRoute allowedRoles={['collector']}>
            <CollectorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
