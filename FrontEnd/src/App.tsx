import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import MainLayout from './components/layout/MainLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Treatments from './pages/Treatments';
import Expenses from './pages/Expenses';
import Appointments from './pages/Appointments';
import AIPanel from './pages/AIPanel';
import './index.css';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
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
        <Route path="/ai-panel" element={<AIPanel />} />
        <Route path="/settings" element={
          <div style={{ padding: '2rem' }}>
            <h1>⚙️ Configuración</h1>
            <p className="text-muted" style={{ marginTop: '0.5rem' }}>En construcción 🏗️</p>
          </div>
        } />
      </Route>
    </Routes>
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
