import { useState } from 'react';
import { Check, CreditCard, Zap, Crown, Building2, History, Download } from 'lucide-react';
import { toast } from 'sonner';
import './Subscription.css';

const plans = [
  {
    id: 'basic',
    name: 'Consultorio Solo',
    price: 49,
    description: 'Perfecto para dentistas independientes en un solo consultorio.',
    features: ['Dashboard en tiempo real', 'Análisis de 10 treatments', 'Reportes PDF básicos', 'Chat con IA limitado'],
    icon: Zap,
    color: '#94a3b8'
  },
  {
    id: 'pro',
    name: 'Clínica Pro',
    price: 99,
    description: 'Nuestra solución completa para pequeñas y medianas clínicas.',
    features: ['Todo en Básico', 'Análisis de tratamientos ilimitado', 'Simulador de rentabilidad IA', 'Gestión de inventario', 'Reportes semanales automáticos'],
    popular: true,
    icon: Crown,
    color: '#6366f1'
  },
  {
    id: 'enterprise',
    name: 'Multi-Clínica',
    price: 249,
    description: 'Control total para franquicias o grupos de múltiples clínicas.',
    features: ['Todo en Pro', 'Soporte multi-clínica', 'API de acceso directo', 'IA personalizada', 'Soporte prioritario 24/7'],
    icon: Building2,
    color: '#10b981'
  }
];

const invoices = [
  { id: 'INV-001', date: '2026-04-01', amount: 99.00, status: 'Pagado' },
  { id: 'INV-002', date: '2026-03-01', amount: 99.00, status: 'Pagado' },
  { id: 'INV-003', date: '2026-02-01', amount: 99.00, status: 'Pagado' },
];

export default function Subscription() {
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpdate = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      toast.success('¡Plan actualizado con éxito!');
    }, 1500);
  };

  return (
    <div className="subscription-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1>Gestión de Suscripción</h1>
          <p className="text-muted">Administra tu plan, métodos de pago y facturación</p>
        </div>
      </div>

      <div className="subscription-grid">
        {/* Current Plan Mini Card */}
        <div className="card current-plan-card glass-glow">
          <div className="status-badge">Activo</div>
          <p className="text-muted text-sm">Tu plan actual</p>
          <h2>Clínica Pro</h2>
          <div className="plan-stats">
            <div>
              <span>Próximo pago</span>
              <p>01 May, 2026</p>
            </div>
            <div>
              <span>Monto</span>
              <p>$99.00/mes</p>
            </div>
          </div>
        </div>

        {/* Payment Method Card */}
        <div className="card payment-method-card">
          <div className="card-header">
            <h3>Método de Pago</h3>
            <button className="btn-link">Cambiar</button>
          </div>
          <div className="card-body">
            <div className="cc-info">
              <div className="cc-icon"><CreditCard /></div>
              <div>
                <p className="cc-number">•••• •••• •••• 4242</p>
                <p className="text-muted text-xs">Vence 12/28</p>
              </div>
              <span className="badge badge-indigo">Visa</span>
            </div>
          </div>
        </div>
      </div>

      <h2 className="section-title">Elige el plan ideal para tu crecimiento</h2>
      <div className="plans-grid">
        {plans.map((plan) => (
          <div 
            key={plan.id} 
            className={`plan-card card ${selectedPlan === plan.id ? 'plan-selected' : ''} ${plan.popular ? 'plan-popular' : ''}`}
            onClick={() => setSelectedPlan(plan.id)}
          >
            {plan.popular && <div className="popular-tag">Más Elegido</div>}
            <div className="plan-icon" style={{ backgroundColor: plan.color + '20', color: plan.color }}>
              <plan.icon size={24} />
            </div>
            <h3>{plan.name}</h3>
            <div className="plan-price">
              <span className="currency">$</span>
              <span className="amount">{plan.price}</span>
              <span className="period">/Mes</span>
            </div>
            <p className="plan-desc">{plan.description}</p>
            <ul className="plan-features">
              {plan.features.map(f => (
                <li key={f}><Check size={14} color="#10b981" /> {f}</li>
              ))}
            </ul>
            <button 
              className={`btn ${selectedPlan === plan.id ? 'btn-primary' : 'btn-secondary'} w-full`}
              disabled={isProcessing}
              onClick={(e) => {
                e.stopPropagation();
                handleUpdate();
              }}
            >
              {selectedPlan === plan.id ? (isProcessing ? 'Procesando...' : 'Mantener este plan') : 'Cambiar a este plan'}
            </button>
          </div>
        ))}
      </div>

      <div className="billing-history">
        <h2 className="section-title"><History size={20} /> Historial de Facturación</h2>
        <div className="card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Factura #</th>
                <th>Fecha</th>
                <th>Monto</th>
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map(inv => (
                <tr key={inv.id}>
                  <td><strong>{inv.id}</strong></td>
                  <td>{inv.date}</td>
                  <td>${inv.amount.toFixed(2)}</td>
                  <td><span className="badge badge-green">{inv.status}</span></td>
                  <td><button className="icon-btn"><Download size={16} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
