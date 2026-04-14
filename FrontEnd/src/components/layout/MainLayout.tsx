import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import PageLoader from '../ui/PageLoader';
import { Bell, Search, User, ChevronDown } from 'lucide-react';
import './MainLayout.css';

export default function MainLayout() {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsPageLoading(true);
    const timer = setTimeout(() => setIsPageLoading(false), 350);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className={`layout ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      {isPageLoading && <PageLoader />}
      
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
      />

      <main className="layout-main">
        <header className="topbar">
          <div className="search-bar">
            <Search size={18} className="text-muted" />
            <input type="text" placeholder="Buscar pacientes, tratamientos..." />
          </div>

          <div className="topbar-actions">
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
                  <div className="notif-header">Notificaciones</div>
                  <div className="notif-item">
                    <p>IA Analysis Complete</p>
                    <small>Nuevos insights de rentabilidad listos</small>
                  </div>
                  <div className="notif-item">
                    <p>Inventario Bajo</p>
                    <small>Resina 3M está pronto a agotarse</small>
                  </div>
                </div>
              )}
            </div>

            <div className="divider-v"></div>

            <div className="user-dropdown">
              <div className="user-avatar">AD</div>
              <div className="user-meta">
                <p>Admin Dental</p>
                <small>Plan Pro</small>
              </div>
              <ChevronDown size={14} className="text-muted" />
            </div>
          </div>
        </header>

        <div className="content-container">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
