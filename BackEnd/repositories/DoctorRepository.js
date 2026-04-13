const BaseRepository = require('./BaseRepository');

/**
 * DoctorRepository — Gestión de doctores y análisis de rendimiento (ChairTime).
 */
class DoctorRepository extends BaseRepository {
    constructor() {
        super('doctors');
    }

    /**
     * Obtiene el rendimiento de los doctores en un periodo.
     * Calcula: Pacientes atendidos, Ingresos generados y tiempo en sillón.
     */
    async getPerformanceMetrics(clinicId, startDate, endDate) {
        const sql = `
            SELECT 
                d.id,
                d.name,
                d.specialty,
                d.color,
                COUNT(a.id) as total_appointments,
                SUM(CASE WHEN a.status = 'completed' THEN 1 ELSE 0 END) as completed_appointments,
                SUM(t.price) as generated_revenue,
                SUM(t.duration_minutes) as scheduled_minutes,
                -- Estimación de tiempo productivo (asumiendo que las completadas duraron lo estimado)
                SUM(CASE WHEN a.status = 'completed' THEN t.duration_minutes ELSE 0 END) as productive_minutes
            FROM doctors d
            LEFT JOIN appointments a ON d.id = a.doctor_id AND DATE(a.start_time) BETWEEN ? AND ?
            LEFT JOIN treatments t ON a.treatment_id = t.id
            WHERE d.clinic_id = ? AND d.is_active = TRUE
            GROUP BY d.id
            ORDER BY generated_revenue DESC`;
        return this.query(sql, [startDate, endDate, clinicId]);
    }
}

module.exports = DoctorRepository;
