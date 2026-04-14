import { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Stethoscope, Receipt, CalendarDays, Package,
  BrainCircuit, Settings, LogOut, Activity, Users,
  ChevronLeft, ChevronRight, ShieldCheck
} from 'lucide-react';
import './Sidebar.css';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/treatments', icon: Stethoscope, label: 'Tratamientos' },
  { to: '/expenses', icon: Receipt, label: 'Gastos' },
  { to: '/appointments', icon: CalendarDays, label: 'Agenda' },
  { to: '/patients', icon: Users, label: 'Pacientes' },
  { to: '/inventory', icon: Package, label: 'Inventario' },
  { to: '/doctors', icon: Users, label: 'Doctores' },
  { to: '/ai-panel', icon: BrainCircuit, label: 'CFO Digital' },
];

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const [n8nStatus, setN8nStatus] = useState<'online' | 'offline' | 'checking'>('checking');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkN8n = () => {
      setN8nStatus('online');
    };
    const timer = setTimeout(checkN8n, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('df_token');
    localStorage.removeItem('df_user');
    navigate('/login');
  };

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-brand">
        <div className="sidebar-logo">
          <Activity size={24} color="#6366f1" />
        </div>
        {!isCollapsed && (
          <div className="sidebar-brand-text">
            <h1 className="sidebar-title">DentalFlow</h1>
            <span className="sidebar-subtitle">AI</span>
          </div>
        )}
        <button className="collapse-btn" onClick={onToggle}>
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
            }
            title={isCollapsed ? item.label : ''}
          >
            <item.icon size={20} />
            {!isCollapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        {!isCollapsed && (
          <div className="n8n-status-card animate-fade-in">
            <div className="n8n-header">
              <ShieldCheck size={14} className="text-accent" />
              <span>n8n Engine</span>
              <div className={`status-dot ${n8nStatus}`}></div>
            </div>
            <p className="status-meta">Last sync: Just now</p>
          </div>
        )}
        
        <NavLink to="/settings" className="sidebar-link" title={isCollapsed ? "Configuración" : ""}>
          <Settings size={20} />
          {!isCollapsed && <span>Configuración</span>}
        </NavLink>
        
        <button className="sidebar-link sidebar-logout" onClick={handleLogout} title={isCollapsed ? "Cerrar sesión" : ""}>
          <LogOut size={20} />
          {!isCollapsed && <span>Cerrar sesión</span>}
        </button>
      </div>
    </aside>
  );
}
