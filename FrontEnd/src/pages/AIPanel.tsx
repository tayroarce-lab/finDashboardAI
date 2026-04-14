import { useState, useEffect } from 'react';
import { BrainCircuit, MessageSquare, Send, AlertTriangle, Lightbulb, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import api from '../services/api';
import AlertCard from '../components/ui/AlertCard';

import { mockAlerts } from '../data/mockData';
import './AIPanel.css';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const quickQuestions = [
  '¿Qué tratamiento debería promover más?',
  '¿Cómo puedo reducir mis gastos en materiales?',
  '¿Cuánto estoy perdiendo por huecos en la agenda?',
  '¿Es viable abrir los sábados?',
];

const mockResponses: Record<string, string> = {
  '¿Qué tratamiento debería promover más?':
    '📊 **Corona dental** es tu tratamiento más rentable con $1,010 de contribución total y 55.8% de margen. Sin embargo, **Blanqueamiento** tiene 71% de margen y solo lo haces 2 veces al mes.\n\n💡 **Recomendación:** Crea un paquete "Blanqueamiento Express" con descuento del 10% para redes sociales. Si logras 4 blanqueamientos extra al mes, son **$540 adicionales** con costo mínimo.',
  '¿Cómo puedo reducir mis gastos en materiales?':
    '🦷 Tus materiales dentales subieron **23% este mes** ($1,350 vs $1,098). Eso representa $252 adicionales.\n\n🔍 **Análisis:** Compraste 3 veces este mes (Dental Supply x2, Dental Express x1). Dental Supply es 15% más caro.\n\n💡 **Acción inmediata:**\n1. Cotizar todo con Dental Express ($380 vs $450 en Supply)\n2. Comprar resinas en bulk cada 2 meses (-8% descuento)\n3. **Ahorro proyectado: $180-220/mes**',
  '¿Cuánto estoy perdiendo por huecos en la agenda?':
    '📅 Tu ocupación esta semana es **70%**. Tienes 12 slots vacíos.\n\n💸 Con tu ticket promedio de $175:\n- **Ingresos perdidos potenciales: $2,100/semana**\n- Al mes: ~$8,400 en oportunidad perdida\n\n💡 **Plan de acción:**\n1. Ofrecer 10% descuento en martes y viernes (los más vacíos)\n2. Implementar recordatorios por WhatsApp 24h antes\n3. Lista de espera para cancelaciones de último minuto',
  '¿Es viable abrir los sábados?':
    '🔢 **Análisis de viabilidad:**\n\n- Costo fijo sábado: ~$320 (asistente + servicios)\n- Si atiendes 4 pacientes: $175 x 4 = $700\n- **Utilidad estimada: $380/sábado**\n- Al mes (4 sábados): **$1,520 adicionales**\n\n⚠️ Tu margen actual es 0.6%. Con sábados subiría a ~12%.\n\n✅ **Veredicto: SÍ es viable.** Empieza con 2 sábados al mes para probar demanda.',
};

export default function AIPanel() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [realAlerts, setRealAlerts] = useState<any[]>(mockAlerts);

  useEffect(() => {
    // 1. Fetch de Rentabilidad Real del Motor CFO
    const hoy = new Date();
    const hace7dias = new Date();
    hace7dias.setDate(hoy.getDate() - 7);

    const sd = hace7dias.toISOString().split('T')[0];
    const ed = hoy.toISOString().split('T')[0];

    api.get(`/finance/profitability?startDate=${sd}&endDate=${ed}`)
      .then(res => {
        const json = res.data;

        if (json.success && json.data.criticalAlerts > 0) {
           const newAlerts = json.data.details
             .filter((d: any) => d.status === 'CRITICAL')
             .map((d: any) => ({
                severity: 'critical', 
                type: 'low_margin',
                title: `Pérdida en: ${d.treatmentName}`,
                content: `Ingreso: $${d.revenue} vs Costo Real (Insumo + Sillón): $${d.totalCost}. Estás operando con margen de ${d.marginPercentage}.`,
                recommendation: 'El CFO Automático recomienda subir el precio o reducir la duración de la cita urgentemente.',
                module: 'dashboard'
             }));
           setRealAlerts([...newAlerts, ...mockAlerts].slice(0, 5)); // Mostrar mix
        }
      }).catch(err => {
      console.error("Error CFO API:", err);
      toast.error('Error al conectar con el motor de IA');
    });
  }, []);

  const triggerAnalysis = async () => {
    setLoading(true);
    const triggerPromise = fetch(import.meta.env.VITE_N8N_WEBHOOK_URL, { 
      method: 'POST' 
    });


    toast.promise(triggerPromise, {
      loading: 'El CFO Digital está analizando tu base de datos...',
      success: 'Análisis completado. Nuevos insights guardados en tu panel.',
      error: 'Error al iniciar análisis. Verifica la conexión con n8n.'
    });

    try {
      await triggerPromise;
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: Message = { role: 'user', content: text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Simular respuesta (reemplazar con API real)
    await new Promise(r => setTimeout(r, 1200));

    const response = mockResponses[text] ||
      `📊 Analizando tu pregunta: "${text}"\n\nBasado en los datos del último mes:\n- Ingresos: $6,480\n- Gastos: $6,440\n- Margen: 0.6%\n\nTu situación requiere atención inmediata. Te recomiendo revisar los gastos en materiales y llenar los huecos de agenda como prioridad.`;

    const aiMsg: Message = { role: 'assistant', content: response, timestamp: new Date() };
    setMessages(prev => [...prev, aiMsg]);
    setLoading(false);
  };

  return (
    <div className="ai-panel-page">
      <div className="page-header">
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BrainCircuit size={32} color="#6366f1" /> CFO Digital
          </h1>
          <p className="text-muted">Tu consultor financiero con inteligencia artificial</p>
        </div>
        <div className="page-actions">
          <button 
            className="btn btn-primary" 
            onClick={triggerAnalysis} 
            disabled={loading}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> 
            {loading ? 'Analizando...' : 'Ejecutar Análisis Completo'}
          </button>
        </div>
      </div>

      <div className="ai-layout">
        {/* Chat Panel */}
        <div className="card ai-chat-card">
          <div className="card-header">
            <h3><BrainCircuit size={18} /> Consulta al CFO</h3>
            <span className="badge badge-green">Online</span>
          </div>

          {messages.length === 0 ? (
            <div className="ai-empty">
              <div className="ai-empty-icon">
                <MessageSquare size={40} />
              </div>
              <h3>Pregúntame sobre tu clínica</h3>
              <p className="text-muted">Analizo tus datos financieros y te doy recomendaciones accionables.</p>
              <div className="ai-quick-questions">
                {quickQuestions.map((q, i) => (
                  <button key={i} className="ai-quick-btn" onClick={() => sendMessage(q)}>
                    <Lightbulb size={14} /> {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="ai-messages">
              {messages.map((msg, i) => (
                <div key={i} className={`ai-msg ai-msg-${msg.role}`}>
                  {msg.role === 'assistant' && <div className="ai-msg-avatar"><BrainCircuit size={16} /></div>}
                  <div className="ai-msg-content">
                    {msg.content.split('\n').map((line, j) => (
                      <p key={j} dangerouslySetInnerHTML={{
                        __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      }} />
                    ))}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="ai-msg ai-msg-assistant">
                  <div className="ai-msg-avatar"><BrainCircuit size={16} /></div>
                  <div className="ai-msg-content ai-typing">
                    <span /><span /><span />
                  </div>
                </div>
              )}
            </div>
          )}

          <form className="ai-input-wrap" onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}>
            <input className="input ai-input" placeholder="Pregunta sobre tus finanzas..."
              value={input} onChange={e => setInput(e.target.value)} disabled={loading} />
            <button type="submit" className="btn btn-primary ai-send" disabled={!input.trim() || loading}>
              <Send size={16} />
            </button>
          </form>
        </div>

        {/* Alerts Sidebar */}
        <div className="ai-alerts-panel">
          <div className="card">
            <div className="card-header">
              <h3><AlertTriangle size={18} /> Alertas Activas</h3>
            </div>
            <div className="alerts-list">
              {realAlerts.map((alert, i) => (
                <AlertCard key={i} alert={alert} index={i} />
              ))}
            </div>
          </div>

          <div className="card card-glow">
            <h4 style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Lightbulb size={20} color="#f59e0b" /> Resumen del CFO
            </h4>
            <ul className="ai-summary-list">
              <li><span className="text-red">●</span> Margen crítico: necesitas acción inmediata</li>
              <li><span className="text-yellow">●</span> Materiales dentales: buscar proveedor alternativo</li>
              <li><span className="text-green">●</span> Coronas y blanqueamientos: tus mejores activos</li>
              <li><span className="text-yellow">●</span> Agenda: 30% de capacidad desperdiciada</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
