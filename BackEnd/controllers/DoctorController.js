const BaseController = require('./BaseController');
const DoctorService = require('../services/DoctorService');

/**
 * DoctorController — Endpoints para gestión y métricas de doctores.
 */
class DoctorController extends BaseController {
    constructor() {
        super(new DoctorService());
    }

    /**
     * GET /api/doctors/performance?period=month
     */
    getPerformance() {
        return this.handleAsync(async (req, res) => {
            const clinicId = this.getClinicId(req);
            const period = this.getPeriod(req);
            const report = await this.service.getChairTimeReport(clinicId, period);
            this.sendSuccess(res, report);
        });
    }
}

module.exports = new DoctorController();
