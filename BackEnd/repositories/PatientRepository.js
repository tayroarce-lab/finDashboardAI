const BaseRepository = require('./BaseRepository');

/**
 * PatientRepository — Queries para pacientes.
 */
class PatientRepository extends BaseRepository {
    constructor() {
        super('patients');
    }

    /**
     * Busca pacientes por nombre (para autocomplete).
     */
    async search(clinicId, searchTerm) {
        const sql = `
            SELECT id, name, phone, email
            FROM patients 
            WHERE clinic_id = ? AND name LIKE ?
            ORDER BY name ASC
            LIMIT 10`;
        return this.query(sql, [clinicId, `%${searchTerm}%`]);
    }
}

module.exports = PatientRepository;
