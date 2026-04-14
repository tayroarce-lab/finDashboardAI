import { Activity } from 'lucide-react';
import './PageLoader.css';

export default function PageLoader() {
  return (
    <div className="page-loader-overlay">
      <div className="page-loader-content">
        <div className="loader-logo-wrapper">
          <Activity size={40} className="loader-icon" />
          <div className="loader-ripple"></div>
        </div>
        <p className="loader-text">DentalFlow AI</p>
        <div className="loader-progress-bar">
          <div className="loader-progress-inner"></div>
        </div>
      </div>
    </div>
  );
}
