const BaseService = require('./BaseService');
const DoctorRepository = require('../repositories/DoctorRepository');
const { getDateRange } = require('../utils/dateHelpers');

/**
 * DoctorService — Lógica de negocio para rendimiento de profesionales.
 */
class DoctorService extends BaseService {
    constructor() {
        super(new DoctorRepository());
        this.resourceName = 'Doctor';
    }

    /**
     * Obtiene el reporte de eficiencia ChairTime por doctor.
     */
    async getChairTimeReport(clinicId, period = 'month') {
        const { startDate, endDate } = getDateRange(period);
        const metrics = await this.repository.getPerformanceMetrics(clinicId, startDate, endDate);

        return metrics.map(doc => {
            const revenue = parseFloat(doc.generated_revenue) || 0;
            const minutes = parseInt(doc.productive_minutes) || 0;
            
            return {
                id: doc.id,
                name: doc.name,
                specialty: doc.specialty,
                color: doc.color,
                stats: {
                    appointments: doc.total_appointments,
                    completed: doc.completed_appointments,
                    revenue: revenue,
                    minutes: minutes,
                    // $/hora en sillón
                    revenuePerHour: minutes > 0 ? parseFloat(((revenue / minutes) * 60).toFixed(2)) : 0,
                    efficiency: doc.scheduled_minutes > 0 ? parseFloat(((minutes / doc.scheduled_minutes) * 100).toFixed(1)) : 0
                }
            };
        });
    }

    validate(data, isUpdate = false) {
        if (!isUpdate && !data.name) {
            throw new Error('El nombre del doctor es requerido');
        }
    }
}

module.exports = DoctorService;
