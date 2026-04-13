import type { KPI, Alert, TopTreatment, RevenueChartPoint } from '../../types';

// ═══════════════════════════════════════════════
// Mock Data — Funciona sin backend
// Reemplazar con API calls cuando el backend esté listo
// ═══════════════════════════════════════════════

export const mockKPIs: KPI[] = [
  {
    key: 'revenue', label: 'Ingresos', value: 6480, previousValue: 5990,
    change: 8.2, format: 'currency',
    semaphore: { status: 'green', label: 'Creciendo' }
  },
  {
    key: 'expenses', label: 'Gastos', value: 6440, previousValue: 6250,
    change: 3.1, format: 'currency',
    semaphore: { status: 'red', label: 'Creciendo' }
  },
  {
    key: 'profit', label: 'Utilidad', value: 40, previousValue: -260,
    change: 115.4, format: 'currency',
    semaphore: { status: 'red', label: 'Crítico' }
  },
  {
    key: 'margin', label: 'Margen', value: 0.6, previousValue: -4.3,
    change: 4.9, format: 'percent',
    semaphore: { status: 'red', label: 'Crítico' }
  },
  {
    key: 'avgTicket', label: 'Ticket Promedio', value: 175.14, previousValue: 166.39,
    change: 5.3, format: 'currency',
    semaphore: { status: 'green', label: 'Creciendo' }
  },
  {
    key: 'totalTreatments', label: 'Tratamientos', value: 37, previousValue: 36,
    change: 2.8, format: 'number',
    semaphore: { status: 'yellow', label: 'Estable' }
  },
];

export const mockAlerts: Alert[] = [
  {
    severity: 'critical', type: 'low_margin',
    title: 'Margen en zona de riesgo: 0.6%',
    content: 'Solo te quedan $0.01 por cada dólar que entra. El benchmark saludable es 35-50%. Estás operando peligrosamente cerca del punto de quiebre.',
    recommendation: 'Prioridad 1: Eliminar tratamientos con margen negativo. Prioridad 2: Reducir gasto más alto (Materiales +23%). Prioridad 3: Llenar huecos de agenda con coronas.',
    module: 'dashboard'
  },
  {
    severity: 'warning', type: 'expense_spike',
    title: 'Gasto en Materiales dentales subió 23%',
    content: 'Gastaste $1,350.00 en Materiales dentales este mes vs $1,098.00 el mes anterior. Eso son $252 adicionales.',
    recommendation: 'Revisa las últimas facturas de Materiales. Si es aumento del proveedor, cotiza Dental Express como alternativa.',
    module: 'expenses', entityId: 2
  },
  {
    severity: 'warning', type: 'low_occupancy',
    title: 'Ocupación baja: 70%',
    content: 'Tienes 12 huecos esta semana. Eso son $2,100 en ingresos perdidos (ticket promedio $175).',
    recommendation: 'Martes y viernes son los más vacíos. Ofrece 10% descuento para citas en esos días.',
    module: 'appointments'
  },
];

export const mockTopTreatments: TopTreatment[] = [
  { id: 7, name: 'Corona dental', category: 'restorative', timesPerformed: 5, avgMargin: 56.2, totalContribution: 1010, semaphore: { status: 'green', label: 'Rentable' } },
  { id: 8, name: 'Implante dental', category: 'surgical', timesPerformed: 2, avgMargin: 51.3, totalContribution: 790, semaphore: { status: 'green', label: 'Rentable' } },
  { id: 9, name: 'Blanqueamiento', category: 'cosmetic', timesPerformed: 2, avgMargin: 70.0, totalContribution: 270, semaphore: { status: 'green', label: 'Rentable' } },
  { id: 3, name: 'Resina compuesta', category: 'restorative', timesPerformed: 7, avgMargin: 57.1, totalContribution: 330, semaphore: { status: 'green', label: 'Rentable' } },
  { id: 6, name: 'Endodoncia', category: 'endodontic', timesPerformed: 3, avgMargin: 52.1, totalContribution: 412, semaphore: { status: 'green', label: 'Rentable' } },
  { id: 10, name: 'Ortodoncia', category: 'orthodontic', timesPerformed: 3, avgMargin: 70.8, totalContribution: 255, semaphore: { status: 'green', label: 'Rentable' } },
  { id: 5, name: 'Extracción muela', category: 'surgical', timesPerformed: 2, avgMargin: 57.2, totalContribution: 207, semaphore: { status: 'green', label: 'Rentable' } },
  { id: 4, name: 'Extracción simple', category: 'surgical', timesPerformed: 2, avgMargin: 55.4, totalContribution: 72, semaphore: { status: 'green', label: 'Rentable' } },
  { id: 1, name: 'Limpieza dental', category: 'preventive', timesPerformed: 8, avgMargin: 60.0, totalContribution: 216, semaphore: { status: 'green', label: 'Rentable' } },
];

export const mockRevenueChart: RevenueChartPoint[] = (() => {
  const data: RevenueChartPoint[] = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    data.push({
      date: date.toISOString().split('T')[0],
      revenue: isWeekend ? 0 : Math.round(150 + Math.random() * 400),
      expenses: isWeekend ? 0 : Math.round(100 + Math.random() * 300),
      treatments: isWeekend ? 0 : Math.floor(1 + Math.random() * 4),
    });
  }
  return data;
})();
