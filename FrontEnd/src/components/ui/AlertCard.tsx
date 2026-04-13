import { AlertTriangle, AlertCircle, Info, ChevronRight } from 'lucide-react';
import type { Alert } from '../../types';
import './AlertCard.css';

interface AlertCardProps {
  alert: Alert;
  index: number;
}

const severityConfig = {
  critical: { icon: AlertTriangle, color: 'red', label: 'Crítico' },
  warning: { icon: AlertCircle, color: 'yellow', label: 'Atención' },
  info: { icon: Info, color: 'blue', label: 'Info' },
  positive: { icon: Info, color: 'green', label: 'Positivo' },
};

export default function AlertCard({ alert, index }: AlertCardProps) {
  const config = severityConfig[alert.severity];
  const Icon = config.icon;

  return (
    <div className={`alert-card alert-card-${config.color} animate-fade-in stagger-${index + 1}`}>
      <div className="alert-icon-wrap">
        <Icon size={20} />
      </div>
      <div className="alert-body">
        <div className="alert-header">
          <h4 className="alert-title">{alert.title}</h4>
          <span className={`badge badge-${config.color}`}>{config.label}</span>
        </div>
        <p className="alert-content">{alert.content}</p>
        {alert.recommendation && (
          <div className="alert-recommendation">
            <span className="alert-rec-label">📌 Acción:</span>
            {alert.recommendation}
          </div>
        )}
        {alert.module && (
          <button className="alert-action">
            Ver detalle <ChevronRight size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
