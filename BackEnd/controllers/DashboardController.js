const DashboardService = require('../services/DashboardService');

/**
 * DashboardController — Endpoints del dashboard ejecutivo.
 */
class DashboardController {
    constructor() {
        this.service = new DashboardService();
    }

    /**
     * GET /api/dashboard/kpis?period=month — KPIs principales.
     */
    getKPIs() {
        return async (req, res, next) => {
            try {
                const clinicId = req.user.clinicId;
                const period = req.query.period || 'month';
                const data = await this.service.getKPIs(clinicId, period);
                res.json({ success: true, data });
            } catch (error) {
                next(error);
            }
        };
    }

    /**
     * GET /api/dashboard/revenue-chart?period=month — Gráfico ingresos vs gastos.
     */
    getRevenueChart() {
        return async (req, res, next) => {
            try {
                const clinicId = req.user.clinicId;
                const period = req.query.period || 'month';
                const data = await this.service.getRevenueChart(clinicId, period);
                res.json({ success: true, data });
            } catch (error) {
                next(error);
            }
        };
    }

    /**
     * GET /api/dashboard/top-treatments?period=month — Top tratamientos.
     */
    getTopTreatments() {
        return async (req, res, next) => {
            try {
                const clinicId = req.user.clinicId;
                const period = req.query.period || 'month';
                const data = await this.service.getTopTreatments(clinicId, period);
                res.json({ success: true, data });
            } catch (error) {
                next(error);
            }
        };
    }

    /**
     * GET /api/dashboard/alerts — Alertas activas.
     */
    getAlerts() {
        return async (req, res, next) => {
            try {
                const clinicId = req.user.clinicId;
                const alerts = await this.service.getAlerts(clinicId);
                res.json({ success: true, data: alerts });
            } catch (error) {
                next(error);
            }
        };
    }
}

module.exports = new DashboardController();
