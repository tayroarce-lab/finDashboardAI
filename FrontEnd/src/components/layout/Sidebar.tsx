import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Stethoscope, Receipt, CalendarDays,
  BrainCircuit, Settings, LogOut, Activity
} from 'lucide-react';
import './Sidebar.css';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/treatments', icon: Stethoscope, label: 'Tratamientos' },
  { to: '/expenses', icon: Receipt, label: 'Gastos' },
  { to: '/appointments', icon: CalendarDays, label: 'Agenda' },
  { to: '/ai-panel', icon: BrainCircuit, label: 'CFO Digital' },
];

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('df_token');
    localStorage.removeItem('df_user');
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo"><Activity size={24} color="#6366f1" /></div>
        <div>
          <h1 className="sidebar-title">DentalFlow</h1>
          <span className="sidebar-subtitle">AI</span>
        </div>
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
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <NavLink to="/settings" className="sidebar-link">
          <Settings size={20} />
          <span>Configuración</span>
        </NavLink>
        <button className="sidebar-link sidebar-logout" onClick={handleLogout}>
          <LogOut size={20} />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}
