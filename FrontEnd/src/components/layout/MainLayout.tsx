import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import PageLoader from '../ui/PageLoader';
import './MainLayout.css';

export default function MainLayout() {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Show loader on route change for a brief moment to feel "premium"
    setIsPageLoading(true);
    const timer = setTimeout(() => setIsPageLoading(false), 800);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className="layout">
      {isPageLoading && <PageLoader />}
      <Sidebar />
      <main className="layout-main">
        <div className="content-container">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
