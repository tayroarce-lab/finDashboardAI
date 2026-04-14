import { useState, useEffect } from 'react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Cell
} from 'recharts';
import { Plus, Filter, Star, Gem, Briefcase, Skull, CircleDollarSign, TrendingUp, DollarSign, FileDown, BrainCircuit, RefreshCw, AlertTriangle } from 'lucide-react';
import type { TreatmentProfitability } from '../types';
import Skeleton from '../components/ui/Skeleton';
import { downloadCSV } from '../utils/export';
import { toast } from 'sonner';
import api from '../services/api';
import './Treatments.css';

// Mock profitability data
const mockProfitability: TreatmentProfitability[] = [
  { id: 9, name: 'Blanqueamiento', catalog_price: 200, estimated_cost: 55, category: 'cosmetic', times_performed: 2, avg_revenue: 190, avg_cost: 55, avg_profit: 135, avg_margin_pct: 71.1, total_profit_contribution: 270, quadrant: { type: 'gem', label: 'Joya', action: 'Aumentar volumen' } },
  { id: 10, name: 'Ortodoncia', catalog_price: 120, estimated_cost: 35, category: 'orthodontic', times_performed: 3, avg_revenue: 120, avg_cost: 35, avg_profit: 85, avg_margin_pct: 70.8, total_profit_contribution: 255, quadrant: { type: 'gem', label: 'Joya', action: 'Aumentar volumen' } },
  { id: 1, name: 'Limpieza dental', catalog_price: 45, estimated_cost: 18, category: 'preventive', times_performed: 8, avg_revenue: 45, avg_cost: 18, avg_profit: 27, avg_margin_pct: 60.0, total_profit_contribution: 216, quadrant: { type: 'star', label: 'Estrella', action: 'Proteger y crecer' } },
  { id: 3, name: 'Resina compuesta', catalog_price: 95, estimated_cost: 38, category: 'restorative', times_performed: 7, avg_revenue: 91, avg_cost: 39, avg_profit: 52, avg_margin_pct: 57.1, total_profit_contribution: 334, quadrant: { type: 'star', label: 'Estrella', action: 'Proteger y crecer' } },
  { id: 7, name: 'Corona dental', catalog_price: 380, estimated_cost: 160, category: 'restorative', times_performed: 5, avg_revenue: 362, avg_cost: 160, avg_profit: 202, avg_margin_pct: 55.8, total_profit_contribution: 1010, quadrant: { type: 'star', label: 'Estrella', action: 'Proteger y crecer' } },
  { id: 8, name: 'Implante dental', catalog_price: 850, estimated_cost: 395, category: 'surgical', times_performed: 2, avg_revenue: 800, avg_cost: 405, avg_profit: 395, avg_margin_pct: 49.4, total_profit_contribution: 790, quadrant: { type: 'gem', label: 'Joya', action: 'Aumentar volumen' } },
  { id: 6, name: 'Endodoncia', catalog_price: 280, estimated_cost: 125, category: 'endodontic', times_performed: 3, avg_revenue: 280, avg_cost: 128, avg_profit: 152, avg_margin_pct: 54.3, total_profit_contribution: 412, quadrant: { type: 'gem', label: 'Joya', action: 'Aumentar volumen' } },
  { id: 5, name: 'Extracción muela', catalog_price: 180, estimated_cost: 75, category: 'surgical', times_performed: 2, avg_revenue: 180, avg_cost: 77, avg_profit: 103, avg_margin_pct: 57.2, total_profit_contribution: 207, quadrant: { type: 'gem', label: 'Joya', action: 'Aumentar volumen' } },
  { id: 4, name: 'Extracción simple', catalog_price: 65, estimated_cost: 28, category: 'surgical', times_performed: 2, avg_revenue: 65, avg_cost: 29, avg_profit: 36, avg_margin_pct: 55.4, total_profit_contribution: 72, quadrant: { type: 'gem', label: 'Joya', action: 'Aumentar volumen' } },
  { id: 2, name: 'Limpieza profunda', catalog_price: 85, estimated_cost: 46, category: 'preventive', times_performed: 0, avg_revenue: 0, avg_cost: 0, avg_profit: 0, avg_margin_pct: 0, total_profit_contribution: 0, quadrant: { type: 'trap', label: 'Trampa', action: 'Evaluar' } },
];

const quadrantColors: Record<string, string> = {
  star: '#10b981', gem: '#6366f1', cow: '#f59e0b', trap: '#ef4444'
};

