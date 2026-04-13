const AppError = require('../utils/AppError');

/**
 * BaseService — Clase base para todos los servicios.
 * Contiene lógica de negocio compartida y delegación al repositorio.
 */
class BaseService {
    /**
     * @param {BaseRepository} repository - Repositorio asociado
     */
    constructor(repository) {
        this.repository = repository;
    }

    /**
     * Obtiene todos los registros de una clínica.
     */
    async getAll(clinicId, options = {}) {
        return this.repository.findAll(clinicId, options);
    }

    /**
     * Obtiene un registro por ID, lanza error si no existe.
     */
    async getById(id, clinicId) {
        const record = await this.repository.findById(id, clinicId);
        if (!record) {
            throw AppError.notFound(this.resourceName || 'Recurso');
        }
        return record;
    }

    /**
     * Crea un nuevo registro con validación.
     */
    async create(data, clinicId) {
        this.validate(data);
        return this.repository.create({ ...data, clinic_id: clinicId });
    }

    /**
     * Actualiza un registro existente.
     */
    async update(id, data, clinicId) {
        // Verificar que existe
        await this.getById(id, clinicId);
        this.validate(data, true);
        const updated = await this.repository.update(id, data, clinicId);
        if (!updated) {
            throw AppError.notFound(this.resourceName || 'Recurso');
        }
        return this.getById(id, clinicId);
    }

    /**
     * Elimina un registro.
     */
    async delete(id, clinicId) {
        await this.getById(id, clinicId);
        return this.repository.delete(id, clinicId);
    }

    /**
     * Validación de datos — Override en subclases.
     * @param {Object} data - Datos a validar
     * @param {boolean} isUpdate - true si es actualización (campos opcionales)
     */
    validate(data, isUpdate = false) {
        // Override en subclases
    }
}

module.exports = BaseService;
