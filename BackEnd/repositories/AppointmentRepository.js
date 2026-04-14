const BaseRepository = require('./BaseRepository');

/**
 * AppointmentRepository — Queries para citas y ocupación.
 */
class AppointmentRepository extends BaseRepository {
    constructor() {
        super('appointments');
    }

    /**
     * Citas de un rango de fechas con join a paciente y tratamiento.
     */
    async findByDateRange(clinicId, startDate, endDate) {
        const sql = `
            SELECT a.*, p.name AS patient_name, t.name AS treatment_name,
                   t.price AS treatment_price
            FROM appointments a
            LEFT JOIN patients p ON a.patient_id = p.id
            LEFT JOIN treatments t ON a.treatment_id = t.id
            WHERE a.clinic_id = ? 
              AND DATE(a.start_time) BETWEEN ? AND ?
            ORDER BY a.start_time ASC`;
        return this.query(sql, [clinicId, startDate, endDate]);
    }

    /**
     * Datos de ocupación para un período.
     */
    async getOccupancyData(clinicId, startDate, endDate) {
        const sql = `
            SELECT 
                COUNT(*) AS total_appointments,
                SUM(CASE WHEN status IN ('completed', 'confirmed', 'scheduled') THEN 1 ELSE 0 END) AS booked,
                SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completed,
                SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) AS cancelled,
                SUM(CASE WHEN status = 'no_show' THEN 1 ELSE 0 END) AS no_shows
            FROM appointments
            WHERE clinic_id = ? AND DATE(start_time) BETWEEN ? AND ?`;
        const rows = await this.query(sql, [clinicId, startDate, endDate]);
        return rows[0];
    }

    /**
     * Actualiza el status de una cita.
     */
    async updateStatus(id, clinicId, status, reason = null) {
        const data = { status };
        if (reason) data.cancellation_reason = reason;
        return this.update(id, data, clinicId);
    }

    /**
     * Obtiene datos básicos para recordatorios de un día específico.
     */
    async getRemindersForDate(dateStr) {
        const sql = `
            SELECT a.id, a.start_time, p.name as patient_name, p.phone, t.name as treatment_name
            FROM appointments a
            JOIN patients p ON a.patient_id = p.id
            JOIN treatments t ON a.treatment_id = t.id
            WHERE DATE(a.start_time) = ? AND a.status = 'scheduled'`;
        return this.query(sql, [dateStr]);
    }
}


module.exports = AppointmentRepository;
