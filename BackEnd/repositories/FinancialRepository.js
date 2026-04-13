const db = require('../config/db.js');
const { AppointmentModel, TreatmentModel, InsightModel } = require('../models/BusinessModels.js');

class FinancialRepository {
    async getAppointmentsByDateRange(startDate, endDate) {
        // Adaptado al schema real de DentalFlow AI (treatment_records)
        const sql = `
            SELECT 
                r.id, 
                r.treatment_id, 
                r.performed_date as appointment_date, 
                (r.price_charged - r.discount) as revenue, 
                r.actual_cost as doctor_commission,
                t.name as treatment_name, 
                t.price as base_price, 
                t.estimated_cost as provider_cost,
                t.duration_minutes as real_duration_minutes
            FROM treatment_records r
            JOIN treatments t ON r.treatment_id = t.id
            WHERE r.performed_date BETWEEN ? AND ?
        `;
        const rows = await db.query(sql, [startDate, endDate]);
        
        return rows.map(r => ({
            appointment: new AppointmentModel(
                r.id, 
                1, // doctor_id estatico para demo
                r.treatment_id, 
                r.appointment_date, 
                r.real_duration_minutes, 
                r.revenue, 
                r.doctor_commission // usando actual_cost como comision
            ),
            treatment: new TreatmentModel(
                r.treatment_id, 
                r.treatment_name, 
                r.base_price, 
                r.provider_cost, 
                r.real_duration_minutes
            )
        }));
    }

    async getTotalFixedExpenses() {
        // Usamos la tabla real expenses
        const sql = `SELECT SUM(amount) as total FROM expenses`;
        const rows = await db.query(sql, []);
        return rows[0].total || 0;
    }

    async saveAiInsight(insight) {
        // Guardando en la tabla real ai_insights
        const sql = `
            INSERT INTO ai_insights 
            (clinic_id, type, severity, title, content, recommendation) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const result = await db.query(sql, [
            1, // Clinic ID para Demo
            'recommendation', 
            insight.severity === 'CRITICAL' ? 'critical' : 'warning', 
            'Alerta CFO: ' + insight.type,
            insight.summary,
            insight.recommendedAction
        ]);
        return result.insertId;
    }
}

module.exports = new FinancialRepository();
