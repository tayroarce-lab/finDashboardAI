const BaseService = require('./BaseService');
const PatientRepository = require('../repositories/PatientRepository');
const AppError = require('../utils/AppError');

/**
 * PatientService — Lógica de negocio para pacientes.
 */
class PatientService extends BaseService {
    constructor() {
        super(new PatientRepository());
        this.resourceName = 'Paciente';
    }

    /**
     * Busca pacientes por nombre (autocomplete).
     */
    async search(clinicId, searchTerm) {
        if (!searchTerm || searchTerm.length < 2) {
            throw AppError.validation('El término de búsqueda debe tener al menos 2 caracteres');
        }
        return this.repository.search(clinicId, searchTerm);
    }

    validate(data, isUpdate = false) {
        if (!isUpdate && !data.name) {
            throw AppError.validation('El nombre del paciente es requerido');
        }
    }
}

module.exports = PatientService;
