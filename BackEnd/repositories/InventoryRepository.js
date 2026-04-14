const BaseRepository = require('./BaseRepository');

class InventoryRepository extends BaseRepository {
    constructor() {
        super('inventory_items');
    }

    /**
     * Obtiene todos los items de inventario de una clínica con alertas de stock bajo.
     */
    async getInventoryStatus(clinicId) {
        const query = `
            SELECT *,
                   (stock_current <= stock_min) as is_low_stock
            FROM inventory_items
            WHERE clinic_id = ? AND is_active = TRUE
            ORDER BY name ASC
        `;
        return this.query(query, [clinicId]);
    }

    /**
     * Registra una transacción de inventario y actualiza el stock del item.
     * Esta operación debería ser una transacción en un entorno real.
     */
    async addTransaction(clinicId, data) {
        const { item_id, type, quantity, unit_cost, transaction_date, notes, user_id, provider } = data;
        
        // 1. Insertar la transacción
        const transQuery = `
            INSERT INTO inventory_transactions 
            (clinic_id, item_id, user_id, type, quantity, unit_cost, transaction_date, provider, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        await this.query(transQuery, [clinicId, item_id, user_id, type, quantity, unit_cost, transaction_date, provider, notes]);

        // 2. Calcular el ajuste de stock
        // 'in': suma, 'out': resta, 'adjustment': reemplaza o suma dependiendo de la lógica.
        // Aquí simplificaremos: 'in' y 'return' suman, 'out' resta.
        let stockChange = quantity;
        if (type === 'out') stockChange = -quantity;
        
        // 3. Actualizar el stock y el costo promedio si es una compra
        let updateQuery = `
            UPDATE inventory_items 
            SET stock_current = stock_current + ?
        `;
        const params = [stockChange];

        if (type === 'in' && unit_cost > 0) {
            updateQuery += `, last_purchase_price = ?, 
                           average_cost = (average_cost * stock_current + ? * ?) / (stock_current + ?)`;
            params.push(unit_cost, unit_cost, quantity, quantity);
        }

        updateQuery += ` WHERE id = ? AND clinic_id = ?`;
        params.push(item_id, clinicId);

        return this.query(updateQuery, params);
    }

    /**
     * Obtiene el historial de movimientos de un item.
     */
    async getTransactions(clinicId, itemId, limit = 50) {
        const query = `
            SELECT t.*, u.name as user_name
            FROM inventory_transactions t
            LEFT JOIN users u ON t.user_id = u.id
            WHERE t.clinic_id = ? AND t.item_id = ?
            ORDER BY t.transaction_date DESC, t.created_at DESC
            LIMIT ?
        `;
        return this.query(query, [clinicId, itemId, limit]);
    }

    /**
     * Obtiene los insumos asociados a un tratamiento.
     */
    async getSuppliesByTreatment(treatmentId) {
        const query = 'SELECT * FROM treatment_supplies WHERE treatment_id = ?';
        return this.query(query, [treatmentId]);
    }
}


module.exports = new InventoryRepository();
