const BaseRepository = require('./BaseRepository');

/**
 * TreatmentRepository — Queries para el catálogo de tratamientos.
 */
class TreatmentRepository extends BaseRepository {
    constructor() {
        super('treatments');
    }

    /**
     * Obtiene tratamientos activos de una clínica.
     */
    async findActive(clinicId) {
        const sql = `SELECT * FROM treatments 
                     WHERE clinic_id = ? AND is_active = TRUE 
                     ORDER BY name ASC`;
        return this.query(sql, [clinicId]);
    }

    /**
     * Desactiva un tratamiento (soft delete).
     */
    async deactivate(id, clinicId) {
        return this.update(id, { is_active: false }, clinicId);
    }
}

module.exports = TreatmentRepository;
