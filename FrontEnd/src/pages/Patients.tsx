import { useState, useEffect } from 'react';
import { Users, Search, Plus, Phone, Mail, Calendar, Edit, Trash2 } from 'lucide-react';
import api from '../services/api';
import { toast } from 'sonner';

interface Patient {
  id: number;
  name: string;
  phone: string;
  email: string;
  birth_date: string;
  notes: string;
}

export default function Patients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients() {
    try {
      setLoading(true);
      api.get('/patients').then(res => {
        if (res.data.success) setPatients(res.data.data);
      });
    } catch (error) {
      console.error(error);
      toast.error('Error al cargar pacientes');
    } finally {
      setLoading(false);
    }
  }

  const filtered = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.email && p.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="patients-page">
      <header className="page-header">
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users size={32} color="#6366f1" /> Gestión de Pacientes
          </h1>
          <p className="text-muted">Directorio de pacientes y expedientes clínicos</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={16} /> Nuevo Paciente
        </button>
      </header>

      <div className="card" style={{ marginTop: '2rem', padding: '1.5rem' }}>
        <div className="search-wrap" style={{ marginBottom: '1.5rem', maxWidth: '400px', position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            className="input" 
            placeholder="Buscar por nombre o email..." 
            style={{ paddingLeft: '40px', width: '100%' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>Cargando pacientes...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>No se encontraron pacientes.</div>
        ) : (
          <div className="table-responsive">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ padding: '1rem' }}>Paciente</th>
                  <th style={{ padding: '1rem' }}>Contacto</th>
                  <th style={{ padding: '1rem' }}>F. Nacimiento</th>
                  <th style={{ padding: '1rem' }}>Notas</th>
                  <th style={{ padding: '1rem' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: 600 }}>{p.name}</div>
                      <div className="text-muted" style={{ fontSize: '0.75rem' }}>ID: #{p.id}</div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <Phone size={14} className="text-muted" /> {p.phone || 'N/A'}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Mail size={14} className="text-muted" /> {p.email || 'N/A'}
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Calendar size={14} className="text-muted" /> {p.birth_date ? new Date(p.birth_date).toLocaleDateString() : 'N/A'}
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span className="text-muted" style={{ fontSize: '0.85rem' }}>{p.notes || 'Sin notas'}</span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn-icon"><Edit size={16} /></button>
                        <button className="btn-icon" style={{ color: '#ef4444' }}><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
