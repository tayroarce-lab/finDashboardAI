import { useState, useEffect } from 'react';
import { BrainCircuit, Bell, TrendingUp, ArrowRight, Trophy, Download, ShieldCheck } from 'lucide-react';
import { exportDashboardPDF } from '../utils/pdfExport';

import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, BarChart, Bar, Cell
} from 'recharts';
import KPICard from '../components/ui/KPICard';
import AlertCard from '../components/ui/AlertCard';
import { mockKPIs, mockAlerts, mockTopTreatments, mockRevenueChart } from '../data/mockData';
import Skeleton from '../components/ui/Skeleton';
import api from '../services/api';
import { toast } from 'sonner';
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

const predictionData = [
  { name: 'Ene', actual: 4500, pred: 4500 },
  { name: 'Feb', actual: 5200, pred: 5200 },
  { name: 'Mar', actual: 4800, pred: 4800 },
  { name: 'Abr', actual: 6100, pred: 6100 },
  { name: 'May', actual: null, pred: 6800 },
  { name: 'Jun', actual: null, pred: 7400 },
];

export default function Dashboard() {
  const [period, setPeriod] = useState('month');
  const [kpis, setKpis] = useState(mockKPIs);
  const [revenueChart, setRevenueChart] = useState(mockRevenueChart);
  const [topTreatments, setTopTreatments] = useState(mockTopTreatments);
  const [alerts, setAlerts] = useState(mockAlerts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('df_token');
    if (!token) return;

    setLoading(true);

    Promise.all([
      api.get(`/dashboard/kpis?period=${period}`),
      api.get(`/dashboard/revenue-chart?period=${period}`),
      api.get(`/dashboard/top-treatments?period=${period}`),
      api.get(`/dashboard/alerts`)
    ]).then(([kpiRes, revRes, topRes, alertsRes]) => {
      if (kpiRes.data.success) setKpis(kpiRes.data.data.kpis);
      if (revRes.data.success) setRevenueChart(revRes.data.data);
      if (topRes.data.success) setTopTreatments(topRes.data.data);
      if (alertsRes.data.success) setAlerts(alertsRes.data.data);
    }).catch(err => {
      console.error("Error fetching dashboard data:", err);
      toast.error('Error al cargar datos del dashboard');
    })
      .finally(() => setLoading(false));

  }, [period]);

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
          <button 
            className="btn btn-secondary" 
            onClick={() => exportDashboardPDF(kpis, topTreatments)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Download size={16} /> Exportar PDF
          </button>
        </div>
      </div>


      {/* KPI Cards */}
      <div className="grid-kpis">
        {loading 
          ? Array(4).fill(0).map((_, i) => <Skeleton key={i} height="120px" variant="rect" />)
          : kpis.map((kpi, i) => <KPICard key={kpi.key} kpi={kpi} index={i} />)
        }
      </div>

      {/* Main Grid: Chart + AI Insight */}
      <div className="dashboard-grid">
        {/* Revenue Chart */}
        <div className="card chart-card animate-fade-in stagger-3">
          <div className="card-header">
            <h3><TrendingUp size={18} /> Ingresos vs Gastos</h3>
            <span className="text-muted" style={{ fontSize: '0.8125rem' }}>Dinámico</span>
          </div>
          <div className="chart-container">
            {loading ? (
              <Skeleton height="280px" width="100%" />
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={revenueChart} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
                    formatter={(value: any, name: any) => [
                      `$${parseFloat(value).toLocaleString()}`,
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
            )}
          </div>
        </div>

        {/* AI Forecast Chart */}
        <div className="card chart-card animate-fade-in stagger-4 glass-glow">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <div className="ai-icon-mini"><BrainCircuit size={16} color="white" /></div>
              <h3>Predicción IA Pro</h3>
            </div>
            <span className="badge badge-green">94% Confidence</span>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={230}>
              <AreaChart data={predictionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ background: '#1a1f35', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px' }}
                />
                <Area type="monotone" dataKey="actual" stroke="#6366f1" strokeWidth={3} fill="none" />
                <Area type="monotone" dataKey="pred" stroke="#818cf8" strokeWidth={2} strokeDasharray="5 5" fill="rgba(99, 102, 241, 0.05)" />
              </AreaChart>
            </ResponsiveContainer>
            <div className="prediction-insight">
              <p>Basado en la tendencia actual, se proyecta un cierre de trimestre con <strong>+$12,400</strong> de excedente.</p>
              <button className="btn-link">Ver plan de inversión <ArrowRight size={14} /></button>
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
              <BarChart data={topTreatments.slice(0, 6)} layout="vertical"
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
                  formatter={(value: any) => [`${value}%`, 'Margen']}
                />
                <Bar dataKey="avgMargin" radius={[0, 6, 6, 0]} barSize={24}>
                  {topTreatments.slice(0, 6).map((t, i) => (
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

        {/* Alerts & Insights Mini-Panel */}
        <div className="card animate-fade-in stagger-6">
          <div className="card-header">
            <h3><Bell size={18} /> Alertas & Insights</h3>
          </div>
          <div className="alerts-list">
             <div className="mini-insight-box">
                <ShieldCheck size={16} className="text-green" />
                <span>n8n Engine: <strong>Procesamiento Semanal Listo</strong></span>
             </div>
            {alerts.map((alert, i) => (
              <AlertCard key={i} alert={alert} index={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
