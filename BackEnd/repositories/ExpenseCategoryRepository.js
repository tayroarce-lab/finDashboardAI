const BaseRepository = require('./BaseRepository');

/**
 * ExpenseCategoryRepository — Queries para categorías de gastos.
 */
class ExpenseCategoryRepository extends BaseRepository {
    constructor() {
        super('expense_categories');
    }

    /**
     * Obtiene todas las categorías de una clínica ordenadas por nombre.
     */
    async findAll(clinicId) {
        const sql = `SELECT * FROM expense_categories 
                     WHERE clinic_id = ? 
                     ORDER BY is_default DESC, name ASC`;
        return this.query(sql, [clinicId]);
    }
}

module.exports = ExpenseCategoryRepository;
