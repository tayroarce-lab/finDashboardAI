import { useState, useEffect } from 'react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Cell, PieChart, Pie
} from 'recharts';
import { Users, TrendingUp, Clock, Target, Award, Filter, RefreshCw } from 'lucide-react';
import type { DoctorPerformance, ApiResponse } from '../types';

export default function Doctors() {
  const [doctors, setDoctors] = useState<DoctorPerformance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('df_token');
      const res = await fetch('http://localhost:3000/api/doctors/performance?period=month', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const json: ApiResponse<DoctorPerformance[]> = await res.json();
      if (json.success) {
        setDoctors(json.data);
      }
    } catch (err) {
      console.error("Error fetching doctor performance:", err);
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = doctors.reduce((acc, doc) => acc + doc.stats.revenue, 0);

  return (
    <div className="doctors-page">
      <div className="page-header">
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users size={28} color="#6366f1" /> Rendimiento de Profesionales {loading && <span className="text-muted" style={{fontSize:'0.6em', marginLeft: '.5rem'}}>(Actualizando...)</span>}
          </h1>
          <p className="text-muted">Análisis de "Chair-Time" y eficiencia operativa por doctor</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-secondary" onClick={fetchData}><RefreshCw size={16} /> Refrescar</button>
          <button className="btn btn-primary"><Filter size={16} /> Filtrar Periodo</button>
        </div>
      </div>

      <div className="grid-kpis">
        <div className="card shadow-sm animate-fade-in">
          <div className="kpi-header">
            <span className="kpi-icon icon-blue"><Target size={20} /></span>
          </div>
          <div className="kpi-body">
            <h3>{doctors.length}</h3>
            <p className="text-muted">Doctores Activos</p>
          </div>
        </div>
        <div className="card shadow-sm animate-fade-in stagger-1">
          <div className="kpi-header">
            <span className="kpi-icon icon-green"><TrendingUp size={20} /></span>
          </div>
          <div className="kpi-body">
            <h3>${totalRevenue.toLocaleString()}</h3>
            <p className="text-muted">Ingresos Totales (Mes)</p>
          </div>
        </div>
        <div className="card shadow-sm animate-fade-in stagger-2">
          <div className="kpi-header">
            <span className="kpi-icon icon-purple"><Clock size={20} /></span>
          </div>
          <div className="kpi-body">
            <h3>{doctors.reduce((acc, doc) => acc + doc.stats.minutes, 0)} min</h3>
            <p className="text-muted">Tiempo Total Productivo</p>
          </div>
        </div>
        <div className="card shadow-sm animate-fade-in stagger-3">
          <div className="kpi-header">
            <span className="kpi-icon icon-red"><Award size={20} /></span>
          </div>
          <div className="kpi-body">
            <h3>{doctors.length > 0 ? (doctors.reduce((acc, doc) => acc + doc.stats.efficiency, 0) / doctors.length).toFixed(1) : 0}%</h3>
            <p className="text-muted">Eficiencia General</p>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="card animate-fade-in stagger-4">
          <div className="card-header">
            <h3> चेयर-टाइम (Chair-Time) — $/Hora</h3>
            <p className="text-muted">Ingreso promedio generado por hora ocupada</p>
          </div>
          <div style={{ height: 300, marginTop: '1rem' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={doctors} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip 
                  contentStyle={{ background: '#1a1f35', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px' }}
                  formatter={(v: any) => [`$${v}`, 'Ingreso/Hora']}
                />
                <Bar dataKey="stats.revenuePerHour" radius={[6, 6, 0, 0]} barSize={40}>
                  {doctors.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card animate-fade-in stagger-5">
           <div className="card-header">
            <h3>Participación en Ingresos</h3>
          </div>
          <div style={{ height: 300, marginTop: '1rem' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={doctors}
                  dataKey="stats.revenue"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={60}
                  paddingAngle={5}
                >
                  {doctors.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#1a1f35', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detail Table */}
      <div className="card animate-fade-in stagger-6" style={{ marginTop: '2rem' }}>
        <div className="card-header">
          <h3>Detalle de Productividad por Profesional</h3>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Doctor</th>
                <th>Especialidad</th>
                <th>Citas (Realizadas)</th>
                <th>Ingresos</th>
                <th>Tiempo Estimado</th>
                <th>Rendimiento/H</th>
                <th>Eficiencia</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map(doc => (
                <tr key={doc.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: doc.color }}></div>
                      <strong>{doc.name}</strong>
                    </div>
                  </td>
                  <td>{doc.specialty}</td>
                  <td>{doc.stats.appointments} ({doc.stats.completed})</td>
                  <td>${doc.stats.revenue.toLocaleString()}</td>
                  <td>{(doc.stats.minutes / 60).toFixed(1)} h</td>
                  <td style={{ color: doc.stats.revenuePerHour > 100 ? '#10b981' : '#f59e0b' }}>
                    <strong>${doc.stats.revenuePerHour}</strong>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div className="progress-bar-bg" style={{ width: '60px', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px' }}>
                        <div style={{ width: `${doc.stats.efficiency}%`, height: '100%', background: doc.color, borderRadius: '3px' }}></div>
                      </div>
                      <span style={{ fontSize: '0.8rem' }}>{doc.stats.efficiency}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
