const financialService = require('../services/FinancialService.js');

class FinancialController {
    async getProfitabilityReport(req, res, next) {
        try {
            const { startDate, endDate } = req.query;
            
            if (!startDate || !endDate) {
                return res.status(400).json({ error: 'startDate and endDate are required parameters' });
            }

            const report = await financialService.analyzeProfitability(startDate, endDate);
            
            res.status(200).json({
                success: true,
                message: 'Profitability analysis completed',
                data: report
            });
        } catch (error) {
            next(error); // Pasamos al error handler global
        }
    }
    
    async saveAiReport(req, res, next) {
        try {
            const { summary, recommendedAction, severity, type } = req.body;
            
            if (!summary || !recommendedAction) {
                return res.status(400).json({ error: 'Missing summary or recommendedAction' });
            }

            const financialRepo = require('../repositories/FinancialRepository.js');
            const insertId = await financialRepo.saveAiInsight({
                type: type || 'CRITICAL_MARGIN',
                summary,
                recommendedAction,
                severity: severity || 'CRITICAL'
            });

            res.status(201).json({ success: true, insightId: insertId });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new FinancialController();
