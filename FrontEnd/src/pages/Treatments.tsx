import { useState } from 'react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Cell, ScatterChart, Scatter, ZAxis, Legend
} from 'recharts';
import { Plus, Search, DollarSign, TrendingUp, Filter } from 'lucide-react';
import type { TreatmentProfitability } from '../types';
import './Treatments.css';

// Mock profitability data
const mockProfitability: TreatmentProfitability[] = [
  { id: 9, name: 'Blanqueamiento', catalog_price: 200, estimated_cost: 55, category: 'cosmetic', times_performed: 2, avg_revenue: 190, avg_cost: 55, avg_profit: 135, avg_margin_pct: 71.1, total_profit_contribution: 270, quadrant: { type: 'gem', label: '💎 Joya', action: 'Aumentar volumen' } },
  { id: 10, name: 'Ortodoncia', catalog_price: 120, estimated_cost: 35, category: 'orthodontic', times_performed: 3, avg_revenue: 120, avg_cost: 35, avg_profit: 85, avg_margin_pct: 70.8, total_profit_contribution: 255, quadrant: { type: 'gem', label: '💎 Joya', action: 'Aumentar volumen' } },
  { id: 1, name: 'Limpieza dental', catalog_price: 45, estimated_cost: 18, category: 'preventive', times_performed: 8, avg_revenue: 45, avg_cost: 18, avg_profit: 27, avg_margin_pct: 60.0, total_profit_contribution: 216, quadrant: { type: 'star', label: '⭐ Estrella', action: 'Proteger y crecer' } },
  { id: 3, name: 'Resina compuesta', catalog_price: 95, estimated_cost: 38, category: 'restorative', times_performed: 7, avg_revenue: 91, avg_cost: 39, avg_profit: 52, avg_margin_pct: 57.1, total_profit_contribution: 334, quadrant: { type: 'star', label: '⭐ Estrella', action: 'Proteger y crecer' } },
  { id: 7, name: 'Corona dental', catalog_price: 380, estimated_cost: 160, category: 'restorative', times_performed: 5, avg_revenue: 362, avg_cost: 160, avg_profit: 202, avg_margin_pct: 55.8, total_profit_contribution: 1010, quadrant: { type: 'star', label: '⭐ Estrella', action: 'Proteger y crecer' } },
  { id: 8, name: 'Implante dental', catalog_price: 850, estimated_cost: 395, category: 'surgical', times_performed: 2, avg_revenue: 800, avg_cost: 405, avg_profit: 395, avg_margin_pct: 49.4, total_profit_contribution: 790, quadrant: { type: 'gem', label: '💎 Joya', action: 'Aumentar volumen' } },
  { id: 6, name: 'Endodoncia', catalog_price: 280, estimated_cost: 125, category: 'endodontic', times_performed: 3, avg_revenue: 280, avg_cost: 128, avg_profit: 152, avg_margin_pct: 54.3, total_profit_contribution: 412, quadrant: { type: 'gem', label: '💎 Joya', action: 'Aumentar volumen' } },
  { id: 5, name: 'Extracción muela', catalog_price: 180, estimated_cost: 75, category: 'surgical', times_performed: 2, avg_revenue: 180, avg_cost: 77, avg_profit: 103, avg_margin_pct: 57.2, total_profit_contribution: 207, quadrant: { type: 'gem', label: '💎 Joya', action: 'Aumentar volumen' } },
  { id: 4, name: 'Extracción simple', catalog_price: 65, estimated_cost: 28, category: 'surgical', times_performed: 2, avg_revenue: 65, avg_cost: 29, avg_profit: 36, avg_margin_pct: 55.4, total_profit_contribution: 72, quadrant: { type: 'gem', label: '💎 Joya', action: 'Aumentar volumen' } },
  { id: 2, name: 'Limpieza profunda', catalog_price: 85, estimated_cost: 46, category: 'preventive', times_performed: 0, avg_revenue: 0, avg_cost: 0, avg_profit: 0, avg_margin_pct: 0, total_profit_contribution: 0, quadrant: { type: 'trap', label: '☠️ Trampa', action: 'Evaluar' } },
];

const quadrantColors: Record<string, string> = {
  star: '#10b981', gem: '#6366f1', cow: '#f59e0b', trap: '#ef4444'
};

