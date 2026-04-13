// ═══════════════════════════════════════════════
// DentalFlow AI — TypeScript Types
// ═══════════════════════════════════════════════

// ─── Auth ───────────────────────────────────────
export interface User {
  id: number;
  clinicId: number;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'staff';
  clinicName?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// ─── KPI ────────────────────────────────────────
export interface Semaphore {
  status: 'green' | 'yellow' | 'red';
  label: string;
}

export interface KPI {
  key: string;
  label: string;
  value: number;
  previousValue: number;
  change: number;
  format: 'currency' | 'percent' | 'number';
  semaphore: Semaphore;
}

export interface KPIResponse {
  period: string;
  dateRange: { startDate: string; endDate: string };
  kpis: KPI[];
}

// ─── Treatments ─────────────────────────────────
export interface Treatment {
  id: number;
  clinic_id: number;
  name: string;
  description?: string;
  price: number;
  estimated_cost: number;
  duration_minutes: number;
  category: string;
  is_active: boolean;
}

export interface TreatmentProfitability {
  id: number;
  name: string;
  catalog_price: number;
  estimated_cost: number;
  category: string;
  times_performed: number;
  avg_revenue: number;
  avg_cost: number;
  avg_profit: number;
  avg_margin_pct: number;
  total_profit_contribution: number;
  quadrant: {
    type: 'star' | 'cow' | 'gem' | 'trap';
    label: string;
    action: string;
  };
}

export interface TreatmentRecord {
  id: number;
  treatment_id: number;
  patient_id: number;
  treatment_name: string;
  patient_name: string;
  price_charged: number;
  discount: number;
  actual_cost: number;
  payment_method: string;
  performed_date: string;
}

// ─── Expenses ───────────────────────────────────
export interface ExpenseCategory {
  id: number;
  name: string;
  icon: string;
  is_default: boolean;
}

export interface ExpenseByCat {
  category_id: number;
  category_name: string;
  icon: string;
  current_amount: number;
  previous_amount: number;
  pct_change: number;
  pct_of_total: number;
  has_alert: boolean;
}

export interface Expense {
  id: number;
  category_id: number;
  category_name: string;
  category_icon: string;
  amount: number;
  vendor: string;
  expense_date: string;
  is_recurring: boolean;
}

// ─── Chart Data ─────────────────────────────────
export interface RevenueChartPoint {
  date: string;
  revenue: number;
  expenses: number;
  treatments: number;
}

export interface TopTreatment {
  id: number;
  name: string;
  category: string;
  timesPerformed: number;
  avgMargin: number;
  totalContribution: number;
  semaphore: Semaphore;
}

export interface Alert {
  severity: 'critical' | 'warning' | 'info' | 'positive';
  type: string;
  title: string;
  content: string;
  recommendation: string;
  module?: string;
  entityId?: number;
}

// ─── Doctors & Agenda ───────────────────────────
export interface DoctorPerformance {
  id: number;
  name: string;
  specialty: string;
  color: string;
  stats: {
    appointments: number;
    completed: number;
    revenue: number;
    minutes: number;
    revenuePerHour: number;
    efficiency: number;
  };
}

export interface AppointmentSlot {
  id: number;
  time: string;
  patient: string;
  treatment: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  price: number;
  doctor_id?: number;
  doctor_name?: string;
}

// ─── API Response ───────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: {
    code: string;
    message: string;
  };
}
