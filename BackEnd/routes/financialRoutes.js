const { Router } = require('express');
const financialController = require('../controllers/FinancialController.js');

const router = Router();

// GET /profitability?startDate=2023-01-01&endDate=2023-01-31
router.get('/profitability', financialController.getProfitabilityReport.bind(financialController));

// POST /insights 
router.post('/insights', financialController.saveAiReport.bind(financialController));

// GET /upcoming-reminders (Para n8n)
router.get('/upcoming-reminders', financialController.getUpcomingReminders.bind(financialController));

module.exports = router;

