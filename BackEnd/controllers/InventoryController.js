const BaseController = require('./BaseController');
const InventoryService = require('../services/InventoryService');

class InventoryController extends BaseController {
    constructor() {
        super(new InventoryService());
    }

    /**
     * GET /api/inventory/status
     */
    getStatus() {
        return this.handleAsync(async (req, res) => {
            const clinicId = this.getClinicId(req);
            const status = await this.service.getFullStatus(clinicId);
            this.sendSuccess(res, status);
        });
    }

    /**
     * POST /api/inventory/movements
     */
    addMovement() {
        return this.handleAsync(async (req, res) => {
            const clinicId = this.getClinicId(req);
            const data = {
                ...req.body,
                user_id: req.user.id // Usuario que registra
            };
            await this.service.registerMovement(clinicId, data);
            this.sendSuccess(res, { message: 'Movimiento registrado con éxito' });
        });
    }

    /**
     * GET /api/inventory/:id/history
     */
    getHistory() {
        return this.handleAsync(async (req, res) => {
            const clinicId = this.getClinicId(req);
            const itemId = req.params.id;
            const history = await this.service.getItemHistory(clinicId, itemId);
            this.sendSuccess(res, history);
        });
    }
}

module.exports = new InventoryController();
