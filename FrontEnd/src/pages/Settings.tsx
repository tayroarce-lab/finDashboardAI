import { useState } from 'react';
import { Settings as SettingsIcon, Building, CreditCard, Bell, Shield, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function Settings() {
  const [clinicName, setClinicName] = useState('Clínica Dental Sonrisa');
  const [currency, setCurrency] = useState('USD');
  const [notifications, setNotifications] = useState(true);

  const handleSave = () => {
    // In a real app, this would be a fetch call to update settings
    toast.success('Configuración guardada correctamente');
  };

  return (
    <div className="settings-page">
      <div className="page-header">
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <SettingsIcon size={28} color="#6366f1" /> Configuración
          </h1>
          <p className="text-muted">Gestiona las preferencias de tu clínica y cuenta</p>
        </div>
        <button className="btn btn-primary" onClick={handleSave}>
          <Save size={16} /> Guardar Cambios
        </button>
      </div>

      <div className="dashboard-grid" style={{ marginTop: '2rem' }}>
        <div className="card animate-fade-in">
          <div className="card-header">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Building size={18} /> Datos de la Clínica
            </h3>
          </div>
          <div className="form-group" style={{ padding: '1rem 0' }}>
            <label className="text-muted" style={{ display: 'block', marginBottom: '0.5rem' }}>Nombre Comercial</label>
            <input 
              type="text" 
              className="form-control" 
              value={clinicName} 
              onChange={(e) => setClinicName(e.target.value)}
              style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.75rem', borderRadius: '8px' }}
            />
          </div>
          <div className="form-group">
            <label className="text-muted" style={{ display: 'block', marginBottom: '0.5rem' }}>Moneda del Sistema</label>
            <select 
              className="form-control" 
              value={currency} 
              onChange={(e) => setCurrency(e.target.value)}
              style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.75rem', borderRadius: '8px' }}
            >
              <option value="USD">Dólar Estadounidense (USD)</option>
              <option value="CRC">Colón Costarricense (CRC)</option>
              <option value="MXN">Peso Mexicano (MXN)</option>
              <option value="EUR">Euro (EUR)</option>
            </select>
          </div>
        </div>

        <div className="card animate-fade-in stagger-1">
          <div className="card-header">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Bell size={18} /> Notificaciones
            </h3>
          </div>
          <div style={{ padding: '1rem 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <p style={{ margin: 0 }}>Alertas de Bajo Margen</p>
                <small className="text-muted">Recibe avisos cuando un tratamiento pierda rentabilidad</small>
              </div>
              <input type="checkbox" checked={notifications} onChange={() => setNotifications(!notifications)} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ margin: 0 }}>Reporte Semanal de IA</p>
                <small className="text-muted">Envío automático de insights por email</small>
              </div>
              <input type="checkbox" checked={true} readOnly />
            </div>
          </div>
        </div>

        <div className="card animate-fade-in stagger-2">
          <div className="card-header">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CreditCard size={18} /> Plan y Facturación
            </h3>
          </div>
          <div style={{ padding: '1rem 0' }}>
            <div style={{ background: 'linear-gradient(45deg, #6366f1, #a855f7)', padding: '1.5rem', borderRadius: '12px', color: 'white' }}>
              <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.8 }}>Plan Actual</p>
              <h2 style={{ margin: '0.25rem 0' }}>DentalFlow PRO</h2>
              <button style={{ marginTop: '1rem', background: 'white', color: '#6366f1', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer' }}>
                Gestionar Suscripción
              </button>
            </div>
          </div>
        </div>

        <div className="card animate-fade-in stagger-3">
          <div className="card-header">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Shield size={18} /> Seguridad
            </h3>
          </div>
          <div style={{ padding: '1rem 0' }}>
            <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
              Cambiar Contraseña
            </button>
            <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem', color: '#ef4444' }}>
              Eliminar Cuenta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
