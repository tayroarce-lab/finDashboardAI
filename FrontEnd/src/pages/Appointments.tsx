import { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, User, Plus, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import './Appointments.css';

interface AppointmentSlot {
  id: number;
  time: string;
  patient: string;
  treatment: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  price: number;
}

const statusConfig = {
  scheduled: { label: 'Agendada', color: 'blue', icon: Clock },
  confirmed: { label: 'Confirmada', color: 'green', icon: CheckCircle },
  completed: { label: 'Completada', color: 'green', icon: CheckCircle },
  cancelled: { label: 'Cancelada', color: 'red', icon: XCircle },
  no_show: { label: 'No asistió', color: 'yellow', icon: AlertCircle },
};

// Mock schedule
const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
const hours = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];

const mockSchedule: Record<string, AppointmentSlot[]> = {
  Lunes: [
    { id: 1, time: '09:00', patient: 'María García', treatment: 'Limpieza dental', status: 'confirmed', price: 45 },
    { id: 2, time: '10:00', patient: 'Juan Rodríguez', treatment: 'Resina compuesta', status: 'confirmed', price: 95 },
    { id: 3, time: '14:00', patient: 'Ana López', treatment: 'Corona dental', status: 'scheduled', price: 380 },
  ],
  Martes: [
    { id: 4, time: '08:00', patient: 'Carlos Hernández', treatment: 'Endodoncia', status: 'completed', price: 280 },
  ],
  Miércoles: [
    { id: 5, time: '09:00', patient: 'Laura Martínez', treatment: 'Limpieza dental', status: 'confirmed', price: 45 },
    { id: 6, time: '11:00', patient: 'Pedro Sánchez', treatment: 'Blanqueamiento', status: 'confirmed', price: 200 },
    { id: 7, time: '15:00', patient: 'Sofía Ramírez', treatment: 'Extracción muela', status: 'scheduled', price: 180 },
  ],
  Jueves: [
    { id: 8, time: '08:00', patient: 'Diego Torres', treatment: 'Ortodoncia', status: 'confirmed', price: 120 },
    { id: 9, time: '10:00', patient: 'María García', treatment: 'Resina compuesta', status: 'scheduled', price: 95 },
  ],
  Viernes: [
    { id: 10, time: '09:00', patient: 'Juan Rodríguez', treatment: 'Limpieza dental', status: 'scheduled', price: 45 },
  ],
};

const totalSlots = days.length * hours.length;
const bookedSlots = Object.values(mockSchedule).flat().length;
const occupancyRate = ((bookedSlots / totalSlots) * 100).toFixed(0);

export default function Appointments() {
  const [weekOffset, setWeekOffset] = useState(0);

  const getWeekDates = () => {
    const now = new Date();
    const dayOfWeek = now.getDay() || 7;
    const monday = new Date(now);
    monday.setDate(now.getDate() - dayOfWeek + 1 + weekOffset * 7);
    return days.map((day, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return { day, date: d.getDate(), month: d.toLocaleDateString('es', { month: 'short' }) };
    });
  };

  const weekDates = getWeekDates();

  return (
    <div className="appointments-page">
      <div className="page-header">
        <div>
          <h1>📅 Agenda & Ocupación</h1>
          <p className="text-muted">Vista semanal de citas y análisis de ocupación</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary"><Plus size={16} /> Nueva cita</button>
        </div>
      </div>

      {/* Occupancy KPIs */}
      <div className="grid-kpis">
        <div className="card">
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>OCUPACIÓN</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.5rem' }}>{occupancyRate}%</div>
          <div className="badge badge-yellow" style={{ marginTop: '0.5rem' }}>Mejorable</div>
        </div>
        <div className="card">
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>CITAS ESTA SEMANA</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.5rem' }}>{bookedSlots}</div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.375rem' }}>de {totalSlots} slots disponibles</div>
        </div>
        <div className="card">
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>INGRESOS PROYECTADOS</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.5rem' }}>${Object.values(mockSchedule).flat().reduce((s, a) => s + a.price, 0).toLocaleString()}</div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.375rem' }}>basado en citas agendadas</div>
        </div>
        <div className="card" style={{ borderColor: 'var(--color-yellow-border)' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-yellow)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>OPORTUNIDAD PERDIDA</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.5rem', color: 'var(--color-yellow)' }}>
            ${((totalSlots - bookedSlots) * 175).toLocaleString()}
          </div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.375rem' }}>{totalSlots - bookedSlots} huecos × $175 ticket prom.</div>
        </div>
      </div>

      {/* Week Navigator */}
      <div className="week-nav">
        <button className="btn btn-ghost" onClick={() => setWeekOffset(w => w - 1)}>
          <ChevronLeft size={18} />
        </button>
        <span className="week-label">
          {weekOffset === 0 ? 'Esta semana' : weekOffset === -1 ? 'Semana anterior' : weekOffset === 1 ? 'Próxima semana' : `Semana ${weekOffset > 0 ? '+' : ''}${weekOffset}`}
        </span>
        <button className="btn btn-ghost" onClick={() => setWeekOffset(w => w + 1)}>
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Schedule Grid */}
      <div className="card schedule-card">
        <div className="schedule-grid">
          {/* Header */}
          <div className="schedule-header-cell schedule-time-col" />
          {weekDates.map(wd => (
            <div key={wd.day} className="schedule-header-cell">
              <span className="schedule-day-name">{wd.day}</span>
              <span className="schedule-day-date">{wd.date} {wd.month}</span>
            </div>
          ))}

          {/* Time slots */}
          {hours.map(hour => (
            <>
              <div key={`t-${hour}`} className="schedule-time-cell">{hour}</div>
              {days.map(day => {
                const appointment = mockSchedule[day]?.find(a => a.time === hour);
                return (
                  <div key={`${day}-${hour}`} className={`schedule-cell ${appointment ? 'schedule-cell-booked' : ''}`}>
                    {appointment && (
                      <div className={`schedule-appointment schedule-status-${appointment.status}`}>
                        <div className="schedule-apt-patient">
                          <User size={12} /> {appointment.patient}
                        </div>
                        <div className="schedule-apt-treatment">{appointment.treatment}</div>
                        <div className="schedule-apt-meta">
                          <span className={`badge badge-${statusConfig[appointment.status].color}`}>
                            {statusConfig[appointment.status].label}
                          </span>
                          <span>${appointment.price}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          ))}
        </div>
      </div>
    </div>
  );
}
