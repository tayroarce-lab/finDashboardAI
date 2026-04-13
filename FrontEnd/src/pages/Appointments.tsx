import { useState, useEffect } from 'react';
import { 
  ChevronLeft, ChevronRight, Clock, User, Plus, 
  CheckCircle, XCircle, AlertCircle, TrendingUp 
} from 'lucide-react';
import Skeleton from '../components/ui/Skeleton';
import { toast } from 'sonner';
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

const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
const hours = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];

export default function Appointments() {
  const [weekOffset, setWeekOffset] = useState(0);
  const [schedule, setSchedule] = useState<Record<string, AppointmentSlot[]>>({});
  const [occupancy, setOccupancy] = useState<any>({
    totalCapacity: 0, booked: 0, completed: 0, cancelled: 0, noShows: 0, emptySlots: 0, occupancyRate: 0, cancellationRate: 0
  });
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const token = localStorage.getItem('df_token');
    if (!token) return;

    setLoading(true);
    const headers = { 'Authorization': `Bearer ${token}` };

    Promise.all([
      fetch(`http://localhost:3000/api/appointments?weekOffset=${weekOffset}`, { headers }).then(res => res.json()),
      fetch(`http://localhost:3000/api/appointments/occupancy?period=week`, { headers }).then(res => res.json())
    ]).then(([schedRes, occRes]) => {
      if (occRes.success) setOccupancy(occRes.data);
      if (schedRes.success) {
        const grouped: Record<string, AppointmentSlot[]> = { Lunes: [], Martes: [], Miércoles: [], Jueves: [], Viernes: [] };
        schedRes.data.forEach((apt: any) => {
          const date = new Date(apt.start_time);
          const dayName = date.toLocaleDateString('es', { weekday: 'long' });
          const dayCap = dayName.charAt(0).toUpperCase() + dayName.slice(1);
          const timeStr = date.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' });
          const slot: AppointmentSlot = {
            id: apt.id,
            time: timeStr.includes(':00') ? timeStr : timeStr.split(':')[0] + ':00',
            patient: apt.patient_name || 'Paciente',
            treatment: apt.treatment_name || 'Consulta',
            status: apt.status || 'scheduled',
            price: parseFloat(apt.treatment_price || 0)
          };
          if (grouped[dayCap]) grouped[dayCap].push(slot);
          else if (dayCap === 'Miercoles') grouped['Miércoles'].push(slot);
        });
        setSchedule(grouped);
      }
    }).catch(err => {
      console.error("Error fetching appointments:", err);
      toast.error('Error al cargar la agenda');
    }).finally(() => setLoading(false));
  }, [weekOffset]);

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

      <div className="grid-kpis">
        {loading ? Array(4).fill(0).map((_, i) => <Skeleton key={i} height="100px" />) : (
          <>
            <div className="card">
              <span className="kpi-label" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>OCUPACIÓN</span>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.5rem' }}>{occupancy.occupancyRate}%</div>
              <div className={`badge badge-${occupancy.occupancyRate > 75 ? 'green' : 'yellow'}`} style={{ marginTop: '0.5rem' }}>
                {occupancy.occupancyRate > 75 ? 'Óptima' : 'Mejorable'}
              </div>
            </div>
            <div className="card">
              <span className="kpi-label" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>CITAS ESTA SEMANA</span>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.5rem' }}>{occupancy.booked}</div>
              <p className="text-muted" style={{ fontSize: '0.8125rem', marginTop: '0.375rem' }}>de {occupancy.totalCapacity} slots disponibles</p>
            </div>
            <div className="card">
              <span className="kpi-label" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>INGRESO PROYECTADO</span>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.5rem' }}>
                ${Object.values(schedule).flat().reduce((s, a) => s + (a.price || 0), 0).toLocaleString()}
              </div>
              <p className="text-muted" style={{ fontSize: '0.8125rem', marginTop: '0.375rem' }}>basado en citas agendadas</p>
            </div>
            <div className="card" style={{ borderColor: 'var(--color-yellow-border)' }}>
              <span className="kpi-label" style={{ fontSize: '0.75rem', color: 'var(--color-yellow)' }}>OPORTUNIDAD PERDIDA</span>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.5rem', color: 'var(--color-yellow)' }}>
                ${(occupancy.emptySlots * 175).toLocaleString()}
              </div>
              <p className="text-muted" style={{ fontSize: '0.8125rem', marginTop: '0.375rem' }}>{occupancy.emptySlots} huecos vacíos</p>
            </div>
          </>
        )}
      </div>

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

      <div className="card schedule-card">
        {loading ? <Skeleton height="400px" /> : (
          <div className="schedule-grid">
            <div className="schedule-header-cell schedule-time-col" />
            {weekDates.map(wd => (
              <div key={wd.day} className="schedule-header-cell">
                <span className="schedule-day-name">{wd.day}</span>
                <span className="schedule-day-date">{wd.date} {wd.month}</span>
              </div>
            ))}
            {hours.map(hour => (
              <>
                <div key={`t-${hour}`} className="schedule-time-cell">{hour}</div>
                {days.map(day => {
                  const appointment = schedule[day]?.find(a => a.time === hour);
                  return (
                    <div key={`${day}-${hour}`} className={`schedule-cell ${appointment ? 'schedule-cell-booked' : ''}`}>
                      {appointment && (
                        <div className={`schedule-appointment schedule-status-${appointment.status}`}>
                          <div className="schedule-apt-patient"><User size={12} /> {appointment.patient}</div>
                          <div className="schedule-apt-treatment">{appointment.treatment}</div>
                          <div className="schedule-apt-meta">
                            <span className={`badge badge-${statusConfig[appointment.status]?.color || 'blue'}`}>
                              {statusConfig[appointment.status]?.label || appointment.status}
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
        )}
      </div>
    </div>
  );
}