export default function Treatments() {
  const [tab, setTab] = useState<'catalog' | 'profitability' | 'simulator'>('profitability');
  const [profitabilityData, setProfitabilityData] = useState<TreatmentProfitability[]>(mockProfitability);
  const [loading, setLoading] = useState(true);
  
  // Simulator state
  const [simTarget, setSimTarget] = useState<number>(0);
  const [simPrice, setSimPrice] = useState<number>(0);
  const [simCost, setSimCost] = useState<number>(0);

  useEffect(() => {
    const fetchTreatments = async () => {
      try {
        setLoading(true);
        const res = await api.get('/finance/profitability');
        if (res.data.success && res.data.data) {
          setProfitabilityData(res.data.data);
          if (res.data.data.length > 0) {
            const first = res.data.data[0];
            setSimTarget(0);
            setSimPrice(first.catalog_price || 0);
            setSimCost(first.estimated_cost || 0);
          }
        }
      } catch (err) {
        console.error("Error fetching treatments data:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTreatments();
  }, []);

  const activeData = profitabilityData.filter(t => t.times_performed > 0);

  const selectedForSim = profitabilityData[simTarget];
  const currentSimMargin = simPrice > 0 ? ((simPrice - simCost) / simPrice) * 100 : 0;
  const originalMargin = selectedForSim ? ((selectedForSim.catalog_price - selectedForSim.estimated_cost) / selectedForSim.catalog_price) * 100 : 0;
  const marginDiff = currentSimMargin - originalMargin;

  return (
    <div className="treatments-page">
      <div className="page-header">
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CircleDollarSign size={28} color="#6366f1" /> Tratamientos & Rentabilidad</h1>
          <p className="text-muted">Análisis de márgenes y estrategia de precios</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-secondary" onClick={() => {
            downloadCSV(profitabilityData, 'tratamientos_dentalflow');
            toast.info('Exportando tratamientos...');
          }}>
            <FileDown size={16} /> Exportar
          </button>
          <button className="btn btn-secondary"><Filter size={16} /> Filtrar</button>
          <button className="btn btn-primary"><Plus size={16} /> Nuevo tratamiento</button>
        </div>
      </div>

      <div className="tabs">
        <button className={`tab ${tab === 'profitability' ? 'tab-active' : ''}`}
          onClick={() => setTab('profitability')}>
          <TrendingUp size={16} /> Rentabilidad
        </button>
        <button className={`tab ${tab === 'catalog' ? 'tab-active' : ''}`}
          onClick={() => setTab('catalog')}>
          <DollarSign size={16} /> Catálogo
        </button>
        <button className={`tab ${tab === 'simulator' ? 'tab-active' : ''}`}
          onClick={() => setTab('simulator')}>
          <BrainCircuit size={16} /> Simulador IA
        </button>
      </div>

      {tab === 'profitability' && (
        <>
          <div className="grid-kpis">
            {loading 
              ? Array(4).fill(0).map((_, i) => <Skeleton key={i} height="140px" variant="rect" />)
              : (['star', 'gem', 'cow', 'trap'] as const).map(type => {
                  const items = activeData.filter(t => t.quadrant.type === type);
                  const labels: Record<string, { icon: any; name: string; desc: string }> = {
                    star: { icon: Star, name: 'Estrellas', desc: 'Alto margen + Alto volumen' },
                    gem: { icon: Gem, name: 'Joyas', desc: 'Alto margen + Bajo volumen' },
                    cow: { icon: Briefcase, name: 'Vacas', desc: 'Bajo margen + Alto volumen' },
                    trap: { icon: Skull, name: 'Trampas', desc: 'Bajo margen + Bajo volumen' },
                  };
                  const Icon = labels[type].icon;
                  return (
                    <div key={type} className="card quadrant-card" style={{ borderColor: quadrantColors[type] + '40' }}>
                      <span className="quadrant-icon"><Icon size={24} color={quadrantColors[type]} /></span>
                      <h4>{labels[type].name} ({items.length})</h4>
                      <p className="text-muted" style={{ fontSize: '0.75rem' }}>{labels[type].desc}</p>
                      <div className="quadrant-names">
                        {items.map(t => <span key={t.id}>{t.name}</span>)}
                        {items.length === 0 && <span className="text-muted">Ninguno</span>}
                      </div>
                    </div>
                  );
                })
            }
          </div>

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
                  formatter={(v: any, _: any, p: any) => [`${parseFloat(v).toFixed(1)}% (${p.payload.times_performed} realizados)`, 'Margen']}
                />
                <Bar dataKey="avg_margin_pct" radius={[0, 6, 6, 0]} barSize={20}>
                  {activeData.map((t, i) => (
                    <Cell key={i} fill={quadrantColors[t.quadrant.type]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

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
                  </tr>
                </thead>
                <tbody>
                  {profitabilityData.map(t => (
                    <tr key={t.id}>
                      <td><strong>{t.name}</strong><br/><span className="text-muted" style={{fontSize:'0.75rem'}}>{t.category}</span></td>
                      <td>{t.times_performed || 0}</td>
                      <td>${(t.avg_revenue || 0).toFixed(2)}</td>
                      <td>${(t.avg_cost || 0).toFixed(2)}</td>
                      <td><span className={`badge badge-${(t.avg_margin_pct || 0) >= 50 ? 'green' : (t.avg_margin_pct || 0) >= 30 ? 'yellow' : 'red'}`}>{(t.avg_margin_pct || 0).toFixed(1)}%</span></td>
                      <td className="text-accent">${(t.total_profit_contribution || 0).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {tab === 'catalog' && (
        <div className="card animate-fade-in">
          <div className="card-header"><h3>Catálogo de Tratamientos</h3></div>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr><th>Nombre</th><th>Categoría</th><th>Precio</th><th>Costo Est.</th><th>Margen Est.</th><th>Duración</th></tr>
              </thead>
              <tbody>
                {profitabilityData.map(t => (
                  <tr key={t.id}>
                    <td><strong>{t.name}</strong></td>
                    <td><span className="badge badge-green">{t.category}</span></td>
                    <td>${(t.catalog_price || 0).toFixed(2)}</td>
                    <td>${(t.estimated_cost || 0).toFixed(2)}</td>
                    <td>{((1 - (t.estimated_cost || 0) / (t.catalog_price || 1)) * 100).toFixed(0)}%</td>
                    <td>60 min</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'simulator' && selectedForSim && (
        <div className="simulator-container animate-fade-in">
          <div className="card simulator-controls">
            <div className="card-header">
              <h3><BrainCircuit size={18} color="#6366f1" /> Simulador de Impacto Inteligente</h3>
              <p className="text-muted">Proyecta márgenes basados en ajustes tácticos</p>
            </div>
            
            <div className="sim-form">
              <div className="form-group">
                <label className="label">Tratamiento de Referencia</label>
                <select 
                  className="input select" 
                  value={simTarget} 
                  onChange={(e) => {
                    const idx = parseInt(e.target.value);
                    setSimTarget(idx);
                    setSimPrice(profitabilityData[idx].catalog_price);
                    setSimCost(profitabilityData[idx].estimated_cost);
                  }}
                >
                  {profitabilityData.map((t, i) => <option key={t.id} value={i}>{t.name}</option>)}
                </select>
              </div>
 
              <div className="sim-sliders">
                <div className="form-group">
                  <div className="sim-value-track">
                    <span className="sim-label-text">Nuevo Punto de Precio</span>
                    <span className="sim-amount-text">${simPrice}</span>
                  </div>
                  <input 
                    type="range" 
                    min={simCost} 
                    max={simPrice * 2} 
                    step="5" 
                    value={simPrice} 
                    onChange={(e) => setSimPrice(parseInt(e.target.value))} 
                  />
                </div>
 
                <div className="form-group">
                  <div className="sim-value-track">
                    <span className="sim-label-text">Escalamiento de Costos</span>
                    <span className="sim-amount-text">${simCost}</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max={simPrice} 
                    step="1" 
                    value={simCost} 
                    onChange={(e) => setSimCost(parseInt(e.target.value))} 
                  />
                </div>
              </div>
 
              <button className="btn btn-secondary w-full" onClick={() => {
                setSimPrice(selectedForSim.catalog_price);
                setSimCost(selectedForSim.estimated_cost);
              }}>
                <RefreshCw size={14} /> Restaurar Valores Base
              </button>
            </div>
          </div>
 
          <div className="simulator-results">
            <div className="card sim-result-card glass-glow">
              <span className="sim-label-main">Margen Bruto Proyectado</span>
              <h2 className={`sim-value-main ${currentSimMargin > 50 ? 'text-green' : currentSimMargin > 30 ? 'text-yellow' : 'text-red'}`}>
                {currentSimMargin.toFixed(1)}%
              </h2>
              <div className={`sim-diff-pill ${marginDiff >= 0 ? 'pill-up' : 'pill-down'}`}>
                {marginDiff >= 0 ? <TrendingUp size={14}/> : <AlertTriangle size={14}/>}
                {marginDiff >= 0 ? '+' : ''}{marginDiff.toFixed(1)}% de Diferencial
              </div>
            </div>
 
            <div className="card recommendation-card">
              <div className="card-header">
                <h3><BrainCircuit size={18} color="#6366f1"/> Estrategia CFO Automática</h3>
              </div>
              <div className="rec-content" style={{ padding: 0 }}>
                {currentSimMargin < 40 ? (
                  <div className="rec-item rec-danger">
                    <AlertTriangle size={24} className="text-red" />
                    <p><strong>Riesgo de Rentabilidad detectado.</strong> El margen resultante está por debajo del umbral de seguridad clínica. Se recomienda encarecidamente revisar la cadena de suministro o el tiempo de sillón asignado.</p>
                  </div>
                ) : marginDiff > 5 ? (
                  <div className="rec-item rec-success">
                    <TrendingUp size={24} className="text-green" />
                    <p><strong>Optimización de Alto Impacto.</strong> Este ajuste proyecta una utilidad incremental de <strong>${(marginDiff/100 * simPrice * (selectedForSim.times_performed || 10)).toFixed(0)}</strong> mensuales. Es seguro proceder con el cambio en el catálogo.</p>
                  </div>
                ) : (
                  <div className="rec-item rec-info">
                    <Briefcase size={24} className="text-accent" />
                    <p><strong>Equilibrio de Mercado.</strong> Mantienes una posición competitiva. El margen es saludable para la categoría <strong>{selectedForSim.category}</strong> y permite absorber fluctuaciones menores en costos.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
