const BaseController = require('./BaseController');
const PatientService = require('../services/PatientService');

/**
 * PatientController — Endpoints de pacientes.
 */
class PatientController extends BaseController {
    constructor() {
        super(new PatientService());
    }

    /**
     * GET /api/patients/search?q=maria — Búsqueda para autocomplete.
     */
    search() {
        return this.handleAsync(async (req, res) => {
            const clinicId = this.getClinicId(req);
            const results = await this.service.search(clinicId, req.query.q);
            this.sendSuccess(res, results);
        });
    }
}

module.exports = new PatientController();
