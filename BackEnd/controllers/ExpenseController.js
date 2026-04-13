const BaseController = require('./BaseController');
const ExpenseService = require('../services/ExpenseService');

/**
 * ExpenseController — Endpoints de gastos.
 */
class ExpenseController extends BaseController {
    constructor() {
        super(new ExpenseService());
    }

    /**
     * GET /api/expenses/categories — Categorías de gastos.
     */
    getCategories() {
        return this.handleAsync(async (req, res) => {
            const clinicId = this.getClinicId(req);
            const categories = await this.service.getCategories(clinicId);
            this.sendSuccess(res, categories);
        });
    }

    /**
     * GET /api/expenses/by-category?period=month — Gastos por categoría.
     */
    getByCategory() {
        return this.handleAsync(async (req, res) => {
            const clinicId = this.getClinicId(req);
            const period = this.getPeriod(req);
            const data = await this.service.getByCategory(clinicId, period);
            this.sendSuccess(res, data);
        });
    }
}

module.exports = new ExpenseController();
