import { WifiOff, RefreshCw } from 'lucide-react';
import './GlobalError.css';

interface GlobalErrorProps {
  onRetry: () => void;
  message?: string;
}

export default function GlobalError({ onRetry, message = "Parece que hay un problema de conexión con nuestro servidor central." }: GlobalErrorProps) {
  return (
    <div className="global-error-overlay animate-fade-in">
      <div className="global-error-card glass-card">
        <div className="error-icon-wrap">
          <WifiOff size={48} className="text-red" />
        </div>
        <h2>Error de Sincronización</h2>
        <p className="text-secondary">{message}</p>
        
        <div className="error-actions">
          <button className="btn btn-primary" onClick={onRetry}>
            <RefreshCw size={16} /> Reintentar Conexión
          </button>
        </div>
        
        <div className="error-footer">
          <small className="text-muted">Si el problema persiste, contacta a soporte@dentalflow.ai</small>
        </div>
      </div>
    </div>
  );
}
