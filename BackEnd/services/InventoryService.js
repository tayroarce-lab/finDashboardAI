const BaseService = require('./BaseService');
const inventoryRepository = require('../repositories/InventoryRepository');

class InventoryService extends BaseService {
    constructor() {
        super(inventoryRepository);
    }

    async getFullStatus(clinicId) {
        return this.repository.getInventoryStatus(clinicId);
    }

    async registerMovement(clinicId, data) {
        // Validaciones básicas
        if (!data.item_id || !data.type || !data.quantity) {
            throw new Error('Datos incompletos para registrar movimiento');
        }
        return this.repository.addTransaction(clinicId, data);
    }

    async getItemHistory(clinicId, itemId) {
        return this.repository.getTransactions(clinicId, itemId);
    }
}

module.exports = InventoryService;