export default function Treatments() {
  const [tab, setTab] = useState<'catalog' | 'profitability'>('profitability');
  const activeData = mockProfitability.filter(t => t.times_performed > 0);

  return (
    <div className="treatments-page">
      <div className="page-header">
        <div>
          <h1>💰 Tratamientos & Rentabilidad</h1>
          <p className="text-muted">Análisis de márgenes y estrategia de precios</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-secondary"><Filter size={16} /> Filtrar</button>
          <button className="btn btn-primary"><Plus size={16} /> Nuevo tratamiento</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button className={`tab ${tab === 'profitability' ? 'tab-active' : ''}`}
          onClick={() => setTab('profitability')}>
          <TrendingUp size={16} /> Rentabilidad
        </button>
        <button className={`tab ${tab === 'catalog' ? 'tab-active' : ''}`}
          onClick={() => setTab('catalog')}>
          <DollarSign size={16} /> Catálogo
        </button>
      </div>

      {tab === 'profitability' ? (
        <>
          {/* Quadrant Summary */}
          <div className="grid-kpis">
            {(['star', 'gem', 'cow', 'trap'] as const).map(type => {
              const items = activeData.filter(t => t.quadrant.type === type);
              const labels: Record<string, { icon: string; name: string; desc: string }> = {
                star: { icon: '⭐', name: 'Estrellas', desc: 'Alto margen + Alto volumen' },
                gem: { icon: '💎', name: 'Joyas', desc: 'Alto margen + Bajo volumen' },
                cow: { icon: '🐄', name: 'Vacas', desc: 'Bajo margen + Alto volumen' },
                trap: { icon: '☠️', name: 'Trampas', desc: 'Bajo margen + Bajo volumen' },
              };
              return (
                <div key={type} className="card quadrant-card" style={{ borderColor: quadrantColors[type] + '40' }}>
                  <span className="quadrant-icon">{labels[type].icon}</span>
                  <h4>{labels[type].name} ({items.length})</h4>
                  <p className="text-muted" style={{ fontSize: '0.75rem' }}>{labels[type].desc}</p>
                  <div className="quadrant-names">
                    {items.map(t => <span key={t.id}>{t.name}</span>)}
                    {items.length === 0 && <span className="text-muted">Ninguno</span>}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Margin Chart */}
          <div className="card animate-fade-in">
            <div className="card-header">
              <h3>Margen por tratamiento</h3>
              <span className="text-muted" style={{ fontSize: '0.8125rem' }}>Este mes</span>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={activeData} layout="vertical" margin={{ left: 100, right: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis type="number" stroke="#64748b" fontSize={11} tickFormatter={v => `${v}%`} domain={[0, 80]} />
                <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={12} width={95} />
                <Tooltip
                  contentStyle={{ background: '#1a1f35', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', fontSize: '13px' }}
                  formatter={(v: number, _: string, p: any) => [`${v}% (${p.payload.times_performed} realizados)`, 'Margen']}
                />
                <Bar dataKey="avg_margin_pct" radius={[0, 6, 6, 0]} barSize={20}>
                  {activeData.map((t, i) => (
                    <Cell key={i} fill={quadrantColors[t.quadrant.type]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Table */}
          <div className="card animate-fade-in">
            <div className="card-header">
              <h3>Detalle de rentabilidad</h3>
            </div>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Tratamiento</th>
                    <th>Realizados</th>
                    <th>Ingreso Prom.</th>
                    <th>Costo Prom.</th>
                    <th>Margen</th>
                    <th>Contribución Total</th>
                    <th>Cuadrante</th>
                  </tr>
                </thead>
                <tbody>
                  {mockProfitability.map(t => (
                    <tr key={t.id}>
                      <td><strong>{t.name}</strong><br/><span className="text-muted" style={{fontSize:'0.75rem'}}>{t.category}</span></td>
                      <td>{t.times_performed}</td>
                      <td>${t.avg_revenue.toFixed(2)}</td>
                      <td>${t.avg_cost.toFixed(2)}</td>
                      <td><span className={`badge badge-${t.avg_margin_pct >= 50 ? 'green' : t.avg_margin_pct >= 30 ? 'yellow' : 'red'}`}>{t.avg_margin_pct}%</span></td>
                      <td className="text-accent">${t.total_profit_contribution.toFixed(2)}</td>
                      <td>{t.quadrant.label}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="card animate-fade-in">
          <div className="card-header"><h3>Catálogo de Tratamientos</h3></div>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr><th>Nombre</th><th>Categoría</th><th>Precio</th><th>Costo Est.</th><th>Margen Est.</th><th>Duración</th></tr>
              </thead>
              <tbody>
                {mockProfitability.map(t => (
                  <tr key={t.id}>
                    <td><strong>{t.name}</strong></td>
                    <td><span className="badge badge-green">{t.category}</span></td>
                    <td>${t.catalog_price.toFixed(2)}</td>
                    <td>${t.estimated_cost.toFixed(2)}</td>
                    <td>{((1 - t.estimated_cost / t.catalog_price) * 100).toFixed(0)}%</td>
                    <td>60 min</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
