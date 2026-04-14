import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import PageLoader from '../ui/PageLoader';
import GlobalError from '../ui/GlobalError';
import { Bell, Search, User, ChevronDown, CheckCircle2 } from 'lucide-react';
import './MainLayout.css';

export default function MainLayout() {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    setIsPageLoading(true);
    const timer = setTimeout(() => setIsPageLoading(false), 350);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Simulate global error handling
  useEffect(() => {
    const handleError = (e: any) => {
      if (e.detail?.message) setGlobalError(e.detail.message);
    };
    window.addEventListener('app-error', handleError);
    return () => window.removeEventListener('app-error', handleError);
  }, []);

  return (
    <div className={`layout ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      {isPageLoading && <PageLoader />}
      {globalError && <GlobalError onRetry={() => setGlobalError(null)} message={globalError} />}
      
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
      />

      <main className="layout-main">
        <header className="topbar">
          <div className="search-bar">
            <Search size={18} className="text-muted" />
            <input type="text" placeholder="IA Search: Pacientes, Finanzas, n8n..." />
          </div>

          <div className="topbar-actions">
            <div className="status-badge-wrap">
               <span className="badge badge-green">
                  <CheckCircle2 size={12} /> Live
               </span>
            </div>

            <div className="notification-center">
              <button 
                className={`icon-btn ${showNotifications ? 'active' : ''}`}
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell size={20} />
                <span className="notif-badge"></span>
              </button>
              
              {showNotifications && (
                <div className="notif-dropdown animate-fade-in glass-card">
                  <div className="notif-header">Centro de Acción</div>
                  <div className="notif-item">
                    <p>IA Analysis Complete</p>
                    <small>Resumen de rentabilidad de Marza disponible</small>
                  </div>
                  <div className="notif-item">
                    <p>Stock Crítico</p>
                    <small>Resina Flow 3M por debajo del mínimo</small>
                  </div>
                </div>
              )}
            </div>

            <div className="divider-v"></div>

            <div className="user-dropdown">
              <div className="user-avatar text-accent">AD</div>
              <div className="user-meta">
                <p>Admin Dental Flow</p>
                <small>Elite Plan Member</small>
              </div>
              <ChevronDown size={14} className="text-muted" />
            </div>
          </div>
        </header>

        <div className="content-container animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
