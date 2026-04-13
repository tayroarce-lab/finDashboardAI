const BaseService = require('./BaseService');
const AppointmentRepository = require('../repositories/AppointmentRepository');
const { pool } = require('../config/db');
const AppError = require('../utils/AppError');
const { getDateRange } = require('../utils/dateHelpers');

/**
 * AppointmentService — Lógica de negocio para citas y ocupación.
 */
class AppointmentService extends BaseService {
    constructor() {
        super(new AppointmentRepository());
        this.resourceName = 'Cita';
    }

    /**
     * Citas de una semana.
     */
    async getByWeek(clinicId, weekOffset = 0) {
        const now = new Date();
        const dayOfWeek = now.getDay() || 7;
        const monday = new Date(now);
        monday.setDate(now.getDate() - dayOfWeek + 1 + (weekOffset * 7));
        const friday = new Date(monday);
        friday.setDate(monday.getDate() + 4);

        const startDate = monday.toISOString().split('T')[0];
        const endDate = friday.toISOString().split('T')[0];

        return this.repository.findByDateRange(clinicId, startDate, endDate);
    }

    /**
     * Calcula tasa de ocupación.
     */
    async getOccupancy(clinicId, period = 'week') {
        const { startDate, endDate } = getDateRange(period);

        // Obtener datos de citas
        const occupancy = await this.repository.getOccupancyData(clinicId, startDate, endDate);

        // Obtener capacidad de la clínica
        const [clinics] = await pool.execute(
            'SELECT chairs, opening_time, closing_time, slot_duration_minutes, working_days FROM clinics WHERE id = ?',
            [clinicId]
        );

        if (clinics.length === 0) throw AppError.notFound('Clínica');
        const clinic = clinics[0];

        // Calcular capacidad
        const openingHour = parseInt(clinic.opening_time.split(':')[0]);
        const closingHour = parseInt(clinic.closing_time.split(':')[0]);
        const hoursPerDay = closingHour - openingHour;
        const slotsPerDay = Math.floor((hoursPerDay * 60) / clinic.slot_duration_minutes) * clinic.chairs;
        const workingDays = clinic.working_days.split(',').length;

        // Calcular días en período
        const start = new Date(startDate);
        const end = new Date(endDate);
        const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
        const weeks = Math.ceil(totalDays / 7);
        const totalCapacity = slotsPerDay * workingDays * weeks;

        const booked = parseInt(occupancy.booked) || 0;
        const occupancyRate = totalCapacity > 0
            ? parseFloat(((booked / totalCapacity) * 100).toFixed(1))
            : 0;

        const emptySlots = totalCapacity - booked;

        return {
            totalCapacity,
            booked,
            completed: parseInt(occupancy.completed) || 0,
            cancelled: parseInt(occupancy.cancelled) || 0,
            noShows: parseInt(occupancy.no_shows) || 0,
            emptySlots,
            occupancyRate,
            cancellationRate: occupancy.total_appointments > 0
                ? parseFloat((((parseInt(occupancy.cancelled) + parseInt(occupancy.no_shows)) / parseInt(occupancy.total_appointments)) * 100).toFixed(1))
                : 0
        };
    }

    /**
     * Actualiza status de una cita.
     */
    async updateStatus(id, clinicId, status, reason) {
        const validStatuses = ['scheduled', 'confirmed', 'completed', 'cancelled', 'no_show'];
        if (!validStatuses.includes(status)) {
            throw AppError.validation(`Status inválido. Opciones: ${validStatuses.join(', ')}`);
        }
        const updated = await this.repository.updateStatus(id, clinicId, status, reason);
        if (!updated) throw AppError.notFound('Cita');
        return this.getById(id, clinicId);
    }

    validate(data, isUpdate = false) {
        if (!isUpdate) {
            if (!data.start_time) throw AppError.validation('La hora de inicio es requerida');
            if (!data.end_time) throw AppError.validation('La hora de fin es requerida');
        }
    }
}

module.exports = AppointmentService;
