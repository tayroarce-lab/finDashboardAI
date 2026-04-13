const BaseController = require('./BaseController');
const AppointmentService = require('../services/AppointmentService');

/**
 * AppointmentController — Endpoints de citas y ocupación.
 */
class AppointmentController extends BaseController {
    constructor() {
        super(new AppointmentService());
    }

    /**
     * GET /api/appointments?week=0 — Citas de la semana (0=actual, -1=anterior, 1=siguiente).
     */
    getByWeek() {
        return this.handleAsync(async (req, res) => {
            const clinicId = this.getClinicId(req);
            const weekOffset = parseInt(req.query.week) || 0;
            const appointments = await this.service.getByWeek(clinicId, weekOffset);
            this.sendSuccess(res, appointments);
        });
    }

    /**
     * PATCH /api/appointments/:id/status — Cambiar status de cita.
     */
    updateStatus() {
        return this.handleAsync(async (req, res) => {
            const clinicId = this.getClinicId(req);
            const { status, reason } = req.body;
            const appointment = await this.service.updateStatus(
                req.params.id, clinicId, status, reason
            );
            this.sendSuccess(res, appointment);
        });
    }

    /**
     * GET /api/appointments/occupancy?period=week — Tasa de ocupación.
     */
    getOccupancy() {
        return this.handleAsync(async (req, res) => {
            const clinicId = this.getClinicId(req);
            const period = this.getPeriod(req);
            const data = await this.service.getOccupancy(clinicId, period);
            this.sendSuccess(res, data);
        });
    }
}

module.exports = new AppointmentController();
