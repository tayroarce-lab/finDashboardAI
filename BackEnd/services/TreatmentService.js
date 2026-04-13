const BaseService = require('./BaseService');
const TreatmentRepository = require('../repositories/TreatmentRepository');
const AppError = require('../utils/AppError');

/**
 * TreatmentService — Lógica de negocio para catálogo de tratamientos.
 */
class TreatmentService extends BaseService {
    constructor() {
        super(new TreatmentRepository());
        this.resourceName = 'Tratamiento';
    }

    /**
     * Obtiene tratamientos activos.
     */
    async getAll(clinicId) {
        return this.repository.findActive(clinicId);
    }

    /**
     * Desactiva un tratamiento (soft delete).
     */
    async delete(id, clinicId) {
        await this.getById(id, clinicId);
        return this.repository.deactivate(id, clinicId);
    }

    /**
     * Validación de datos de tratamiento.
     */
    validate(data, isUpdate = false) {
        if (!isUpdate) {
            if (!data.name) throw AppError.validation('El nombre es requerido');
            if (data.price === undefined) throw AppError.validation('El precio es requerido');
            if (data.estimated_cost === undefined) throw AppError.validation('El costo estimado es requerido');
        }

        if (data.price !== undefined && data.price < 0) {
            throw AppError.validation('El precio debe ser mayor o igual a 0');
        }
        if (data.estimated_cost !== undefined && data.estimated_cost < 0) {
            throw AppError.validation('El costo estimado debe ser mayor o igual a 0');
        }
        if (data.duration_minutes !== undefined && data.duration_minutes < 1) {
            throw AppError.validation('La duración debe ser al menos 1 minuto');
        }
    }
}

module.exports = TreatmentService;
