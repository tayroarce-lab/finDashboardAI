import { useState } from 'react';
import { BrainCircuit, Bell, TrendingUp, ArrowRight, Trophy } from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, BarChart, Bar, Cell
} from 'recharts';
import KPICard from '../components/ui/KPICard';
import AlertCard from '../components/ui/AlertCard';
import { mockKPIs, mockAlerts, mockTopTreatments, mockRevenueChart } from '../data/mockData';
import './Dashboard.css';

const periods = [
  { value: 'week', label: 'Semana' },
  { value: 'month', label: 'Mes' },
  { value: 'quarter', label: 'Trimestre' },
];

const MARGIN_COLORS = {
  high: '#10b981',
  mid: '#f59e0b',
  low: '#ef4444',
};

export default function Dashboard() {
  const [period, setPeriod] = useState('month');

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>Dashboard Ejecutivo</h1>
          <p className="text-muted">Clínica Dental Sonrisa — Resumen financiero</p>
        </div>
        <div className="dashboard-actions">
          <div className="period-selector">
            {periods.map((p) => (
              <button
                key={p.value}
                className={`period-btn ${period === p.value ? 'period-btn-active' : ''}`}
                onClick={() => setPeriod(p.value)}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid-kpis">
        {mockKPIs.map((kpi, i) => (
          <KPICard key={kpi.key} kpi={kpi} index={i} />
        ))}
      </div>

      {/* Main Grid: Chart + AI Insight */}
      <div className="dashboard-grid">
        {/* Revenue Chart */}
        <div className="card chart-card animate-fade-in stagger-3">
          <div className="card-header">
            <h3><TrendingUp size={18} /> Ingresos vs Gastos</h3>
            <span className="text-muted" style={{ fontSize: '0.8125rem' }}>Últimos 30 días</span>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={mockRevenueChart} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradientRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradientExpenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis
                  dataKey="date" stroke="#64748b" fontSize={11}
                  tickFormatter={(d) => new Date(d).getDate().toString()}
                />
                <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  contentStyle={{
                    background: '#1a1f35', border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '10px', fontSize: '13px'
                  }}
                  formatter={(value: number, name: string) => [
                    `$${value.toLocaleString()}`,
                    name === 'revenue' ? 'Ingresos' : 'Gastos'
                  ]}
                  labelFormatter={(label) => new Date(label).toLocaleDateString('es')}
                />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2.5}
                  fill="url(#gradientRevenue)" name="revenue" />
                <Area type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2}
                  fill="url(#gradientExpenses)" name="expenses" strokeDasharray="4 4" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insight Card */}
        <div className="card card-glow ai-insight-card animate-fade-in stagger-4">
          <div className="card-header">
            <h3><BrainCircuit size={18} /> Insight del Día</h3>
            <span className="badge badge-red">Crítico</span>
          </div>
          <div className="ai-insight-body">
            <p>
              Tu margen es <strong>0.6%</strong> — estás operando en el filo. De cada <strong>$100</strong> que
              entran, solo queda <strong>$0.60</strong> después de gastos. El benchmark dental saludable
              es <strong>35-50%</strong>.
            </p>
            <p>
              El problema principal: <strong>materiales dentales subieron 23%</strong> este mes (+$252). Si ese costo
              se mantiene, el próximo mes estarás en <span className="text-red">pérdida neta</span>.
            </p>
            <div className="ai-actions">
              <span>3 recomendaciones disponibles</span>
              <button className="btn btn-primary btn-sm">
                Ver análisis completo <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Top Treatments + Alerts */}
      <div className="dashboard-grid">
        {/* Top Treatments */}
        <div className="card animate-fade-in stagger-5">
          <div className="card-header">
            <h3><Trophy size={18} /> Top Tratamientos por Rentabilidad</h3>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockTopTreatments.slice(0, 6)} layout="vertical"
                margin={{ top: 5, right: 30, left: 80, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis type="number" stroke="#64748b" fontSize={11}
                  tickFormatter={(v) => `${v}%`} domain={[0, 80]} />
                <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={12}
                  width={75} />
                <Tooltip
                  contentStyle={{
                    background: '#1a1f35', border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '10px', fontSize: '13px'
                  }}
                  formatter={(value: number) => [`${value}%`, 'Margen']}
                />
                <Bar dataKey="avgMargin" radius={[0, 6, 6, 0]} barSize={24}>
                  {mockTopTreatments.slice(0, 6).map((t, i) => (
                    <Cell key={i} fill={
                      t.avgMargin >= 60 ? MARGIN_COLORS.high :
                      t.avgMargin >= 40 ? MARGIN_COLORS.mid : MARGIN_COLORS.low
                    } />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alerts */}
        <div className="card animate-fade-in stagger-6">
          <div className="card-header">
            <h3><Bell size={18} /> Alertas Activas ({mockAlerts.length})</h3>
          </div>
          <div className="alerts-list">
            {mockAlerts.map((alert, i) => (
              <AlertCard key={i} alert={alert} index={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
