import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import MainLayout from './components/layout/MainLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Treatments from './pages/Treatments';
import Expenses from './pages/Expenses';
import Appointments from './pages/Appointments';
import Doctors from './pages/Doctors';
import AIPanel from './pages/AIPanel';
import Settings from './pages/Settings';
import { Toaster } from 'sonner';
import './index.css';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <Toaster position="top-right" richColors theme="dark" />
      <Routes>
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/" replace /> : <Login />
        } />
        <Route element={
          <ProtectedRoute><MainLayout /></ProtectedRoute>
        }>
          <Route path="/" element={<Dashboard />} />
          <Route path="/treatments" element={<Treatments />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/ai-panel" element={<AIPanel />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
