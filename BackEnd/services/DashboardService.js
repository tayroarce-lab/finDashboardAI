const TreatmentRecordRepository = require('../repositories/TreatmentRecordRepository');
const ExpenseRepository = require('../repositories/ExpenseRepository');
const AppointmentRepository = require('../repositories/AppointmentRepository');
const { getDateRange, percentChange } = require('../utils/dateHelpers');
const { getSemaphore } = require('../utils/kpiThresholds');

/**
 * DashboardService — Agrega datos de múltiples repositorios
 * para calcular KPIs del dashboard ejecutivo.
 */
class DashboardService {
    constructor() {
        this.recordRepo = new TreatmentRecordRepository();
        this.expenseRepo = new ExpenseRepository();
        this.appointmentRepo = new AppointmentRepository();
    }

    /**
     * Obtiene todos los KPIs principales del dashboard.
     */
    async getKPIs(clinicId, period = 'month') {
        const { startDate, endDate, prevStartDate, prevEndDate } = getDateRange(period);

        // Queries en paralelo para máximo rendimiento
        const [
            currentRevenue,
            previousRevenue,
            currentExpenses,
            previousExpenses,
            ticketData,
            prevTicketData
        ] = await Promise.all([
            this.recordRepo.sumRevenue(clinicId, startDate, endDate),
            this.recordRepo.sumRevenue(clinicId, prevStartDate, prevEndDate),
            this.expenseRepo.sumExpenses(clinicId, startDate, endDate),
            this.expenseRepo.sumExpenses(clinicId, prevStartDate, prevEndDate),
            this.recordRepo.avgTicket(clinicId, startDate, endDate),
            this.recordRepo.avgTicket(clinicId, prevStartDate, prevEndDate)
        ]);

        // Cálculos derivados
        const currentProfit = currentRevenue - currentExpenses;
        const previousProfit = previousRevenue - previousExpenses;
        const currentMargin = currentRevenue > 0 ? (currentProfit / currentRevenue) * 100 : 0;
        const previousMargin = previousRevenue > 0 ? (previousProfit / previousRevenue) * 100 : 0;

        const revenueChange = percentChange(currentRevenue, previousRevenue);
        const expenseChange = percentChange(currentExpenses, previousExpenses);
        const profitChange = percentChange(currentProfit, previousProfit);
        const marginChange = parseFloat((currentMargin - previousMargin).toFixed(1));

        return {
            period,
            dateRange: { startDate, endDate },
            kpis: [
                {
                    key: 'revenue',
                    label: 'Ingresos',
                    value: currentRevenue,
                    previousValue: previousRevenue,
                    change: revenueChange,
                    format: 'currency',
                    semaphore: getSemaphore('revenueChange', revenueChange)
                },
                {
                    key: 'expenses',
                    label: 'Gastos',
                    value: currentExpenses,
                    previousValue: previousExpenses,
                    change: expenseChange,
                    format: 'currency',
                    semaphore: getSemaphore('expenseChange', expenseChange)
                },
                {
                    key: 'profit',
                    label: 'Utilidad',
                    value: parseFloat(currentProfit.toFixed(2)),
                    previousValue: parseFloat(previousProfit.toFixed(2)),
                    change: profitChange,
                    format: 'currency',
                    semaphore: getSemaphore('revenueChange', profitChange)
                },
                {
                    key: 'margin',
                    label: 'Margen',
                    value: parseFloat(currentMargin.toFixed(1)),
                    previousValue: parseFloat(previousMargin.toFixed(1)),
                    change: marginChange,
                    format: 'percent',
                    semaphore: getSemaphore('margin', currentMargin)
                },
                {
                    key: 'avgTicket',
                    label: 'Ticket Promedio',
                    value: ticketData.avgTicket,
                    previousValue: prevTicketData.avgTicket,
                    change: percentChange(ticketData.avgTicket, prevTicketData.avgTicket),
                    format: 'currency',
                    semaphore: getSemaphore('revenueChange', percentChange(ticketData.avgTicket, prevTicketData.avgTicket))
                },
                {
                    key: 'totalTreatments',
                    label: 'Tratamientos Realizados',
                    value: ticketData.totalRecords,
                    previousValue: prevTicketData.totalRecords,
                    change: percentChange(ticketData.totalRecords, prevTicketData.totalRecords),
                    format: 'number',
                    semaphore: getSemaphore('revenueChange', percentChange(ticketData.totalRecords, prevTicketData.totalRecords))
                }
            ]
        };
    }

