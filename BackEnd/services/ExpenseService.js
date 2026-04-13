const BaseService = require('./BaseService');
const ExpenseRepository = require('../repositories/ExpenseRepository');
const ExpenseCategoryRepository = require('../repositories/ExpenseCategoryRepository');
const AppError = require('../utils/AppError');
const { getDateRange } = require('../utils/dateHelpers');

/**
 * ExpenseService — Lógica de negocio para gastos.
 */
class ExpenseService extends BaseService {
    constructor() {
        super(new ExpenseRepository());
        this.categoryRepo = new ExpenseCategoryRepository();
        this.resourceName = 'Gasto';
    }

    /**
     * Gastos del período con info de categoría.
     */
    async getByPeriod(clinicId, period = 'month') {
        const { startDate, endDate } = getDateRange(period);
        return this.repository.findByPeriod(clinicId, startDate, endDate);
    }

    /**
     * Gastos agrupados por categoría con comparación.
     */
    async getByCategory(clinicId, period = 'month') {
        const { startDate, endDate, prevStartDate, prevEndDate } = getDateRange(period);
        const data = await this.repository.getByCategory(
            clinicId, startDate, endDate, prevStartDate, prevEndDate
        );

        // Calcular total y % de cada categoría
        const totalExpenses = data.reduce((sum, cat) => sum + parseFloat(cat.current_amount), 0);

        return data.map(cat => ({
            ...cat,
            current_amount: parseFloat(cat.current_amount),
            previous_amount: parseFloat(cat.previous_amount),
            pct_change: parseFloat(cat.pct_change),
            pct_of_total: totalExpenses > 0
                ? parseFloat(((cat.current_amount / totalExpenses) * 100).toFixed(1))
                : 0,
            has_alert: parseFloat(cat.pct_change) > 20 && parseFloat(cat.current_amount) > 100
        }));
    }

    /**
     * Obtiene categorías de gastos.
     */
    async getCategories(clinicId) {
        return this.categoryRepo.findAll(clinicId);
    }

    validate(data, isUpdate = false) {
        if (!isUpdate) {
            if (!data.category_id) throw AppError.validation('La categoría es requerida');
            if (data.amount === undefined) throw AppError.validation('El monto es requerido');
            if (!data.expense_date) throw AppError.validation('La fecha es requerida');
        }

        if (data.amount !== undefined && data.amount <= 0) {
            throw AppError.validation('El monto debe ser mayor a 0');
        }
    }
}

module.exports = ExpenseService;
