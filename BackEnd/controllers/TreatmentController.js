const BaseController = require('./BaseController');
const TreatmentService = require('../services/TreatmentService');
const TreatmentRecordService = require('../services/TreatmentRecordService');

/**
 * TreatmentController — Endpoints de tratamientos y registros.
 */
class TreatmentController extends BaseController {
    constructor() {
        super(new TreatmentService());
        this.recordService = new TreatmentRecordService();
    }

    /**
     * POST /api/treatments/records — Registrar tratamiento realizado (4 clicks).
     */
    createRecord() {
        return this.handleAsync(async (req, res) => {
            const clinicId = this.getClinicId(req);
            const record = await this.recordService.create(req.body, clinicId);
            this.sendCreated(res, record);
        });
    }

    /**
     * GET /api/treatments/records — Historial de tratamientos.
     */
    getRecords() {
        return this.handleAsync(async (req, res) => {
            const clinicId = this.getClinicId(req);
            const period = this.getPeriod(req);
            const records = await this.recordService.getByPeriod(clinicId, period);
            this.sendSuccess(res, records);
        });
    }

    /**
     * GET /api/treatments/profitability — Análisis de rentabilidad.
     */
    getProfitability() {
        return this.handleAsync(async (req, res) => {
            const clinicId = this.getClinicId(req);
            const period = this.getPeriod(req);
            const data = await this.recordService.getProfitability(clinicId, period);
            this.sendSuccess(res, data);
        });
    }
}

module.exports = new TreatmentController();
