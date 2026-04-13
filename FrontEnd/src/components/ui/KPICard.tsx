import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { KPI } from '../../types';
import './KPICard.css';

interface KPICardProps {
  kpi: KPI;
  index: number;
}

export default function KPICard({ kpi, index }: KPICardProps) {
  const formatValue = (value: number, format: string) => {
    switch (format) {
      case 'currency': return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
      case 'percent': return `${value}%`;
      default: return value.toLocaleString();
    }
  };

  const TrendIcon = kpi.change > 0 ? TrendingUp : kpi.change < 0 ? TrendingDown : Minus;
  const isPositive = kpi.key === 'expenses' ? kpi.change < 0 : kpi.change > 0;
  const trendClass = kpi.change === 0 ? 'neutral' : isPositive ? 'positive' : 'negative';

  return (
    <div className={`kpi-card animate-fade-in stagger-${index + 1}`}>
      <div className="kpi-header">
        <span className="kpi-label">{kpi.label}</span>
        <span className={`kpi-semaphore kpi-semaphore-${kpi.semaphore.status}`}>
          {kpi.semaphore.label}
        </span>
      </div>

      <div className="kpi-value">{formatValue(kpi.value, kpi.format)}</div>

      <div className={`kpi-trend kpi-trend-${trendClass}`}>
        <TrendIcon size={14} />
        <span>{kpi.change > 0 ? '+' : ''}{kpi.change}%</span>
        <span className="kpi-vs">vs anterior</span>
      </div>
    </div>
  );
}
