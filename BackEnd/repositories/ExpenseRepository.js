const BaseRepository = require('./BaseRepository');

/**
 * ExpenseRepository — Queries para gastos.
 */
class ExpenseRepository extends BaseRepository {
    constructor() {
        super('expenses');
    }

    /**
     * Gastos del período con join a categoría.
     */
    async findByPeriod(clinicId, startDate, endDate) {
        const sql = `
            SELECT e.*, ec.name AS category_name, ec.icon AS category_icon
            FROM expenses e
            JOIN expense_categories ec ON e.category_id = ec.id
            WHERE e.clinic_id = ? AND e.expense_date BETWEEN ? AND ?
            ORDER BY e.expense_date DESC`;
        return this.query(sql, [clinicId, startDate, endDate]);
    }

    /**
     * Gastos totales de un período.
     */
    async sumExpenses(clinicId, startDate, endDate) {
        const sql = `
            SELECT COALESCE(SUM(amount), 0) AS total 
            FROM expenses
            WHERE clinic_id = ? AND expense_date BETWEEN ? AND ?`;
        const rows = await this.query(sql, [clinicId, startDate, endDate]);
        return parseFloat(rows[0].total);
    }

    /**
     * Gastos agrupados por categoría con comparación vs período anterior.
     */
    async getByCategory(clinicId, startDate, endDate, prevStartDate, prevEndDate) {
        const sql = `
            SELECT 
                ec.id AS category_id,
                ec.name AS category_name,
                ec.icon,
                COALESCE(curr.amount, 0) AS current_amount,
                COALESCE(prev.amount, 0) AS previous_amount,
                CASE 
                    WHEN COALESCE(prev.amount, 0) = 0 THEN 
                        CASE WHEN COALESCE(curr.amount, 0) > 0 THEN 100 ELSE 0 END
                    ELSE ROUND(((COALESCE(curr.amount, 0) - prev.amount) / prev.amount) * 100, 1)
                END AS pct_change
            FROM expense_categories ec
            LEFT JOIN (
                SELECT category_id, SUM(amount) AS amount
                FROM expenses
                WHERE clinic_id = ? AND expense_date BETWEEN ? AND ?
                GROUP BY category_id
            ) curr ON ec.id = curr.category_id
            LEFT JOIN (
                SELECT category_id, SUM(amount) AS amount
                FROM expenses
                WHERE clinic_id = ? AND expense_date BETWEEN ? AND ?
                GROUP BY category_id
            ) prev ON ec.id = prev.category_id
            WHERE ec.clinic_id = ?
            ORDER BY current_amount DESC`;
        return this.query(sql, [
            clinicId, startDate, endDate,
            clinicId, prevStartDate, prevEndDate,
            clinicId
        ]);
    }

    /**
     * Gastos diarios para gráfico de línea.
     */
    async dailyExpenses(clinicId, startDate, endDate) {
        const sql = `
            SELECT expense_date AS date,
                   SUM(amount) AS total
            FROM expenses
            WHERE clinic_id = ? AND expense_date BETWEEN ? AND ?
            GROUP BY expense_date
            ORDER BY expense_date ASC`;
        return this.query(sql, [clinicId, startDate, endDate]);
    }
}

module.exports = ExpenseRepository;
