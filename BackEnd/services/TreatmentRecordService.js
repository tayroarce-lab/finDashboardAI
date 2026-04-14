const TreatmentRecordRepository = require('../repositories/TreatmentRecordRepository');
const TreatmentRepository = require('../repositories/TreatmentRepository');
const AppError = require('../utils/AppError');
const { getDateRange } = require('../utils/dateHelpers');

/**
 * TreatmentRecordService — Lógica para registros de tratamientos (ingresos).
 */
class TreatmentRecordService {
    constructor() {
        this.recordRepo = new TreatmentRecordRepository();
        this.treatmentRepo = new TreatmentRepository();
    }

    /**
     * Registra un tratamiento realizado.
     * Si no envía actual_cost, usa el estimated_cost del catálogo.
     */
    async create(data, clinicId) {
        // Validar campos requeridos
        if (!data.treatment_id) throw AppError.validation('treatment_id es requerido');
        if (!data.patient_id) throw AppError.validation('patient_id es requerido');

        // Obtener tratamiento del catálogo
        const treatment = await this.treatmentRepo.findById(data.treatment_id, clinicId);
        if (!treatment) throw AppError.notFound('Tratamiento');

        // Construir registro
        const record = {
            clinic_id: clinicId,
            treatment_id: data.treatment_id,
            patient_id: data.patient_id,
            price_charged: data.price_charged !== undefined ? data.price_charged : treatment.price,
            discount: data.discount || 0,
            actual_cost: data.actual_cost !== undefined ? data.actual_cost : treatment.estimated_cost,
            payment_method: data.payment_method || 'cash',
            performed_date: data.performed_date || new Date().toISOString().split('T')[0],
            notes: data.notes || null
        };

        const newRecord = await this.recordRepo.create(record);

        // ─── Lógica de Inventario (Consumo Automático) ───
        try {
            const inventoryRepo = require('../repositories/InventoryRepository');
            const supplies = await inventoryRepo.getSuppliesByTreatment(data.treatment_id);
            
            for (const supply of supplies) {
                await inventoryRepo.addTransaction(clinicId, {
                    item_id: supply.item_id,
                    type: 'out',
                    quantity: supply.quantity_used,
                    transaction_date: record.performed_date,
                    notes: `Consumo automático por tratamiento: ${treatment.name}`
                });
            }
        } catch (error) {
            console.error('Error en consumo de inventario:', error);
            // No bloqueamos el registro del tratamiento si falla el inventario
        }

        return newRecord;
    }

    /**
     * Obtiene registros de un período.
     */
    async getByPeriod(clinicId, period = 'month') {
        const { startDate, endDate } = getDateRange(period);
        return this.recordRepo.findByPeriod(clinicId, startDate, endDate);
    }

    /**
     * Análisis de rentabilidad por tratamiento.
     */
    async getProfitability(clinicId, period = 'month') {
        const { startDate, endDate } = getDateRange(period);
        const data = await this.recordRepo.getProfitabilityByTreatment(clinicId, startDate, endDate);

        // Clasificar en cuadrantes
        return data.map(item => ({
            ...item,
            quadrant: this._classifyTreatment(item)
        }));
    }

    /**
     * Clasifica tratamiento en cuadrante estratégico.
     */
    _classifyTreatment(item) {
        const highMargin = item.avg_margin_pct > 40;
        const highVolume = item.times_performed >= 5;

        if (highMargin && highVolume) return { type: 'star', label: '⭐ Estrella', action: 'Proteger y crecer' };
        if (!highMargin && highVolume) return { type: 'cow', label: '🐄 Vaca lechera', action: 'Subir precio o reducir costo' };
        if (highMargin && !highVolume) return { type: 'gem', label: '💎 Joya', action: 'Aumentar volumen' };
        return { type: 'trap', label: '☠️ Trampa', action: 'Evaluar eliminar o subir precio' };
    }
}

module.exports = TreatmentRecordService;
