import { useState } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Plus, TrendingDown, TrendingUp, BarChart3, List } from 'lucide-react';
import type { ExpenseByCat } from '../types';
import './Treatments.css';

const mockExpensesByCategory: ExpenseByCat[] = [
  { category_id: 1, category_name: 'Nómina', icon: '👥', current_amount: 3200, previous_amount: 3200, pct_change: 0, pct_of_total: 49.7, has_alert: false },
  { category_id: 2, category_name: 'Materiales dentales', icon: '🦷', current_amount: 1350, previous_amount: 1098, pct_change: 22.9, pct_of_total: 20.9, has_alert: true },
  { category_id: 3, category_name: 'Renta/Alquiler', icon: '🏢', current_amount: 1200, previous_amount: 1200, pct_change: 0, pct_of_total: 18.6, has_alert: false },
  { category_id: 5, category_name: 'Marketing', icon: '📢', current_amount: 225, previous_amount: 180, pct_change: 25.0, pct_of_total: 3.5, has_alert: false },
  { category_id: 4, category_name: 'Servicios', icon: '💡', current_amount: 185, previous_amount: 178, pct_change: 3.9, pct_of_total: 2.9, has_alert: false },
  { category_id: 6, category_name: 'Equipo y mantenimiento', icon: '🔧', current_amount: 280, previous_amount: 0, pct_change: 100, pct_of_total: 4.3, has_alert: true },
];

const PIE_COLORS = ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd', '#10b981', '#f59e0b', '#ef4444'];
const totalExpenses = mockExpensesByCategory.reduce((s, c) => s + c.current_amount, 0);

export default function Expenses() {
  const [view, setView] = useState<'breakdown' | 'list'>('breakdown');

  return (
    <div className="expenses-page">
      <div className="page-header">
        <div>
          <h1>📉 Control de Gastos</h1>
          <p className="text-muted">Análisis por categoría con comparación vs mes anterior</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary"><Plus size={16} /> Registrar gasto</button>
        </div>
      </div>

      {/* KPI Summary */}
      <div className="grid-kpis">
        <div className="card">
          <span className="kpi-label" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>GASTO TOTAL</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.5rem' }}>${totalExpenses.toLocaleString()}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8125rem', color: 'var(--color-red)', marginTop: '0.375rem' }}>
            <TrendingUp size={14} /> +3.1% vs anterior
          </div>
        </div>
        <div className="card">
          <span className="kpi-label" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>CATEGORÍA MÁS ALTA</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.5rem' }}>👥 Nómina</div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.375rem' }}>49.7% del total • $3,200</div>
        </div>
        <div className="card" style={{ borderColor: 'var(--color-yellow-border)' }}>
          <span className="kpi-label" style={{ fontSize: '0.75rem', color: 'var(--color-yellow)' }}>⚠️ ALERTAS</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.5rem' }}>2</div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.375rem' }}>Materiales +23% • Equipo nuevo</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button className={`tab ${view === 'breakdown' ? 'tab-active' : ''}`}
          onClick={() => setView('breakdown')}><BarChart3 size={16} /> Desglose</button>
        <button className={`tab ${view === 'list' ? 'tab-active' : ''}`}
          onClick={() => setView('list')}><List size={16} /> Lista</button>
      </div>

      <div className="dashboard-grid">
        {/* Pie Chart */}
        <div className="card animate-fade-in">
          <div className="card-header">
            <h3>Distribución por categoría</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={mockExpensesByCategory} dataKey="current_amount" nameKey="category_name"
                cx="50%" cy="50%" outerRadius={110} innerRadius={65}
                stroke="rgba(0,0,0,0.3)" strokeWidth={2}>
                {mockExpensesByCategory.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: '#1a1f35', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', fontSize: '13px' }}
                formatter={(v: number) => [`$${v.toLocaleString()}`, 'Monto']}
              />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem', justifyContent: 'center' }}>
            {mockExpensesByCategory.map((cat, i) => (
              <span key={cat.category_id} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: PIE_COLORS[i] }} />
                {cat.icon} {cat.category_name}
              </span>
            ))}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="card animate-fade-in">
          <div className="card-header">
            <h3>Por categoría vs anterior</h3>
          </div>
          <div className="expense-cats">
            {mockExpensesByCategory.map(cat => (
              <div key={cat.category_id} className={`expense-cat-row ${cat.has_alert ? 'expense-alert-row' : ''}`}>
                <span className="expense-cat-icon">{cat.icon}</span>
                <div className="expense-cat-info">
                  <div className="expense-cat-name">{cat.category_name}</div>
                  <div className="expense-cat-amounts">
                    ${cat.current_amount.toLocaleString()} <span style={{ color: 'var(--text-muted)' }}>/ ant. ${cat.previous_amount.toLocaleString()}</span>
                  </div>
                </div>
                <div className="expense-cat-bar">
                  <div className="expense-cat-bar-fill" style={{
                    width: `${cat.pct_of_total}%`,
                    background: cat.has_alert ? 'var(--color-yellow)' : 'var(--accent-primary)'
                  }} />
                </div>
                <span className="expense-cat-pct">{cat.pct_of_total}%</span>
                <span className={`expense-cat-change ${cat.pct_change > 15 ? 'text-red' : cat.pct_change > 0 ? 'text-yellow' : 'text-green'}`}>
                  {cat.pct_change > 0 ? '+' : ''}{cat.pct_change}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
