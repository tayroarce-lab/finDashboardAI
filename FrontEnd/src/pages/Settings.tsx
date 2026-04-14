import { useState } from 'react';
import { Settings as SettingsIcon, Building, CreditCard, Bell, Shield, Save, Users, RefreshCw, Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import './Settings.css';

export default function Settings() {
  const navigate = useNavigate();
  const [clinicName, setClinicName] = useState('Clínica Dental Sonrisa');
  const [currency, setCurrency] = useState('USD');
  const [notifications, setNotifications] = useState(true);

  const handleSave = () => {
    toast.success('Configuración guardada correctamente');
  };

  return (
    <div className="settings-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="flex items-center gap-2">
            <SettingsIcon size={28} className="text-accent" /> Configuración General
          </h1>
          <p className="text-muted">Gestiona las preferencias críticas de tu clínica y equipo</p>
        </div>
        <button className="btn btn-primary" onClick={handleSave}>
          <Save size={16} /> Guardar Cambios
        </button>
      </div>

      <div className="settings-grid">
        {/* Clínica */}
        <div className="card settings-section">
          <div className="settings-section-header">
            <Building size={18} className="text-accent" />
            <h3>Identidad de Clínica</h3>
          </div>
          <div className="flex flex-col gap-4">
            <div className="form-group">
              <label className="label">Nombre Comercial</label>
              <input 
                type="text" 
                className="input" 
                value={clinicName} 
                onChange={(e) => setClinicName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="label">Moneda Base</label>
              <select 
                className="input select" 
                value={currency} 
                onChange={(e) => setCurrency(e.target.value)}
              >
                <option value="USD">Dólar Estadounidense (USD)</option>
                <option value="CRC">Colón Costarricense (CRC)</option>
                <option value="MXN">Peso Mexicano (MXN)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notificaciones */}
        <div className="card settings-section">
          <div className="settings-section-header">
            <Bell size={18} className="text-accent" />
            <h3>Preferencias de Alerta</h3>
          </div>
          <div className="toggle-group">
            <div className="toggle-item">
              <div className="toggle-item-info">
                <p>Alertas de Rentabilidad</p>
                <small className="text-muted">Avisos por márgenes inferiores al 30%</small>
              </div>
              <input type="checkbox" checked={notifications} onChange={() => setNotifications(!notifications)} />
            </div>
            <div className="toggle-item">
              <div className="toggle-item-info">
                <p>Reporte Semanal n8n</p>
                <small className="text-muted">Envío automático de consolidado financiero</small>
              </div>
              <input type="checkbox" checked={true} readOnly />
            </div>
          </div>
        </div>

        {/* Facturación */}
        <div className="card settings-section">
          <div className="settings-section-header">
            <CreditCard size={18} className="text-accent" />
            <h3>Estado del Plan</h3>
          </div>
          <div className="settings-billing-cta">
            <p className="text-xs uppercase font-bold opacity-80">Suscripción Activa</p>
            <h3>DentalFlow PRO</h3>
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/subscription')}>
              Administrar Plan
            </button>
          </div>
        </div>

        {/* Equipo */}
        <div className="card settings-section">
          <div className="settings-section-header">
            <Users size={18} className="text-accent" />
            <h3>Gestión de Equipo</h3>
          </div>
          <div className="team-list">
            <div className="team-item">
              <div className="avatar">AD</div>
              <div>
                <p>Admin Principal</p>
                <small className="text-muted">Owner / Especialista</small>
              </div>
            </div>
            <button className="btn btn-secondary btn-sm w-full">
              <Plus size={14} /> Invitar a Colega
            </button>
          </div>
        </div>

        {/* Seguridad */}
        <div className="card settings-section">
          <div className="settings-section-header">
            <Shield size={18} className="text-accent" />
            <h3>Seguridad y Datos</h3>
          </div>
          <div className="settings-actions-footer">
            <button className="btn btn-secondary w-full">
              <RefreshCw size={14} /> Actualizar Contraseña
            </button>
            <button className="btn btn-secondary w-full text-red">
              <Trash2 size={14} /> Solicitar Borrado de Datos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
