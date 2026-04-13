/**
 * BaseController — Clase base para todos los controladores.
 * Maneja estandarización de respuestas y extracción de datos del request.
 */
class BaseController {
    /**
     * @param {BaseService} service - Servicio asociado
     */
    constructor(service) {
        this.service = service;
    }

    /**
     * Wrapper para manejar errores async automáticamente.
     * Evita repetir try/catch en cada método.
     * @param {Function} fn - Función async (req, res, next) => {}
     * @returns {Function} Middleware de Express
     */
    handleAsync(fn) {
        return (req, res, next) => {
            Promise.resolve(fn.call(this, req, res, next)).catch(next);
        };
    }

    /**
     * Respuesta exitosa estándar.
     */
    sendSuccess(res, data, statusCode = 200) {
        res.status(statusCode).json({
            success: true,
            data
        });
    }

    /**
     * Respuesta de creación (201).
     */
    sendCreated(res, data) {
        this.sendSuccess(res, data, 201);
    }

    /**
     * Respuesta sin contenido (204).
     */
    sendNoContent(res) {
        res.status(204).send();
    }

    /**
     * Extrae el clinicId del usuario autenticado.
     */
    getClinicId(req) {
        return req.user.clinicId;
    }

    /**
     * Extrae el período del query string (default: 'month').
     */
    getPeriod(req) {
        return req.query.period || 'month';
    }

    // ─── CRUD Genérico ─────────────────────────────────

    /**
     * GET / — Listar todos
     */
    getAll() {
        return this.handleAsync(async (req, res) => {
            const clinicId = this.getClinicId(req);
            const data = await this.service.getAll(clinicId, req.query);
            this.sendSuccess(res, data);
        });
    }

    /**
     * GET /:id — Obtener por ID
     */
    getById() {
        return this.handleAsync(async (req, res) => {
            const clinicId = this.getClinicId(req);
            const data = await this.service.getById(req.params.id, clinicId);
            this.sendSuccess(res, data);
        });
    }

    /**
     * POST / — Crear
     */
    create() {
        return this.handleAsync(async (req, res) => {
            const clinicId = this.getClinicId(req);
            const data = await this.service.create(req.body, clinicId);
            this.sendCreated(res, data);
        });
    }

    /**
     * PUT /:id — Actualizar
     */
    update() {
        return this.handleAsync(async (req, res) => {
            const clinicId = this.getClinicId(req);
            const data = await this.service.update(req.params.id, req.body, clinicId);
            this.sendSuccess(res, data);
        });
    }

    /**
     * DELETE /:id — Eliminar
     */
    remove() {
        return this.handleAsync(async (req, res) => {
            const clinicId = this.getClinicId(req);
            await this.service.delete(req.params.id, clinicId);
            this.sendNoContent(res);
        });
    }
}

module.exports = BaseController;
