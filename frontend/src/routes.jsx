import { createBrowserRouter, createRoutesFromElements, Route, Navigate, Outlet } from 'react-router-dom';
import { getToken } from './utils/auth';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import Profile from './pages/Profile';

function ProtectedRoute({ children }) {
  if (!getToken()) return <Navigate to="/login" replace />;
  return children;
}

function PublicOnlyRoute({ children }) {
  if (getToken()) return <Navigate to="/profile" replace />;
  return children;
}

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Outlet />}>
      <Route index element={<Navigate to="/profile" replace />} />
      <Route path="login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
      <Route path="register" element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />
      <Route path="verify-email" element={<VerifyEmail />} />
      <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/profile" replace />} />
    </Route>
  )
);
