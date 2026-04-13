const BaseRepository = require('./BaseRepository');

/**
 * TreatmentRecordRepository — Queries para tratamientos realizados (ingresos).
 */
class TreatmentRecordRepository extends BaseRepository {
    constructor() {
        super('treatment_records');
    }

    /**
     * Obtiene registros del período con join a tratamiento y paciente.
     */
    async findByPeriod(clinicId, startDate, endDate) {
        const sql = `
            SELECT tr.*, t.name as treatment_name, t.category,
                   p.name as patient_name
            FROM treatment_records tr
            JOIN treatments t ON tr.treatment_id = t.id
            JOIN patients p ON tr.patient_id = p.id
            WHERE tr.clinic_id = ? 
              AND tr.performed_date BETWEEN ? AND ?
            ORDER BY tr.performed_date DESC`;
        return this.query(sql, [clinicId, startDate, endDate]);
    }

    /**
     * Ingresos totales de un período.
     */
    async sumRevenue(clinicId, startDate, endDate) {
        const sql = `
            SELECT COALESCE(SUM(price_charged - discount), 0) AS total
            FROM treatment_records
            WHERE clinic_id = ? AND performed_date BETWEEN ? AND ?`;
        const rows = await this.query(sql, [clinicId, startDate, endDate]);
        return parseFloat(rows[0].total);
    }

    /**
     * Costos totales directos de un período.
     */
    async sumDirectCosts(clinicId, startDate, endDate) {
        const sql = `
            SELECT COALESCE(SUM(actual_cost), 0) AS total
            FROM treatment_records
            WHERE clinic_id = ? AND performed_date BETWEEN ? AND ?`;
        const rows = await this.query(sql, [clinicId, startDate, endDate]);
        return parseFloat(rows[0].total);
    }

    /**
     * Rentabilidad por tratamiento en un período.
     */
    async getProfitabilityByTreatment(clinicId, startDate, endDate) {
        const sql = `
            SELECT 
                t.id,
                t.name,
                t.price AS catalog_price,
                t.estimated_cost,
                t.category,
                COUNT(tr.id) AS times_performed,
                ROUND(AVG(tr.price_charged - tr.discount), 2) AS avg_revenue,
                ROUND(AVG(tr.actual_cost), 2) AS avg_cost,
                ROUND(AVG(tr.price_charged - tr.discount - tr.actual_cost), 2) AS avg_profit,
                ROUND(
                    AVG((tr.price_charged - tr.discount - tr.actual_cost) / 
                        NULLIF(tr.price_charged - tr.discount, 0)) * 100
                , 1) AS avg_margin_pct,
                ROUND(SUM(tr.price_charged - tr.discount - tr.actual_cost), 2) AS total_profit_contribution
            FROM treatments t
            LEFT JOIN treatment_records tr ON t.id = tr.treatment_id
                AND tr.performed_date BETWEEN ? AND ?
            WHERE t.clinic_id = ? AND t.is_active = TRUE
            GROUP BY t.id, t.name, t.price, t.estimated_cost, t.category
            ORDER BY total_profit_contribution DESC`;
        return this.query(sql, [startDate, endDate, clinicId]);
    }

    /**
     * Conteo de tratamientos por método de pago.
     */
    async countByPaymentMethod(clinicId, startDate, endDate) {
        const sql = `
            SELECT payment_method, COUNT(*) AS count,
                   SUM(price_charged - discount) AS total
            FROM treatment_records
            WHERE clinic_id = ? AND performed_date BETWEEN ? AND ?
            GROUP BY payment_method
            ORDER BY total DESC`;
        return this.query(sql, [clinicId, startDate, endDate]);
    }

    /**
     * Ticket promedio de un período.
     */
    async avgTicket(clinicId, startDate, endDate) {
        const sql = `
            SELECT ROUND(AVG(price_charged - discount), 2) AS avg_ticket,
                   COUNT(*) AS total_records
            FROM treatment_records
            WHERE clinic_id = ? AND performed_date BETWEEN ? AND ?`;
        const rows = await this.query(sql, [clinicId, startDate, endDate]);
        return {
            avgTicket: parseFloat(rows[0].avg_ticket) || 0,
            totalRecords: rows[0].total_records
        };
    }

    /**
     * Ingresos diarios para gráfico de línea.
     */
    async dailyRevenue(clinicId, startDate, endDate) {
        const sql = `
            SELECT performed_date AS date,
                   SUM(price_charged - discount) AS revenue,
                   COUNT(*) AS treatments_count
            FROM treatment_records
            WHERE clinic_id = ? AND performed_date BETWEEN ? AND ?
            GROUP BY performed_date
            ORDER BY performed_date ASC`;
        return this.query(sql, [clinicId, startDate, endDate]);
    }
}

module.exports = TreatmentRecordRepository;
