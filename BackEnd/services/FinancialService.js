const financialRepo = require('../repositories/FinancialRepository.js');

class FinancialService {
    /**
     * Calcula la rentabilidad real de todas las citas en un periodo.
     * Este es el "Cerebro Financiero" inicial del CFO.
     */
    async analyzeProfitability(startDate, endDate) {
        const appointmentsData = await financialRepo.getAppointmentsByDateRange(startDate, endDate);
        const monthlyFixedExpenses = await financialRepo.getTotalFixedExpenses();
        
        // Asumiendo 160 horas operativas por mes en una clínica promedio
        // Calculamos el costo real de tener el sillón abierto por minuto
        const CHS_PER_MINUTE = (monthlyFixedExpenses / (160 * 60)); 

        const analysis = appointmentsData.map(data => {
            const { appointment, treatment } = data;
            
            const chairCost = (CHS_PER_MINUTE || 0.5) * appointment.realDuration; // fallback si monthlyFixedExpenses = 0
            const totalCost = treatment.providerCost + appointment.commission + chairCost;
            
            const netProfit = appointment.revenue - totalCost;
            const netMarginPercentage = appointment.revenue > 0 ? ((netProfit / appointment.revenue) * 100) : 0;

            let status = 'HEALTHY';
            if (netMarginPercentage < 15) status = 'CRITICAL';
            else if (netMarginPercentage < 30) status = 'WARNING';

            return {
                appointmentId: appointment.id,
                treatmentName: treatment.name,
                revenue: appointment.revenue,
                totalCost: totalCost.toFixed(2),
                netProfit: netProfit.toFixed(2),
                marginPercentage: netMarginPercentage.toFixed(2) + '%',
                status
            };
        });

        const criticalTreatments = analysis.filter(a => a.status === 'CRITICAL');

        return {
            period: { startDate, endDate },
            chairCostPerMinute: (CHS_PER_MINUTE || 0.5).toFixed(2),
            totalAppointments: analysis.length,
            criticalAlerts: criticalTreatments.length,
            details: analysis
        };
    }
}

module.exports = new FinancialService();