    /**
     * Datos para gráfico de ingresos vs gastos (línea de tiempo).
     */
    async getRevenueChart(clinicId, period = 'month') {
        const { startDate, endDate } = getDateRange(period);

        const [dailyRevenue, dailyExpenses] = await Promise.all([
            this.recordRepo.dailyRevenue(clinicId, startDate, endDate),
            this.expenseRepo.dailyExpenses(clinicId, startDate, endDate)
        ]);

        // Combinar en un solo dataset por fecha
        const dateMap = new Map();

        dailyRevenue.forEach(row => {
            const dateStr = new Date(row.date).toISOString().split('T')[0];
            dateMap.set(dateStr, {
                date: dateStr,
                revenue: parseFloat(row.revenue),
                expenses: 0,
                treatments: row.treatments_count
            });
        });

        dailyExpenses.forEach(row => {
            const dateStr = new Date(row.date).toISOString().split('T')[0];
            if (dateMap.has(dateStr)) {
                dateMap.get(dateStr).expenses = parseFloat(row.total);
            } else {
                dateMap.set(dateStr, {
                    date: dateStr,
                    revenue: 0,
                    expenses: parseFloat(row.total),
                    treatments: 0
                });
            }
        });

        // Ordenar por fecha
        return Array.from(dateMap.values()).sort((a, b) => a.date.localeCompare(b.date));
    }

    /**
     * Top tratamientos por rentabilidad para el dashboard.
     */
    async getTopTreatments(clinicId, period = 'month') {
        const { startDate, endDate } = getDateRange(period);
        const profitability = await this.recordRepo.getProfitabilityByTreatment(clinicId, startDate, endDate);

        return profitability
            .filter(t => t.times_performed > 0)
            .map(t => ({
                id: t.id,
                name: t.name,
                category: t.category,
                timesPerformed: t.times_performed,
                avgMargin: parseFloat(t.avg_margin_pct) || 0,
                totalContribution: parseFloat(t.total_profit_contribution) || 0,
                semaphore: getSemaphore('treatmentMargin', parseFloat(t.avg_margin_pct) || 0)
            }));
    }

    /**
     * Genera alertas automáticas basadas en reglas.
     */
    async getAlerts(clinicId) {
        const { startDate, endDate, prevStartDate, prevEndDate } = getDateRange('month');
        const alerts = [];

        // 1. Tratamientos con margen negativo
        const profitability = await this.recordRepo.getProfitabilityByTreatment(clinicId, startDate, endDate);
        for (const t of profitability) {
            if (t.times_performed > 0 && parseFloat(t.avg_margin_pct) < 0) {
                alerts.push({
                    severity: 'critical',
                    type: 'negative_margin',
                    title: `Tratamiento con margen negativo: ${t.name}`,
                    content: `${t.name} te cuesta $${Math.abs(t.avg_cost)} pero cobras $${t.avg_revenue}. Cada vez que haces uno, pierdes $${Math.abs(t.avg_profit).toFixed(2)}. Este mes hiciste ${t.times_performed}.`,
                    recommendation: `Sube el precio al menos a $${(parseFloat(t.avg_cost) * 1.2).toFixed(2)} o renegocia costos.`,
                    module: 'treatments',
                    entityId: t.id
                });
            }
        }

        // 2. Gastos anormales por categoría
        const expenses = await this.expenseRepo.getByCategory(clinicId, startDate, endDate, prevStartDate, prevEndDate);
        for (const cat of expenses) {
            const change = parseFloat(cat.pct_change);
            const amount = parseFloat(cat.current_amount);
            if (change > 20 && amount > 100) {
                alerts.push({
                    severity: 'warning',
                    type: 'expense_spike',
                    title: `Gasto en ${cat.category_name} subió ${change}%`,
                    content: `Gastaste $${amount.toFixed(2)} en ${cat.category_name} este mes vs $${parseFloat(cat.previous_amount).toFixed(2)} el mes anterior.`,
                    recommendation: `Revisa las últimas facturas de ${cat.category_name}. Si es aumento de proveedor, cotiza alternativas.`,
                    module: 'expenses',
                    entityId: cat.category_id
                });
            }
        }

        // 3. Margen general bajo
        const kpis = await this.getKPIs(clinicId, 'month');
        const marginKpi = kpis.kpis.find(k => k.key === 'margin');
        if (marginKpi && marginKpi.value < 20) {
            alerts.push({
                severity: marginKpi.value < 5 ? 'critical' : 'warning',
                type: 'low_margin',
                title: `Margen en zona de riesgo: ${marginKpi.value}%`,
                content: `Solo te quedan $${(marginKpi.value / 100).toFixed(2)} centavos por cada dólar que entra. El benchmark saludable es 35-50%.`,
                recommendation: 'Prioridad 1: Eliminar tratamientos con margen negativo. Prioridad 2: Reducir gasto más alto. Prioridad 3: Llenar huecos de agenda.',
                module: 'dashboard'
            });
        }

        return alerts.sort((a, b) => {
            const order = { critical: 0, warning: 1, info: 2 };
            return (order[a.severity] || 3) - (order[b.severity] || 3);
        });
    }
}

module.exports = DashboardService;
